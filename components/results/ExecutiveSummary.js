export default function ExecutiveSummary({ text }) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
        Executive Summary
      </h2>
      <p className="text-base leading-relaxed">{text}</p>
    </div>
  );
}
