import { initialState, type AppState } from "./store";

export function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(state: AppState) {
  download(
    `plano-90-dias-${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify({ app: "pac90", version: 1, exportedAt: new Date().toISOString(), data: state }, null, 2),
    "application/json",
  );
}

function csvEscape(v: unknown) {
  const s = String(v ?? "");
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const cols = Object.keys(rows[0]!);
  return [cols.join(","), ...rows.map((r) => cols.map((c) => csvEscape(r[c])).join(","))].join("\n");
}

export function exportCSV(state: AppState) {
  const incidentes = toCsv(state.incidents as unknown as Record<string, unknown>[]);
  const semanas = toCsv(
    Object.values(state.weeks).map((w) => ({
      semana: w.week,
      ...w.painel,
      scorecard_total: w.scorecard.reduce<number>((a, v) => a + (v ?? 0), 0),
      foco_proxima: w.focoProxima,
      ...w.revisao,
    })) as unknown as Record<string, unknown>[],
  );
  const dias = toCsv(
    Object.values(state.days).map((d) => ({
      data: d.date,
      checkin: d.checkin ?? "",
      episodio: d.episodio === null ? "" : d.episodio ? "sim" : "nao",
      rotina_cumprida: Object.values(d.rotina).filter(Boolean).length,
      rotina_total: Object.keys(d.rotina).length,
    })) as unknown as Record<string, unknown>[],
  );
  const content = [
    "# INCIDENTES",
    incidentes || "(sem registros)",
    "",
    "# SEMANAS",
    semanas || "(sem registros)",
    "",
    "# DIAS",
    dias || "(sem registros)",
  ].join("\n");
  download(`plano-90-dias-${new Date().toISOString().slice(0, 10)}.csv`, content, "text/csv;charset=utf-8");
}

export type ImportResult = { ok: true; state: AppState } | { ok: false; erro: string };

export function parseBackup(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, erro: "Arquivo não é um JSON válido." };
  }
  const obj = parsed as { app?: string; data?: unknown };
  const data = (obj && typeof obj === "object" && "data" in obj ? obj.data : parsed) as Partial<AppState>;
  if (!data || typeof data !== "object") return { ok: false, erro: "Estrutura do backup não reconhecida." };
  if (!("incidents" in data) && !("weeks" in data) && !("startDate" in data)) {
    return { ok: false, erro: "O arquivo não contém dados deste painel." };
  }
  if (data.incidents && !Array.isArray(data.incidents)) {
    return { ok: false, erro: "A lista de incidentes está corrompida." };
  }
  return { ok: true, state: { ...initialState, ...data } as AppState };
}