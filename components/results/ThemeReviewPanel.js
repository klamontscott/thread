"use client";

import { useState, useEffect } from "react";
import ConfidenceBadge from "../shared/ConfidenceBadge";
import TranscriptHeatmap from "../shared/TranscriptHeatmap";

const CONFIDENCE_OPTIONS = ["high", "medium", "low"];

export default function ThemeReviewPanel({
  theme,
  transcript,
  annotation,
  onSave,
  onClose,
  onOpenFullReview,
}) {
  const [notes, setNotes] = useState(annotation?.notes || "");
  const [confidenceOverride, setConfidenceOverride] = useState(
    annotation?.confidenceOverride || null
  );
  const [dismissedQuotes, setDismissedQuotes] = useState(
    new Set(annotation?.dismissedQuotes || [])
  );
  const [customFlags, setCustomFlags] = useState(
    annotation?.customFlags || []
  );
  const [newFlag, setNewFlag] = useState("");
  const [askQuestion, setAskQuestion] = useState("");
  const [askHistory, setAskHistory] = useState([]);
  const [askLoading, setAskLoading] = useState(false);

  // Lock body scroll when panel is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  function removeFlag(index) {
    setCustomFlags((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAsk() {
    if (!askQuestion.trim() || askLoading) return;
    const q = askQuestion.trim();
    setAskQuestion("");
    setAskLoading(true);
    setAskHistory((prev) => [...prev, { role: "user", text: q }]);
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, theme, question: q }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAskHistory((prev) => [...prev, { role: "ai", text: data.answer }]);
    } catch {
      setAskHistory((prev) => [...prev, { role: "ai", text: "Sorry, I couldn't process that question. Please try again." }]);
    }
    setAskLoading(false);
  }

  function handleSave() {
    onSave(theme.id, {
      notes,
      confidenceOverride,
      dismissedQuotes: Array.from(dismissedQuotes),
      customFlags,
    });
  }

  const activeConfidence = confidenceOverride || theme.confidence;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 animate-fadeOverlay"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-surface shadow-2xl animate-slideIn flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-accent mb-1">
              Review Theme
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              {theme.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-tertiary hover:text-foreground transition-colors shrink-0 mt-1"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* AI Description */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-1.5">
              AI Analysis
            </h3>
            <p className="text-sm text-secondary leading-relaxed">
              {theme.description}
            </p>
          </div>

          {/* Evidence Strength */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
              Evidence Strength
            </h3>
            {theme.mentionCount > 0 && (
              <div className="flex items-center gap-1.5 mb-2">
                <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-secondary">
                  Referenced {theme.mentionCount} times in transcript
                </span>
              </div>
            )}
            {theme.relatedKeywords?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {theme.relatedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium text-accent bg-accent-light px-2 py-0.5 rounded"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
            {transcript && theme.relatedKeywords?.length > 0 && (
              <div>
                <p className="text-[10px] text-tertiary mb-1">Keyword density across transcript</p>
                <TranscriptHeatmap
                  transcript={transcript}
                  keywords={theme.relatedKeywords}
                />
              </div>
            )}
          </div>

          {/* Confidence Override */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
              Confidence Level
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-tertiary">AI suggests:</span>
              <ConfidenceBadge level={theme.confidence} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-secondary font-medium mr-1">Your assessment:</span>
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
                Overriding AI confidence from {theme.confidence} to {confidenceOverride}
              </p>
            )}
          </div>

          {/* Supporting Quotes */}
          {theme.supportingQuotes?.length > 0 && (
            <div>
              <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Supporting Evidence
              </h3>
              <div className="space-y-2">
                {theme.supportingQuotes.map((quote, i) => (
                  <div
                    key={i}
                    className={`
                      border-l-2 pl-3 py-2 transition-opacity duration-200
                      ${dismissedQuotes.has(i) ? "opacity-40 border-border" : "border-border-strong"}
                    `}
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
                      onClick={() => toggleQuoteDismiss(i)}
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
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
              Risk Flags
            </h3>
            {theme.riskFlags?.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {theme.riskFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-medium bg-medium-light rounded-md px-3 py-2"
                  >
                    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Custom flags */}
            {customFlags.length > 0 && (
              <div className="space-y-1.5 mb-3">
                {customFlags.map((flag, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm text-accent bg-accent-light rounded-md px-3 py-2"
                  >
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span>{flag}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFlag(i)}
                      className="text-tertiary hover:text-secondary shrink-0"
                    >
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

          {/* Researcher Notes */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
              Your Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your domain context, observations, or concerns about this theme..."
              rows={4}
              className="w-full text-sm border border-border rounded-lg px-3 py-2.5 bg-background placeholder:text-tertiary resize-none focus:outline-none focus:border-accent leading-relaxed"
            />
          </div>

          {/* Ask About This Theme */}
          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
              Ask About This Theme
            </h3>
            {askHistory.length > 0 && (
              <div className="rounded-lg border border-border bg-background p-3 space-y-3 mb-2 max-h-64 overflow-y-auto">
                {askHistory.map((msg, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0 mt-px ${
                      msg.role === "user"
                        ? "text-accent bg-accent-light"
                        : "text-tertiary bg-background border border-border"
                    }`}>
                      {msg.role === "user" ? "You" : "Thread"}
                    </span>
                    <p className={`text-sm ${msg.role === "user" ? "text-secondary italic" : "text-secondary"}`}>
                      {msg.role === "user" ? `\u201C${msg.text}\u201D` : msg.text}
                    </p>
                  </div>
                ))}
                {askLoading && (
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-semibold text-tertiary bg-background border border-border px-1.5 py-0.5 rounded shrink-0 mt-px">Thread</span>
                    <div className="flex gap-1 items-center pt-1">
                      <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={askQuestion}
                onChange={(e) => setAskQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                placeholder="Ask a question about this theme..."
                className="flex-1 text-sm border border-border rounded-md px-3 py-1.5 bg-background placeholder:text-tertiary focus:outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={handleAsk}
                disabled={!askQuestion.trim() || askLoading}
                className="text-xs font-medium px-3 py-1.5 rounded-md bg-accent text-white hover:bg-accent-hover disabled:opacity-40 transition-colors"
              >
                Ask
              </button>
            </div>
            <p className="text-[10px] text-tertiary mt-1.5">Interrogate the model with your domain expertise</p>
          </div>
        </div>

        {/* Footer — sticky */}
        <div className="px-6 py-4 border-t border-border shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {onOpenFullReview && (
              <button
                type="button"
                onClick={onOpenFullReview}
                className="text-sm font-medium text-accent hover:text-accent-hover px-4 py-2.5 rounded-lg border border-accent/30 hover:border-accent transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-6v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 6v-4.5m0 4.5h-4.5m4.5 0L15 15" />
                </svg>
                Full Review
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="text-sm font-semibold text-white bg-accent hover:bg-accent-hover px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Save &amp; Mark Reviewed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
