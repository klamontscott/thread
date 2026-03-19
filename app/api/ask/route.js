import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request) {
  try {
    const { transcript, theme, question } = await request.json();

    if (!question || question.trim().length === 0) {
      return Response.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const system = `You are a senior UX researcher helping a colleague interrogate a theme that was extracted from an interview transcript. Answer concisely (2-4 sentences). Ground your answer in specific evidence from the transcript. If the transcript doesn't contain enough evidence to answer confidently, say so.`;

    const userMessage = `Here is the interview transcript:

---
${transcript}
---

The theme being reviewed is: "${theme.title}"
Description: ${theme.description}

The researcher's question: ${question}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system,
      messages: [{ role: "user", content: userMessage }],
    });

    return Response.json({ answer: response.content[0].text });
  } catch (error) {
    console.error("Ask error:", error);
    return Response.json(
      { error: error.message || "Failed to get answer. Please try again." },
      { status: 500 }
    );
  }
}
