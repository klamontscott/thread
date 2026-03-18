const styles = {
  high: "bg-high-light text-high",
  medium: "bg-medium-light text-medium",
  low: "bg-low-light text-low",
};

export default function ConfidenceBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${styles[level] || styles.medium}`}
    >
      {level}
    </span>
  );
}
