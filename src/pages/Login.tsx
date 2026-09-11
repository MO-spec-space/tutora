import { useState, FormEvent } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signInWithEmail(email);
    setSubmitting(false);
    if (error) {
      setError(error);
    } else {
      setSent(true);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-serif font-semibold">Tutora</h1>
        <p className="text-sm text-ink/60 mt-1 mb-8">
          Персональний AI-репетитор. Увійди, щоб почати.
        </p>

        {sent ? (
          <p className="text-sm bg-white border rule rounded-md p-4">
            Ми надіслали посилання для входу на <strong>{email}</strong>. Перевір пошту.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="твоя@пошта.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border rule px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-chalk"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-ink text-paper px-3 py-2 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Надсилаємо…" : "Отримати посилання для входу"}
            </button>
            {error && <p className="text-xs text-red-600">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
