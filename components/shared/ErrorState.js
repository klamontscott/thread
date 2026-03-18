export default function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-sm mx-auto py-24 text-center" role="alert">
      <div className="w-10 h-10 mx-auto rounded-full bg-low-light flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-low"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold mb-1">Analysis failed</h2>
      <p className="text-sm text-secondary mb-6">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-foreground text-white rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
