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
    <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[15px]">{title}</h3>
          {count !== undefined && (
            <span className="text-xs text-secondary bg-background px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-tertiary transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 border-t border-border pt-4">{children}</div>
      )}
    </div>
  );
}
