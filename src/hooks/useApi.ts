"use client";
import { useEffect, useState } from "react";
import { requestJson } from "@/src/lib/client-api";

export function useApi<T>(url: string, revision = 0) {
  const [state, setState] = useState<{ url: string; data?: T; error?: string }>({ url });
  useEffect(() => {
    const controller = new AbortController();
    requestJson<T>(url, { signal: controller.signal }).then(data => {
      setState({ url, data });
    }).catch(error => {
      if (!controller.signal.aborted) setState({ url, error: error instanceof Error ? error.message : "Data gagal dimuat." });
    });
    return () => controller.abort();
  }, [url, revision]);
  return state.url === url ? state : { url };
}
