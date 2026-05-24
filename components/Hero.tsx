import { siteConfig } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="home"
      className="glow-bg relative flex min-h-screen items-center pt-16"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-24 lg:px-8">
        <div className="max-w-3xl">
          <p className="animate-fade-in-up mb-4 font-mono text-sm uppercase tracking-widest text-accent">
            Portfolio
          </p>
          <h1 className="animate-fade-in-up animation-delay-100 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-foreground to-muted bg-clip-text text-transparent">
              {siteConfig.name}
            </span>
          </h1>
          <p className="animate-fade-in-up animation-delay-200 mt-6 text-lg font-medium leading-relaxed text-accent sm:text-xl">
            {siteConfig.headline}
          </p>
          <p className="animate-fade-in-up animation-delay-300 mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {siteConfig.intro}
          </p>
          <div className="animate-fade-in-up animation-delay-400 mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-background transition-all duration-200 hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
            >
              View Projects
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:border-accent/50 hover:bg-white/5"
            >
              Get in Touch
            </a>
          </div>
        </div>

        <div className="animate-fade-in animation-delay-400 mt-20 flex flex-wrap items-center gap-6 text-sm text-muted">
          <span className="font-mono">{siteConfig.location}</span>
          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={siteConfig.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
