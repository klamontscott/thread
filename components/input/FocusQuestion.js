"use client";

export default function FocusQuestion({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="focus-question" className="block text-sm font-medium">
        Research Question
        <span className="text-tertiary font-normal ml-1">(optional)</span>
      </label>
      <input
        id="focus-question"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='e.g., "What barriers prevent users from completing onboarding?"'
        className="w-full px-3.5 py-2.5 bg-background border border-border rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors placeholder:text-tertiary"
      />
    </div>
  );
}
