"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  formatRequestDate,
  statusClasses,
  statusLabel,
  type ApprovalDurationMinutes,
  type LocationAccessRequest,
} from "@/lib/locationAccess";

const approvalOptions: { label: string; durationMinutes: ApprovalDurationMinutes }[] = [
  { label: "Approve for 15 minutes", durationMinutes: 15 },
  { label: "Approve for 1 hour", durationMinutes: 60 },
  { label: "Approve for 24 hours", durationMinutes: 1440 },
  { label: "Approve until revoked", durationMinutes: 0 },
];

export function LocationRequestAdminPanel() {
  const searchParams = useSearchParams();
  const highlightedRequestId = searchParams.get("requestId");
  const [requests, setRequests] = useState<LocationAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/location-access/requests", {
        cache: "no-store",
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to load location requests.");
      }

      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load location requests.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    if (!highlightedRequestId || loading) {
      return;
    }

    const element = document.getElementById(`location-request-${highlightedRequestId}`);
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightedRequestId, loading, requests]);

  const highlightedExists = useMemo(
    () => requests.some((request) => request.id === highlightedRequestId),
    [highlightedRequestId, requests],
  );

  const runApproval = async (id: string, durationMinutes: ApprovalDurationMinutes) => {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/location-access/requests/${id}/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ durationMinutes }),
        },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to update this request.");
      }

      setRequests((current) =>
        current.map((request) => (request.id === id ? data : request)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this request.",
      );
    } finally {
      setActionId(null);
    }
  };

  const runAction = async (id: string, action: "deny" | "revoke") => {
    setActionId(id);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/location-access/requests/${id}/${action}`,
        { method: "POST" },
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Unable to update this request.");
      }

      setRequests((current) =>
        current.map((request) => (request.id === id ? data : request)),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update this request.",
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Review private location access requests. No coordinates are stored or
          shown here.
        </p>
        <button
          type="button"
          onClick={() => void loadRequests()}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Refresh
        </button>
      </div>

      {highlightedRequestId && !loading && highlightedExists && (
        <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-muted">
          Showing the request from your email link. Choose an approval duration
          or deny it manually below.
        </p>
      )}

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/50 px-6 py-12 text-center">
          <span className="mx-auto mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
          <p className="text-sm text-muted">Loading location requests...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-border bg-card px-6 py-8">
          <p className="text-sm text-muted">{error}</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/30 px-6 py-12 text-center">
          <p className="text-sm text-muted">No location requests yet.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => {
            const isBusy = actionId === request.id;
            const isHighlighted = request.id === highlightedRequestId;

            return (
              <li
                key={request.id}
                id={`location-request-${request.id}`}
                className={`rounded-2xl border bg-card p-5 sm:p-6 ${
                  isHighlighted
                    ? "border-accent bg-accent/10 shadow-lg shadow-accent/10"
                    : "border-border"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-foreground">
                        {request.name}
                      </h2>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses(request.status)}`}
                      >
                        {statusLabel(request.status)}
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-accent">{request.email}</p>

                    {request.message && (
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {request.message}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                      <span>Requested {formatRequestDate(request.createdAt)}</span>
                      {request.expiresAt && (
                        <span>
                          Expires {formatRequestDate(request.expiresAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {request.status === "PENDING" && (
                      <>
                        {approvalOptions.map((option) => (
                          <button
                            key={option.durationMinutes}
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                              void runApproval(request.id, option.durationMinutes)
                            }
                            className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-medium text-background transition-all duration-200 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {option.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => void runAction(request.id, "deny")}
                          className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-red-400/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Deny
                        </button>
                      </>
                    )}

                    {request.status === "APPROVED" && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => void runAction(request.id, "revoke")}
                        className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Revoke Access
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
