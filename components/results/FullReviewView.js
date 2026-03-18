"use client";

import { useState, useMemo, useEffect } from "react";
import ConfidenceBadge from "../shared/ConfidenceBadge";

const CONFIDENCE_OPTIONS = ["high", "medium", "low"];

function HighlightedTranscript({ transcript, quotes, activeQuoteIndex }) {
  // Build highlighted version of transcript
  const segments = useMemo(() => {
    if (!quotes || quotes.length === 0) return [{ text: transcript, highlighted: false }];

    // Find all quote positions in transcript
    const matches = [];
    quotes.forEach((quote, i) => {
      const idx = transcript.toLowerCase().indexOf(quote.text.toLowerCase());
      if (idx !== -1) {
        matches.push({ start: idx, end: idx + quote.text.length, index: i });
      }
    });

    // Sort by position
    matches.sort((a, b) => a.start - b.start);

    // Build segments
    const result = [];
    let cursor = 0;
    matches.forEach((match) => {
      if (match.start > cursor) {
        result.push({ text: transcript.slice(cursor, match.start), highlighted: false });
      }
      result.push({
        text: transcript.slice(match.start, match.end),
        highlighted: true,
        quoteIndex: match.index,
        isActive: match.index === activeQuoteIndex,
      });
      cursor = match.end;
    });
    if (cursor < transcript.length) {
      result.push({ text: transcript.slice(cursor), highlighted: false });
    }

    return result;
  }, [transcript, quotes, activeQuoteIndex]);

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark
            key={i}
            id={`quote-${seg.quoteIndex}`}
            className="transition-colors duration-300 rounded-sm px-0.5 -mx-0.5"
            style={{
              background: seg.isActive ? "#C7D2FE" : "#EEF2FF",
              borderLeft: seg.isActive ? "3px solid var(--color-accent)" : "3px solid transparent",
              paddingLeft: seg.isActive ? "6px" : "2px",
            }}
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i} style={{ color: "#5C6370" }}>{seg.text}</span>
        )
      )}
    </div>
  );
}

export default function FullReviewView({
  themes,
  transcript,
  annotations,
  reviewedThemes,
  onSave,
  onClose,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);

  const theme = themes[currentIndex];
  const annotation = annotations[theme.id] || {};

  const [notes, setNotes] = useState(annotation.notes || "");
  const [confidenceOverride, setConfidenceOverride] = useState(
    annotation.confidenceOverride || null
  );
  const [dismissedQuotes, setDismissedQuotes] = useState(
    new Set(annotation.dismissedQuotes || [])
  );
  const [customFlags, setCustomFlags] = useState(annotation.customFlags || []);
  const [newFlag, setNewFlag] = useState("");

  // Reset form when theme changes
  useEffect(() => {
    const a = annotations[theme.id] || {};
    setNotes(a.notes || "");
    setConfidenceOverride(a.confidenceOverride || null);
    setDismissedQuotes(new Set(a.dismissedQuotes || []));
    setCustomFlags(a.customFlags || []);
    setNewFlag("");
    setActiveQuoteIndex(null);
  }, [currentIndex, theme.id, annotations]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function saveCurrentTheme() {
    onSave(theme.id, {
      notes,
      confidenceOverride,
      dismissedQuotes: Array.from(dismissedQuotes),
      customFlags,
    });
  }

  function handleNext() {
    saveCurrentTheme();
    if (currentIndex < themes.length - 1) setCurrentIndex(currentIndex + 1);
  }

  function handlePrev() {
    saveCurrentTheme();
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  function handleSaveAndClose() {
    saveCurrentTheme();
    onClose();
  }

  function toggleQuoteDismiss(index) {
    setDismissedQuotes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function addFlag() {
    if (newFlag.trim()) {
      setCustomFlags((prev) => [...prev, newFlag.trim()]);
      setNewFlag("");
    }
  }

  function scrollToQuote(quoteIndex) {
    setActiveQuoteIndex(quoteIndex);
    const el = document.getElementById(`quote-${quoteIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const activeConfidence = confidenceOverride || theme.confidence;
  const isReviewed = reviewedThemes.has(theme.id);

  return (
    <div className="fixed inset-0 z-50 bg-surface flex flex-col">
      {/* Top bar */}
      <div className="px-6 h-12 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-tight text-accent">Thread</span>
          <span className="text-xs text-tertiary">Full Review</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Theme navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="w-7 h-7 rounded border border-border flex items-center justify-center text-secondary hover:bg-background disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-medium">
              {currentIndex + 1} <span className="text-tertiary">of</span> {themes.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === themes.length - 1}
              className="w-7 h-7 rounded border border-border flex items-center justify-center text-secondary hover:bg-background disabled:opacity-30 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveAndClose}
            className="text-sm font-semibold text-white bg-accent hover:bg-accent-hover px-4 py-1.5 rounded-md transition-colors"
          >
            Save &amp; Exit
          </button>
        </div>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left — Transcript */}
        <div className="w-2/5 border-r border-border flex flex-col" style={{ background: "#F0F0F2" }}>
          <div className="px-6 py-3 border-b border-border shrink-0" style={{ background: "#E8E8EC" }}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Source Transcript
            </h2>
            <p className="text-[11px] text-tertiary mt-0.5">
              Click a quote on the right to highlight it here
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <HighlightedTranscript
              transcript={transcript}
              quotes={theme.supportingQuotes || []}
              activeQuoteIndex={activeQuoteIndex}
            />
          </div>
        </div>

        {/* Right — Theme Review */}
        <div className="w-3/5 flex flex-col">
          <div className="px-6 py-3 border-b border-border shrink-0 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Theme Review
            </h2>
            {isReviewed && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-accent uppercase tracking-wider">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Reviewed
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Theme header */}
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-bold tracking-tight">{theme.title}</h3>
                <ConfidenceBadge level={activeConfidence} />
              </div>
              <p className="text-sm text-secondary mt-2 leading-relaxed">
                {theme.description}
              </p>
            </div>

            {/* Supporting Evidence */}
            {theme.supportingQuotes?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                  Supporting Evidence
                </h4>
                <div className="space-y-2">
                  {theme.supportingQuotes.map((quote, i) => (
                    <div
                      key={i}
                      className={`
                        border-l-2 pl-3 py-2 cursor-pointer transition-all duration-200 rounded-r-md
                        ${activeQuoteIndex === i ? "border-accent bg-accent-light" : dismissedQuotes.has(i) ? "border-border opacity-40" : "border-border-strong hover:border-accent hover:bg-accent-light/50"}
                      `}
                      onClick={() => scrollToQuote(i)}
                    >
                      <p className={`text-sm italic ${dismissedQuotes.has(i) ? "line-through text-tertiary" : "text-secondary"}`}>
                        &ldquo;{quote.text}&rdquo;
                      </p>
                      {quote.speaker && (
                        <cite className="text-xs text-tertiary mt-0.5 block not-italic">
                          {quote.speaker}
                        </cite>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleQuoteDismiss(i);
                        }}
                        className="text-[10px] font-medium text-tertiary hover:text-secondary mt-1 transition-colors"
                      >
                        {dismissedQuotes.has(i) ? "Restore" : "Dismiss"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Flags */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Risk Flags
              </h4>
              {theme.riskFlags?.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {theme.riskFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-medium bg-medium-light rounded-md px-3 py-2">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              )}
              {customFlags.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {customFlags.map((flag, i) => (
                    <div key={i} className="flex items-center justify-between gap-2 text-sm text-accent bg-accent-light rounded-md px-3 py-2">
                      <span>{flag}</span>
                      <button type="button" onClick={() => setCustomFlags((p) => p.filter((_, j) => j !== i))} className="text-tertiary hover:text-secondary shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFlag}
                  onChange={(e) => setNewFlag(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFlag()}
                  placeholder="Add a risk flag..."
                  className="flex-1 text-sm border border-border rounded-md px-3 py-1.5 bg-background placeholder:text-tertiary focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={addFlag}
                  disabled={!newFlag.trim()}
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-background border border-border text-secondary hover:border-border-strong disabled:opacity-40 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Research Annotation */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Research Annotation
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your domain context, observations, or concerns about this theme..."
                rows={4}
                className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background placeholder:text-tertiary resize-none focus:outline-none focus:border-accent leading-relaxed"
              />
            </div>

            {/* Ask About This Theme — Placeholder */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Ask About This Theme
              </h4>
              <div className="rounded-lg border border-border bg-background p-3 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold text-accent bg-accent-light px-1.5 py-0.5 rounded shrink-0 mt-px">You</span>
                  <p className="text-sm text-secondary italic">
                    &ldquo;Could this theme be driven by general tech skepticism rather than driverless-specific concerns?&rdquo;
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] font-semibold text-tertiary bg-background border border-border px-1.5 py-0.5 rounded shrink-0 mt-px">AI</span>
                  <p className="text-sm text-secondary">
                    Based on the transcript, the participant expressed enthusiasm for app-based ride hailing and navigation features, suggesting comfort with technology broadly. Their concern appears specific to autonomous vehicles — they referenced physical safety and lack of human judgment, not technology distrust.
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Ask a follow-up question about this theme..."
                  disabled
                  className="flex-1 text-sm border border-border rounded-md px-3 py-1.5 bg-background placeholder:text-tertiary opacity-60 cursor-not-allowed"
                />
                <button
                  type="button"
                  disabled
                  className="text-xs font-medium px-3 py-1.5 rounded-md bg-accent text-white opacity-60 cursor-not-allowed"
                >
                  Ask
                </button>
              </div>
              <p className="text-[10px] text-tertiary mt-1.5">Coming soon — interrogate the model with your domain expertise</p>
            </div>

            {/* Confidence Override */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Confidence Level
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-tertiary">AI assigned:</span>
                <ConfidenceBadge level={theme.confidence} />
              </div>
              <div className="flex items-center gap-1.5">
                {CONFIDENCE_OPTIONS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() =>
                      setConfidenceOverride(level === confidenceOverride ? null : level)
                    }
                    className={`
                      text-xs font-medium px-3 py-1.5 rounded-md capitalize transition-all border
                      ${
                        activeConfidence === level && confidenceOverride
                          ? level === "high"
                            ? "bg-high-light text-high border-high"
                            : level === "medium"
                              ? "bg-medium-light text-medium border-medium"
                              : "bg-low-light text-low border-low"
                          : "bg-background text-secondary border-border hover:border-border-strong"
                      }
                    `}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {confidenceOverride && confidenceOverride !== theme.confidence && (
                <p className="text-[11px] text-accent font-medium mt-2">
                  Overriding AI from {theme.confidence} → {confidenceOverride}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 h-10 border-t border-border flex items-center justify-between shrink-0">
        <span className="text-xs text-tertiary font-medium">Thread</span>
        <span className="text-xs text-tertiary">Designed by Keith Scott</span>
      </div>
    </div>
  );
}
