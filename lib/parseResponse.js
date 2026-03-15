export function parseAnalysisResponse(text) {
  // Try to extract JSON from the response, handling possible markdown wrapping
  let jsonString = text.trim();

  // Remove markdown code fences if present
  const fenceMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonString = fenceMatch[1].trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error("Failed to parse AI response as JSON. The model returned an unexpected format.");
  }

  // Validate required fields
  if (!parsed.executiveSummary || typeof parsed.executiveSummary !== "string") {
    throw new Error("Response missing executiveSummary.");
  }

  if (!Array.isArray(parsed.themes) || parsed.themes.length === 0) {
    throw new Error("Response missing themes array.");
  }

  if (!Array.isArray(parsed.opportunities)) {
    throw new Error("Response missing opportunities array.");
  }

  if (!Array.isArray(parsed.openQuestions)) {
    throw new Error("Response missing openQuestions array.");
  }

  if (!parsed.modelConfidence || !parsed.modelConfidence.overall) {
    throw new Error("Response missing modelConfidence.");
  }

  // Normalize confidence values
  const validConfidence = ["high", "medium", "low"];
  parsed.themes = parsed.themes.map((theme) => ({
    ...theme,
    confidence: validConfidence.includes(theme.confidence)
      ? theme.confidence
      : "medium",
    supportingQuotes: theme.supportingQuotes || [],
    riskFlags: theme.riskFlags || [],
    relatedOpportunities: theme.relatedOpportunities || [],
  }));

  parsed.modelConfidence.overall = validConfidence.includes(
    parsed.modelConfidence.overall
  )
    ? parsed.modelConfidence.overall
    : "medium";

  return parsed;
}
