"use client";

import { sampleTranscripts } from "@/lib/sampleTranscripts";

export default function SampleSelector({ selected, onSelect }) {
  function handleChange(e) {
    const id = e.target.value;
    if (!id) return;

    const sample = sampleTranscripts.find((s) => s.id === id);
    if (sample) {
      onSelect(sample);
    }
  }

  const isActive = !!selected;

  return (
    <div
      className="space-y-1.5 rounded-lg p-4 mb-2 bg-accent/[0.06] border border-accent/20"
    >
      <div className="flex items-center justify-between">
        <label htmlFor="sample-select" className="block text-sm font-medium">
          Try a Sample Transcript
        </label>
        {isActive && (
          <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
            Sample loaded
          </span>
        )}
      </div>
      <select
        id="sample-select"
        value={selected || ""}
        onChange={handleChange}
        className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors text-secondary cursor-pointer appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
          paddingRight: "40px",
        }}
      >
        <option value="">Select a sample transcript...</option>
        {sampleTranscripts.map((sample) => (
          <option key={sample.id} value={sample.id}>
            {sample.title}
          </option>
        ))}
      </select>
      <p className="text-xs text-tertiary">
        {isActive
          ? "This is a sample transcript for demonstration purposes. You can edit it or replace it with your own."
          : "No transcript handy? Load a sample to see Thread in action."}
      </p>
    </div>
  );
}
