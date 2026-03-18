import ExecutiveSummary from "./ExecutiveSummary";
import ThemeList from "./ThemeList";
import OpportunityList from "./OpportunityList";
import OpenQuestions from "./OpenQuestions";
import ModelConfidence from "./ModelConfidence";

export default function ResultsContainer({ results, onReset }) {
  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Results</h1>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
        >
          Analyze another
        </button>
      </div>

      <ExecutiveSummary text={results.executiveSummary} />
      <ThemeList themes={results.themes} />
      <OpportunityList opportunities={results.opportunities} />
      <OpenQuestions questions={results.openQuestions} />
      <ModelConfidence confidence={results.modelConfidence} />
    </div>
  );
}
