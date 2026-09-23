import { createFileRoute } from "@tanstack/react-router";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { TrendChart } from "@/components/trend-chart";
import { buildKpis } from "@/lib/kpis";
import { useStore } from "@/lib/store";
import { METRICAS_PROIBIDAS } from "@/lib/content";

export const Route = createFileRoute("/kpis")({
  head: () => ({
    meta: [
      { title: "KPIs — Painel de evolução comportamental" },
      { name: "description", content: "Dez indicadores com baseline, metas de 30, 60 e 90 dias e evolução semanal." },
      { property: "og:title", content: "KPIs do plano de 90 dias" },
      { property: "og:description", content: "Indicadores de comportamento próprio, nunca de reação alheia." },
    ],
  }),
  component: Kpis,
});

function Kpis() {
  const { state } = useStore();
  const kpis = buildKpis(state);

  return (
    <div>
      <PageHeader
        eyebrow="Painel de evolução"
        title="KPIs"
        description="Cada indicador mede um comportamento próprio e observável. Sem nota geral, sem ranking entre semanas."
      />

      <div className="grid gap-5">
        {kpis.map((k, i) => (
          <Panel key={k.id} title={`KPI ${i + 1} — ${k.nome}`} subtitle={k.descricao}>
            <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
              <div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="panel-quiet px-4 py-3">
                    <p className="eyebrow">Atual</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-primary">
                      {k.atual === null ? "—" : `${k.atual}${k.unidade === "%" ? "%" : ""}`}
                    </p>
                  </div>
                  <div className="panel-quiet px-4 py-3">
                    <p className="eyebrow">Baseline</p>
                    <p className="mt-1 text-2xl font-semibold tabular-nums text-muted-foreground">
                      {k.baseline === null ? "—" : `${k.baseline}${k.unidade === "%" ? "%" : ""}`}
                    </p>
                  </div>
                </div>
                <dl className="mt-3 grid gap-2 text-xs">
                  {(
                    [
                      ["Meta 30 dias", k.metas.d30],
                      ["Meta 60 dias", k.metas.d60],
                      ["Meta 90 dias", k.metas.d90],
                    ] as const
                  ).map(([label, v]) => (
                    <div key={label} className="flex justify-between gap-3 rounded-md bg-secondary px-3 py-2">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                {k.nota ? <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{k.nota}</p> : null}
              </div>
              <TrendChart
                data={k.serie.map((p) => ({ semana: p.semana, valor: p.valor }))}
                series={[{ key: "valor", label: k.nome }]}
                suffix={k.unidade === "%" ? "%" : ""}
                {...(k.unidade === "%" ? { domain: [0, 100] as [number, number] } : {})}
              />
            </div>
          </Panel>
        ))}
      </div>

      <Panel className="mt-8 border-stop/30" title="O que NÃO será usado para medir evolução">
        <ul className="grid gap-2 sm:grid-cols-2">
          {METRICAS_PROIBIDAS.map((m) => (
            <li key={m} className="rounded-md bg-stop-soft px-3 py-2 text-sm text-stop">
              {m}
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-3">
          <Note>
            Esses resultados dependem de outra pessoa e não podem funcionar como recompensa ou prova da mudança.
          </Note>
          <p className="text-sm font-semibold text-foreground">Mudança ≠ obter proximidade.</p>
        </div>
      </Panel>
    </div>
  );
}