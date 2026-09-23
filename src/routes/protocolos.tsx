import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Flow, Note, PageHeader, Panel } from "@/components/ui-bits";
import { painelVazio, useActions, useStore, weekNumber } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/protocolos")({
  head: () => ({
    meta: [
      { title: "Protocolos — Estou ativado. O que faço agora?" },
      { name: "description", content: "Protocolos de ativação, do não, do silêncio, do solucionador e de reparação." },
      { property: "og:title", content: "Protocolos de regulação" },
      { property: "og:description", content: "Parar, nomear, separar, verificar necessidade e regular." },
    ],
  }),
  component: Protocolos,
});

const LISTA = [
  { id: "ativacao", nome: "Ativação" },
  { id: "nao", nome: "Do “não”" },
  { id: "silencio", nome: "Do silêncio" },
  { id: "solucionador", nome: "Do solucionador" },
  { id: "reparacao", nome: "De reparação" },
] as const;

function Protocolos() {
  const [ativo, setAtivo] = useState<string>("ativacao");

  return (
    <div>
      <PageHeader
        eyebrow="Biblioteca"
        title="Protocolos"
        description="Consulta dos cinco protocolos. Abrir um protocolo aqui não registra uso."
      />

      <Link to="/ativado" className="mb-7 block">
        <div className="panel flex flex-col gap-4 border-stop/30 bg-stop-soft px-5 py-6 transition-shadow hover:shadow-lift sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-stop">Momento de ativação</p>
            <p className="mt-1.5 text-lg font-semibold text-foreground">Estou ativado agora</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Modo guiado, um passo por vez: parar, nomear, separar, verificar, regular, reavaliar.
            </p>
          </div>
          <Button size="lg" className="gap-2 bg-stop text-stop-foreground hover:bg-stop/90">
            <Activity className="size-4" aria-hidden />
            ENTRAR NO MODO GUIADO
          </Button>
        </div>
      </Link>

      <div className="mb-6 flex flex-wrap gap-2">
        {LISTA.map((p) => (
          <Button
            key={p.id}
            type="button"
            size="sm"
            variant={ativo === p.id ? "default" : "outline"}
            onClick={() => setAtivo(p.id)}
          >
            {p.nome}
          </Button>
        ))}
      </div>

      {ativo === "ativacao" ? <Ativacao /> : null}
      {ativo === "nao" ? <ProtocoloNao /> : null}
      {ativo === "silencio" ? <Silencio /> : null}
      {ativo === "solucionador" ? <Solucionador /> : null}
      {ativo === "reparacao" ? <Reparacao /> : null}
    </div>
  );
}

function Passo({ n, titulo, children }: { n: number; titulo: string; children?: React.ReactNode }) {
  return (
    <div className="border-l-2 border-primary/30 pl-4">
      <p className="text-sm font-semibold text-foreground">
        {n}. {titulo}
      </p>
      {children ? <div className="mt-2 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

function Ativacao() {
  return (
    <Panel title="Protocolo de ativação" className="rise-in">
      <div className="space-y-5">
        <Passo n={1} titulo="Parar">
          Nenhuma mensagem, explicação, decisão ou investigação por alguns minutos, salvo urgência objetiva.
        </Passo>
        <Passo n={2} titulo="Nomear">
          “Estou ativado. Estou sentindo ansiedade / medo / frustração. Isso não exige ação imediata.”
        </Passo>
        <Passo n={3} titulo="Separar">
          Fato · Interpretação · Hipóteses · Sentimento · Intensidade.
        </Passo>
        <Passo n={4} titulo="Verificar necessidade">
          Existe uma ação necessária agora ou apenas desconforto querendo desaparecer?
        </Passo>
        <Passo n={5} titulo="Regular">
          Andar, banho, trabalhar, treinar, comer, arrumar algo, respirar lentamente, escrever, mudar de ambiente,
          retomar a atividade planejada. Depois: reavaliar.
        </Passo>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to="/ativado">
          <Button className="gap-2">
            <Activity className="size-4" aria-hidden />
            Executar passo a passo
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">O registro só acontece ao concluir o protocolo.</p>
      </div>
    </Panel>
  );
}

function ProtocoloNao() {
  return (
    <Panel title="Protocolo do “não”" className="rise-in">
      <p className="text-sm text-muted-foreground">
        Ao receber “não”, “agora não”, “depois”, “quero ficar sozinho”, “te aviso”, “não quero conversar”:
      </p>
      <div className="mt-4 space-y-4">
        <Passo n={1} titulo="Pare de argumentar." />
        <Passo n={2} titulo="Traduza literalmente">A pessoa colocou um limite.</Passo>
        <Passo n={3} titulo="Não faça rodada extra." />
        <Passo n={4} titulo="Responda proporcionalmente">
          “Tudo bem.” · “Entendi.” · “Ok, te deixo à vontade.”
        </Passo>
        <Passo n={5} titulo="Regule o desconforto fora da interação." />
      </div>
      <div className="mt-5">
        <Note>Não preciso concordar emocionalmente para respeitar comportamentalmente.</Note>
      </div>
    </Panel>
  );
}

function Silencio() {
  const { logProtocolRun } = useActions();
  const [f, setF] = useState({ contexto: "", conclusao: "", outras: "" });
  return (
    <Panel title="Ausência de informação não é informação negativa." className="rise-in">
      <div className="grid gap-4">
        <div className="panel-quiet px-4 py-3">
          <p className="eyebrow">Fato</p>
          <p className="mt-1 text-sm text-foreground">Ainda não houve resposta.</p>
        </div>
        <label className="grid gap-2">
          <span className="text-xs text-muted-foreground">Contexto objetivo (opcional)</span>
          <Input
            value={f.contexto}
            onChange={(e) => setF({ ...f, contexto: e.target.value })}
            placeholder="ex.: dia de trabalho, viagem, combinamos falar depois"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs text-muted-foreground">Que conclusão minha mente criou a partir disso?</span>
          <Textarea rows={2} value={f.conclusao} onChange={(e) => setF({ ...f, conclusao: e.target.value })} />
        </label>
        <label className="grid gap-2">
          <span className="text-xs text-muted-foreground">Que outras explicações ainda são possíveis?</span>
          <Textarea rows={3} value={f.outras} onChange={(e) => setF({ ...f, outras: e.target.value })} />
        </label>
      </div>
      <div className="mt-5 space-y-3">
        <Note tone="attention">
          Lembrete: não monitorar repetidamente status, visualizações, redes sociais, última conexão ou sinais indiretos.
        </Note>
        <Note>Enquanto não houver informação nova, sigo o plano do meu dia.</Note>
        <Button
          onClick={() => {
            logProtocolRun({
              protocolo: "Protocolo do silêncio",
              emocao: "",
              intensidadeInicial: null,
              intensidadeFinal: null,
              fato: `Ainda não houve resposta.${f.contexto ? ` Contexto: ${f.contexto}` : ""}`,
              interpretacao: f.conclusao,
              hipoteses: f.outras,
              necessidade: "",
              regulacao: "",
              reavaliacao: "",
              nota: "",
            });
            toast.success("Protocolo registrado.");
          }}
        >
          Concluir protocolo
        </Button>
      </div>
    </Panel>
  );
}

const OPCOES_SOLUCIONADOR = [
  ["A", "Escuta", "Sua tarefa agora é ouvir."],
  ["B", "Opinião", "A pessoa pediu para saber o que você pensa?"],
  ["C", "Ajuda prática", "Existe algo concreto que foi solicitado?"],
  ["D", "Solução", "A pessoa pediu para pensar em soluções?"],
  ["E", "Companhia", "Talvez não seja necessário resolver nada."],
] as const;

function Solucionador() {
  const { state } = useStore();
  const { logProtocolRun, setWeek } = useActions();
  const [sel, setSel] = useState<string | null>(null);
  const semana = weekNumber(state.startDate) || 1;

  const registrar = (consentida: boolean) => {
    const painel = state.weeks[semana]?.painel ?? painelVazio;
    setWeek(semana, {
      painel: {
        ...painel,
        ajudaTentativas: painel.ajudaTentativas + 1,
        ajudaConsentida: painel.ajudaConsentida + (consentida ? 1 : 0),
      },
    });
    logProtocolRun({
      protocolo: "Protocolo do solucionador",
      emocao: "",
      intensidadeInicial: null,
      intensidadeFinal: null,
      fato: "",
      interpretacao: "",
      hipoteses: "",
      necessidade: sel ? OPCOES_SOLUCIONADOR.find((o) => o[0] === sel)?.[1] ?? "" : "",
      regulacao: "",
      reavaliacao: consentida ? "Ajuda com consentimento" : "Sem consentimento explícito",
      nota: "",
    });
    toast.success(consentida ? "Registrado como ajuda com consentimento." : "Episódio registrado.");
  };

  return (
    <Panel title="O que essa pessoa precisa de mim?" className="rise-in">
      <div className="grid gap-2 sm:grid-cols-2">
        {OPCOES_SOLUCIONADOR.map(([k, t]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSel(k)}
            className={cn(
              "rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-colors",
              sel === k ? "border-primary bg-primary-soft text-foreground" : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {k} — {t.toUpperCase()}
          </button>
        ))}
      </div>
      {sel ? (
        <div className="mt-5">
          <Note tone="calm">{OPCOES_SOLUCIONADOR.find((o) => o[0] === sel)?.[2]}</Note>
        </div>
      ) : null}
      <div className="mt-5 space-y-3">
        <Note>Frase padrão: “Você quer que eu só escute ou quer alguma ajuda?”</Note>
        <Note tone="calm">Se a resposta for “só queria contar”, sua tarefa acabou.</Note>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => registrar(true)}>Houve consentimento explícito</Button>
        <Button variant="outline" onClick={() => registrar(false)}>
          Não houve pedido
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        O registro alimenta o KPI “Ajuda com consentimento” da semana {semana}.
      </p>
    </Panel>
  );
}

function Reparacao() {
  const { logProtocolRun } = useActions();
  const [f, setF] = useState({ fiz: "", reconheco: "", reparacao: "", diferente: "" });
  const previa = [
    f.fiz ? `${f.fiz}` : "",
    f.reconheco ? `${f.reconheco}` : "",
    f.reparacao ? `${f.reparacao}` : "",
    f.diferente ? `${f.diferente}` : "",
  ].filter(Boolean);

  return (
    <Panel title="Protocolo de reparação" className="rise-in">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3">Reparação curta</p>
          <Flow steps={["Erro", "Reconhecimento", "Responsabilidade", "Reparação", "Comportamento novo"]} tone="calm" />
        </div>
        <div>
          <p className="eyebrow mb-3">Reparação longa</p>
          <Flow steps={["Erro", "Culpa", "Textão", "Promessa", "Busca de tranquilização"]} tone="stop" />
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {(
          [
            ["fiz", "1. Reconheço o que fiz"],
            ["reconheco", "2. Reconheço o limite ou efeito"],
            ["reparacao", "3. Digo a reparação ou ação concreta"],
            ["diferente", "4. Encerro sem exigir tranquilização"],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="grid gap-2">
            <span className="text-xs text-muted-foreground">{label}</span>
            <Textarea rows={2} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
          </label>
        ))}
      </div>

      <div className="mt-6">
        <p className="eyebrow mb-2">Prévia da reparação curta</p>
        <div className="panel-quiet px-4 py-4">
          {previa.length ? (
            <div className="space-y-1.5">
              {previa.map((linha, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground">
                  {linha}
                </p>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Exemplo: “Eu continuei insistindo depois que você disse que não queria conversar. Isso desrespeitou o
              limite que você colocou. Vou encerrar o assunto agora.”
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <Note tone="attention">
          Se você ainda está ativado, guarde como rascunho. Enviar agora costuma virar rodada extra.
        </Note>
        <div className="flex flex-wrap gap-2">
          <Button
            disabled={!previa.length}
            onClick={() => {
              logProtocolRun({
                protocolo: "Protocolo de reparação",
                emocao: "",
                intensidadeInicial: null,
                intensidadeFinal: null,
                fato: f.fiz,
                interpretacao: f.reconheco,
                hipoteses: "",
                necessidade: f.reparacao,
                regulacao: "",
                reavaliacao: f.diferente,
                nota: previa.join(" "),
              });
              toast.success("Rascunho salvo nos seus dados.");
            }}
          >
            Salvar como rascunho
          </Button>
          <Button
            variant="secondary"
            disabled={!previa.length}
            onClick={() => {
              void navigator.clipboard?.writeText(previa.join(" "));
              toast.success("Reparação copiada.");
            }}
          >
            Copiar
          </Button>
        </div>
      </div>
    </Panel>
  );
}