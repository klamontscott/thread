"use client";

import { useState } from "react";

export default function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  count,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-sage-light/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-base">{title}</h3>
          {count !== undefined && (
            <span className="text-xs text-muted bg-border/50 px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}
