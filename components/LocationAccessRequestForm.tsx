"use client";

import { FormEvent, useState } from "react";
import { submitLocationAccessRequest } from "@/lib/locationAccess";

export function LocationAccessRequestForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") ?? "").trim();

    try {
      await submitLocationAccessRequest({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        message: message || undefined,
      });
      setSubmitted(true);
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your request right now.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="location-request-heading"
      className="rounded-2xl border border-border bg-card p-4 sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
            Private Access
          </p>
          <h2
            id="location-request-heading"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Request My Location
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Location sharing is private and requires approval. Submit a request
            with your name and email, and I&apos;ll review it before any access
            is granted.
          </p>
        </div>

        {!submitted && (
          <button
            type="button"
            onClick={() => {
              setIsOpen((open) => !open);
              setError(null);
            }}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-all duration-200 hover:border-accent hover:bg-accent hover:text-background"
          >
            {isOpen ? "Hide Request Form" : "Request My Location"}
          </button>
        )}
      </div>

      {submitted ? (
        <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Request submitted successfully.
          </p>
          <p className="mt-1 text-sm text-muted">
            Your request is pending review. You&apos;ll only receive access if it
            is approved.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setIsOpen(true);
            }}
            className="mt-4 text-sm text-accent transition-colors hover:text-accent-hover"
          >
            Submit another request
          </button>
        </div>
      ) : (
        isOpen && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="location-request-name" className="mb-1.5 block text-sm font-medium">
                Name
              </label>
              <input
                id="location-request-name"
                name="name"
                type="text"
                required
                disabled={submitting}
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="location-request-email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="location-request-email"
                name="email"
                type="email"
                required
                disabled={submitting}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <div>
              <label htmlFor="location-request-message" className="mb-1.5 block text-sm font-medium">
                Message <span className="text-muted">(optional)</span>
              </label>
              <textarea
                id="location-request-message"
                name="message"
                rows={4}
                disabled={submitting}
                placeholder="Why would you like access?"
                className="w-full resize-none rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-background/30 border-t-background" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </form>
        )
      )}
    </section>
  );
}
