import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { UsageStatus } from "../lib/types";

// Reads usage status via a database RPC (increment_ai_usage / get_ai_usage),
// never trusting a client-side counter. The actual enforcement always
// happens again, server-side, inside the Edge Functions.
export function useUsageLimit() {
  const [status, setStatus] = useState<UsageStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_ai_usage_status");
    if (!error && data) {
      setStatus(data as UsageStatus);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, loading, refresh };
}
