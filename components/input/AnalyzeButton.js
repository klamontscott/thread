"use client";

export default function AnalyzeButton({ onClick, disabled, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-3.5 bg-sage text-white rounded-xl font-medium text-sm hover:bg-sage/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Analyze Transcript
        </>
      )}
    </button>
  );
}
