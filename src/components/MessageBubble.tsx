import type { ChatMessage } from "../lib/types";

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
          isUser ? "bg-ink text-paper" : "bg-white border rule"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.corrections && message.corrections.length > 0 && (
          <div className="mt-3 border-t rule pt-2 space-y-2">
            {message.corrections.map((c, i) => (
              <div key={i} className="text-xs">
                <p>
                  <span className="line-through text-ink/40">{c.original}</span>{" "}
                  <span className="text-chalk font-medium">→ {c.suggestion}</span>
                </p>
                <p className="text-ink/60 mt-0.5">{c.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
