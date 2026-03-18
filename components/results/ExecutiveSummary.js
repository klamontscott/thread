export default function ExecutiveSummary({ text }) {
  return (
    <div className="bg-surface rounded-xl shadow-sm p-5">
      <h2 className="text-xs font-medium uppercase tracking-wider text-secondary mb-2">
        Executive Summary
      </h2>
      <p className="text-[15px] leading-relaxed">{text}</p>
    </div>
  );
}
