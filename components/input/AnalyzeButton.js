"use client";

export default function AnalyzeButton({ onClick, disabled, loading }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className="w-full py-3 bg-[#1D1D1F] text-white rounded-lg font-medium text-[15px] hover:bg-black disabled:bg-[#D1D1D6] disabled:text-[#86868B] disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {loading ? (
        <>
          <div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            aria-hidden="true"
          />
          Analyzing...
        </>
      ) : (
        "Analyze Transcript"
      )}
    </button>
  );
}
