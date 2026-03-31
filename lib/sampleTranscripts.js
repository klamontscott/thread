export const sampleTranscripts = [
  {
    id: "usability-test",
    title: "Usability Test — Mobile Banking App",
    phase: "evaluative",
    focusQuestion: "What friction points prevent users from completing mobile deposits?",
    transcript: `Interviewer: Thanks for joining today. We're going to walk through the mobile deposit feature. Can you start by telling me how you typically deposit checks?

Participant: Usually I just go to the bank, honestly. I've tried the app a couple times but I always end up going in person.

Interviewer: What made you go back to in-person deposits?

Participant: The first time I tried it, I took the photo and it said the image was unclear. I tried like four times and kept getting the same error. It never told me what was actually wrong with the photo — just "image unclear, try again." I was standing in good lighting, the check was flat on the table. I gave up.

Interviewer: That sounds frustrating. Did you try again after that?

Participant: Yeah, maybe a month later. That time it actually worked, but then it said the funds would be available in five business days. Five days! If I drive to the bank it's available the next day. So what's the point?

Interviewer: Makes sense. Let's try doing a deposit now. Here's a sample check — go ahead and walk me through what you'd do.

Participant: Okay so I'm opening the app... I'm going to "Accounts"... I don't see a deposit option here. Let me check "Transfers." No, not there either. Oh wait, is it under this "More" menu? Yeah, here it is. "Mobile Deposit." Why is it buried under "More"? That seems like something people would use all the time.

Interviewer: Good observation. Go ahead and continue.

Participant: Alright, so I select my checking account, enter the amount... $150... now it wants front and back photos. I'll take the front... okay it's processing... it accepted it. Now the back... okay, that worked too. Now it says "Review and Submit." I can see the amount, the account, the images. That's actually nice — I can verify the photos look right. Submitting... and done. "Deposit received, funds available in 3-5 business days."

Interviewer: How did that feel compared to your first experience?

Participant: Way better, honestly. The photo part was smooth this time. But the funds timing still bugs me. And I had to hunt for the feature. If there was a "Deposit" button right on the home screen and the money was available faster, I'd probably never go to the bank again.

Interviewer: If you could change one thing about this experience, what would it be?

Participant: The error messages. When something goes wrong with the photo, tell me what's wrong. Is it the lighting? Is the check crooked? Is there a glare? Just "image unclear" tells me nothing. I felt like I was guessing.

Interviewer: Last question — would you recommend this feature to someone?

Participant: Honestly, with how it is now, probably not. I'd say "it works sometimes." That's not exactly a ringing endorsement. But if they fixed the error messages and the hold times, absolutely.`,
  },
  {
    id: "customer-discovery",
    title: "Customer Discovery — Research Team Workflows",
    phase: "exploratory",
    focusQuestion: "",
    transcript: `Interviewer: Tell me about your current role and how research fits into your team's workflow.

Participant: I'm a product designer on a growth team. We're a squad of about six — two engineers, a PM, a data analyst, me, and a part-time researcher who splits time between three teams.

Interviewer: How does that shared researcher arrangement work in practice?

Participant: It doesn't, really. She's great when we have her, but we get maybe ten hours a week of her time. So most of the actual research — the user interviews, the synthesis — that falls on me. I don't mind doing interviews. I actually enjoy that part. But the synthesis kills me.

Interviewer: What does synthesis look like for you right now?

Participant: It's basically me with a Google Doc and highlighters. I'll do five or six interviews over two weeks, and then I need like a full week just to go back through the transcripts and pull out patterns. I'm color-coding quotes, making sticky notes in FigJam, trying to group things into themes. It's incredibly manual.

Interviewer: A full week — is that typical?

Participant: For a thorough job, yeah. But I rarely get a full week. Usually the PM is already asking for insights by day three because there's a sprint planning coming up. So I end up doing a rushed version where I just pull the quotes I remember being important and kind of wing the themes.

Interviewer: How confident are you in the insights when that happens?

Participant: Honestly? Not very. I know I'm missing things. I'll present findings and then two weeks later I'll be re-reading a transcript for something else and find a quote that completely contradicts one of my themes. It's not great. The team makes decisions based on what I present, so if my synthesis is incomplete, we're building on a shaky foundation.

Interviewer: What would change that for you?

Participant: If I could get from raw transcripts to structured themes in hours instead of days. I don't need a robot to do the thinking for me — I need something that can do the first pass. Pull out candidate themes, surface the strongest quotes, flag where participants disagreed. Then I can review that output with my domain knowledge and refine it. The bottleneck isn't the thinking, it's the manual extraction.

Interviewer: Have you tried any tools for this?

Participant: I tried Dovetail for a bit. It's fine for organizing and tagging, but it still requires me to do all the tagging manually. I've also tried just dumping transcripts into ChatGPT, but the output is too generic. It gives me themes like "users want a better experience." No kidding. I need specificity — which users, based on what evidence, with what confidence level.

Interviewer: If a tool could do that first pass you described, what would make you trust its output?

Participant: Show me the receipts. If it says "onboarding is a major pain point," I want to see the exact quotes that support that. I want to know if four out of six participants said it or just one. And I want it to flag when something is ambiguous — like "this could be a theme but the evidence is thin." That honesty is what would make me actually use it instead of just checking a box.`,
  },
  {
    id: "stakeholder-interview",
    title: "Stakeholder Interview — AI Feature Trust & Adoption",
    phase: "exploratory",
    focusQuestion: "How do teams currently evaluate whether to trust AI-generated outputs in their workflow?",
    transcript: `Interviewer: Can you walk me through how your team currently uses AI tools in your day-to-day work?

Participant: We've been using Copilot for code generation for about a year. The engineering team adopted it pretty quickly. On the design and content side, people use ChatGPT and Claude for first drafts — blog posts, error messages, that kind of thing. But there's no real standard. Everyone's kind of doing their own thing.

Interviewer: Is there any oversight or review process for AI-generated content?

Participant: For code, yes — everything goes through code review regardless of how it was written. But for design and content, it's more informal. Someone might write a first draft with AI and then edit it, but there's no requirement to disclose that. A few months ago we had an incident where a marketing email went out with a hallucinated statistic. Nobody caught it in review because it sounded plausible. That was a wake-up call.

Interviewer: How did the team respond to that incident?

Participant: There was a knee-jerk reaction to ban AI tools entirely. Our VP pushed back on that — she said the productivity gains are real and we can't just pretend the tools don't exist. So instead we formed a small working group to draft guidelines. I'm on that group, which is partly why I agreed to this interview.

Interviewer: Where is that working group now in terms of progress?

Participant: We've been meeting for about six weeks. Honestly, it's hard. The engineers want very different things than the content team. Engineers are comfortable with AI because they have deterministic tests — if Copilot writes bad code, the tests catch it. But for content and design, the quality checks are subjective. How do you "test" whether an AI-written paragraph is accurate? You have to read it carefully, check the claims, verify the tone. That's basically the same amount of work as writing it yourself.

Interviewer: That's an interesting tension. How are you resolving it?

Participant: We're not, yet. The current proposal is a tiered system. Low-stakes outputs — internal docs, first drafts, brainstorming — use AI freely. Medium-stakes — customer-facing content, design copy — requires human review with a checklist. High-stakes — legal, medical claims, financial data — no AI generation allowed, period. But even that framework has edge cases. Like, is a product description medium or high stakes? Depends on the product.

Interviewer: Stepping back — what would an ideal AI integration look like for your team?

Participant: I think the tools themselves need to be more honest about their limitations. When I use Claude and it says "I'm not sure about this, you should verify," I actually trust it more. When ChatGPT gives me an answer with total confidence and it turns out to be wrong, I trust it less even when it's right the next time. The tools that acknowledge uncertainty are the ones I'll keep using. I wish our internal tools worked the same way — surface the confidence level, show me what's uncertain, let me make the call.

Interviewer: Is there anything else you think we should know about how your team thinks about AI trust?

Participant: The biggest thing is that trust isn't binary. It's not "we trust AI" or "we don't." It's contextual. I trust Copilot for boilerplate code. I don't trust any AI to write a legal disclosure. Most teams are still figuring out where those lines are, and the tools aren't helping them draw those lines. If anything, the tools are designed to seem maximally confident all the time, which is exactly the wrong approach for building long-term trust.`,
  },
];
