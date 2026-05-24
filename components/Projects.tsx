import { projects } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

const projectAccents = [
  "from-[#E8AEB7]/30 via-accent/10 to-card",
  "from-[#D9929D]/25 via-accent/10 to-card",
  "from-[#F0C4CB]/25 via-accent/10 to-card",
];

function ProjectHeader({ index, title }: { index: number; title: string }) {
  return (
    <div
      className={`flex h-44 items-end rounded-t-xl border-b border-border bg-gradient-to-br p-6 ${projectAccents[index % projectAccents.length]}`}
    >
      <span className="font-mono text-4xl font-bold text-foreground/10 transition-colors group-hover:text-accent/20">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="sr-only">{title}</span>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          title="Selected work"
          description="Full-stack applications and demos built through coursework, fellowships, and collaborative development."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
            >
              <ProjectHeader index={index} title={project.title} />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-background px-2 py-0.5 font-mono text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(project.github || project.demo) && (
                  <div className="mt-5 flex gap-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted transition-colors hover:text-accent"
                      >
                        GitHub →
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-muted transition-colors hover:text-accent"
                      >
                        Live Site →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
