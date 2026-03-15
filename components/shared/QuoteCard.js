export default function QuoteCard({ text, speaker }) {
  return (
    <blockquote className="border-l-3 border-lavender pl-4 py-2 my-2">
      <p className="text-sm italic text-foreground/80">&ldquo;{text}&rdquo;</p>
      {speaker && (
        <cite className="text-xs text-muted mt-1 block not-italic">
          &mdash; {speaker}
        </cite>
      )}
    </blockquote>
  );
}
