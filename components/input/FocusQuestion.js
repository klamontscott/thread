"use client";

export default function FocusQuestion({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Research Question
        <span className="text-muted font-normal ml-1">(optional)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='e.g., "What barriers prevent users from completing onboarding?"'
        className="w-full px-4 py-3 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors placeholder:text-muted/60"
      />
    </div>
  );
}
