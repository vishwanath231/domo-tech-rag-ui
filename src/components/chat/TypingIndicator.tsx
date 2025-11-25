export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-2">
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-neutral-400"></div>
    </div>
  )
}
