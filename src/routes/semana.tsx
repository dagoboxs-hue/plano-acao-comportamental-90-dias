import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { TrendChart } from "@/components/trend-chart";
import { PERGUNTAS_REVISAO, SCORECARD_AREAS, SEMANAS } from "@/lib/content";
import { scorecardSerie } from "@/lib/kpis";
import { painelVazio, scorecardTotal, useActions, useStore, weekNumber, type PainelSemanal } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/semana")({
  head: () => ({
    meta: [
      { title: "Semana atual — Plano de 90 dias" },
      { name: "description", content: "Foco da semana, painel de evolução, scorecard /20 e revisão semanal em menos de 5 minutos." },
      { property: "og:title", content: "Semana atual" },
      { property: "og:description", content: "Tendências importam mais que dias isolados." },
    ],
  }),
  component: SemanaAtual,
});

const CAMPOS_PAINEL: { key: keyof PainelSemanal; label: string }[] = [
  { key: "limitesRecebidos", label: "Limites recebidos" },
  { key: "limitesRespeitados", label: "Limites respeitados sem negociação" },
  { key: "mensagensImpulsivas", label: "Mensagens impulsivas" },
  { key: "episodios", label: "Episódios de ativação" },
  { key: "episodiosPausa15", label: "Episódios com pausa ≥ 15 min" },
  { key: "ajudaTentativas", label: "Tentativas de ajuda" },
  { key: "ajudaConsentida", label: "Ajuda precedida de consentimento" },
  { key: "psicologizacoes", label: "Psicologizações não solicitadas" },
  { key: "privacidade", label: "Violações conscientes de privacidade" },
  { key: "escaladasDR", label: "Escaladas para DR" },
  { key: "a", label: "Episódios A (regulei sozinho)" },
  { key: "b", label: "Episódios B (apoio independente)" },
  { key: "c", label: "Episódios C (procurei a pessoa)" },
  { key: "compromissosPlanejados", label: "Compromissos planejados" },
  { key: "compromissosCumpridos", label: "Compromissos cumpridos" },
  { key: "reparacoesTotais", label: "Reparações totais" },
  { key: "reparacoesCurtas", label: "Reparações curtas" },
];

function SemanaAtual() {
  const { state } = useStore();
  const { setWeek } = useActions();
  const semanaAtual = weekNumber(state.startDate);
  const [semana, setSemana] = useState(semanaAtual || 1);
  const entry = state.weeks[semana];
  const painel = entry?.painel ?? painelVazio;
  const scorecard = entry?.scorecard ?? Array<number | null>(10).fill(null);
  const revisao = entry?.revisao ?? {};
  const info = SEMANAS.find((s) => s.n === semana)!;
  const total = scorecardTotal(scorecard);

  return (
    <div>
      <PageHeader
        eyebrow={`Semana ${semana} de 13`}
        title={info.foco}
        description={info.objetivo}
        action={
          <div className="flex flex-wrap gap-1">
            {SEMANAS.map((s) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setSemana(s.n)}
                aria-current={s.n === semana ? "true" : undefined}
                className={cn(
                  "size-8 rounded-md text-xs font-medium tabular-nums transition-colors",
                  s.n === semana
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {s.n}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Check-in">
          <p className="text-sm text-muted-foreground">{info.checkin}</p>
        </Panel>
        <Panel title="Reflexão">
          <p className="text-sm text-muted-foreground">{info.reflexao}</p>
          <p className="mt-3 text-xs text-muted-foreground">KPIs relevantes: {info.kpis.join(", ")}</p>
        </Panel>
      </div>

      <Panel className="mb-6" title="Painel de evolução" subtitle="Números observados nesta semana.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPOS_PAINEL.map((c) => (
            <label key={c.key} className="grid gap-2">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <Input
                type="number"
                min={0}
                value={painel[c.key]}
                onChange={(e) => setWeek(semana, { painel: { ...painel, [c.key]: Number(e.target.value) || 0 } })}
              />
            </label>
          ))}
        </div>
      </Panel>

      <Panel
        className="mb-6"
        title="Scorecard semanal"
        subtitle="0 comportamento antigo dominou · 1 percebi depois ou interrompi parcialmente · 2 percebi e escolhi comportamento novo."
      >
        <ul className="space-y-2">
          {SCORECARD_AREAS.map((area, idx) => (
            <li key={area} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-4 py-3">
              <span className="text-sm text-foreground">{area}</span>
              <div className="flex gap-2">
                {[0, 1, 2].map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`${area}: ${v}`}
                    aria-pressed={scorecard[idx] === v}
                    onClick={() => {
                      const next = [...scorecard];
                      next[idx] = v;
                      setWeek(semana, { scorecard: next });
                    }}
                    className={cn(
                      "size-9 rounded-md border text-sm font-medium tabular-nums transition-colors",
                      scorecard[idx] === v
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-2xl font-semibold tabular-nums text-primary">
          {total ?? "—"}
          <span className="ml-1 text-base text-muted-foreground">/20</span>
        </p>
        <div className="mt-4">
          <Note>Tendências importam mais que dias isolados.</Note>
        </div>
        <div className="mt-5">
          <TrendChart
            data={scorecardSerie(state).map((p) => ({ semana: p.semana, scorecard: p.valor }))}
            series={[{ key: "scorecard", label: "Scorecard" }]}
            domain={[0, 20]}
          />
        </div>
      </Panel>

      <Panel title="Revisão semanal" subtitle="Menos de 5 minutos.">
        <div className="grid gap-4">
          {PERGUNTAS_REVISAO.map((q) => (
            <label key={q.key} className="grid gap-2">
              <span className="text-xs text-muted-foreground">{q.label}</span>
              <Textarea
                rows={2}
                value={revisao[q.key] ?? ""}
                onChange={(e) => setWeek(semana, { revisao: { ...revisao, [q.key]: e.target.value } })}
              />
            </label>
          ))}
        </div>
        <label className="mt-5 grid gap-2">
          <span className="text-xs text-muted-foreground">Foco único da próxima semana</span>
          <Input
            value={entry?.focoProxima ?? ""}
            onChange={(e) => setWeek(semana, { focoProxima: e.target.value })}
          />
        </label>
        <div className="mt-5">
          <Button onClick={() => toast.success("Revisão salva.")}>Salvar revisão</Button>
        </div>
      </Panel>
    </div>
  );
}