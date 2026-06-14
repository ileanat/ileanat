"use client";

import { useEffect, useState } from "react";

type BackendStatus = "connected" | "unavailable";

export function BackendStatusBadge() {
  const [status, setStatus] = useState<BackendStatus>("unavailable");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!backendUrl) return;

    const controller = new AbortController();

    async function checkHealth() {
      try {
        const response = await fetch(`${backendUrl}/api/health`, {
          signal: controller.signal,
        });
        const data = (await response.json().catch(() => null)) as {
          status?: string;
        } | null;

        setStatus(response.ok && data?.status === "UP" ? "connected" : "unavailable");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("unavailable");
        }
      }
    }

    checkHealth();

    return () => controller.abort();
  }, [backendUrl]);

  const isConnected = status === "connected";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
        isConnected
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-border bg-card text-muted"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isConnected ? "bg-accent" : "bg-muted/60"
        }`}
        aria-hidden="true"
      />
      {isConnected ? "Backend connected" : "Backend unavailable"}
    </span>
  );
}
