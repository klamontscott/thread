"use client";

const phases = [
  {
    id: "exploratory",
    label: "Exploratory",
    description: "Open-ended discovery",
  },
  {
    id: "evaluative",
    label: "Evaluative",
    description: "Testing assumptions",
  },
  {
    id: "generative",
    label: "Generative",
    description: "Generating ideas",
  },
];

export default function PhaseSelector({ value, onChange }) {
  return (
    <fieldset className="space-y-1.5">
      <legend className="block text-sm font-medium">Research Phase</legend>
      <div className="grid grid-cols-3 gap-2">
        {phases.map((phase) => (
          <button
            key={phase.id}
            type="button"
            onClick={() => onChange(phase.id)}
            aria-pressed={value === phase.id}
            className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
              value === phase.id
                ? "border-accent bg-surface shadow-sm"
                : "border-border bg-background hover:border-border-strong"
            }`}
          >
            <span className="block text-sm font-medium">{phase.label}</span>
            <span className="block text-xs text-secondary mt-0.5">
              {phase.description}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
