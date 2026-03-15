import ExpandableSection from "../shared/ExpandableSection";
import ThemeCard from "./ThemeCard";

export default function ThemeList({ themes }) {
  return (
    <ExpandableSection
      title="Themes"
      count={themes.length}
      defaultOpen={true}
    >
      <div className="space-y-3">
        {themes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </div>
    </ExpandableSection>
  );
}
