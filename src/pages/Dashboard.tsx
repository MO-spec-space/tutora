import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useUsageLimit } from "../hooks/useUsageLimit";
import ProgressCard from "../components/ProgressCard";
import type { StudyTopic } from "../lib/types";

export default function Dashboard() {
  const { status } = useUsageLimit();
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase
      .from("study_topics")
      .select("id, subject, title, mastery_percent, last_practiced_at")
      .order("last_practiced_at", { ascending: false, nullsFirst: false })
      .limit(4)
      .then(({ data }) => {
        if (!active) return;
        setTopics(
          (data ?? []).map((t) => ({
            id: t.id,
            subject: t.subject,
            title: t.title,
            masteryPercent: t.mastery_percent,
            lastPracticedAt: t.last_practiced_at,
          }))
        );
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Привіт 👋</h2>
        <p className="text-sm text-ink/60 mt-1">Що вивчаємо сьогодні?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          to="/tutor"
          className="border rule rounded-lg p-5 bg-white hover:border-chalk transition-colors"
        >
          <h3 className="font-medium">AI-репетитор</h3>
          <p className="text-sm text-ink/60 mt-1">
            Постав питання — репетитор підказує крок за кроком, а не дає готову відповідь.
          </p>
        </Link>
        <Link
          to="/writing"
          className="border rule rounded-lg p-5 bg-white hover:border-chalk transition-colors"
        >
          <h3 className="font-medium">Письмо</h3>
          <p className="text-sm text-ink/60 mt-1">
            Напиши текст іноземною мовою — отримай оцінку і пояснені виправлення.
          </p>
        </Link>
        <Link
          to="/snap"
          className="border rule rounded-lg p-5 bg-white hover:border-chalk transition-colors"
        >
          <h3 className="font-medium">Сфотографуй завдання</h3>
          <p className="text-sm text-ink/60 mt-1">
            Завантаж фото задачі — отримай підказку, з чого почати, без готового рішення.
          </p>
        </Link>
      </div>

      {status && (
        <div className="text-xs text-ink/50">
          Використано AI-запитів сьогодні: {status.used} / {status.limit}
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm">Останні теми</h3>
          <Link to="/plan" className="text-xs text-chalk hover:underline">
            Весь план →
          </Link>
        </div>
        {loading ? (
          <p className="text-sm text-ink/50">Завантаження…</p>
        ) : topics.length === 0 ? (
          <p className="text-sm text-ink/50">
            Тем ще немає. Почни з AI-репетитора — теми з'являться автоматично.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {topics.map((t) => (
              <ProgressCard key={t.id} topic={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
