import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  aside?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  aside,
}: PageHeaderProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
      <div className="space-y-3">
        {eyebrow ? (
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-accent-strong">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
      {aside ? <div className="flex flex-wrap gap-2">{aside}</div> : null}
    </div>
  );
}
