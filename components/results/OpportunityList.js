import ExpandableSection from "../shared/ExpandableSection";
import OpportunityArea from "./OpportunityArea";

export default function OpportunityList({ opportunities }) {
  return (
    <ExpandableSection
      title="Opportunities"
      count={opportunities.length}
      defaultOpen={true}
    >
      <div className="space-y-3">
        {opportunities.map((opp) => (
          <OpportunityArea key={opp.id} opportunity={opp} />
        ))}
      </div>
    </ExpandableSection>
  );
}
