export default function OpportunityArea({ opportunity }) {
  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-xs font-semibold text-accent bg-accent-light w-6 h-6 rounded flex items-center justify-center shrink-0 mt-0.5">
          {opportunity.id}
        </span>
        <div className="min-w-0">
          <h4 className="font-medium text-[15px]">{opportunity.title}</h4>
          <p className="text-sm text-secondary mt-0.5">
            {opportunity.description}
          </p>
        </div>
      </div>
    </div>
  );
}
