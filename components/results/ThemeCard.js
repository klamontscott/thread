"use client";

import ConfidenceBadge from "../shared/ConfidenceBadge";
import RiskFlag from "../shared/RiskFlag";

export default function ThemeCard({
  theme,
  index = 0,
  isReviewed,
  onOpenReview,
}) {
  return (
    <div
      className="animate-fadeSlideUp"
      style={{
        animationDelay: `${300 + index * 120}ms`,
        animationFillMode: "both",
      }}
    >
      <div
        className={`
          overflow-hidden transition-all duration-300
          border-l-[3px]
          bg-surface shadow-sm
          hover:shadow-md hover:-translate-y-0.5
          cursor-pointer
        `}
        style={{
          borderLeftColor: isReviewed ? "var(--color-accent)" : "var(--color-border-strong)",
          borderLeftStyle: "solid",
          borderRadius: "0 8px 8px 0",
        }}
        onClick={() => onOpenReview(theme)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onOpenReview(theme)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-[15px]">{theme.title}</h4>
                <ConfidenceBadge level={theme.confidence} />
              </div>
              <p className="text-sm text-secondary mt-1">
                {theme.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isReviewed ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent uppercase tracking-wider">
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
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Reviewed
                </span>
              ) : (
                <span className="text-[10px] font-medium text-tertiary uppercase tracking-wider bg-background px-2 py-0.5 rounded border border-dashed border-border-strong">
                  Needs Review
                </span>
              )}
              {/* Arrow indicating panel opens */}
              <svg
                className="w-4 h-4 text-tertiary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Risk flags */}
          {theme.riskFlags?.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {theme.riskFlags.map((flag, i) => (
                <RiskFlag key={i} text={flag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
