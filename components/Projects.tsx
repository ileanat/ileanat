"use client";

import { useCallback, useEffect, useState } from "react";
import { projects as localProjects } from "@/lib/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string | null;
  demo: string | null;
};

function toProjects(
  items: typeof localProjects,
): Project[] {
  return items.map((project) => ({
    title: project.title,
    description: project.description,
    tags: [...project.tags],
    github: project.github,
    demo: project.demo,
  }));
}

const fallbackProjects = toProjects(localProjects);

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <article
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
  );
}

function ProjectCardSkeleton() {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="h-44 animate-pulse rounded-t-xl border-b border-border bg-gradient-to-br from-border/40 to-card" />
      <div className="flex flex-1 flex-col p-6">
        <div className="h-5 w-2/5 animate-pulse rounded bg-border/60" />
        <div className="mt-3 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-border/40" />
          <div className="h-3 w-full animate-pulse rounded bg-border/40" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-border/40" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-5 w-16 animate-pulse rounded-md bg-border/40"
            />
          ))}
        </div>
      </div>
    </article>
  );
}

async function fetchBackendProjects(backendUrl: string): Promise<Project[]> {
  const response = await fetch(`${backendUrl}/api/projects`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data: Project[] = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Backend returned no projects.");
  }

  return data;
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      if (backendUrl) {
        const backendProjects = await fetchBackendProjects(backendUrl);
        setProjects(backendProjects);
        return;
      }
    } catch {
      // Fall back to local project data below.
    }

    if (fallbackProjects.length > 0) {
      setProjects(fallbackProjects);
      return;
    }

    setProjects([]);
    setError("Unable to load projects.");
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return (
    <section id="projects" className="border-t border-border/60 py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <SectionHeading
          label="Projects"
          title="Selected work"
          description="Full-stack applications and demos built through coursework, fellowships, and collaborative development."
        />

        {loading && (
          <div className="grid gap-6 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">{error}</p>
            <button
              type="button"
              onClick={() => void loadProjects()}
              className="mt-4 text-sm font-medium text-accent transition-colors hover:text-foreground"
            >
              Try again →
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project, index) => (
              <ProjectCard key={project.title} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
