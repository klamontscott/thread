"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TranscriptInput from "@/components/input/TranscriptInput";
import FocusQuestion from "@/components/input/FocusQuestion";
import PhaseSelector from "@/components/input/PhaseSelector";
import AnalyzeButton from "@/components/input/AnalyzeButton";
import ResultsContainer from "@/components/results/ResultsContainer";
import LoadingState from "@/components/shared/LoadingState";
import ErrorState from "@/components/shared/ErrorState";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [focusQuestion, setFocusQuestion] = useState("");
  const [phase, setPhase] = useState("exploratory");
  const [status, setStatus] = useState("idle"); // idle | loading | results | error
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!transcript.trim()) return;

    setStatus("loading");
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, focusQuestion, phase }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResults(data);
      setStatus("results");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setResults(null);
    setError(null);
    setTranscript("");
    setFocusQuestion("");
    setPhase("exploratory");
  }

  function handleRetry() {
    handleAnalyze();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onLogoClick={handleReset} />

      <main className="flex-1 w-full px-6 py-10">
        {status === "idle" && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight">
                Research Synthesis
              </h1>
              <p className="text-sm text-secondary mt-1">
                Paste an interview transcript to extract structured themes,
                opportunities, and open questions.
              </p>
            </div>

            <div className="bg-surface rounded-xl shadow-sm p-6 space-y-5">
              <TranscriptInput value={transcript} onChange={setTranscript} />
              <FocusQuestion
                value={focusQuestion}
                onChange={setFocusQuestion}
              />
              <PhaseSelector value={phase} onChange={setPhase} />
              <AnalyzeButton
                onClick={handleAnalyze}
                disabled={!transcript.trim()}
                loading={false}
              />
            </div>
          </div>
        )}

        {status === "loading" && <LoadingState />}

        {status === "results" && results && (
          <div className="max-w-4xl mx-auto">
            <ResultsContainer results={results} transcript={transcript} onReset={handleReset} />
          </div>
        )}

        {status === "error" && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
      </main>

      <Footer />
    </div>
  );
}
