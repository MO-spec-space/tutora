import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import ProgressCard from "../components/ProgressCard";
import type { StudyTopic } from "../lib/types";

export default function StudyPlan() {
  const [topics, setTopics] = useState<StudyTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("study_topics")
      .select("id, subject, title, mastery_percent, last_practiced_at")
      .order("mastery_percent", { ascending: true })
      .then(({ data }) => {
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
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif font-semibold">Мій навчальний план</h2>
        <p className="text-sm text-ink/60 mt-1">
          Теми з'являються і оновлюються автоматично на основі твоїх занять з репетитором.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Завантаження…</p>
      ) : topics.length === 0 ? (
        <p className="text-sm text-ink/50">
          Поки немає жодної теми. Постав перше питання AI-репетитору — тема з'явиться тут.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {topics.map((t) => (
            <ProgressCard key={t.id} topic={t} />
          ))}
        </div>
      )}
    </div>
  );
}
