import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, Note, PageHeader, Panel } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TEMAS_TERAPIA } from "@/lib/content";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/terapia")({
  head: () => ({
    meta: [
      { title: "O que vale levar para terapia — Plano de 90 dias" },
      { name: "description", content: "Temas de trabalho terapêutico e episódios marcados para levar à sessão." },
      { property: "og:title", content: "O que vale levar para terapia" },
      { property: "og:description", content: "Temas de observação, sem diagnóstico e sem rótulo." },
    ],
  }),
  component: Terapia,
});

function Terapia() {
  const { state } = useStore();
  const marcados = state.incidents.filter((i) => i.terapia);
  const resumo = [
    "RESUMO PARA A PRÓXIMA SESSÃO",
    `Episódios selecionados: ${marcados.length}`,
    `Categorias: ${[...new Set(marcados.map((i) => i.categoria))].join(", ") || "Ainda não registrados"}`,
    `Intensidades: ${marcados.map((i) => `${i.intensidade}/10`).join(", ") || "Ainda não registradas"}`,
    `Fatos: ${marcados.map((i) => i.fato).filter(Boolean).join(" | ") || "Ainda não registrados"}`,
    `Interpretações: ${marcados.map((i) => i.interpretacao).filter(Boolean).join(" | ") || "Ainda não registradas"}`,
    `O que foi feito: ${marcados.map((i) => i.oQueFiz).filter(Boolean).join(" | ") || "Ainda não registrado"}`,
    `O que pareceu ajudar: ${marcados.map((i) => i.aprendi).filter(Boolean).join(" | ") || "Ainda não registrado"}`,
    `Questões registradas: ${marcados.map((i) => i.testar).filter(Boolean).join(" | ") || "Ainda não registradas"}`,
  ].join("\n");

  return (
    <div>
      <PageHeader
        eyebrow="Trabalho terapêutico"
        title="O que vale levar para terapia"
        description="Temas para investigar com acompanhamento profissional. Nada aqui é diagnóstico."
      />

      <Panel className="mb-6" title="Temas">
        <ul className="grid gap-2 sm:grid-cols-2">
          {TEMAS_TERAPIA.map((t) => (
            <li key={t} className="panel-quiet px-4 py-3 text-sm text-foreground">
              {t}
            </li>
          ))}
        </ul>
      </Panel>

      <Panel className="mb-6" title="Resumo para a próxima sessão" subtitle="Somente episódios marcados para levar à terapia; sem diagnóstico ou interpretação adicional.">
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{resumo}</pre>
        <Button className="mt-4" onClick={() => void navigator.clipboard?.writeText(resumo)}>COPIAR RESUMO</Button>
      </Panel>

      <Panel title={`Episódios marcados (${marcados.length})`}>
        {marcados.length === 0 ? (
          <EmptyState
            title="Nenhum episódio marcado"
            description="No diário, marque “Levar para terapia” em um episódio para que ele apareça aqui."
          />
        ) : (
          <ul className="space-y-3">
            {marcados.map((i) => (
              <li key={i.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{i.categoria}</Badge>
                  <span className="text-xs text-muted-foreground">{i.date}</span>
                  <span className="text-xs text-muted-foreground">Intensidade {i.intensidade}/10</span>
                </div>
                {i.situacao ? <p className="mt-2 text-sm text-foreground">{i.situacao}</p> : null}
                {i.aprendi ? <p className="mt-1 text-sm text-muted-foreground">Aprendizado: {i.aprendi}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-6">
        <Note>
          Em caso de sofrimento intenso ou risco pessoal, procure ajuda profissional ou um serviço de emergência.
        </Note>
      </div>
    </div>
  );
}