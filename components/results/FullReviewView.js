"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import ConfidenceBadge from "../shared/ConfidenceBadge";
import TranscriptHeatmap from "../shared/TranscriptHeatmap";

const CONFIDENCE_OPTIONS = ["high", "medium", "low"];

function HighlightedTranscript({
  transcript,
  quotes,
  activeQuoteIndex,
  activeKeyword,
  userAnnotations,
  activeAnnotationId,
  onAnnotationClick,
}) {
  const segments = useMemo(() => {
    // Collect all highlight ranges
    const ranges = [];

    // Quote ranges
    (quotes || []).forEach((quote, i) => {
      const idx = transcript.toLowerCase().indexOf(quote.text.toLowerCase());
      if (idx !== -1) {
        ranges.push({ start: idx, end: idx + quote.text.length, type: "quote", index: i });
      }
    });

    // Annotation ranges
    (userAnnotations || []).forEach((ann) => {
      const idx = transcript.toLowerCase().indexOf(ann.selectedText.toLowerCase());
      if (idx !== -1) {
        ranges.push({ start: idx, end: idx + ann.selectedText.length, type: "annotation", id: ann.id, annotation: ann });
      }
    });

    // Sort by position
    ranges.sort((a, b) => a.start - b.start);

    // Remove overlapping ranges (keep first)
    const filtered = [];
    let lastEnd = 0;
    ranges.forEach((r) => {
      if (r.start >= lastEnd) {
        filtered.push(r);
        lastEnd = r.end;
      }
    });

    // Build segments
    const result = [];
    let cursor = 0;
    filtered.forEach((range) => {
      if (range.start > cursor) {
        result.push({ text: transcript.slice(cursor, range.start), type: "text" });
      }
      result.push({
        text: transcript.slice(range.start, range.end),
        type: range.type,
        index: range.index,
        id: range.id,
        annotation: range.annotation,
        isActiveQuote: range.type === "quote" && range.index === activeQuoteIndex,
        isActiveAnnotation: range.type === "annotation" && range.id === activeAnnotationId,
      });
      cursor = range.end;
    });
    if (cursor < transcript.length) {
      result.push({ text: transcript.slice(cursor), type: "text" });
    }

    return result;
  }, [transcript, quotes, activeQuoteIndex, userAnnotations, activeAnnotationId]);

  // Render text with keyword highlighting
  function renderText(text, baseStyle) {
    if (!activeKeyword) return <span style={baseStyle}>{text}</span>;

    const kwLower = activeKeyword.toLowerCase();
    const textLower = text.toLowerCase();
    const parts = [];
    let lastIdx = 0;
    let idx;
    let keyIdx = 0;

    while ((idx = textLower.indexOf(kwLower, lastIdx)) !== -1) {
      if (idx > lastIdx) {
        parts.push({ text: text.slice(lastIdx, idx), isKw: false });
      }
      parts.push({ text: text.slice(idx, idx + kwLower.length), isKw: true, keyIdx: keyIdx++ });
      lastIdx = idx + kwLower.length;
    }
    if (lastIdx < text.length) {
      parts.push({ text: text.slice(lastIdx), isKw: false });
    }

    if (parts.length <= 1 && !parts[0]?.isKw) return <span style={baseStyle}>{text}</span>;

    return parts.map((p, i) =>
      p.isKw ? (
        <mark
          key={i}
          id={p.keyIdx === 0 ? "keyword-first" : undefined}
          className="rounded-sm"
          style={{ background: "#FEF3C7", color: "#92400E", padding: "0 2px" }}
        >
          {p.text}
        </mark>
      ) : (
        <span key={i} style={baseStyle}>{p.text}</span>
      )
    );
  }

  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {segments.map((seg, i) => {
        if (seg.type === "quote") {
          return (
            <mark
              key={i}
              id={`quote-${seg.index}`}
              className="transition-colors duration-300 rounded-sm px-0.5 -mx-0.5"
              style={{
                background: seg.isActiveQuote ? "#C7D2FE" : "#EEF2FF",
                borderLeft: seg.isActiveQuote ? "3px solid var(--color-accent)" : "3px solid transparent",
                paddingLeft: seg.isActiveQuote ? "6px" : "2px",
              }}
            >
              {renderText(seg.text, {})}
            </mark>
          );
        }

        if (seg.type === "annotation") {
          return (
            <mark
              key={i}
              id={`annotation-${seg.id}`}
              className="transition-colors duration-200 rounded-sm cursor-pointer relative group"
              style={{
                background: seg.isActiveAnnotation ? "#BBF7D0" : "#DCFCE7",
                borderBottom: "2px solid #22C55E",
                padding: "0 2px",
              }}
              onClick={() => onAnnotationClick?.(seg.id)}
            >
              {seg.text}
              <span
                className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-emerald-500 rounded-full ml-0.5 align-super"
                style={{ fontSize: "9px", lineHeight: 1 }}
              >
                {(userAnnotations || []).findIndex((a) => a.id === seg.id) + 1}
              </span>
            </mark>
          );
        }

        return (
          <span key={i}>{renderText(seg.text, { color: "#5C6370" })}</span>
        );
      })}
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
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [activeHeatmapSegment, setActiveHeatmapSegment] = useState(null);

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
  const [askQuestion, setAskQuestion] = useState("");
  const [askHistory, setAskHistory] = useState([]);
  const [askLoading, setAskLoading] = useState(false);

  // Annotation state
  const [transcriptAnnotations, setTranscriptAnnotations] = useState(
    annotation.transcriptAnnotations || []
  );
  const [activeAnnotationId, setActiveAnnotationId] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [pendingNote, setPendingNote] = useState("");
  const transcriptContainerRef = useRef(null);
  const pendingNoteInputRef = useRef(null);

  // Reset form when theme changes
  useEffect(() => {
    const a = annotations[theme.id] || {};
    setNotes(a.notes || "");
    setConfidenceOverride(a.confidenceOverride || null);
    setDismissedQuotes(new Set(a.dismissedQuotes || []));
    setCustomFlags(a.customFlags || []);
    setNewFlag("");
    setActiveQuoteIndex(null);
    setActiveKeyword(null);
    setActiveHeatmapSegment(null);
    setAskQuestion("");
    setAskHistory([]);
    setAskLoading(false);
    setTranscriptAnnotations(a.transcriptAnnotations || []);
    setActiveAnnotationId(null);
    setPendingSelection(null);
    setPendingNote("");
  }, [currentIndex, theme.id, annotations]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Focus the note input when pending selection appears
  useEffect(() => {
    if (pendingSelection && pendingNoteInputRef.current) {
      pendingNoteInputRef.current.focus();
    }
  }, [pendingSelection]);

  function saveCurrentTheme() {
    onSave(theme.id, {
      notes,
      confidenceOverride,
      dismissedQuotes: Array.from(dismissedQuotes),
      customFlags,
      transcriptAnnotations,
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
    setActiveKeyword(null);
    setActiveHeatmapSegment(null);
    setActiveAnnotationId(null);
    const el = document.getElementById(`quote-${quoteIndex}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleKeywordClick(keyword) {
    const next = activeKeyword === keyword ? null : keyword;
    setActiveKeyword(next);
    setActiveQuoteIndex(null);
    setActiveHeatmapSegment(null);
    setActiveAnnotationId(null);
    if (next) {
      setTimeout(() => {
        const el = document.getElementById("keyword-first");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }

  function handleHeatmapSegmentClick(segmentIndex) {
    setActiveHeatmapSegment(segmentIndex);
    setActiveQuoteIndex(null);
    setActiveAnnotationId(null);
    const container = document.getElementById("transcript-scroll-container");
    if (container) {
      const pct = segmentIndex / 40;
      container.scrollTo({
        top: pct * container.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  // Text selection → annotation
  const handleTranscriptMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.toString().trim().length < 3) {
      return;
    }

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = transcriptContainerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const scrollContainer = document.getElementById("transcript-scroll-container");
    const scrollTop = scrollContainer?.scrollTop || 0;

    setPendingSelection({
      text: selectedText,
      top: rect.bottom - containerRect.top + scrollTop + 4,
      left: Math.max(8, Math.min(rect.left - containerRect.left, containerRect.width - 280)),
    });
    setPendingNote("");
  }, []);

  function addAnnotation() {
    if (!pendingSelection || !pendingNote.trim()) return;
    const newAnnotation = {
      id: Date.now(),
      selectedText: pendingSelection.text,
      note: pendingNote.trim(),
      author: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setTranscriptAnnotations((prev) => [...prev, newAnnotation]);
    setPendingSelection(null);
    setPendingNote("");
    window.getSelection()?.removeAllRanges();
  }

  function removeAnnotation(id) {
    setTranscriptAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (activeAnnotationId === id) setActiveAnnotationId(null);
  }

  function handleAnnotationClick(id) {
    setActiveAnnotationId(id === activeAnnotationId ? null : id);
    setActiveQuoteIndex(null);
    setActiveKeyword(null);
    // Scroll to annotation in transcript
    const el = document.getElementById(`annotation-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function scrollToAnnotationInTranscript(id) {
    setActiveAnnotationId(id);
    setActiveQuoteIndex(null);
    setActiveKeyword(null);
    const el = document.getElementById(`annotation-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
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
              Select text to add a comment
            </p>
          </div>
          <div
            id="transcript-scroll-container"
            ref={transcriptContainerRef}
            className="flex-1 overflow-y-auto px-6 py-4 relative"
            onMouseUp={handleTranscriptMouseUp}
          >
            <HighlightedTranscript
              transcript={transcript}
              quotes={theme.supportingQuotes || []}
              activeQuoteIndex={activeQuoteIndex}
              activeKeyword={activeKeyword}
              userAnnotations={transcriptAnnotations}
              activeAnnotationId={activeAnnotationId}
              onAnnotationClick={handleAnnotationClick}
            />

            {/* Floating annotation popover */}
            {pendingSelection && (
              <div
                className="absolute z-20 bg-surface border border-border rounded-lg shadow-xl p-3 w-[270px] animate-fadeSlideUp"
                style={{
                  top: pendingSelection.top,
                  left: pendingSelection.left,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-1.5">
                  Add Comment
                </div>
                <p className="text-[11px] text-secondary italic mb-2 line-clamp-2">
                  &ldquo;{pendingSelection.text}&rdquo;
                </p>
                <textarea
                  ref={pendingNoteInputRef}
                  value={pendingNote}
                  onChange={(e) => setPendingNote(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      addAnnotation();
                    }
                    if (e.key === "Escape") {
                      setPendingSelection(null);
                    }
                  }}
                  placeholder="Your comment..."
                  rows={2}
                  className="w-full text-sm border border-border rounded-md px-2.5 py-1.5 bg-background placeholder:text-tertiary resize-none focus:outline-none focus:border-accent leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setPendingSelection(null)}
                    className="text-[11px] text-tertiary hover:text-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addAnnotation}
                    disabled={!pendingNote.trim()}
                    className="text-[11px] font-semibold text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1 rounded-md disabled:opacity-40 transition-colors"
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
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

            {/* Evidence Strength */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Evidence Strength
              </h4>
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
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleKeywordClick(kw)}
                      className={`
                        text-[11px] font-medium px-2 py-0.5 rounded transition-all
                        ${activeKeyword === kw
                          ? "bg-accent text-white shadow-sm"
                          : "text-accent bg-accent-light hover:bg-accent hover:text-white"
                        }
                      `}
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              )}
              {transcript && theme.relatedKeywords?.length > 0 && (
                <div>
                  <p className="text-[10px] text-tertiary mb-1">Click a segment to jump to that position</p>
                  <TranscriptHeatmap
                    transcript={transcript}
                    keywords={theme.relatedKeywords}
                    onSegmentClick={handleHeatmapSegmentClick}
                    activeSegment={activeHeatmapSegment}
                  />
                </div>
              )}
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

            {/* Transcript Comments */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Transcript Comments
                {transcriptAnnotations.length > 0 && (
                  <span className="ml-1.5 text-emerald-600">{transcriptAnnotations.length}</span>
                )}
              </h4>
              {transcriptAnnotations.length === 0 ? (
                <p className="text-[11px] text-tertiary italic">
                  Select text in the transcript to add a comment
                </p>
              ) : (
                <div className="space-y-2">
                  {transcriptAnnotations.map((ann, i) => (
                    <div
                      key={ann.id}
                      className={`
                        border-l-2 pl-3 py-2 rounded-r-md cursor-pointer transition-all duration-200
                        ${activeAnnotationId === ann.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/50"
                        }
                      `}
                      onClick={() => scrollToAnnotationInTranscript(ann.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-emerald-500 rounded-full shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-[10px] font-medium text-emerald-700">{ann.author}</span>
                            <span className="text-[10px] text-tertiary">{ann.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-tertiary italic line-clamp-1 mb-0.5">
                            &ldquo;{ann.selectedText}&rdquo;
                          </p>
                          <p className="text-sm text-secondary">{ann.note}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAnnotation(ann.id);
                          }}
                          className="text-tertiary hover:text-secondary shrink-0 mt-0.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

            {/* Ask About This Theme */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-tertiary mb-2">
                Ask About This Theme
              </h4>
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

            {/* Mark Reviewed */}
            <button
              type="button"
              onClick={saveCurrentTheme}
              className={`
                w-full text-sm font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2
                ${isReviewed
                  ? "bg-accent/10 text-accent border border-accent/30"
                  : "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow"
                }
              `}
            >
              {isReviewed ? (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Reviewed — Click to Update
                </>
              ) : (
                "Mark as Reviewed"
              )}
            </button>
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
