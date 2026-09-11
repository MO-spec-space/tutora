import { useState, ChangeEvent } from "react";
import { supabase } from "../lib/supabaseClient";
import { useUsageLimit } from "../hooks/useUsageLimit";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function SnapSolve() {
  const { status, refresh } = useUsageLimit();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ reply: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limitReached = status ? status.used >= status.limit : false;

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError(null);
    setResult(null);
    if (!f) return;

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Підтримуються лише зображення: PNG, JPEG, WEBP.");
      return;
    }
    if (f.size > MAX_FILE_BYTES) {
      setError("Файл завеликий. Максимум 8 МБ.");
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSolve() {
    if (!file || limitReached) return;
    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      // Image bytes go straight to the Edge Function over an authenticated
      // call; the function re-validates size/type server-side before
      // spending an AI usage credit or calling the vision provider.
      const { data, error: fnError } = await supabase.functions.invoke("ai-solve", {
        body: { imageBase64: base64, mimeType: file.type },
      });

      setLoading(false);

      if (fnError || data?.error) {
        setError("Не вдалося розпізнати або розв'язати завдання. Спробуй чіткіше фото.");
        return;
      }

      setResult({ reply: data.reply });
      refresh();
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-serif font-semibold">Сфотографуй завдання</h2>
        <p className="text-sm text-ink/60 mt-1">
          Завантаж чітке фото задачі — репетитор підкаже, з чого почати, і проведе
          тебе до рішення питаннями. Готової відповіді він не дає навмисно.
        </p>
      </div>

      <label className="block border-2 border-dashed rule rounded-lg p-8 text-center cursor-pointer bg-white hover:border-chalk transition-colors">
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
        {preview ? (
          <img src={preview} alt="Прев'ю завдання" className="max-h-64 mx-auto rounded-md" />
        ) : (
          <p className="text-sm text-ink/50">Натисни, щоб обрати фото</p>
        )}
      </label>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {limitReached && (
        <p className="text-xs text-highlight">Ліміт безкоштовних запитів на сьогодні вичерпано.</p>
      )}

      <button
        onClick={handleSolve}
        disabled={!file || loading || limitReached}
        className="rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Розпізнаємо…" : "Отримати підказку"}
      </button>

      {result && (
        <div className="border rule rounded-lg p-4 bg-white text-sm whitespace-pre-wrap">
          {result.reply}
        </div>
      )}
    </div>
  );
}
