import type { StudyTopic } from "../lib/types";

export default function ProgressCard({ topic }: { topic: StudyTopic }) {
  return (
    <div className="border rule rounded-lg p-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">{topic.title}</h3>
        <span className="text-xs text-ink/50">{topic.masteryPercent}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-rule/60 overflow-hidden">
        <div
          className="h-full bg-chalk rounded-full"
          style={{ width: `${topic.masteryPercent}%` }}
        />
      </div>
    </div>
  );
}
