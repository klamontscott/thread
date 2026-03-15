export default function OpportunityArea({ opportunity }) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-lavender-light flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs font-bold text-lavender">
            {opportunity.id}
          </span>
        </div>
        <div>
          <h4 className="font-semibold text-sm">{opportunity.title}</h4>
          <p className="text-sm text-muted mt-1">{opportunity.description}</p>
        </div>
      </div>
    </div>
  );
}
