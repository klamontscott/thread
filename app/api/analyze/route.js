import Anthropic from "@anthropic-ai/sdk";
import { buildMessages } from "@/lib/prompt";
import { parseAnalysisResponse } from "@/lib/parseResponse";

const anthropic = new Anthropic();

export async function POST(request) {
  try {
    const { transcript, focusQuestion, phase } = await request.json();

    if (!transcript || transcript.trim().length === 0) {
      return Response.json(
        { error: "Transcript is required." },
        { status: 400 }
      );
    }

    const { system, messages } = buildMessages(
      transcript,
      focusQuestion,
      phase || "exploratory"
    );

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system,
      messages,
    });

    const text = response.content[0].text;
    const parsed = parseAnalysisResponse(text);

    return Response.json(parsed);
  } catch (error) {
    console.error("Analysis error:", error);

    if (error.message?.includes("parse")) {
      return Response.json(
        { error: "The AI returned an unexpected format. Please try again." },
        { status: 502 }
      );
    }

    return Response.json(
      { error: error.message || "Analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
