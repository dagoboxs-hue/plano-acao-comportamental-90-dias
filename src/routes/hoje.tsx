import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Note, PageHeader, Panel } from "@/components/ui-bits";
import { SEMANAS } from "@/lib/content";
import { dayNumber, todayISO, useActions, useStore, weekNumber } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

export const Route = createFileRoute("/hoje")({
  head: () => ({
    meta: [
      { title: "Hoje — Plano de Ação Comportamental 90 dias" },
      { name: "description", content: "Check-in do dia, foco da semana, episódios e rotina mínima." },
      { property: "og:title", content: "Hoje — treino comportamental do dia" },
      { property: "og:description", content: "Hoje → foco da semana → episódio → pausa → escolha → registro." },
    ],
  }),
  component: Hoje,
});

function Hoje() {
  const { state } = useStore();
  const { setDay, setRotinaItems } = useActions();
  const date = todayISO();
  const dia = dayNumber(state.startDate);
  const semana = weekNumber(state.startDate);
  const foco = SEMANAS.find((s) => s.n === semana);
  const focoEscolhido = state.weeks[semana - 1]?.focoProxima?.trim();
  const day = state.days[date];
  const [novoItem, setNovoItem] = useState("");

  const checkin = day?.checkin ?? null;
  const rotina = day?.rotina ?? {};
  const feitos = state.rotinaItems.filter((i) => rotina[i]).length;

  return (
    <div>
      <PageHeader
        eyebrow={`Dia ${dia} / 90`}
        title="Hoje"
        description="Hoje → foco da semana → episódio → pausa → escolha → registro."
      />

      <Panel className="mb-5 border-primary/25 bg-primary-soft/60">
        <p className="eyebrow">Foco escolhido para esta semana</p>
        <p className="mt-2 text-lg font-medium text-foreground">{focoEscolhido || foco?.foco}</p>
        {focoEscolhido ? <p className="mt-2 text-xs text-muted-foreground">Tema da semana: {foco?.foco}</p> : null}
      </Panel>

      <Panel className="mb-5" title="Como estou agora?" subtitle="Escala de 0 a 10. Serve para observar, não para julgar.">
        <div className="flex items-center gap-5">
          <Slider
            value={[checkin ?? 0]}
            min={0}
            max={10}
            step={1}
            aria-label="Como estou agora, de 0 a 10"
            onValueChange={(v) => setDay(date, { checkin: v[0] ?? 0 })}
            className="flex-1"
          />
          <span className="w-12 shrink-0 text-right text-2xl font-semibold tabular-nums text-primary">
            {checkin ?? "—"}
          </span>
        </div>
      </Panel>

      <Panel className="mb-5" title="Houve algum episódio relevante hoje?">
        <div className="flex flex-wrap gap-3">
          <Button
            variant={day?.episodio === true ? "default" : "outline"}
            onClick={() => setDay(date, { episodio: true })}
          >
            Sim
          </Button>
          <Button
            variant={day?.episodio === false ? "default" : "outline"}
            onClick={() => setDay(date, { episodio: false })}
          >
            Não
          </Button>
        </div>
        {day?.episodio === true ? (
          <div className="mt-4">
            <Link to="/diario">
              <Button size="lg">Registrar incidente</Button>
            </Link>
          </div>
        ) : null}
        <div className="mt-4">
          <Link to="/ativado">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Estou ativado agora
            </Button>
          </Link>
        </div>
      </Panel>

      <Panel
        title="Rotina mínima de hoje"
        subtitle={`${feitos} de ${state.rotinaItems.length} concluídos.`}
      >
        <ul className="space-y-2">
          {state.rotinaItems.map((item) => (
            <li
              key={item}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors",
                rotina[item] && "bg-calm-soft/70",
              )}
            >
              <Checkbox
                id={`rotina-${item}`}
                checked={!!rotina[item]}
                onCheckedChange={(v) => setDay(date, { rotina: { ...rotina, [item]: !!v } })}
              />
              <label htmlFor={`rotina-${item}`} className="flex-1 cursor-pointer text-sm text-foreground">
                {item}
              </label>
              <button
                type="button"
                aria-label={`Remover ${item}`}
                className="text-muted-foreground transition-colors hover:text-destructive"
                onClick={() => setRotinaItems(state.rotinaItems.filter((i) => i !== item))}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>

        {state.rotinaItems.length < 5 ? (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const v = novoItem.trim();
              if (!v || state.rotinaItems.includes(v)) return;
              setRotinaItems([...state.rotinaItems, v]);
              setNovoItem("");
            }}
          >
            <Input
              value={novoItem}
              onChange={(e) => setNovoItem(e.target.value)}
              placeholder="Adicionar item (3 a 5 no total)"
              aria-label="Novo item da rotina mínima"
            />
            <Button type="submit" variant="secondary" className="gap-1.5">
              <Plus className="size-4" aria-hidden />
              Adicionar
            </Button>
          </form>
        ) : null}
      </Panel>

      <div className="mt-6">
        <Note>O painel mede comportamentos, não valor pessoal.</Note>
      </div>
    </div>
  );
}