export const sampleResult = {
  executiveSummary:
    "Users strongly value the core product experience but face significant friction during onboarding. The gap between initial interest and first meaningful interaction is where most drop-off occurs. There is a clear opportunity to redesign the setup flow with progressive disclosure and guided first-run experiences.",
  themes: [
    {
      id: 1,
      title: "Onboarding Friction",
      description:
        "Users consistently reported feeling overwhelmed by the number of setup steps required before they could experience core value.",
      confidence: "high",
      supportingQuotes: [
        {
          text: "I signed up expecting to just dive in, but there were like eight screens of configuration before I could do anything.",
          speaker: "Participant",
        },
        {
          text: "I almost gave up during setup. It felt like homework.",
          speaker: "Participant",
        },
      ],
      riskFlags: [
        "Both quotes come from the same participant — need cross-validation",
      ],
      relatedOpportunities: [1, 2],
    },
    {
      id: 2,
      title: "Trust Through Transparency",
      description:
        "Users expressed higher confidence when the system explained its reasoning or showed how results were generated.",
      confidence: "high",
      supportingQuotes: [
        {
          text: "When it showed me why it recommended that, I actually trusted it. Without that, it just felt like a black box.",
          speaker: "Participant",
        },
      ],
      riskFlags: [],
      relatedOpportunities: [3],
    },
    {
      id: 3,
      title: "Feature Discovery Gap",
      description:
        "Several key features were unknown to regular users, suggesting the information architecture may be burying important capabilities.",
      confidence: "medium",
      supportingQuotes: [
        {
          text: "Wait, it can do that? I've been using this for three months and never noticed.",
          speaker: "Participant",
        },
      ],
      riskFlags: [
        "Interviewer may have primed this response by demonstrating the feature",
      ],
      relatedOpportunities: [2],
    },
    {
      id: 4,
      title: "Collaborative Workflow Needs",
      description:
        "Users frequently described workarounds to share or collaborate, indicating unmet needs for team-oriented features.",
      confidence: "medium",
      supportingQuotes: [
        {
          text: "I end up screenshotting results and pasting them into Slack. It works but it's not great.",
          speaker: "Participant",
        },
      ],
      riskFlags: ["Single data point — needs validation in broader study"],
      relatedOpportunities: [4],
    },
  ],
  opportunities: [
    {
      id: 1,
      title: "Progressive Onboarding",
      description:
        "Replace the multi-step setup wizard with a progressive disclosure model that lets users start immediately and configure as they go.",
      relatedThemes: [1],
    },
    {
      id: 2,
      title: "Contextual Feature Education",
      description:
        "Surface feature tips at the moment of relevance rather than during onboarding, reducing cognitive load upfront.",
      relatedThemes: [1, 3],
    },
    {
      id: 3,
      title: "Explainable AI Layer",
      description:
        "Add visible reasoning traces or confidence indicators to AI-generated outputs to build user trust.",
      relatedThemes: [2],
    },
    {
      id: 4,
      title: "Lightweight Sharing",
      description:
        "Add a one-click share or export feature for results, reducing friction in collaborative workflows.",
      relatedThemes: [4],
    },
  ],
  openQuestions: [
    "How does onboarding friction differ between individual users and team leads who set up accounts for others?",
    "What is the actual drop-off rate at each onboarding step?",
    "Would users prefer inline explanations or a dedicated 'how it works' section?",
    "Are the undiscovered features genuinely valuable, or is low usage a signal of low utility?",
  ],
  modelConfidence: {
    overall: "medium",
    limitations: [
      "Analysis is based on a single interview transcript",
      "Participant may not be representative of the full user base",
      "Some interviewer questions appeared to be leading",
    ],
    transcriptQuality:
      "Good dialogue quality with clear speaker turns. Transcript is relatively short, limiting the depth of pattern analysis. Some paraphrasing detected that may not capture exact user language.",
  },
};
