export default function ExecutiveSummary({ text }) {
  return (
    <div className="rounded-xl shadow-sm p-5" style={{ background: "#EEF2FF" }}>
      <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#312E81" }}>
        Executive Summary
      </h2>
      <p className="text-[15px] leading-relaxed" style={{ color: "#1E1B4B" }}>{text}</p>
    </div>
  );
}
