import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  // Fails loudly at build/dev time instead of silently breaking auth later.
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill it in."
  );
}

// IMPORTANT: only the public anon key belongs here. Never put a service_role
// key or any AI provider API key in frontend code — those live exclusively
// as Supabase Edge Function secrets (see supabase/functions/*).
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
