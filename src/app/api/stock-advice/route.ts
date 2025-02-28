import { groqSuggestStock } from "@/utils/groq";
import { formatStockAnalysis } from "@/utils/stockFormatting";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { query } = await req.json();

    if (!query) {
        return NextResponse.json(
            { error: 'Query is required' },
            { status: 400 }
        );
    }

    const prompt = `You are a stock market analyst. Analyze the given stock or answer the stock-related question. 
If it's a stock analysis request, structure your response exactly like this example:
**Recent Performance:** [performance details]
**Trends:** [market trends]
**Key Metrics:** 
* [metric 1]
* [metric 2]
* [metric 3]
**Valuation:** [valuation details]
**Recommendation:** [clear buy/sell/hold recommendation]
**Actionable Advice:**
* [advice 1]
* [advice 2]
* [advice 3]

Keep each section concise and factual. For non-analysis questions, provide a clear, direct answer.

User Query: "${query}"`;

    try {
        const response = await groqSuggestStock(prompt);
        
        if (!response) {
            return NextResponse.json(
                { error: 'Failed to get suggestion' },
                { status: 500 }
            );
        }

        // Check if response is a stock analysis
        if (response.includes("**Current Stock Price:**")) {
            const stockName = query.split(" ")[0]; // Get first word as stock name
            const formattedResponse = formatStockAnalysis(stockName, response);
            return NextResponse.json({ suggestion: formattedResponse });
        }
        
        return NextResponse.json({ suggestion: response });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}