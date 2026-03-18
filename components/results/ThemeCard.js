import ConfidenceBadge from "../shared/ConfidenceBadge";
import QuoteCard from "../shared/QuoteCard";
import RiskFlag from "../shared/RiskFlag";

export default function ThemeCard({ theme }) {
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
          {theme.supportingQuotes.map((quote, i) => (
            <QuoteCard key={i} text={quote.text} speaker={quote.speaker} />
          ))}
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
