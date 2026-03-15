"use client";

export default function TranscriptInput({ value, onChange }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isShort = wordCount > 0 && wordCount < 200;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        Interview Transcript
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your interview transcript here. Include both interviewer and participant dialogue for best results..."
        className="w-full h-64 px-4 py-3 bg-white border border-border rounded-xl text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-colors placeholder:text-muted/60"
      />
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{wordCount.toLocaleString()} words</span>
        {isShort && (
          <span className="text-terra flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            Short transcript — results may be limited
          </span>
        )}
      </div>
    </div>
  );
}
