export default function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4.5h12M3 9h8M3 13.5h10"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">Thread</span>
        </div>
        <span className="text-xs text-muted font-medium uppercase tracking-wider">
          Research Synthesis
        </span>
      </div>
    </header>
  );
}
