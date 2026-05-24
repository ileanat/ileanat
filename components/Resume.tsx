import { education, experience, siteConfig } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Resume() {
  return (
    <section id="resume" className="border-t border-border/60 bg-card/30 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            label="Resume"
            title="Experience & education"
            description="A snapshot of my professional journey. Download the full PDF for complete details."
          />
          <a
            href={siteConfig.resumePath}
            download
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent transition-all duration-200 hover:border-accent hover:bg-accent hover:text-background sm:self-auto"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume PDF
          </a>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-accent">
              Experience
            </h3>
            <div className="space-y-8">
              {experience.map((item) => (
                <article
                  key={`${item.company}-${item.role}`}
                  className="group relative border-l-2 border-border pl-6 transition-colors hover:border-accent/50"
                >
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-accent" />
                  <p className="font-mono text-xs text-muted">{item.period}</p>
                  <h4 className="mt-1 text-lg font-medium">{item.role}</h4>
                  <p className="text-sm text-accent">{item.company}</p>
                  <ul className="mt-3 space-y-1.5">
                    {item.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-2 text-sm leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-accent">
              Education
            </h3>
            <div className="space-y-8">
              {education.map((item) => (
                <article
                  key={item.school}
                  className="group relative border-l-2 border-border pl-6 transition-colors hover:border-accent/50"
                >
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-border transition-colors group-hover:bg-accent" />
                  <p className="font-mono text-xs text-muted">{item.period}</p>
                  <h4 className="mt-1 text-lg font-medium">{item.degree}</h4>
                  <p className="text-sm text-accent">{item.school}</p>
                  <p className="mt-2 text-sm text-muted">GPA: {item.gpa}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.honors.join(" · ")}
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-foreground">
                      Relevant Coursework
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {item.coursework.map((course) => (
                        <span
                          key={course}
                          className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
