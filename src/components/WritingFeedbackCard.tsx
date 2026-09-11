import type { WritingFeedback } from "../lib/types";

export default function WritingFeedbackCard({ feedback }: { feedback: WritingFeedback }) {
  return (
    <div className="border rule rounded-lg p-4 bg-white space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Оцінка тексту</h3>
        <span className="text-lg font-serif font-semibold text-chalk">{feedback.score}/100</span>
      </div>

      <p className="text-sm text-ink/80 whitespace-pre-wrap">{feedback.overallFeedback}</p>

      {feedback.strengths.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink/60 mb-1">Що вдалося:</p>
          <ul className="text-sm space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-chalk">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.corrections.length > 0 && (
        <div>
          <p className="text-xs font-medium text-ink/60 mb-1">Виправлення:</p>
          <div className="space-y-2">
            {feedback.corrections.map((c, i) => (
              <div key={i} className="text-sm border-l-2 border-highlight pl-3">
                <p>
                  <span className="line-through text-ink/40">{c.original}</span>{" "}
                  <span className="text-chalk font-medium">→ {c.suggestion}</span>
                </p>
                <p className="text-xs text-ink/60 mt-0.5">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
