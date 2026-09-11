import { useState, useRef, useEffect, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUsageLimit } from "../hooks/useUsageLimit";
import MessageBubble from "../components/MessageBubble";
import type { ChatMessage, Subject } from "../lib/types";

const subjects: { value: Subject; label: string }[] = [
  { value: "math", label: "Математика" },
  { value: "physics", label: "Фізика" },
  { value: "chemistry", label: "Хімія" },
  { value: "language", label: "Мова" },
  { value: "other", label: "Інше" },
];

export default function ChatTutor() {
  const { status, refresh } = useUsageLimit();
  const [subject, setSubject] = useState<Subject>("math");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const limitReached = status ? status.used >= status.limit : false;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending || limitReached) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSending(true);
    setError(null);

    // All AI calls go through an authenticated Edge Function. The function
    // re-checks usage limits and ownership server-side — this client never
    // decides what's allowed, it just displays the result.
    const { data, error: fnError } = await supabase.functions.invoke("ai-chat", {
      body: {
        subject,
        message: userMessage.content,
        history: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      },
    });

    setSending(false);

    if (fnError) {
      setError(
        "Не вдалося отримати відповідь від AI. Спробуй ще раз за хвилину."
      );
      return;
    }

    if (data?.error) {
      setError(mapServerError(data.error));
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
        corrections: data.corrections,
      },
    ]);
    refresh();
  }

  function mapServerError(code: string): string {
    switch (code) {
      case "usage_limit_reached":
        return "Ти вичерпав ліміт безкоштовних запитів на сьогодні. Спробуй завтра.";
      case "invalid_input":
        return "Повідомлення задовге або порожнє.";
      case "ai_unavailable":
        return "AI-сервіс тимчасово недоступний. Спробуй трохи пізніше.";
      case "invalid_ai_response":
        return "AI повернув некоректну відповідь. Спробуй переформулювати питання.";
      default:
        return "Щось пішло не так. Спробуй ще раз.";
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] md:h-[calc(100vh-5rem)]">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-xl font-serif font-semibold">AI-репетитор</h2>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
          className="text-sm border rule rounded-md px-2 py-1 bg-white"
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <p className="text-sm text-ink/50">
            Постав будь-яке питання з обраної теми. Репетитор навмисно не дає готових
            відповідей — він підказує крок за кроком і чекає, поки ти зробиш крок сам.
          </p>
        )}
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={bottomRef} />
      </div>

      {limitReached && (
        <p className="text-xs text-highlight mt-2">
          Ліміт безкоштовних запитів на сьогодні вичерпано.
        </p>
      )}
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Напиши своє питання…"
          maxLength={2000}
          disabled={sending || limitReached}
          className="flex-1 rounded-md border rule px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chalk disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || limitReached || !input.trim()}
          className="rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {sending ? "…" : "Надіслати"}
        </button>
      </form>
    </div>
  );
}
