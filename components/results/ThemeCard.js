"use client";

import { useState } from "react";
import ConfidenceBadge from "../shared/ConfidenceBadge";
import QuoteCard from "../shared/QuoteCard";
import RiskFlag from "../shared/RiskFlag";

export default function ThemeCard({ theme }) {
  const [quotesOpen, setQuotesOpen] = useState(false);

  return (
    <div className="bg-background rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-[15px]">{theme.title}</h4>
          <p className="text-sm text-secondary mt-0.5">{theme.description}</p>
        </div>
        <ConfidenceBadge level={theme.confidence} />
      </div>

      {theme.supportingQuotes.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setQuotesOpen(!quotesOpen)}
            aria-expanded={quotesOpen}
            className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-tertiary hover:text-secondary transition-colors"
          >
            <span>Supporting Evidence</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform ${quotesOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {quotesOpen && (
            <div className="mt-2">
              {theme.supportingQuotes.map((quote, i) => (
                <QuoteCard key={i} text={quote.text} speaker={quote.speaker} />
              ))}
            </div>
          )}
        </div>
      )}

      {theme.riskFlags.length > 0 && (
        <div className="space-y-1.5">
          {theme.riskFlags.map((flag, i) => (
            <RiskFlag key={i} text={flag} />
          ))}
        </div>
      )}
    </div>
  );
}
