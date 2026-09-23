import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Metric, Note, PageHeader, Panel, Flow } from "@/components/ui-bits";
import { TrendChart } from "@/components/trend-chart";
import { PADRAO_ANTIGO, PADRAO_NOVO, PRIORIDADES_30, SEMANAS } from "@/lib/content";
import { buildKpis, scorecardSerie } from "@/lib/kpis";
import { dayNumber, scorecardTotal, useStore, weekNumber } from "@/lib/store";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão Geral — Plano de Ação Comportamental 90 dias" },
      {
        name: "description",
        content:
          "Painel de auto-observação e treino comportamental em 90 dias: pausa, autonomia, rotina e tendências semanais.",
      },
      { property: "og:title", content: "Plano de Ação Comportamental — 90 dias" },
      {
        property: "og:description",
        content: "Menos controle. Mais pausa, regulação, escolha e consistência.",
      },
    ],
  }),
  component: VisaoGeral,
});

function VisaoGeral() {
  const { state } = useStore();
  const dia = dayNumber(state.startDate);
  const semana = weekNumber(state.startDate);
  const focoSemana = SEMANAS.find((s) => s.n === semana);
  const kpis = buildKpis(state);
  const pausa = kpis.find((k) => k.id === "pausa")!;
  const autonomia = kpis.find((k) => k.id === "autonomia")!;
  const rotina = kpis.find((k) => k.id === "compromissos")!;
  const scSerie = scorecardSerie(state);
  const atual = state.weeks[semana];
  const total = atual ? scorecardTotal(atual.scorecard) : null;

  return (
    <div>
      <PageHeader
        eyebrow={`Dia ${dia} de 90 · Semana ${semana} de 13`}
        title="Plano de ação comportamental — 90 dias"
        description="Menos controle. Mais pausa, regulação, escolha e consistência."
        action={
          <Link to="/hoje">
            <Button size="lg">Abrir Hoje</Button>
          </Link>
        }
      />

      <Panel className="mb-6 border-primary/25 bg-primary-soft/60">
        <p className="eyebrow">Foco da semana</p>
        <p className="mt-2 text-lg font-medium text-foreground">
          Semana {semana} — {focoSemana?.foco ?? "definir foco"}
        </p>
        {focoSemana ? <p className="mt-2 text-sm text-muted-foreground">{focoSemana.objetivo}</p> : null}
      </Panel>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Metric
          label="Pausa"
          value={pausa.atual}
          suffix="%"
          hint="Episódios com pausa antes da ação (≥15 min)."
        />
        <Metric
          label="Autonomia"
          value={autonomia.atual}
          suffix="%"
          tone="calm"
          hint="Episódios A/B em vez de C."
        />
        <Metric
          label="Rotina"
          value={rotina.atual}
          suffix="%"
          tone="neutral"
          hint="Rotina essencial e compromissos cumpridos."
        />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Panel title="Scorecard semanal" subtitle="Soma das 10 dimensões desta semana.">
          <p className="text-4xl font-semibold tabular-nums text-primary">
            {total ?? "—"}
            <span className="ml-1 text-xl text-muted-foreground">/20</span>
          </p>
          <Link to="/semana" className="mt-4 inline-block">
            <Button variant="secondary" size="sm">
              {atual ? "Revisar scorecard" : "Preencher scorecard"}
            </Button>
          </Link>
        </Panel>
        <Panel title="Tendência das últimas semanas" subtitle="Tendências importam mais que dias isolados.">
          <TrendChart
            data={scSerie.map((p) => ({ semana: p.semana, scorecard: p.valor }))}
            series={[{ key: "scorecard", label: "Scorecard" }]}
            domain={[0, 20]}
          />
        </Panel>
      </div>

      <Panel className="mb-6" title="Princípio central">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Padrão antigo</p>
            <Flow steps={PADRAO_ANTIGO} tone="stop" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">Resumo: ansiedade → ação → alívio</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Padrão novo</p>
            <Flow steps={PADRAO_NOVO} tone="calm" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">Resumo: espaço entre sentir e agir</p>
          </div>
        </div>
        <div className="mt-5">
          <Note>
            O objetivo não é deixar de sentir ansiedade. É criar espaço suficiente entre sentir e agir.
          </Note>
        </div>
      </Panel>

      <Panel className="mb-6" title="Prioridades dos primeiros 30 dias">
        <ol className="space-y-2">
          {PRIORIDADES_30.map((p, i) => (
            <li key={p} className="flex gap-3 text-sm text-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[0.7rem] font-semibold text-secondary-foreground">
                {i + 1}
              </span>
              {p}
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">Não precisamos corrigir 18 padrões simultaneamente.</p>
      </Panel>

      <Panel className="mb-6 border-attention/40 bg-attention-soft/60">
        <p className="eyebrow">Regra do “te aviso”</p>
        <p className="mt-2 text-sm leading-relaxed text-foreground">
          Quando alguém disser “te aviso”, não enviar nova cobrança sobre aquele assunto até que a pessoa retome ou
          apareça uma necessidade objetiva independente da ansiedade.
        </p>
      </Panel>

      <Collapsible className="panel p-5 sm:p-6">
        <CollapsibleTrigger className="flex w-full items-start justify-between gap-4 text-left">
          <div>
            <p className="eyebrow">Pergunta central</p>
            <p className="mt-2 text-base font-medium text-foreground">
              Como saberei que realmente mudei mesmo se ninguém estiver me elogiando, reconhecendo ou recompensando por
              isso?
            </p>
          </div>
          <ChevronDown className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            A mudança existe quando comportamentos novos continuam acontecendo quando ninguém observa, quando ninguém
            elogia, quando não produzem proximidade e quando respeitar um limite traz exatamente o resultado que eu não
            queria.
          </p>
          <p className="mt-3 font-medium text-foreground">A ação deixa de depender da reação da outra pessoa.</p>
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Consciência", "perfeição"],
          ["Consistência", "promessas"],
          ["Comportamento", "intenção"],
          ["Tendência", "episódio isolado"],
        ].map(([a, b]) => (
          <div key={a} className="panel-quiet px-4 py-3 text-sm">
            <span className="font-semibold text-foreground">{a}</span>
            <span className="mx-2 text-muted-foreground">&gt;</span>
            <span className="text-muted-foreground">{b}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm italic text-muted-foreground">
        “Mudança real é aquilo que continua acontecendo mesmo quando ninguém está olhando.”
      </p>
    </div>
  );
}