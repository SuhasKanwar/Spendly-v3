import { groqSuggestMutualFund } from "@/utils/groq";
import { formatMutualFundAnalysis } from "@/utils/mutualFundFormatting";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const { query } = await req.json();

	if (!query) {
		return NextResponse.json(
			{ error: 'Query is required' },
			{ status: 400 }
		);
	}

	const prompt = `You are a mutual fund analyst. Analyze the given mutual fund or answer the fund-related question.
If it's an analysis request, structure your response exactly like this example:
**Fund Performance:** [performance details]
**Underlying Assets:** [asset details]
**Risk Metrics:**
* [metric 1]
* [metric 2]
* [metric 3]
**Expense Ratio:** [expense details]
**Recommendation:** [clear buy/hold recommendation]
**Actionable Insights:**
* [insight 1]
* [insight 2]
* [insight 3]

Keep each section concise and factual. For non-analysis questions, provide a clear, direct answer.

User Query: "${query}"`;

	try {
		const response = await groqSuggestMutualFund(prompt);
		
		if (!response) {
			return NextResponse.json(
				{ error: 'Failed to get suggestion' },
				{ status: 500 }
			);
		}

		if (response.includes("**Fund Performance:**")) {
			const fundName = query.split(" ")[0];
			const formattedResponse = formatMutualFundAnalysis(fundName, response);
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
