import type { AppState, PainelSemanal, ProtocolRun } from "./store";
import { painelVazio, weekOfDate } from "./store";

export type WeeklyAnalytics = PainelSemanal & {
  intensidadeMedia: number | null;
  duracaoMedia: number | null;
  recuperacaoMedia: number | null;
  frequenciaIncidentes: number;
  diasComRotina: number;
  rotinaPlanejada: number;
  rotinaCumprida: number;
  pausas: Record<string, number>;
  protocolosConcluidos: number;
};

const avg = (values: number[]) =>
  values.length ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : null;

export function deriveWeek(state: AppState, week: number): WeeklyAnalytics {
  const result: WeeklyAnalytics = {
    ...painelVazio,
    intensidadeMedia: null,
    duracaoMedia: null,
    recuperacaoMedia: null,
    frequenciaIncidentes: 0,
    diasComRotina: 0,
    rotinaPlanejada: 0,
    rotinaCumprida: 0,
    pausas: {},
    protocolosConcluidos: 0,
  };
  const incidents = state.incidents.filter((incident) => weekOfDate(state.startDate, incident.date) === week);
  const runs = state.protocolRuns.filter((run) => weekOfDate(state.startDate, run.at.slice(0, 10)) === week);
  const intensities = incidents.map((incident) => incident.intensidade).filter((value) => Number.isFinite(value));
  const durations = incidents.map((incident) => incident.duracaoMin).filter((value) => Number.isFinite(value));
  const recoveries = incidents.map((incident) => incident.recuperacaoMin).filter((value) => Number.isFinite(value));

  result.frequenciaIncidentes = incidents.length;
  result.episodios = incidents.length;
  result.intensidadeMedia = avg(intensities);
  result.duracaoMedia = avg(durations);
  result.recuperacaoMedia = avg(recoveries);
  result.episodiosPausa15 = incidents.filter((incident) => ["15–30 min", "30–60 min", ">60 min"].includes(incident.pausa)).length;
  result.a = incidents.filter((incident) => incident.autonomia === "A").length;
  result.b = incidents.filter((incident) => incident.autonomia === "B").length;
  result.c = incidents.filter((incident) => incident.autonomia === "C").length;
  for (const incident of incidents) result.pausas[incident.pausa] = (result.pausas[incident.pausa] ?? 0) + 1;
  result.protocolosConcluidos = runs.length;

  for (const day of Object.values(state.days)) {
    if (weekOfDate(state.startDate, day.date) !== week) continue;
    const planned = state.rotinaItems.length;
    const completed = Object.values(day.rotina ?? {}).filter(Boolean).length;
    if (Object.keys(day.rotina ?? {}).length || day.checkin !== null || day.episodio !== null) result.diasComRotina += 1;
    result.rotinaPlanejada += planned;
    result.rotinaCumprida += completed;
  }
  return result;
}

export function mergedPainel(state: AppState, week: number, manual: PainelSemanal): PainelSemanal {
  const derived = deriveWeek(state, week);
  const hasRealEpisodes = derived.episodios > 0;
  return {
    ...manual,
    // Quando ha episodios reais registrados no Diario/protocolos, eles prevalecem
    // sobre a digitacao manual para evitar dado duplicado e desatualizado.
    episodios: hasRealEpisodes ? derived.episodios : manual.episodios,
    episodiosPausa15: hasRealEpisodes ? derived.episodiosPausa15 : manual.episodiosPausa15,
    a: hasRealEpisodes ? derived.a : manual.a,
    b: hasRealEpisodes ? derived.b : manual.b,
    c: hasRealEpisodes ? derived.c : manual.c,
  };
}

export function deriveAllWeeks(state: AppState) {
  const weeks = new Set<number>();
  for (const incident of state.incidents) weeks.add(weekOfDate(state.startDate, incident.date));
  for (const day of Object.values(state.days)) weeks.add(weekOfDate(state.startDate, day.date));
  for (const run of state.protocolRuns) weeks.add(weekOfDate(state.startDate, run.at.slice(0, 10)));
  return [...weeks].filter((week) => week > 0).sort((a, b) => a - b).map((week) => ({ week, ...deriveWeek(state, week) }));
}

export function pauseBandFromMinutes(minutes: number | null | undefined) {
  if (minutes === null || minutes === undefined || !Number.isFinite(minutes)) return undefined;
  if (minutes < 5) return "<5 min" as const;
  if (minutes < 15) return "5–15 min" as const;
  if (minutes < 30) return "15–30 min" as const;
  if (minutes < 60) return "30–60 min" as const;
  return ">60 min" as const;
}

export function protocolDuration(run: ProtocolRun) {
  if (!run.pauseStartedAt || !run.pauseEndedAt) return null;
  return Math.max(0, Math.round((new Date(run.pauseEndedAt).getTime() - new Date(run.pauseStartedAt).getTime()) / 60000));
}
