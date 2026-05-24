import { siteConfig, skillCategories } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading label="About" title="About me" />

        <div className="grid gap-12 lg:grid-cols-2">
          <p className="text-muted leading-relaxed">{siteConfig.about}</p>

          <div className="space-y-8">
            {skillCategories.map((category) => (
              <div key={category.label}>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-foreground">
                  {category.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted transition-all duration-200 hover:border-accent/40 hover:text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
