import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { pinata } from '@/utils/pinataConfig';
import { PdfReader } from "pdfreader";
import { callGroq } from '@/utils/groq';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const userEmail = session.user.email;
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;
    const pdfPassword = formData.get('pdfPassword') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let parsedData;
    let transactionsUpload;
    let transactionsGatewayUrl;

    try {
      let pdfReaderOptions = {};

      if (pdfPassword && pdfPassword.trim() !== '') {
        pdfReaderOptions = { password: pdfPassword };
      }

      const extractedText: string[] = [];

      await new Promise((resolve, reject) => {
        new PdfReader(pdfReaderOptions).parseBuffer(
          buffer,
          function (err, item) {
            if (err) reject(err);
            else if (!item) {
              resolve(true);
            }
            else if (item.text) {
              extractedText.push(item.text);
            }
          }
        );
      });

      let currentLine = '';
      const lines = [];

      extractedText.forEach(text => {
        if (text.endsWith('-') || text.endsWith(' ')) {
          currentLine += text;
        } else {
          currentLine += text;
          lines.push(currentLine);
          currentLine = '';
        }
      });
      if (currentLine) {
        lines.push(currentLine);
      }

      const transactionStartIndex = lines.findIndex(line =>
        line.toLowerCase().includes('date') ||
        line.toLowerCase().includes('transaction') ||
        line.toLowerCase().includes('description') ||
        (line.toLowerCase().includes('debit') && line.toLowerCase().includes('credit'))
      );
      if (transactionStartIndex === -1) {
        throw new Error('Could not find transaction section in statement');
      }

      const header = lines.slice(0, transactionStartIndex).join('\n');
      const transactions = lines.slice(transactionStartIndex);

      const transactionHeader = transactions[0];
      const actualTransactions = transactions.slice(1);
      const quarterLength = Math.floor(actualTransactions.length / 4);
      const reducedTransactions = [transactionHeader, ...actualTransactions.slice(0, quarterLength)];

      const reducedText = header + '\n\n' + reducedTransactions.join('\n');

      const prompt = `
        You are a JSON generator for bank statements that MUST follow these rules:
        1. Only use information found in the statement
        2. Calculate actual balance numbers (do not use arithmetic expressions)
        3. Use proper JSON with all required commas
        4. Never truncate data - ensure all fields are complete
        5. Format dates as ISO strings
        6. For transaction type:
           - Mark as "credit" if it's a deposit or "TRANSFER FROM"
           - Mark as "debit" if it's a withdrawal or "TRANSFER TO"
        7. For amount values:
           - Must be reasonable numbers (no amounts larger than 1 million)
           - Must match the balance changes in the statement
        8. For username and accountHolderName:
           - Must be a person's name found in the statement header
           - Do not use numbers, addresses, or PINs as names
        9. Return ONLY valid JSON that can be parsed by JSON.parse()

        Required structure (with actual data from statement):
        {
          "username": "(extract from statement)",
          "email": "${userEmail}",
          "banksCount": 1,
          "banks": [{
            "accountHolderName": "(extract account holder's name)",
            "accountNumber": "(extract account number)",
            "accountType": "(extract account type)",
            "bankName": "(extract bank name)",
            "transactionsCount": (number of transactions in array),
            "transactions": [{
              "date": "(ISO date string)",
              "amount": (positive number),
              "description": "(complete transaction description)",
              "transactionType": "(credit or debit)",
              "balance": (calculated balance after transaction)
            }]
          }]
        }

        Rules for balance calculation:
        1. Start with the opening balance
        2. For each transaction:
           - If credit, add the amount to previous balance
           - If debit, subtract the amount from previous balance
        3. Store the actual calculated number, not a formula

        Strictly stick to the structure and provide the complete JSON

        Here is the bank statement text to parse:
        ${reducedText}
      `;

      const response = await callGroq(prompt);
      if (!response) {
        throw new Error('Failed to process statement with Groq');
      }

      const jsonMatch = response.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        console.error('No JSON object found in response');
        throw new Error('No JSON found in Groq response');
      }

      let rawJson = jsonMatch[0].trim();

      rawJson = rawJson.replace(/"balance":\s*([\d.]+\s*[-+]\s*[\d.]+)/g, (match, expression) => {
        try {
          return `"balance": ${eval(expression)}`; // Evaluate the arithmetic expression safely
        } catch (e) {
          console.error('Invalid balance expression:', expression);
          throw new Error('Invalid balance expression in Groq response');
        }
      });

      let parsedData;
      try {
        parsedData = JSON.parse(rawJson);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid JSON response from Groq');
      }
      
      if (!parsedData || !parsedData.email) {
        throw new Error('Missing required fields in parsed data');
      }

      const transactionData = JSON.stringify(parsedData);
      const transactionBlob = new Blob([transactionData], { type: 'application/json' });
      const transactionFile = new File([transactionBlob], 'transactions.json', { type: 'application/json' });

      transactionsUpload = await pinata.upload.file(transactionFile);
      transactionsGatewayUrl = await pinata.gateways.createSignedURL({
        cid: transactionsUpload.cid,
        expires: 3600 * 24
      });

      await dbConnect();

      const user = await UserModel.findOne({ email: parsedData.email });
      if (!user) {
        throw new Error('User not found');
      }

      user.transactionsCID.push(transactionsUpload.cid);
      await user.save();

    } catch (error) {
      console.error('Error processing PDF:', error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      transactionsUrl: transactionsGatewayUrl,
      transactionsCid: transactionsUpload?.cid,
      message: 'Statement processed and saved successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';