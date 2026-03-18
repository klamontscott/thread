"use client";

import { useState } from "react";
import AnalysisSummary from "./AnalysisSummary";
import ExecutiveSummary from "./ExecutiveSummary";
import ThemeList from "./ThemeList";
import ThemeReviewPanel from "./ThemeReviewPanel";
import FullReviewView from "./FullReviewView";
import OpportunityList from "./OpportunityList";
import OpenQuestions from "./OpenQuestions";
import ModelConfidence from "./ModelConfidence";

export default function ResultsContainer({ results, transcript, onReset }) {
  const [reviewedThemes, setReviewedThemes] = useState(new Set());
  const [annotations, setAnnotations] = useState({});
  const [activeTheme, setActiveTheme] = useState(null);
  const [fullReviewOpen, setFullReviewOpen] = useState(false);

  function handleSaveReview(themeId, annotation) {
    setAnnotations((prev) => ({ ...prev, [themeId]: annotation }));
    setReviewedThemes((prev) => {
      const next = new Set(prev);
      next.add(themeId);
      return next;
    });
    setActiveTheme(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-baseline justify-between animate-fadeSlideUp">
        <h1 className="text-2xl font-semibold tracking-tight">
          Analysis Results
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setFullReviewOpen(true)}
            className="text-sm font-semibold text-white bg-accent hover:bg-accent-hover px-4 py-1.5 rounded-md shadow-sm hover:shadow transition-all"
          >
            Full Review
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-accent hover:text-accent-hover font-medium transition-colors"
          >
            Analyze another
          </button>
        </div>
      </div>

      {/* Data Viz Summary */}
      <AnalysisSummary
        results={results}
        reviewedCount={reviewedThemes.size}
        totalThemes={results.themes.length}
      />

      {/* Executive Summary */}
      <div className="animate-fadeSlideUp" style={{ animationDelay: "200ms" }}>
        <ExecutiveSummary text={results.executiveSummary} />
      </div>

      {/* Themes — Review Queue */}
      <ThemeList
        themes={results.themes}
        reviewedThemes={reviewedThemes}
        onOpenReview={setActiveTheme}
      />

      {/* Opportunities */}
      <div
        className="animate-fadeSlideUp"
        style={{ animationDelay: `${300 + results.themes.length * 120 + 200}ms` }}
      >
        <OpportunityList opportunities={results.opportunities} />
      </div>

      {/* Open Questions */}
      <div
        className="animate-fadeSlideUp"
        style={{ animationDelay: `${300 + results.themes.length * 120 + 400}ms` }}
      >
        <OpenQuestions questions={results.openQuestions} />
      </div>

      {/* Model Confidence */}
      <div
        className="animate-fadeSlideUp"
        style={{ animationDelay: `${300 + results.themes.length * 120 + 600}ms` }}
      >
        <ModelConfidence confidence={results.modelConfidence} />
      </div>

      {/* Slide-over Panel */}
      {activeTheme && (
        <ThemeReviewPanel
          theme={activeTheme}
          annotation={annotations[activeTheme.id]}
          onSave={handleSaveReview}
          onClose={() => setActiveTheme(null)}
        />
      )}

      {/* Full Review — Split Screen */}
      {fullReviewOpen && (
        <FullReviewView
          themes={results.themes}
          transcript={transcript}
          annotations={annotations}
          reviewedThemes={reviewedThemes}
          onSave={handleSaveReview}
          onClose={() => setFullReviewOpen(false)}
        />
      )}
    </div>
  );
}
