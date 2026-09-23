import { createFileRoute } from "@tanstack/react-router";
import { Textarea } from "@/components/ui/textarea";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { TrendChart } from "@/components/trend-chart";
import { CRITERIOS_EVOLUCAO, PERGUNTAS_FECHAMENTO } from "@/lib/content";
import { buildKpis, episodeSerie, scorecardSerie } from "@/lib/kpis";
import { dayNumber, useActions, useStore } from "@/lib/store";

export const Route = createFileRoute("/evolucao")({
  head: () => ({
    meta: [
      { title: "Evolução real — frequência, intensidade, duração e recuperação" },
      { name: "description", content: "Tendências ao longo das 13 semanas, sem ranking e sem depender da reação de ninguém." },
      { property: "og:title", content: "Evolução real" },
      { property: "og:description", content: "Menos frequência, menor intensidade, menor duração, recuperação mais rápida." },
    ],
  }),
  component: Evolucao,
});

function Evolucao() {
  const { state } = useStore();
  const { setFechamento } = useActions();
  const kpis = buildKpis(state);
  const ep = episodeSerie(state);
  const dia = dayNumber(state.startDate);

  const serieDe = (id: string) =>
    kpis.find((k) => k.id === id)!.serie.map((p) => ({ semana: p.semana, valor: p.valor }));

  const graficos: { titulo: string; id: string; pct: boolean }[] = [
    { titulo: "Limites respeitados", id: "limites", pct: true },
    { titulo: "Mensagens impulsivas", id: "mensagens", pct: false },
    { titulo: "Pausa antes de agir", id: "pausa", pct: true },
    { titulo: "A+B versus C", id: "autonomia", pct: true },
    { titulo: "Compromissos cumpridos", id: "compromissos", pct: true },
    { titulo: "Reparações curtas", id: "reparacao", pct: true },
    { titulo: "Psicologizações", id: "psicologizacoes", pct: false },
    { titulo: "Escaladas para DR", id: "dr", pct: false },
  ];

  return (
    <div>
      <PageHeader
        eyebrow="Tendências"
        title="Como reconhecer mudança sem depender da reação de ninguém?"
        description="Séries temporais ao longo das 13 semanas. Sem ranking entre semanas, sem nota geral."
      />

      <Panel className="mb-6" title="Critérios observáveis">
        <ul className="grid gap-2 sm:grid-cols-2">
          {CRITERIOS_EVOLUCAO.map((c) => (
            <li key={c} className="panel-quiet px-4 py-2.5 text-sm text-foreground">
              {c}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {(
          [
            ["Frequência de episódios", "frequencia"],
            ["Intensidade média", "intensidade"],
            ["Duração média (min)", "duracao"],
            ["Tempo de recuperação (min)", "recuperacao"],
          ] as const
        ).map(([titulo, key]) => (
          <Panel key={key} title={titulo}>
            <TrendChart
              data={ep.map((p) => ({ semana: p.semana, valor: p[key] }))}
              series={[{ key: "valor", label: titulo }]}
            />
          </Panel>
        ))}
      </div>

      <Note>
        A evidência mais forte é: menos frequência + menor intensidade + menor duração + recuperação mais rápida.
      </Note>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {graficos.map((g) => (
          <Panel key={g.id} title={g.titulo}>
            <TrendChart
              data={serieDe(g.id)}
              series={[{ key: "valor", label: g.titulo }]}
              suffix={g.pct ? "%" : ""}
              {...(g.pct ? { domain: [0, 100] as [number, number] } : {})}
            />
          </Panel>
        ))}
        <Panel title="Scorecard semanal">
          <TrendChart
            data={scorecardSerie(state).map((p) => ({ semana: p.semana, valor: p.valor }))}
            series={[{ key: "valor", label: "Scorecard" }]}
            domain={[0, 20]}
          />
        </Panel>
      </div>

      <Panel className="mt-8" title="Fechamento dos 90 dias" subtitle="Comparação de tendências entre baseline, 30, 60 e 90 dias.">
        {dia < 90 ? (
          <p className="mb-5 text-sm text-muted-foreground">
            Você está no dia {dia}. As perguntas já ficam disponíveis — as respostas podem ser ajustadas até o fim do
            ciclo.
          </p>
        ) : null}
        <div className="grid gap-4">
          {PERGUNTAS_FECHAMENTO.map((q) => (
            <label key={q} className="grid gap-2">
              <span className="text-xs text-muted-foreground">{q}</span>
              <Textarea
                rows={2}
                value={state.fechamento[q] ?? ""}
                onChange={(e) => setFechamento(q, e.target.value)}
              />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  );
}