import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="rise-in mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  subtitle,
  children,
  className,
  action,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={cn("panel p-5 sm:p-6", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h2 className="text-base font-semibold text-foreground">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Metric({
  label,
  value,
  suffix,
  hint,
  tone = "primary",
}: {
  label: string;
  value: number | string | null;
  suffix?: string;
  hint?: string;
  tone?: "primary" | "calm" | "attention" | "neutral";
}) {
  const toneClass = {
    primary: "text-primary",
    calm: "text-calm",
    attention: "text-attention",
    neutral: "text-foreground",
  }[tone];
  return (
    <div className="panel p-5">
      <p className="eyebrow">{label}</p>
      {value === null || value === "" ? (
        <p className="mt-3 text-sm text-muted-foreground">Dados ainda insuficientes</p>
      ) : (
        <p className={cn("mt-2 text-3xl font-semibold tabular-nums", toneClass)}>
          {value}
          {suffix ? <span className="ml-1 text-lg font-medium text-muted-foreground">{suffix}</span> : null}
        </p>
      )}
      {hint ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="panel-quiet flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}

export function Note({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "attention" | "stop" | "calm" }) {
  const map = {
    neutral: "bg-primary-soft text-accent-foreground border-transparent",
    attention: "bg-attention-soft text-attention-foreground border-transparent",
    stop: "bg-stop-soft text-stop border-transparent",
    calm: "bg-calm-soft text-calm border-transparent",
  }[tone];
  return <p className={cn("rounded-lg border px-4 py-3 text-sm leading-relaxed", map)}>{children}</p>;
}

export function Flow({ steps, tone = "neutral" }: { steps: string[]; tone?: "neutral" | "stop" | "calm" }) {
  const chip = {
    neutral: "bg-secondary text-secondary-foreground",
    stop: "bg-stop-soft text-stop",
    calm: "bg-calm-soft text-calm",
  }[tone];
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={cn("rounded-full px-3 py-1.5 text-xs font-medium", chip)}>{s}</span>
          {i < steps.length - 1 ? <span aria-hidden className="text-muted-foreground">→</span> : null}
        </li>
      ))}
    </ol>
  );
}