export default function QuoteCard({ text, speaker }) {
  return (
    <blockquote className="border-l-2 border-border-strong pl-3 py-1.5 my-1.5">
      <p className="text-sm text-secondary italic">&ldquo;{text}&rdquo;</p>
      {speaker && (
        <cite className="text-xs text-tertiary mt-1 block not-italic">
          {speaker}
        </cite>
      )}
    </blockquote>
  );
}
