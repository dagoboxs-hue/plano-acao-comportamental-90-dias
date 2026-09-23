import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FaixaPausa } from "./content";

const STORAGE_KEY = "pac90.v1";

export type Autonomia = "A" | "B" | "C";

export type Incident = {
  id: string;
  date: string; // yyyy-mm-dd
  createdAt: string;
  situacao: string;
  fato: string;
  interpretacao: string;
  emocao: string;
  intensidade: number;
  corpo: string;
  impulso: string;
  oQueFiz: string;
  pausa: FaixaPausa;
  duracaoMin: number;
  recuperacaoMin: number;
  consequencia: string;
  poderia: string;
  aprendi: string;
  testar: string;
  categoria: string;
  autonomia: Autonomia;
  terapia: boolean;
};

export type DayLog = {
  date: string;
  checkin: number | null;
  episodio: boolean | null;
  rotina: Record<string, boolean>;
};

export type PainelSemanal = {
  limitesRecebidos: number;
  limitesRespeitados: number;
  mensagensImpulsivas: number;
  episodios: number;
  episodiosPausa15: number;
  ajudaTentativas: number;
  ajudaConsentida: number;
  psicologizacoes: number;
  privacidade: number;
  escaladasDR: number;
  a: number;
  b: number;
  c: number;
  compromissosPlanejados: number;
  compromissosCumpridos: number;
  reparacoesTotais: number;
  reparacoesCurtas: number;
};

export const painelVazio: PainelSemanal = {
  limitesRecebidos: 0,
  limitesRespeitados: 0,
  mensagensImpulsivas: 0,
  episodios: 0,
  episodiosPausa15: 0,
  ajudaTentativas: 0,
  ajudaConsentida: 0,
  psicologizacoes: 0,
  privacidade: 0,
  escaladasDR: 0,
  a: 0,
  b: 0,
  c: 0,
  compromissosPlanejados: 0,
  compromissosCumpridos: 0,
  reparacoesTotais: 0,
  reparacoesCurtas: 0,
};

export type WeekEntry = {
  week: number;
  painel: PainelSemanal;
  scorecard: (number | null)[]; // 10 itens 0/1/2
  revisao: Record<string, string>;
  focoProxima: string;
  updatedAt: string;
};

export type Baseline = {
  limitesRecebidos: number;
  limitesNegociados: number;
  mensagensImpulsivas: number;
  episodios: number;
  pausaPredominante: FaixaPausa;
  solucoesOferecidas: number;
  solucoesConsentidas: number;
  psicologizacoes: number;
  privacidade: number;
  escaladasDR: number;
  a: number;
  b: number;
  c: number;
  compromissosPlanejados: number;
  compromissosCumpridos: number;
  concluido: boolean;
};

export type ProtocolLog = { id: string; protocolo: string; at: string; nota?: string | undefined };

export type ProtocolRun = {
  id: string;
  at: string;
  protocolo: string;
  emocao: string;
  intensidadeInicial: number | null;
  intensidadeFinal: number | null;
  fato: string;
  interpretacao: string;
  hipoteses: string;
  necessidade: string;
  regulacao: string;
  reavaliacao: string;
  nota: string;
};

export type IncidentDraft = Partial<Omit<Incident, "id" | "createdAt">>;

export type AppState = {
  onboarded: boolean;
  startDate: string | null;
  rotinaItems: string[];
  incidents: Incident[];
  days: Record<string, DayLog>;
  weeks: Record<number, WeekEntry>;
  baseline: Baseline | null;
  semaforo: Record<string, "verde" | "amarelo" | "vermelho">;
  protocolLogs: ProtocolLog[];
  protocolRuns: ProtocolRun[];
  incidentDraft: IncidentDraft | null;
  fechamento: Record<string, string>;
};

export const initialState: AppState = {
  onboarded: false,
  startDate: null,
  rotinaItems: ["Trabalho", "Treino", "Alimentação", "Sono"],
  incidents: [],
  days: {},
  weeks: {},
  baseline: null,
  semaforo: {},
  protocolLogs: [],
  protocolRuns: [],
  incidentDraft: null,
  fechamento: {},
};

export function todayISO(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return tz.toISOString().slice(0, 10);
}

export function dayNumber(startDate: string | null, ref = new Date()): number {
  if (!startDate) return 0;
  const start = new Date(startDate + "T00:00:00");
  const diff = Math.floor((new Date(todayISO(ref) + "T00:00:00").getTime() - start.getTime()) / 86400000);
  return Math.min(90, Math.max(1, diff + 1));
}

export function weekNumber(startDate: string | null, ref = new Date()): number {
  const d = dayNumber(startDate, ref);
  if (!d) return 0;
  return Math.min(13, Math.max(1, Math.ceil(d / 7)));
}

type Ctx = {
  state: AppState;
  ready: boolean;
  setState: (updater: (s: AppState) => AppState) => void;
  reset: () => void;
  replaceAll: (s: AppState) => void;
};

const StoreContext = createContext<Ctx | null>(null);

function migrate(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") return initialState;
  const s = raw as Partial<AppState>;
  return {
    ...initialState,
    ...s,
    rotinaItems: Array.isArray(s.rotinaItems) && s.rotinaItems.length ? s.rotinaItems : initialState.rotinaItems,
    incidents: Array.isArray(s.incidents) ? s.incidents : [],
    days: s.days && typeof s.days === "object" ? s.days : {},
    weeks: s.weeks && typeof s.weeks === "object" ? (s.weeks as AppState["weeks"]) : {},
    semaforo: s.semaforo && typeof s.semaforo === "object" ? s.semaforo : {},
    protocolLogs: Array.isArray(s.protocolLogs) ? s.protocolLogs : [],
    protocolRuns: Array.isArray(s.protocolRuns) ? s.protocolRuns : [],
    incidentDraft: s.incidentDraft && typeof s.incidentDraft === "object" ? s.incidentDraft : null,
    fechamento: s.fechamento && typeof s.fechamento === "object" ? s.fechamento : {},
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setLocal] = useState<AppState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLocal(migrate(JSON.parse(raw)));
    } catch {
      /* dados locais indisponíveis */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* armazenamento indisponível */
    }
  }, [state, ready]);

  const setState = useCallback((updater: (s: AppState) => AppState) => {
    setLocal((prev) => updater(prev));
  }, []);

  const reset = useCallback(() => {
    setLocal(initialState);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const replaceAll = useCallback((s: AppState) => setLocal(migrate(s)), []);

  const value = useMemo(() => ({ state, ready, setState, reset, replaceAll }), [state, ready, setState, reset, replaceAll]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}

/* ---------- helpers de escrita ---------- */

export function useActions() {
  const { setState } = useStore();

  return useMemo(
    () => ({
      completeOnboarding: () =>
        setState((s) => ({ ...s, onboarded: true, startDate: s.startDate ?? todayISO() })),
      setDay: (date: string, patch: Partial<DayLog>) =>
        setState((s) => ({
          ...s,
          days: {
            ...s.days,
            [date]: { date, checkin: null, episodio: null, rotina: {}, ...(s.days[date] ?? {}), ...patch },
          },
        })),
      setRotinaItems: (items: string[]) => setState((s) => ({ ...s, rotinaItems: items })),
      addIncident: (inc: Incident) => setState((s) => ({ ...s, incidents: [inc, ...s.incidents] })),
      updateIncident: (id: string, patch: Partial<Incident>) =>
        setState((s) => ({
          ...s,
          incidents: s.incidents.map((i) => (i.id === id ? { ...i, ...patch } : i)),
        })),
      removeIncident: (id: string) =>
        setState((s) => ({ ...s, incidents: s.incidents.filter((i) => i.id !== id) })),
      setWeek: (week: number, patch: Partial<WeekEntry>) =>
        setState((s) => {
          const prev: WeekEntry = s.weeks[week] ?? {
            week,
            painel: painelVazio,
            scorecard: Array(10).fill(null),
            revisao: {},
            focoProxima: "",
            updatedAt: new Date().toISOString(),
          };
          return {
            ...s,
            weeks: { ...s.weeks, [week]: { ...prev, ...patch, updatedAt: new Date().toISOString() } },
          };
        }),
      setBaseline: (b: Baseline) => setState((s) => ({ ...s, baseline: b })),
      setSemaforo: (cat: string, val: "verde" | "amarelo" | "vermelho") =>
        setState((s) => ({ ...s, semaforo: { ...s.semaforo, [cat]: val } })),
      logProtocol: (protocolo: string, nota?: string) =>
        setState((s) => ({
          ...s,
          protocolLogs: [
            { id: crypto.randomUUID(), protocolo, at: new Date().toISOString(), nota },
            ...s.protocolLogs,
          ].slice(0, 300),
        })),
      logProtocolRun: (run: Omit<ProtocolRun, "id" | "at">) =>
        setState((s) => ({
          ...s,
          protocolRuns: [{ ...run, id: crypto.randomUUID(), at: new Date().toISOString() }, ...s.protocolRuns].slice(
            0,
            300,
          ),
        })),
      setIncidentDraft: (draft: IncidentDraft | null) => setState((s) => ({ ...s, incidentDraft: draft })),
      setFechamento: (key: string, val: string) =>
        setState((s) => ({ ...s, fechamento: { ...s.fechamento, [key]: val } })),
    }),
    [setState],
  );
}

/* ---------- derivações ---------- */

export function pct(part: number, total: number): number | null {
  if (!total) return null;
  return Math.round((part / total) * 100);
}

export function weekOfDate(startDate: string | null, date: string): number {
  if (!startDate) return 0;
  const start = new Date(startDate + "T00:00:00").getTime();
  const d = new Date(date + "T00:00:00").getTime();
  const diff = Math.floor((d - start) / 86400000);
  if (diff < 0) return 0;
  return Math.min(13, Math.floor(diff / 7) + 1);
}

export function scorecardTotal(sc: (number | null)[]): number | null {
  if (!sc.some((v) => v !== null)) return null;
  return sc.reduce<number>((a, v) => a + (v ?? 0), 0);
}

export const PAUSA_MIN: Record<string, number> = {
  "<5 min": 2,
  "5–15 min": 10,
  "15–30 min": 22,
  "30–60 min": 45,
  ">60 min": 75,
};