import type { Metadata } from "next";
import { LocationExplorer } from "@/components/LocationExplorer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `Location Explorer | ${siteConfig.name}`,
  description:
    "Search for locations, businesses, and points of interest through an interactive map experience powered by Google Maps and a Java Spring Boot backend.",
};

export default async function LocationExplorerPage({
  searchParams,
}: {
  searchParams: Promise<{ place?: string }>;
}) {
  const { place } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="glow-bg min-h-screen pt-16">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8">
          <SectionHeading
            label="Explore"
            title="Location Explorer"
            description="Search for locations, businesses, and points of interest through an interactive map experience powered by Google Maps and a Java Spring Boot backend."
          />
          <LocationExplorer initialPlace={place} />
        </div>
      </main>
      <Footer />
    </>
  );
}
