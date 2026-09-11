export interface WritingPrompt {
  id: string;
  level: "A1" | "A2" | "B1" | "B2";
  title: string;
  instructions: string;
  minWords: number;
}

// A small starter bank across CEFR levels. Not exhaustive by design —
// enough for real daily practice; expand later without touching the app logic.
export const writingPrompts: WritingPrompt[] = [
  {
    id: "a1-intro",
    level: "A1",
    title: "Розкажи про себе",
    instructions: "Напиши 4–6 речень: як тебе звати, звідки ти, чим займаєшся, що любиш.",
    minWords: 25,
  },
  {
    id: "a1-day",
    level: "A1",
    title: "Мій звичайний день",
    instructions: "Опиши свій типовий день від ранку до вечора простими реченнями.",
    minWords: 30,
  },
  {
    id: "a2-weekend",
    level: "A2",
    title: "Минулі вихідні",
    instructions: "Розкажи, що ти робив(ла) минулих вихідних. Використай минулий час.",
    minWords: 40,
  },
  {
    id: "a2-friend",
    level: "A2",
    title: "Опис друга",
    instructions: "Опиши свого друга або подругу: як виглядає, який характер, що любить робити.",
    minWords: 40,
  },
  {
    id: "b1-opinion",
    level: "B1",
    title: "Твоя думка про соцмережі",
    instructions:
      "Напиши коротке есе: чи корисні соціальні мережі? Наведи 2 аргументи за і 1 проти.",
    minWords: 80,
  },
  {
    id: "b1-email",
    level: "B1",
    title: "Лист другу про подорож",
    instructions: "Напиши лист другу, у якому розповідаєш про нещодавню або заплановану подорож.",
    minWords: 80,
  },
  {
    id: "b2-argument",
    level: "B2",
    title: "За чи проти дистанційної роботи",
    instructions:
      "Напиши аргументоване есе на 3 абзаци: вступ з тезою, аргументи, висновок.",
    minWords: 120,
  },
  {
    id: "b2-review",
    level: "B2",
    title: "Рецензія на книгу або фільм",
    instructions:
      "Напиши рецензію: короткий опис сюжету, твоя оцінка, кому б ти порадив(ла).",
    minWords: 120,
  },
];

export function randomPrompt(exclude?: string): WritingPrompt {
  const pool = exclude ? writingPrompts.filter((p) => p.id !== exclude) : writingPrompts;
  return pool[Math.floor(Math.random() * pool.length)];
}
