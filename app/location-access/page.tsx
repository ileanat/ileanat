import type { Metadata } from "next";
import { Suspense } from "react";
import LocationAccessPage from "./page.client";

export const metadata: Metadata = {
  title: "Location Access",
  description: "Validate private location access.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="glow-bg min-h-screen pt-16">
          <div className="mx-auto max-w-3xl px-6 py-24 lg:px-8">
            <div className="rounded-2xl border border-border bg-card/50 px-6 py-12 text-center">
              <span className="mx-auto mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
              <p className="text-sm text-muted">Loading access validation...</p>
            </div>
          </div>
        </main>
      }
    >
      <LocationAccessPage />
    </Suspense>
  );
}
