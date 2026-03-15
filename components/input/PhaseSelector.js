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
    <div className="space-y-2">
      <label className="block text-sm font-medium">Research Phase</label>
      <div className="grid grid-cols-3 gap-2">
        {phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => onChange(phase.id)}
            className={`px-3 py-3 rounded-xl border text-left transition-all ${
              value === phase.id
                ? "border-sage bg-sage-light/50 ring-1 ring-sage/20"
                : "border-border bg-white hover:border-sage/40"
            }`}
          >
            <span className="block text-sm font-medium">{phase.label}</span>
            <span className="block text-xs text-muted mt-0.5">
              {phase.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
