interface SectionHeadingProps {
  label: string;
  title: string;
  description?: string;
  badge?: React.ReactNode;
}

export function SectionHeading({
  label,
  title,
  description,
  badge,
}: SectionHeadingProps) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-2 font-mono text-sm uppercase tracking-widest text-accent">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h2>
        {badge}
      </div>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted">{description}</p>
      )}
    </div>
  );
}
