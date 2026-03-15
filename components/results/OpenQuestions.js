import ExpandableSection from "../shared/ExpandableSection";

export default function OpenQuestions({ questions }) {
  return (
    <ExpandableSection
      title="Open Questions"
      count={questions.length}
      defaultOpen={false}
    >
      <ul className="space-y-2">
        {questions.map((question, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="text-sky mt-0.5 shrink-0">?</span>
            <span>{question}</span>
          </li>
        ))}
      </ul>
    </ExpandableSection>
  );
}
