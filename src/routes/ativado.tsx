import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Note } from "@/components/ui-bits";
import { pauseBandFromMinutes } from "@/lib/analytics";
import { useActions, useStore, type ActiveProtocolDraft } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/ativado")({
  head: () => ({
    meta: [
      { title: "Modo ativado agora — um passo por vez" },
      {
        name: "description",
        content: "Modo guiado de regulação: parar, nomear, separar, verificar necessidade, regular e reavaliar.",
      },
      { property: "og:title", content: "Modo ativado agora" },
      { property: "og:description", content: "Um passo por vez, entre sentir e agir." },
    ],
  }),
  component: ModoAtivado,
});

const EMOCOES = ["Ansiedade", "Medo", "Frustração", "Culpa", "Raiva", "Tristeza", "Urgência", "Outro"];

const REGULACOES = [
  "Andar 5 minutos",
  "Tomar banho",
  "Trabalhar",
  "Treinar",
  "Comer",
  "Arrumar algo",
  "Respirar lentamente",
  "Escrever",
  "Mudar de ambiente",
  "Retomar atividade planejada",
];

const TOTAL = 6;

type Form = {
  emocao: string;
  intensidadeInicial: number;
  intensidadeFinal: number;
  fato: string;
  interpretacao: string;
  hipoteses: string;
  necessidade: "acao" | "desconforto" | "";
  regulacao: string;
  reavaliacao: "sim" | "nao" | "";
};

const inicial: Form = {
  emocao: "",
  intensidadeInicial: 5,
  intensidadeFinal: 5,
  fato: "",
  interpretacao: "",
  hipoteses: "",
  necessidade: "",
  regulacao: "",
  reavaliacao: "",
};

function ModoAtivado() {
  const navigate = useNavigate();
  const { state } = useStore();
  const { logProtocolRun, setIncidentDraft, setActiveProtocolDraft, clearActiveProtocolDraft } = useActions();
  const [step, setStep] = useState(state.activeProtocolDraft?.step ?? 1);
  const [f, setF] = useState<Form>(() => ({ ...inicial, ...(state.activeProtocolDraft ?? {}) }));
  const [startedAt] = useState(state.activeProtocolDraft?.startedAt ?? new Date().toISOString());
  const [pauseStartedAt, setPauseStartedAt] = useState(state.activeProtocolDraft?.pauseStartedAt);
  const [pauseEndedAt, setPauseEndedAt] = useState(state.activeProtocolDraft?.pauseEndedAt);
  const [regulationStartedAt, setRegulationStartedAt] = useState(state.activeProtocolDraft?.regulationStartedAt);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    if (concluido) return;
    setActiveProtocolDraft({ ...f, step, startedAt, pauseStartedAt, pauseEndedAt, regulationStartedAt });
  }, [f, step, startedAt, pauseStartedAt, pauseEndedAt, regulationStartedAt, concluido, setActiveProtocolDraft]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, ...(k === "intensidadeInicial" && !p.intensidadeFinal ? { intensidadeFinal: v as number } : {}), [k]: v }));

  const concluir = () => {
    const ended = pauseEndedAt ?? new Date().toISOString();
    const durationMin = pauseStartedAt ? Math.max(0, Math.round((new Date(ended).getTime() - new Date(pauseStartedAt).getTime()) / 60000)) : null;
    logProtocolRun({
      protocolo: "Protocolo de ativação",
      emocao: f.emocao,
      intensidadeInicial: f.intensidadeInicial,
      intensidadeFinal: f.intensidadeFinal,
      fato: f.fato,
      interpretacao: f.interpretacao,
      hipoteses: f.hipoteses,
      necessidade: f.necessidade === "acao" ? "Ação prática necessária" : f.necessidade === "desconforto" ? "Desconforto sem urgência" : "",
      regulacao: f.regulacao,
      reavaliacao: f.reavaliacao === "sim" ? "Necessidade objetiva" : f.reavaliacao === "nao" ? "Voltei ao meu dia" : "",
      nota: "",
      pauseStartedAt,
      pauseEndedAt: pauseEndedAt ?? undefined,
      durationMin,
    });
    clearActiveProtocolDraft();
    setConcluido(true);
  };

  const salvarComoIncidente = () => {
    setIncidentDraft({
      fato: f.fato,
      interpretacao: f.interpretacao,
      emocao: f.emocao,
      intensidade: f.intensidadeInicial,
      oQueFiz: f.regulacao ? `Protocolo de ativação · ${f.regulacao}` : "Protocolo de ativação",
      aprendi: `Intensidade ${f.intensidadeInicial}/10 → ${f.intensidadeFinal}/10.`,
      ...(pauseStartedAt && pauseEndedAt
        ? { pausa: pauseBandFromMinutes(Math.max(0, (new Date(pauseEndedAt).getTime() - new Date(pauseStartedAt).getTime()) / 60000)) }
        : {}),
      ...(pauseStartedAt && pauseEndedAt
        ? { duracaoMin: Math.max(0, Math.round((new Date(pauseEndedAt).getTime() - new Date(pauseStartedAt).getTime()) / 60000)) }
        : {}),
    });
    void navigate({ to: "/diario" });
  };

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center gap-3 px-4 py-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Voltar ao passo anterior"
          disabled={step === 1 || concluido}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          <ArrowLeft className="size-5" />
        </Button>
        <p className="text-xs tabular-nums text-muted-foreground">
          {concluido ? "Protocolo concluído" : `${step} de ${TOTAL}`}
        </p>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Sair do modo ativado"
          className="ml-auto"
          onClick={() => void navigate({ to: "/protocolos" })}
        >
          <X className="size-5" />
        </Button>
      </header>

      <div className="px-4 sm:px-6">
        <div className="mx-auto h-1 w-full max-w-xl overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${(concluido ? TOTAL : step) * (100 / TOTAL)}%` }}
          />
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6 lg:flex-none lg:py-12">
        {concluido ? (
          <Final
            f={f}
            onIncidente={salvarComoIncidente}
            onSair={() => void navigate({ to: "/protocolos" })}
          />
        ) : (
          <div key={step} className="rise-in flex flex-1 flex-col">
            {step === 1 ? <Parar onNext={() => { const now = new Date().toISOString(); setPauseStartedAt(now); setStep(2); }} /> : null}
            {step === 2 ? <Nomear f={f} set={set} onNext={() => setStep(3)} /> : null}
            {step === 3 ? <Separar f={f} set={set} onNext={() => setStep(4)} /> : null}
            {step === 4 ? <Verificar f={f} set={set} onNext={() => setStep(5)} /> : null}
            {step === 5 ? <Regular f={f} set={set} onNext={() => { const now = new Date().toISOString(); setRegulationStartedAt(now); setPauseEndedAt(now); setStep(6); }} /> : null}
            {step === 6 ? <Reavaliar f={f} set={set} onConcluir={concluir} /> : null}
          </div>
        )}
      </main>
    </div>
  );
}

type SetFn = <K extends keyof Form>(k: K, v: Form[K]) => void;

function StepTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{title}</h1>
    </div>
  );
}

function Parar({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <p className="text-[3rem] font-semibold leading-none tracking-tight text-stop sm:text-[4rem]">PARE.</p>
      <div className="mt-8 space-y-1.5 text-lg text-foreground sm:text-xl">
        <p>Não envie.</p>
        <p>Não explique.</p>
        <p>Não investigue.</p>
        <p className="text-muted-foreground">Ainda.</p>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Salvo necessidade prática objetiva.</p>
      <Button
        size="lg"
        onClick={onNext}
        className="mt-10 h-14 w-full bg-stop text-base font-semibold text-stop-foreground hover:bg-stop/90"
      >
        PAREI
      </Button>
    </div>
  );
}

function Nomear({ f, set, onNext }: { f: Form; set: SetFn; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepTitle eyebrow="Passo 2 — Nomear" title="O que está acontecendo em você agora?" />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {EMOCOES.map((e) => (
          <button
            key={e}
            type="button"
            onClick={() => set("emocao", e)}
            className={cn(
              "rounded-xl border px-3 py-4 text-sm font-medium transition-colors",
              f.emocao === e
                ? "border-primary bg-primary-soft font-semibold text-foreground ring-1 ring-primary/30"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {e}
          </button>
        ))}
      </div>
      <div className="mt-8">
        <p className="mb-3 text-sm text-muted-foreground">
          Intensidade agora: <span className="font-semibold tabular-nums text-foreground">{f.intensidadeInicial}/10</span>
        </p>
        <Slider
          value={[f.intensidadeInicial]}
          min={0}
          max={10}
          step={1}
          aria-label="Intensidade de 0 a 10"
          onValueChange={(v) => set("intensidadeInicial", v[0] ?? 0)}
        />
      </div>
      <div className="mt-8">
        <Note>Isso é desconfortável. Não significa que exige ação imediata.</Note>
      </div>
      <Button size="lg" className="mt-auto h-13 w-full pt-0 text-base" onClick={onNext}>
        CONTINUAR
      </Button>
    </div>
  );
}

function Separar({ f, set, onNext }: { f: Form; set: SetFn; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepTitle eyebrow="Passo 3 — Separar" title="Fato, interpretação e hipóteses" />
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Fato</span>
          <span className="text-xs text-muted-foreground">O que aconteceu objetivamente?</span>
          <Textarea rows={2} value={f.fato} onChange={(e) => set("fato", e.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Interpretação</span>
          <span className="text-xs text-muted-foreground">O que minha mente concluiu?</span>
          <Textarea rows={2} value={f.interpretacao} onChange={(e) => set("interpretacao", e.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-foreground">Hipóteses</span>
          <span className="text-xs text-muted-foreground">Que outras explicações ainda são possíveis?</span>
          <Textarea rows={2} value={f.hipoteses} onChange={(e) => set("hipoteses", e.target.value)} />
        </label>
      </div>
      <Button size="lg" className="mt-8 h-13 w-full text-base" onClick={onNext}>
        CONTINUAR
      </Button>
    </div>
  );
}

function Verificar({ f, set, onNext }: { f: Form; set: SetFn; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepTitle eyebrow="Passo 4 — Verificar necessidade" title="Existe uma ação realmente necessária agora ou apenas desconforto querendo desaparecer?" />
      <div className="grid gap-3">
        <button
          type="button"
          onClick={() => set("necessidade", "acao")}
          className={cn(
            "rounded-2xl border px-5 py-6 text-left text-base font-semibold transition-colors",
            f.necessidade === "acao" ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary/40",
          )}
        >
          AÇÃO PRÁTICA NECESSÁRIA
        </button>
        <button
          type="button"
          onClick={() => set("necessidade", "desconforto")}
          className={cn(
            "rounded-2xl border px-5 py-6 text-left text-base font-semibold transition-colors",
            f.necessidade === "desconforto"
              ? "border-primary bg-primary-soft"
              : "border-border bg-surface hover:border-primary/40",
          )}
        >
          DESCONFORTO / SEM URGÊNCIA
        </button>
      </div>
      {f.necessidade === "acao" ? (
        <div className="mt-6">
          <Note tone="attention">Faça somente a ação objetiva necessária. Sem rodada extra de explicação.</Note>
        </div>
      ) : null}
      {f.necessidade === "desconforto" ? (
        <div className="mt-6">
          <Note tone="calm">Nenhuma ação interpessoal agora. Regule primeiro.</Note>
        </div>
      ) : null}
      <Button size="lg" className="mt-auto h-13 w-full text-base lg:mt-10" disabled={!f.necessidade} onClick={onNext}>
        CONTINUAR
      </Button>
    </div>
  );
}

function Regular({ f, set, onNext }: { f: Form; set: SetFn; onNext: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepTitle eyebrow="Passo 5 — Regular" title="O que vou fazer agora?" />
      <div className="grid gap-2 sm:grid-cols-2">
        {REGULACOES.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => set("regulacao", r)}
            className={cn(
              "rounded-xl border px-4 py-4 text-left text-sm font-medium transition-colors",
              f.regulacao === r
                ? "border-calm bg-calm-soft font-semibold text-foreground ring-1 ring-calm/40"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {r}
          </button>
        ))}
      </div>
      {f.regulacao ? (
        <div className="mt-6">
          <Note tone="calm">Vou fazer isso agora: {f.regulacao.toLowerCase()}.</Note>
        </div>
      ) : null}
      <Button size="lg" className="mt-auto h-13 w-full text-base lg:mt-10" disabled={!f.regulacao} onClick={onNext}>
        REAVALIAR
      </Button>
    </div>
  );
}

function Reavaliar({ f, set, onConcluir }: { f: Form; set: SetFn; onConcluir: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <StepTitle eyebrow="Passo 6 — Reavaliar" title="Qual a intensidade agora?" />
      <Slider
        value={[f.intensidadeFinal]}
        min={0}
        max={10}
        step={1}
        aria-label="Intensidade agora, de 0 a 10"
        onValueChange={(v) => set("intensidadeFinal", v[0] ?? 0)}
      />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="panel-quiet px-4 py-3">
          <p className="eyebrow">Intensidade inicial</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{f.intensidadeInicial}/10</p>
        </div>
        <div className="panel-quiet px-4 py-3">
          <p className="eyebrow">Intensidade agora</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{f.intensidadeFinal}/10</p>
        </div>
      </div>

      <p className="mt-8 text-base font-medium text-foreground">A ação ainda parece necessária?</p>
      <div className="mt-3 grid gap-3">
        <button
          type="button"
          onClick={() => set("reavaliacao", "sim")}
          className={cn(
            "rounded-2xl border px-5 py-5 text-left text-sm font-semibold transition-colors",
            f.reavaliacao === "sim" ? "border-primary bg-primary-soft" : "border-border bg-surface hover:border-primary/40",
          )}
        >
          SIM, EXISTE UMA NECESSIDADE OBJETIVA
        </button>
        <button
          type="button"
          onClick={() => set("reavaliacao", "nao")}
          className={cn(
            "rounded-2xl border px-5 py-5 text-left text-sm font-semibold transition-colors",
            f.reavaliacao === "nao" ? "border-calm bg-calm-soft" : "border-border bg-surface hover:border-calm/50",
          )}
        >
          NÃO, POSSO VOLTAR AO MEU DIA
        </button>
      </div>

      <div className="mt-8">
        <Note>Criar espaço entre sentir e agir já é parte do treino.</Note>
      </div>
      <Button size="lg" className="mt-6 h-13 w-full text-base" disabled={!f.reavaliacao} onClick={onConcluir}>
        CONCLUIR PROTOCOLO
      </Button>
    </div>
  );
}

function Final({ f, onIncidente, onSair }: { f: Form; onIncidente: () => void; onSair: () => void }) {
  return (
    <div className="rise-in flex flex-1 flex-col justify-center">
      <p className="eyebrow">Protocolo registrado</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Criar espaço entre sentir e agir já é parte do treino.
      </h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="panel-quiet px-4 py-3">
          <p className="eyebrow">Intensidade inicial</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{f.intensidadeInicial}/10</p>
        </div>
        <div className="panel-quiet px-4 py-3">
          <p className="eyebrow">Intensidade final</p>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{f.intensidadeFinal}/10</p>
        </div>
      </div>
      <div className="mt-8 grid gap-3">
        <Button
          size="lg"
          className="h-13 text-base"
          onClick={() => {
            toast.success("Dados levados para o diário.");
            onIncidente();
          }}
        >
          SALVAR COMO INCIDENTE
        </Button>
        <Button size="lg" variant="outline" className="h-13 text-base" onClick={onSair}>
          Voltar ao meu dia
        </Button>
      </div>
    </div>
  );
}