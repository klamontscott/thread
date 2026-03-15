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
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {status === "idle" && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Research Synthesis
              </h1>
              <p className="text-sm text-muted">
                Paste an interview transcript to extract structured themes,
                opportunities, and open questions.
              </p>
            </div>

            <TranscriptInput value={transcript} onChange={setTranscript} />
            <FocusQuestion value={focusQuestion} onChange={setFocusQuestion} />
            <PhaseSelector value={phase} onChange={setPhase} />
            <AnalyzeButton
              onClick={handleAnalyze}
              disabled={!transcript.trim()}
              loading={false}
            />
          </div>
        )}

        {status === "loading" && <LoadingState />}

        {status === "results" && results && (
          <ResultsContainer results={results} onReset={handleReset} />
        )}

        {status === "error" && (
          <ErrorState message={error} onRetry={handleRetry} />
        )}
      </main>

      <Footer />
    </div>
  );
}
