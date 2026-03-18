export default function Header() {
  return (
    <header className="bg-surface border-b border-border">
      <div className="px-6 h-11 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect width="20" height="20" rx="4" fill="#1D1D1F" />
            <path
              d="M5 7h10M5 10h7M5 13h9"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight">
            Thread
          </span>
        </div>
        <span className="text-xs text-tertiary font-medium">
          Research Synthesis
        </span>
      </div>
    </header>
  );
}
