"use client";

import { useEffect, useState } from "react";

const COLORS = {
  high: "#059669",
  medium: "#D97706",
  low: "#DC2626",
};

const LABELS = {
  high: "High\nConfidence",
  medium: "Medium\nConfidence",
  low: "Low\nConfidence",
};

export default function ConfidenceRing({ themes }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const counts = { high: 0, medium: 0, low: 0 };
  themes.forEach((t) => {
    const level = t.confidence?.toLowerCase() || "medium";
    if (counts[level] !== undefined) counts[level]++;
  });

  const total = themes.length;
  const r = 52;
  const strokeWidth = 14;
  const size = (r + strokeWidth) * 2;
  const circumference = 2 * Math.PI * r;

  const segments = [];
  let offset = 0;
  for (const [level, count] of Object.entries(counts)) {
    if (count === 0) continue;
    const gap = 5;
    const length = (count / total) * circumference - gap;
    segments.push({
      level,
      color: COLORS[level],
      dasharray: `${Math.max(length, 0)} ${circumference - Math.max(length, 0)}`,
      dashoffset: -offset - gap / 2,
    });
    offset += (count / total) * circumference;
  }

  // Split callouts: high goes right, medium/low go left
  const leftCallouts = [];
  const rightCallouts = [];
  if (counts.high > 0) rightCallouts.push({ level: "high", count: counts.high });
  if (counts.medium > 0) leftCallouts.push({ level: "medium", count: counts.medium });
  if (counts.low > 0) leftCallouts.push({ level: "low", count: counts.low });

  // If only one side has callouts, balance
  if (leftCallouts.length === 0 && rightCallouts.length > 1) {
    leftCallouts.push(rightCallouts.pop());
  }

  return (
    <div className="flex items-center gap-3 justify-center">
      {/* Left callouts */}
      <div className="flex flex-col gap-3 items-end text-right min-w-[80px]">
        {leftCallouts.map((c) => (
          <div key={c.level}>
            <div
              className="text-3xl font-extrabold leading-none"
              style={{ color: COLORS[c.level] }}
            >
              {animate ? c.count : 0}
            </div>
            <div
              className="text-[9px] font-semibold uppercase tracking-wider leading-tight mt-0.5 whitespace-pre-line"
              style={{ color: COLORS[c.level], opacity: 0.8 }}
            >
              {LABELS[c.level]}
            </div>
          </div>
        ))}
      </div>

      {/* Ring */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => (
            <circle
              key={seg.level}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={animate ? seg.dasharray : `0 ${circumference}`}
              strokeDashoffset={seg.dashoffset}
              style={{
                transition: `stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.15 + 0.3}s`,
              }}
            />
          ))}
        </svg>
      </div>

      {/* Right callouts */}
      <div className="flex flex-col gap-3 min-w-[80px]">
        {rightCallouts.map((c) => (
          <div key={c.level}>
            <div
              className="text-3xl font-extrabold leading-none"
              style={{ color: COLORS[c.level] }}
            >
              {animate ? c.count : 0}
            </div>
            <div
              className="text-[9px] font-semibold uppercase tracking-wider leading-tight mt-0.5 whitespace-pre-line"
              style={{ color: COLORS[c.level], opacity: 0.8 }}
            >
              {LABELS[c.level]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
