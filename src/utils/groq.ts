import { Groq } from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  console.error("Groq API key not found. Please set the GROQ_API_KEY environment variable.");
  process.exit(1);
}

const groq = new Groq({ apiKey });

export async function callGroq(prompt: string): Promise<string | null> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 20000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }

    // Clean the response
    let cleanedContent = content
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    try {
      const jsonMatch = cleanedContent.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        // Validate if it's proper JSON
        JSON.parse(jsonMatch[0]); // Test parse
        return jsonMatch[0];
      }

      // If no JSON found or invalid, return cleaned content
      return cleanedContent;
    } catch (parseError) {
      // If JSON parsing failed, return the cleaned content
      console.log("JSON parsing failed, returning raw content:", parseError);
      return cleanedContent;
    }
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return null;
  }
}

const suggestionAPIkey = process.env.GROQ_SUGGEST_BUDGET_API;

// @ts-ignore
const groqSuggestInstance = new Groq({ suggestionAPIkey });

async function groqSuggest(prompt: string): Promise<string | null> {
  try {
    const completion = await groqSuggestInstance.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }
    return content;
  }
  catch (error) {
    console.error("Error calling Groq API:", error);
    return null;
  }
}

export async function processGROQBudgetResponse(prompt: string) {
  try {
    const response = await groqSuggest(prompt);
    
    if (!response) return null;

    let cleanedResponse = response
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const jsonMatch = cleanedResponse.match(/\{(?:[^{}]|(\{[^{}]*\}))*\}/);
    
    if (!jsonMatch) {
      console.error('No valid JSON object found in response');
      return null;
    }

    const jsonStr = jsonMatch[0];

    try {
      const parsedResponse = JSON.parse(jsonStr);

      if (!parsedResponse.advice || !parsedResponse.updatedBudget) {
        console.error('Invalid response structure:', parsedResponse);
        return null;
      }

      const updatedBudget = typeof parsedResponse.updatedBudget === 'string' 
        ? JSON.parse(parsedResponse.updatedBudget.replace(/\s+/g, ' '))
        : parsedResponse.updatedBudget;

      return {
        advice: parsedResponse.advice.trim(),
        updatedBudget: Array.isArray(updatedBudget) ? updatedBudget : []
      };
    } catch (parseError) {
      console.error('Failed to parse GROQ response:', parseError, '\nResponse:', jsonStr);
      return null;
    }
  } catch (error) {
    console.error('GROQ API error:', error);
    return null;
  }
}

export async function groqSuggestStock(prompt: string): Promise<string | null> {
  try {
    const completion = await groqSuggestInstance.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-specdec',
      temperature: 0.3,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }
    return content;
  }
  catch (error) {
    console.error("Error calling Groq API:", error);
    return null;
  }
}

export async function groqSuggestMutualFund(prompt: string): Promise<string | null> {
  try {
    const completion = await groqSuggestInstance.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-specdec',
      temperature: 0.3,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in response');
    }
    return content;
  }
  catch (error) {
    console.error("Error calling Groq API:", error);
    return null;
  }
}