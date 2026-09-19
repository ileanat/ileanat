"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  formatRequestDate,
  statusLabel,
  validateLocationAccess,
  type LocationAccessValidationResponse,
} from "@/lib/locationAccess";

export default function LocationAccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [result, setResult] = useState<LocationAccessValidationResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    validateLocationAccess(token)
      .then((response) => {
        if (!cancelled) {
          setResult(response);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to validate this access link.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="glow-bg min-h-screen pt-16">
        <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
          <SectionHeading
            label="Private Access"
            title="Location Access"
            description="This page validates your private access link. No location coordinates are shown here yet."
          />

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            {!token ? (
              <p className="text-sm text-muted">
                A valid private access token is required. Use the link from your
                approval email.
              </p>
            ) : loading ? (
              <div className="text-center">
                <span className="mx-auto mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
                <p className="text-sm text-muted">Validating your access link...</p>
              </div>
            ) : error ? (
              <p className="text-sm text-muted">{error}</p>
            ) : result ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      result.approved
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {result.approved ? "Access approved" : "Access not available"}
                  </span>
                  {result.status && (
                    <span className="text-sm text-muted">
                      Status: {statusLabel(result.status)}
                    </span>
                  )}
                </div>

                {result.expiresAt ? (
                  <p className="text-sm text-muted">
                    Expires {formatRequestDate(result.expiresAt)}
                  </p>
                ) : result.approved ? (
                  <p className="text-sm text-muted">
                    This access remains valid until revoked.
                  </p>
                ) : null}

                {!result.approved && (
                  <p className="text-sm text-muted">
                    This link may be invalid, denied, revoked, or expired.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
