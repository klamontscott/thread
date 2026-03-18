import ExpandableSection from "../shared/ExpandableSection";

export default function OpenQuestions({ questions }) {
  return (
    <ExpandableSection
      title="Open Questions"
      count={questions.length}
      defaultOpen={false}
    >
      <ul className="space-y-2.5">
        {questions.map((question, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span className="text-accent font-semibold mt-px shrink-0">?</span>
            <span className="text-secondary">{question}</span>
          </li>
        ))}
      </ul>
    </ExpandableSection>
  );
}
