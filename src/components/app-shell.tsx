import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  CalendarRange,
  CircleGauge,
  Database,
  Home,
  LifeBuoy,
  LineChart,
  ListChecks,
  Menu,
  Notebook,
  ShieldAlert,
  Sun,
  TrafficCone,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Onboarding } from "@/components/onboarding";
import { dayNumber, useStore, weekNumber } from "@/lib/store";
import { SEMANAS } from "@/lib/content";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Visão Geral", icon: Home },
  { to: "/hoje", label: "Hoje", icon: Sun },
  { to: "/semana", label: "Semana Atual", icon: CalendarRange },
  { to: "/kpis", label: "KPIs", icon: CircleGauge },
  { to: "/protocolos", label: "Protocolos", icon: LifeBuoy },
  { to: "/diario", label: "Diário", icon: Notebook },
  { to: "/semaforo", label: "Semáforo", icon: TrafficCone },
  { to: "/plano", label: "Plano de 90 dias", icon: ListChecks },
  { to: "/recaidas", label: "Recaídas", icon: ShieldAlert },
  { to: "/terapia", label: "Terapia", icon: BookOpen },
  { to: "/evolucao", label: "Evolução", icon: LineChart },
  { to: "/dados", label: "Meus dados", icon: Database },
] as const;

const MOBILE_NAV = NAV.filter((n) => ["/", "/hoje", "/protocolos", "/diario", "/evolucao"].includes(n.to));

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Seções do painel">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function ProgressBadge() {
  const { state } = useStore();
  const d = dayNumber(state.startDate);
  const w = weekNumber(state.startDate);
  const foco = SEMANAS.find((s) => s.n === w)?.foco;
  return (
    <div className="panel-quiet px-4 py-3">
      <p className="text-sm font-semibold tabular-nums text-foreground">
        Dia {d} <span className="text-muted-foreground">/ 90</span>
        <span className="mx-2 text-border">·</span>
        Semana {w} <span className="text-muted-foreground">/ 13</span>
      </p>
      {foco ? <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Foco: {foco}</p> : null}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready } = useStore();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!ready) {
    return <div className="min-h-svh bg-background" aria-hidden />;
  }

  if (!state.onboarded) return <Onboarding />;

  // Modo guiado: tela dedicada, sem sidebar nem navegação inferior.
  if (pathname === "/ativado") return <>{children}</>;

  return (
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Link to="/" className="px-3">
          <p className="text-[0.95rem] font-semibold leading-tight text-foreground">
            Plano de ação
            <br />
            comportamental
          </p>
          <p className="eyebrow mt-1">90 dias</p>
        </Link>
        <div className="mt-6">
          <ProgressBadge />
        </div>
        <div className="mt-6 flex-1 overflow-y-auto pb-4">
          <NavList />
        </div>
        <p className="px-3 text-[0.7rem] leading-relaxed text-muted-foreground">
          O painel mede comportamentos, não valor pessoal.
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/85 px-4 py-3 backdrop-blur lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[19rem] overflow-y-auto px-4 py-6">
            <SheetTitle className="px-3 text-sm">Plano de ação comportamental — 90 dias</SheetTitle>
            <div className="mt-4">
              <ProgressBadge />
            </div>
            <div className="mt-4">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">Plano de ação comportamental</p>
          <p className="truncate text-xs text-muted-foreground">
            Dia {dayNumber(state.startDate)}/90 · Semana {weekNumber(state.startDate)}/13
          </p>
        </div>
        <Link to="/ativado" className="ml-auto">
          <Button size="sm" variant="secondary" className="gap-1.5">
            <Activity className="size-4" aria-hidden />
            Ativado
          </Button>
        </Link>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:ml-72 lg:px-10 lg:pb-16 lg:pt-10">
        <div className="mx-auto max-w-5xl">{children}</div>
        <footer className="mx-auto mt-16 max-w-5xl border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground">
          <p>
            Este é um plano de auto-observação e treino comportamental, não uma ferramenta de diagnóstico ou substituto
            para acompanhamento profissional.
          </p>
          <p className="mt-2">
            Em caso de sofrimento intenso, risco pessoal ou emergência, procure ajuda profissional ou um serviço de
            emergência (no Brasil: CVV 188, SAMU 192, emergência 190).
          </p>
        </footer>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
        aria-label="Navegação principal"
      >
        {MOBILE_NAV.map(({ to, label, icon: Icon }) => (
          <MobileItem key={to} to={to} label={label} Icon={Icon} />
        ))}
      </nav>
    </div>
  );
}

function MobileItem({
  to,
  label,
  Icon,
}: {
  to: string;
  label: string;
  Icon: typeof Home;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const active = pathname === to;
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-col items-center gap-1 px-1 py-2.5 text-[0.65rem] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <Icon className="size-[1.15rem]" aria-hidden />
      <span className="truncate">{label}</span>
    </Link>
  );
}