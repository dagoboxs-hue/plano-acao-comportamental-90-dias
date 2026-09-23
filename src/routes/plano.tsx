import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Flow, Note, PageHeader, Panel } from "@/components/ui-bits";
import {
  ESTRESSORES_90,
  FAIXAS_PAUSA,
  PADROES,
  PRIORIDADES_30,
  SEMANAS,
  SUBSTITUICOES,
  type FaixaPausa,
} from "@/lib/content";
import { useActions, useStore, type Baseline } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/plano")({
  head: () => ({
    meta: [
      { title: "Plano de 90 dias — consciência, substituição e consistência" },
      { name: "description", content: "Baseline, padrões observados, prioridades e as 13 semanas do treino comportamental." },
      { property: "og:title", content: "Plano de 90 dias" },
      { property: "og:description", content: "0–30 consciência · 31–60 substituição · 61–90 consistência." },
    ],
  }),
  component: Plano,
});

const baselineVazio: Baseline = {
  limitesRecebidos: 0,
  limitesNegociados: 0,
  mensagensImpulsivas: 0,
  episodios: 0,
  pausaPredominante: "<5 min",
  solucoesOferecidas: 0,
  solucoesConsentidas: 0,
  psicologizacoes: 0,
  privacidade: 0,
  escaladasDR: 0,
  a: 0,
  b: 0,
  c: 0,
  compromissosPlanejados: 0,
  compromissosCumpridos: 0,
  concluido: false,
};

const CAMPOS_BASELINE: { key: keyof Baseline; label: string }[] = [
  { key: "limitesRecebidos", label: "Limites recebidos" },
  { key: "limitesNegociados", label: "Limites negociados depois" },
  { key: "mensagensImpulsivas", label: "Mensagens impulsivas" },
  { key: "episodios", label: "Episódios de ativação" },
  { key: "solucoesOferecidas", label: "Soluções oferecidas" },
  { key: "solucoesConsentidas", label: "Soluções com consentimento" },
  { key: "psicologizacoes", label: "Psicologizações" },
  { key: "privacidade", label: "Violações de privacidade" },
  { key: "escaladasDR", label: "Escaladas para DR" },
  { key: "a", label: "Episódios A" },
  { key: "b", label: "Episódios B" },
  { key: "c", label: "Episódios C" },
  { key: "compromissosPlanejados", label: "Compromissos planejados" },
  { key: "compromissosCumpridos", label: "Compromissos cumpridos" },
];

function Plano() {
  const { state } = useStore();
  const { setBaseline } = useActions();
  const b = state.baseline ?? baselineVazio;

  return (
    <div>
      <PageHeader
        eyebrow="Estrutura"
        title="Plano de 90 dias"
        description="Três fases, 13 semanas e um baseline inicial. Uma prioridade por vez."
      />

      <Panel className="mb-6" title="Semana de observação — primeiros 7 dias">
        <Note>Não tente ter uma semana perfeita. A primeira semana serve para descobrir o que realmente acontece.</Note>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAMPOS_BASELINE.map((c) => (
            <label key={c.key} className="grid gap-2">
              <span className="text-xs text-muted-foreground">{c.label}</span>
              <Input
                type="number"
                min={0}
                value={b[c.key] as number}
                onChange={(e) => setBaseline({ ...b, [c.key]: Number(e.target.value) || 0 })}
              />
            </label>
          ))}
          <div className="grid gap-2">
            <span className="text-xs text-muted-foreground">Pausa predominante</span>
            <div className="flex flex-wrap gap-1.5">
              {FAIXAS_PAUSA.map((f) => (
                <Button
                  key={f}
                  type="button"
                  size="sm"
                  variant={b.pausaPredominante === f ? "default" : "outline"}
                  onClick={() => setBaseline({ ...b, pausaPredominante: f as FaixaPausa })}
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              setBaseline({ ...b, concluido: true });
              toast.success("Baseline registrado.");
            }}
          >
            Concluir baseline
          </Button>
          <p className="text-sm text-muted-foreground">Seu baseline não é uma nota. É apenas o ponto de partida.</p>
        </div>
      </Panel>

      <div className="mb-6 grid gap-4 lg:grid-cols-3">
        <Panel title="0–30 · Consciência e interrupção">
          <p className="text-sm text-muted-foreground">
            Objetivo: perceber o impulso cedo o suficiente para criar escolha.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-foreground">
            {[
              "Registrar episódios",
              "Usar pausa",
              "Respeitar “não”",
              "Reduzir mensagens impulsivas",
              "Manter rotina mínima",
              "Separar fato de interpretação",
              "Não transformar recaída em crise moral",
            ].map((p) => (
              <li key={p}>· {p}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="31–60 · Substituição">
          <ul className="space-y-2.5 text-sm">
            {SUBSTITUICOES.map((s) => (
              <li key={s.de}>
                <span className="text-muted-foreground">{s.de}</span>
                <span className="mx-1.5 text-border">→</span>
                <span className="font-medium text-foreground">{s.para}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="61–90 · Consistência">
          <p className="text-sm text-muted-foreground">Testar o novo comportamento sob estresse:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ESTRESSORES_90.map((e) => (
              <span key={e} className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                {e}
              </span>
            ))}
          </div>
          <p className="mt-4 text-sm italic text-muted-foreground">
            “O que faço quando meu sistema inteiro pede que eu volte ao comportamento antigo?”
          </p>
        </Panel>
      </div>

      <Panel className="mb-6" title="Prioridades dos primeiros 30 dias">
        <ol className="space-y-2 text-sm text-foreground">
          {PRIORIDADES_30.map((p, i) => (
            <li key={p}>
              {i + 1}. {p}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted-foreground">Não precisamos corrigir 18 padrões simultaneamente.</p>
      </Panel>

      <Panel className="mb-6" title="Plano semanal — 13 semanas">
        <ol className="divide-y divide-border">
          {SEMANAS.map((s) => (
            <li key={s.n} className="flex gap-4 py-3 first:pt-0 last:pb-0">
              <span className="w-8 shrink-0 text-sm font-semibold tabular-nums text-primary">S{s.n}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{s.foco}</p>
                <p className="text-sm text-muted-foreground">{s.objetivo}</p>
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Os padrões que estamos observando" subtitle="18 padrões funcionais. Observar, não rotular.">
        <Accordion type="single" collapsible className="w-full">
          {PADROES.map((p) => (
            <AccordionItem key={p.id} value={String(p.id)}>
              <AccordionTrigger className="text-left text-sm">
                <span>
                  <span className="mr-2 tabular-nums text-muted-foreground">{String(p.id).padStart(2, "0")}</span>
                  {p.titulo}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Flow
                  steps={[p.gatilho, p.pensamento, p.emocao, p.comportamento, p.alivio, p.consequencia]}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Panel>
    </div>
  );
}