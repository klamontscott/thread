"use client";

import { useMemo, useState } from "react";

const SEGMENT_COUNT = 40;

export default function TranscriptHeatmap({ transcript, keywords, onSegmentClick, activeSegment }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const segments = useMemo(() => {
    if (!transcript || !keywords || keywords.length === 0) {
      return Array(SEGMENT_COUNT).fill(0);
    }

    const lower = transcript.toLowerCase();
    const segLen = Math.ceil(lower.length / SEGMENT_COUNT);
    const hits = Array(SEGMENT_COUNT).fill(0);

    keywords.forEach((kw) => {
      const kwLower = kw.toLowerCase();
      let idx = 0;
      while ((idx = lower.indexOf(kwLower, idx)) !== -1) {
        const seg = Math.min(Math.floor(idx / segLen), SEGMENT_COUNT - 1);
        hits[seg]++;
        idx += kwLower.length;
      }
    });

    return hits;
  }, [transcript, keywords]);

  const max = Math.max(...segments, 1);

  return (
    <div className="relative">
      <div className="flex gap-px h-3 rounded-sm overflow-hidden" title="Theme density across transcript">
        {segments.map((count, i) => (
          <div
            key={i}
            className={`
              flex-1 transition-all duration-200
              ${count > 0 ? "cursor-pointer" : ""}
              ${activeSegment === i ? "ring-1 ring-accent ring-offset-1" : ""}
              ${hoveredSegment === i && count > 0 ? "scale-y-150" : ""}
            `}
            style={{
              background:
                count > 0
                  ? `rgba(67, 56, 202, ${activeSegment === i ? 1 : hoveredSegment === i ? 0.9 : 0.2 + (count / max) * 0.6})`
                  : "#E5E7EB",
            }}
            onClick={() => count > 0 && onSegmentClick?.(i)}
            onMouseEnter={() => setHoveredSegment(i)}
            onMouseLeave={() => setHoveredSegment(null)}
          />
        ))}
      </div>
      {/* Tooltip */}
      {hoveredSegment !== null && segments[hoveredSegment] > 0 && (
        <div
          className="absolute -top-8 px-2 py-1 bg-foreground text-white text-[10px] font-medium rounded shadow-lg pointer-events-none whitespace-nowrap z-10"
          style={{
            left: `${(hoveredSegment / SEGMENT_COUNT) * 100}%`,
            transform: "translateX(-50%)",
          }}
        >
          {segments[hoveredSegment]} mention{segments[hoveredSegment] !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
