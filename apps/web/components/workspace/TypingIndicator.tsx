export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-surface-secondary px-3 py-2.5 w-fit">
      <span className="size-1.5 rounded-full bg-text-secondary/60 animate-bounce [animation-delay:-0.3s]" />
      <span className="size-1.5 rounded-full bg-text-secondary/60 animate-bounce [animation-delay:-0.15s]" />
      <span className="size-1.5 rounded-full bg-text-secondary/60 animate-bounce" />
    </div>
  );
}