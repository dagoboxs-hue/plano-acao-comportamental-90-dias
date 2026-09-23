import { createFileRoute, Link } from "@tanstack/react-router";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { SEMAFORO } from "@/lib/content";
import { useActions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const protocoloPorCategoria: Record<string, string> = {
  silencio: "Silêncio",
  limites: "Não",
  ajuda: "Solucionador",
  reparacao: "Reparação",
  mensagens: "Mensagens",
  culpa: "Culpa",
  rotina: "Rotina",
  futuro: "Futuro",
  privacidade: "Privacidade",
  psicologizacao: "Fato, interpretação e hipótese",
};

export const Route = createFileRoute("/semaforo")({
  head: () => ({
    meta: [
      { title: "Semáforo comportamental — Plano de 90 dias" },
      { name: "description", content: "Estado atual por categoria: verde, amarelo ou vermelho, com ação correspondente." },
      { property: "og:title", content: "Semáforo comportamental" },
      { property: "og:description", content: "Amarelo aplica protocolo. Vermelho interrompe a ação interpessoal." },
    ],
  }),
  component: Semaforo,
});

function Semaforo() {
  const { state } = useStore();
  const { setSemaforo } = useActions();

  return (
    <div>
      <PageHeader
        eyebrow="Estado atual"
        title="Semáforo comportamental"
        description="Marque o estado observado agora em cada categoria. Serve para decidir a próxima ação, não para avaliar você."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <Note tone="attention">🟡 Amarelo → aplicar protocolo.</Note>
        <Note tone="stop">
          🔴 Vermelho → interromper ação interpessoal e regular primeiro, salvo necessidade prática real.
        </Note>
      </div>

      <Panel>
        <ul className="divide-y divide-border">
          {SEMAFORO.map((cat) => {
            const atual = state.semaforo[cat.id];
            return (
              <li key={cat.id} className="py-4 first:pt-0 last:pb-0">
                <p className="text-sm font-semibold text-foreground">{cat.nome}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["verde", cat.verde, "🟢"],
                      ["amarelo", cat.amarelo, "🟡"],
                      ["vermelho", cat.vermelho, "🔴"],
                    ] as const
                  ).map(([key, texto, emoji]) => {
                    const ativo = atual === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={ativo}
                        onClick={() => setSemaforo(cat.id, key)}
                        className={cn(
                          "rounded-lg border px-3 py-3 text-left text-sm transition-colors",
                          !ativo && "border-border text-muted-foreground hover:bg-secondary",
                          ativo && key === "verde" && "border-calm bg-calm-soft text-calm",
                          ativo && key === "amarelo" && "border-attention bg-attention-soft text-attention-foreground",
                          ativo && key === "vermelho" && "border-stop bg-stop-soft text-stop",
                        )}
                      >
                        <span className="mr-1.5" aria-hidden>
                          {emoji}
                        </span>
                        {texto}
                      </button>
                    );
                  })}
                </div>
              {atual === "amarelo" ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-attention-soft px-3 py-3 text-sm text-attention-foreground">
                  <span>Aplicar protocolo recomendado: {protocoloPorCategoria[cat.id] ?? "modo guiado"}.</span>
                  <Link to="/protocolos" className="font-semibold underline underline-offset-4">Abrir protocolo</Link>
                </div>
              ) : null}
              {atual === "vermelho" ? (
                <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-stop-soft px-3 py-3 text-sm text-stop">
                  <span>Regular antes de agir.</span>
                  <Link to="/ativado" className="font-semibold underline underline-offset-4">REGULAR ANTES DE AGIR</Link>
                </div>
              ) : null}
              </li>
          );
          })}
        </ul>
      </Panel>
    </div>
  );
}