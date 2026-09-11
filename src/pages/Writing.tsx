import { useState, FormEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUsageLimit } from "../hooks/useUsageLimit";
import WritingFeedbackCard from "../components/WritingFeedbackCard";
import { randomPrompt } from "../lib/writingPrompts";
import type { WritingFeedback } from "../lib/types";

const MAX_LENGTH = 3000;

const languages = ["Шведська", "Англійська", "Німецька", "Іспанська", "Інша"];

export default function Writing() {
  const { status, refresh } = useUsageLimit();
  const [language, setLanguage] = useState("Шведська");
  const [prompt, setPrompt] = useState("");
  const [promptId, setPromptId] = useState<string | undefined>(undefined);
  const [content, setContent] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limitReached = status ? status.used >= status.limit : false;

  function suggestPrompt() {
    const p = randomPrompt(promptId);
    setPromptId(p.id);
    setPrompt(`${p.title} — ${p.instructions} (${p.level}, від ${p.minWords} слів)`);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading || limitReached) return;

    setLoading(true);
    setError(null);
    setFeedback(null);

    const { data, error: fnError } = await supabase.functions.invoke("ai-writing", {
      body: { language, prompt: prompt.trim() || null, content: content.trim() },
    });

    setLoading(false);

    if (fnError) {
      setError("Не вдалося отримати фідбек. Спробуй ще раз за хвилину.");
      return;
    }
    if (data?.error) {
      setError(mapServerError(data.error));
      return;
    }

    setFeedback(data as WritingFeedback);
    refresh();
  }

  function mapServerError(code: string): string {
    switch (code) {
      case "usage_limit_reached":
        return "Ти вичерпав ліміт безкоштовних запитів на сьогодні. Спробуй завтра.";
      case "invalid_input":
        return "Текст порожній або задовгий (максимум 3000 символів).";
      case "ai_unavailable":
        return "AI-сервіс тимчасово недоступний. Спробуй трохи пізніше.";
      case "invalid_ai_response":
        return "Не вдалося обробити відповідь AI. Спробуй ще раз.";
      default:
        return "Щось пішло не так. Спробуй ще раз.";
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-serif font-semibold">Письмо</h2>
        <p className="text-sm text-ink/60 mt-1">
          Напиши кілька речень або короткий текст — отримаєш оцінку, пояснені
          виправлення і те, що вже вдається добре.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm border rule rounded-md px-2 py-2 bg-white"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Тема (необов'язково), напр. «Мій вихідний день»"
            maxLength={300}
            className="flex-1 text-sm border rule rounded-md px-3 py-2 bg-white"
          />
          <button
            type="button"
            onClick={suggestPrompt}
            className="text-sm border rule rounded-md px-3 py-2 bg-white hover:border-chalk whitespace-nowrap"
          >
            Ідея для тексту
          </button>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Напиши тут свій текст…"
          maxLength={MAX_LENGTH}
          rows={8}
          disabled={loading || limitReached}
          className="w-full rounded-md border rule px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chalk disabled:opacity-50"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink/40">
            {content.length}/{MAX_LENGTH}
          </span>
          <button
            type="submit"
            disabled={loading || limitReached || !content.trim()}
            className="rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Перевіряємо…" : "Отримати фідбек"}
          </button>
        </div>
      </form>

      {limitReached && (
        <p className="text-xs text-highlight">Ліміт безкоштовних запитів на сьогодні вичерпано.</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}

      {feedback && <WritingFeedbackCard feedback={feedback} />}
    </div>
  );
}
