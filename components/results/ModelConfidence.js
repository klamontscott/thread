import ConfidenceBadge from "../shared/ConfidenceBadge";

export default function ModelConfidence({ confidence }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Analysis Confidence
        </h3>
        <ConfidenceBadge level={confidence.overall} />
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-medium text-muted mb-1.5">
            Transcript Quality
          </h4>
          <p className="text-sm">{confidence.transcriptQuality}</p>
        </div>

        {confidence.limitations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted mb-1.5">
              Limitations
            </h4>
            <ul className="space-y-1">
              {confidence.limitations.map((limitation, i) => (
                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-terra mt-1 shrink-0">&bull;</span>
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
