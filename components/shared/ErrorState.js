export default function ErrorState({ message, onRetry }) {
  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl bg-terra-light flex items-center justify-center mb-4">
        <svg
          className="w-6 h-6 text-terra"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2">Analysis Failed</h3>
      <p className="text-sm text-muted mb-6">
        {message || "Something went wrong. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-sage text-white rounded-lg font-medium text-sm hover:bg-sage/90 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
