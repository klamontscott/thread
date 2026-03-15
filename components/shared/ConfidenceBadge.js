const styles = {
  high: "bg-sage-light text-sage",
  medium: "bg-sky-light text-sky",
  low: "bg-terra-light text-terra",
};

export default function ConfidenceBadge({ level }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${styles[level] || styles.medium}`}
    >
      {level} confidence
    </span>
  );
}
