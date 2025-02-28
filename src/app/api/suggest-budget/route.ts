import { NextResponse } from 'next/server';
import { processGROQBudgetResponse } from "@/utils/groq";

export async function POST(req: Request) {
    try {
        const { query, currentDistribution, immutableCategories } = await req.json();

        if (!query) {
            return NextResponse.json(
                { error: 'Query is required' },
                { status: 400 }
            );
        }

        let prompt = `Given the user's financial situation and their query (${query}),
Current Budget Distribution:
${currentDistribution.map((category: any) => `- ${category.category}: $${category.amount}`).join('\n')}
STRICT Immutable Categories (do not change these): ${immutableCategories && immutableCategories.length ? immutableCategories.join(', ') : 'None'}

Provide a structured response in two sections:
1) Advice: Provide financial guidance based on the user's input. This should be clear, concise, and actionable.
2) Updated Budget Distribution: Suggest a revised budget allocation.

The response must be a valid JSON object with exactly this structure:
{
    "advice": "Your advice text here",
    "updatedBudget": [
        { "category": "Category Name", "amount": number(rupees), "percentage": number }
    ]
}
Note-1: Do not answer any irrelevant queries. In that case provide updatedBudget as it is and in advice provide that "Hi!!! I am a personal budgeting bot I do not have context to your query".
Note-2: The sum of all the amounts in updatedBudget should be equal to the total income of the user and the amounts of other categories can be changed to maintain the sum.

Strictly do not exceed the total sum of the user's income in the updatedBudget.

Strictly if the user's query is not related to finance or budgeting, return the current budget distribution as it is and advice: "I am a personal budget chatbot, sorry can't help with that". Do not answer any irrelevant queries.
        `;

        const response = await processGROQBudgetResponse(prompt);

        if (!response) {
            return NextResponse.json(
                { error: 'Failed to get suggestion' },
                { status: 500 }
            );
        }

        return NextResponse.json({ suggestion: JSON.stringify(response) });

    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}