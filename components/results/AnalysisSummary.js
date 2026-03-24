"use client";

import ConfidenceRing from "./ConfidenceRing";
import AnimatedCounter from "../shared/AnimatedCounter";

const STATS_CONFIG = {
  themes: {
    label: "Themes",
    color: "#4338CA",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#4338CA">
        <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  opportunities: {
    label: "Opportunities",
    color: "#22C55E",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#22C55E">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  risks: {
    label: "Risk Flags",
    color: "#EF4444",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#EF4444">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  questions: {
    label: "Open Questions",
    color: "#F59E0B",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#F59E0B">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
};

export default function AnalysisSummary({ results, reviewedCount, totalThemes }) {
  const riskCount = results.themes.reduce(
    (acc, t) => acc + (t.riskFlags?.length || 0),
    0
  );

  const stats = [
    { key: "themes", value: results.themes.length },
    { key: "opportunities", value: results.opportunities.length },
    { key: "risks", value: riskCount },
    { key: "questions", value: results.openQuestions.length },
  ];

  const maxStatValue = 8;

  return (
    <div
      className="bg-surface rounded-xl shadow-sm overflow-hidden animate-fadeSlideUp"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex">
        {/* Left — Ring with callout numbers */}
        <div className="p-8 flex items-center justify-center border-r border-border">
          <ConfidenceRing themes={results.themes} />
        </div>

        {/* Right — Vertical stat list with bars */}
        <div className="flex-1 py-5 px-6 flex flex-col justify-center gap-4">
          {stats.map((stat, i) => {
            const config = STATS_CONFIG[stat.key];
            return (
              <div key={stat.key} className="flex items-center gap-4">
                {/* Icon */}
                <div className="shrink-0">
                  {config.icon}
                </div>

                {/* Number + Label */}
                <div className="w-20 shrink-0">
                  <div className="text-2xl font-extrabold leading-none text-foreground">
                    <AnimatedCounter value={stat.value} delay={400 + i * 150} />
                  </div>
                  <div
                    className="text-[9px] font-semibold uppercase tracking-wider mt-0.5"
                    style={{ color: config.color }}
                  >
                    {config.label}
                  </div>
                </div>

                {/* Horizontal bar */}
                <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${(stat.value / maxStatValue) * 100}%`,
                      background: config.color,
                      transitionDelay: `${600 + i * 150}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Progress — Segmented */}
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
            Review Progress
          </span>
          <span className="text-xs text-tertiary">
            <span className="font-bold text-foreground">{reviewedCount}</span> of{" "}
            {totalThemes} reviewed
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: totalThemes }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2.5 rounded-sm transition-colors duration-500"
              style={{
                background:
                  i < reviewedCount
                    ? "var(--color-accent)"
                    : "#E5E7EB",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
