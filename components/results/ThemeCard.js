import ConfidenceBadge from "../shared/ConfidenceBadge";
import QuoteCard from "../shared/QuoteCard";
import RiskFlag from "../shared/RiskFlag";

export default function ThemeCard({ theme }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-base">{theme.title}</h4>
          <p className="text-sm text-muted mt-1">{theme.description}</p>
        </div>
        <ConfidenceBadge level={theme.confidence} />
      </div>

      {theme.supportingQuotes.length > 0 && (
        <div className="space-y-1">
          {theme.supportingQuotes.map((quote, i) => (
            <QuoteCard key={i} text={quote.text} speaker={quote.speaker} />
          ))}
        </div>
      )}

      {theme.riskFlags.length > 0 && (
        <div className="space-y-2">
          {theme.riskFlags.map((flag, i) => (
            <RiskFlag key={i} text={flag} />
          ))}
        </div>
      )}
    </div>
  );
}
