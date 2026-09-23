import { createFileRoute } from "@tanstack/react-router";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { RECAIDAS } from "@/lib/content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/recaidas")({
  head: () => ({
    meta: [
      { title: "Prevenção de recaída — sinais e ações" },
      { name: "description", content: "Sinais de volta ao automático e a ação correspondente para cada um." },
      { property: "og:title", content: "Sinais de que estou voltando ao automático" },
      { property: "og:description", content: "Um episódio isolado não define a tendência." },
    ],
  }),
  component: Recaidas,
});

function Recaidas() {
  return (
    <div>
      <PageHeader
        eyebrow="Prevenção"
        title="Sinais de que estou voltando ao automático"
        description="Cada sinal tem uma ação correspondente. Reconhecer cedo é o que mantém a escolha disponível."
      />

      <Panel>
        <ul className="divide-y divide-border">
          {RECAIDAS.map((r) => (
            <li key={r.sinal} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-2 sm:items-center sm:gap-6">
              <p className="text-sm text-foreground">{r.sinal}</p>
              <p
                className={cn(
                  "rounded-lg px-3 py-2 text-sm",
                  r.vermelho ? "bg-stop-soft font-medium text-stop" : "bg-secondary text-secondary-foreground",
                )}
              >
                {r.acao}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="mt-6">
        <Note>Um episódio isolado não define a tendência.</Note>
      </div>
    </div>
  );
}