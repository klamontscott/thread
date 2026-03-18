"use client";

import { useState, useEffect } from "react";

const stages = [
  "Reading transcript...",
  "Identifying patterns...",
  "Extracting themes...",
  "Analyzing confidence levels...",
  "Finding opportunities...",
  "Building synthesis...",
];

export default function LoadingState() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-sm mx-auto py-24 text-center" role="status">
      <div className="mb-6">
        <div className="w-5 h-5 mx-auto border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
      <p className="text-[15px] font-medium mb-1">Analyzing transcript</p>
      <p className="text-sm text-secondary transition-all duration-300">
        {stages[stageIndex]}
      </p>
      <span className="sr-only">Analysis in progress</span>
    </div>
  );
}
