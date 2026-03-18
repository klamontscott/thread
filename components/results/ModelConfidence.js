import ConfidenceBadge from "../shared/ConfidenceBadge";

export default function ModelConfidence({ confidence }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-secondary">
          Analysis Confidence
        </h3>
        <ConfidenceBadge level={confidence.overall} />
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-xs font-medium text-secondary mb-1">
            Transcript Quality
          </h4>
          <p className="text-sm">{confidence.transcriptQuality}</p>
        </div>

        {confidence.limitations.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-secondary mb-1">
              Limitations
            </h4>
            <ul className="space-y-1">
              {confidence.limitations.map((limitation, i) => (
                <li
                  key={i}
                  className="text-sm text-secondary flex items-start gap-2"
                >
                  <span className="mt-2 shrink-0 w-1 h-1 rounded-full bg-tertiary" />
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
