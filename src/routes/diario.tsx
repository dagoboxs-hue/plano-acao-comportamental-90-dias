import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { EmptyState, Note, PageHeader, Panel } from "@/components/ui-bits";
import { CATEGORIAS_INCIDENTE, FAIXAS_PAUSA, type FaixaPausa } from "@/lib/content";
import { todayISO, useActions, useStore, type Autonomia, type Incident } from "@/lib/store";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Diário de incidentes — Plano de 90 dias" },
      { name: "description", content: "Registro de episódios em 2 a 3 minutos: fato, interpretação, impulso e escolha." },
      { property: "og:title", content: "Diário de incidentes" },
      { property: "og:description", content: "Episódio registrado, padrão observado, ajuste possível." },
    ],
  }),
  component: Diario,
});

const vazio = (): Omit<Incident, "id" | "createdAt"> => ({
  date: todayISO(),
  situacao: "",
  fato: "",
  interpretacao: "",
  emocao: "",
  intensidade: 5,
  corpo: "",
  impulso: "",
  oQueFiz: "",
  pausa: "<5 min",
  duracaoMin: 30,
  recuperacaoMin: 60,
  consequencia: "",
  poderia: "",
  aprendi: "",
  testar: "",
  categoria: "Outro",
  autonomia: "A",
  terapia: false,
});

function Diario() {
  const { state } = useStore();
  const { addIncident, updateIncident, removeIncident, setIncidentDraft } = useActions();
  const [form, setForm] = useState(vazio());
  const draft = state.incidentDraft;

  useEffect(() => {
    if (!draft) return;
    setForm((f) => ({ ...f, ...draft }));
    setIncidentDraft(null);
  }, [draft, setIncidentDraft]);
  const [filtro, setFiltro] = useState<string>("Todas");

  const lista = useMemo(
    () => (filtro === "Todas" ? state.incidents : state.incidents.filter((i) => i.categoria === filtro)),
    [state.incidents, filtro],
  );

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <PageHeader
        eyebrow="Registro"
        title="Diário de incidentes"
        description="Dois a três minutos por episódio. Episódio registrado é dado, não julgamento."
      />

      <Panel className="mb-6" title="Novo registro">
        <form
          className="grid gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            addIncident({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
            setForm(vazio());
            toast.success("Episódio registrado.");
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data">
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
            </Field>
            <Field label="Categoria">
              <Select value={form.categoria} onValueChange={(v) => set("categoria", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIAS_INCIDENTE.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field label="Situação">
            <Textarea
              value={form.situacao}
              onChange={(e) => set("situacao", e.target.value)}
              placeholder="O que aconteceu, em uma ou duas linhas."
              rows={2}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Fato observável">
              <Textarea value={form.fato} onChange={(e) => set("fato", e.target.value)} rows={2} />
            </Field>
            <Field label="Interpretação automática">
              <Textarea value={form.interpretacao} onChange={(e) => set("interpretacao", e.target.value)} rows={2} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Emoção">
              <Input value={form.emocao} onChange={(e) => set("emocao", e.target.value)} />
            </Field>
            <Field label="Sensação corporal">
              <Input value={form.corpo} onChange={(e) => set("corpo", e.target.value)} />
            </Field>
          </div>

          <Field label={`Intensidade: ${form.intensidade}/10`}>
            <Slider
              value={[form.intensidade]}
              min={0}
              max={10}
              step={1}
              onValueChange={(v) => set("intensidade", v[0] ?? 0)}
              aria-label="Intensidade de 0 a 10"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Impulso">
              <Input value={form.impulso} onChange={(e) => set("impulso", e.target.value)} />
            </Field>
            <Field label="O que fiz">
              <Input value={form.oQueFiz} onChange={(e) => set("oQueFiz", e.target.value)} />
            </Field>
          </div>

          <Group label="Tempo entre impulso e ação">
            <div className="flex flex-wrap gap-2">
              {FAIXAS_PAUSA.map((f) => (
                <Button
                  key={f}
                  type="button"
                  size="sm"
                  variant={form.pausa === f ? "default" : "outline"}
                  onClick={() => set("pausa", f as FaixaPausa)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </Group>

          <Group label="Autonomia neste episódio">
            <div className="grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["A", "Regulei sozinho"],
                  ["B", "Busquei apoio saudável independente"],
                  ["C", "Procurei imediatamente a pessoa envolvida"],
                ] as const
              ).map(([k, d]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => set("autonomia", k as Autonomia)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    form.autonomia === k
                      ? "border-primary bg-primary-soft text-accent-foreground"
                      : "border-border text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span className="font-semibold">{k}</span> — {d}
                </button>
              ))}
            </div>
          </Group>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Duração do episódio (min)">
              <Input
                type="number"
                min={0}
                value={form.duracaoMin}
                onChange={(e) => set("duracaoMin", Number(e.target.value))}
              />
            </Field>
            <Field label="Tempo até recuperar (min)">
              <Input
                type="number"
                min={0}
                value={form.recuperacaoMin}
                onChange={(e) => set("recuperacaoMin", Number(e.target.value))}
              />
            </Field>
          </div>

          <Field label="Consequência">
            <Textarea value={form.consequencia} onChange={(e) => set("consequencia", e.target.value)} rows={2} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="O que poderia ter feito">
              <Textarea value={form.poderia} onChange={(e) => set("poderia", e.target.value)} rows={2} />
            </Field>
            <Field label="O que aprendi">
              <Textarea value={form.aprendi} onChange={(e) => set("aprendi", e.target.value)} rows={2} />
            </Field>
          </div>
          <Field label="Qual comportamento testar da próxima vez">
            <Textarea value={form.testar} onChange={(e) => set("testar", e.target.value)} rows={2} />
          </Field>

          <label className="flex items-center gap-3 rounded-lg border border-border px-4 py-3 text-sm">
            <Checkbox checked={form.terapia} onCheckedChange={(v) => set("terapia", !!v)} />
            Levar para terapia
          </label>

          <div>
            <Button type="submit" size="lg">
              Salvar episódio
            </Button>
          </div>
        </form>
      </Panel>

      <Panel
        title={`Episódios registrados (${state.incidents.length})`}
        action={
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todas">Todas</SelectItem>
              {CATEGORIAS_INCIDENTE.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        {lista.length === 0 ? (
          <EmptyState
            title="Nenhum episódio registrado ainda"
            description="Registros aparecem aqui assim que você salvar o primeiro. Dados ainda insuficientes para observar padrões."
          />
        ) : (
          <ul className="space-y-3">
            {lista.map((i) => (
              <li key={i.id} className="rounded-xl border border-border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{i.categoria}</Badge>
                  <Badge variant="outline">Pausa {i.pausa}</Badge>
                  <Badge variant="outline">Autonomia {i.autonomia}</Badge>
                  <span className="text-xs text-muted-foreground">{i.date}</span>
                  <span className="text-xs text-muted-foreground">Intensidade {i.intensidade}/10</span>
                  <button
                    type="button"
                    className="ml-auto text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Remover episódio"
                    onClick={() => removeIncident(i.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                {i.situacao ? <p className="mt-3 text-sm text-foreground">{i.situacao}</p> : null}
                {i.fato ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Fato:</span> {i.fato}
                  </p>
                ) : null}
                {i.interpretacao ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Interpretação:</span> {i.interpretacao}
                  </p>
                ) : null}
                <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <Checkbox
                    checked={i.terapia}
                    onCheckedChange={(v) => updateIncident(i.id, { terapia: !!v })}
                    aria-label="Levar para terapia"
                  />
                  Levar para terapia
                </label>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="mt-6">
        <Note>Interrupção parcial também é dado. Tendências importam mais que dias isolados.</Note>
      </div>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-xs font-medium text-muted-foreground">{label}</legend>
      {children}
    </fieldset>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}