import ExecutiveSummary from "./ExecutiveSummary";
import ThemeList from "./ThemeList";
import OpportunityList from "./OpportunityList";
import OpenQuestions from "./OpenQuestions";
import ModelConfidence from "./ModelConfidence";

export default function ResultsContainer({ results, onReset }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Analysis Results</h2>
        <button
          onClick={onReset}
          className="text-sm text-sage hover:text-sage/80 font-medium transition-colors"
        >
          Analyze Another
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
