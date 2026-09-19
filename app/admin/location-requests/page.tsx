import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { LocationRequestAdminPanel } from "@/components/LocationRequestAdminPanel";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Location Requests | ${siteConfig.name}`,
  description: "Review and manage private location access requests.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LocationRequestsAdminPage() {
  return (
    <>
      <Navbar />
      <main className="glow-bg min-h-screen pt-16">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <SectionHeading
            label="Admin"
            title="Location Requests"
            description="Approve, deny, or revoke private location access requests. This page is protected and never exposes coordinates."
          />
          <div className="mt-10">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-border bg-card/50 px-6 py-12 text-center">
                  <span className="mx-auto mb-4 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-accent/20 border-t-accent" />
                  <p className="text-sm text-muted">Loading location requests...</p>
                </div>
              }
            >
              <LocationRequestAdminPanel />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
