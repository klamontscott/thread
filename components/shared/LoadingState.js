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
    <div className="max-w-2xl mx-auto py-20 text-center">
      <div className="mb-8">
        <div className="w-12 h-12 mx-auto rounded-xl bg-sage/10 flex items-center justify-center mb-6">
          <div className="w-6 h-6 border-2 border-sage border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-medium text-foreground mb-2">
          Analyzing your transcript
        </p>
        <p className="text-sm text-muted transition-all duration-300">
          {stages[stageIndex]}
        </p>
      </div>

      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className="h-4 bg-border/50 rounded-full"
              style={{ width: `${85 - i * 15}%`, marginInline: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
