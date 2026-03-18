"use client";

export default function TranscriptInput({ value, onChange }) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const isShort = wordCount > 0 && wordCount < 200;

  return (
    <div className="space-y-1.5">
      <label htmlFor="transcript" className="block text-sm font-medium">
        Interview Transcript
      </label>
      <textarea
        id="transcript"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your interview transcript here. Include both interviewer and participant dialogue for best results..."
        className="w-full h-56 px-3.5 py-3 bg-background border border-border rounded-lg text-[15px] leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors placeholder:text-tertiary"
      />
      <div className="flex items-center justify-between text-xs text-secondary">
        <span>{wordCount.toLocaleString()} words</span>
        {isShort && (
          <span className="text-medium flex items-center gap-1" role="alert">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01"
              />
            </svg>
            Short transcript — results may be limited
          </span>
        )}
      </div>
    </div>
  );
}
