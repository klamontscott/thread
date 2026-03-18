import ThemeCard from "./ThemeCard";

export default function ThemeList({ themes, reviewedThemes, onOpenReview }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[15px]">Themes</h3>
        <span className="text-xs text-tertiary">
          {themes.length} identified
        </span>
      </div>
      <div className="space-y-3">
        {themes.map((theme, i) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            index={i}
            isReviewed={reviewedThemes.has(theme.id)}
            onOpenReview={onOpenReview}
          />
        ))}
      </div>
    </div>
  );
}
