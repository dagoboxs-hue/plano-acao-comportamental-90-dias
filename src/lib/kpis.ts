import type { AppState, WeekEntry } from "./store";
import { pct, scorecardTotal } from "./store";
import { mergedPainel } from "./analytics";

export type KpiPoint = { semana: number; valor: number | null };

export type Kpi = {
  id: string;
  nome: string;
  descricao: string;
  unidade: "%" | "n";
  direcao: "subir" | "descer";
  metas: { d30: string; d60: string; d90: string };
  baseline: number | null;
  atual: number | null;
  serie: KpiPoint[];
  nota?: string;
};

function weeksOrdered(state: AppState): WeekEntry[] {
  return Object.values(state.weeks).sort((a, b) => a.week - b.week);
}

function serieFrom(state: AppState, fn: (w: WeekEntry) => number | null): KpiPoint[] {
  return weeksOrdered(state).map((w) => ({
    semana: w.week,
    valor: fn({ ...w, painel: mergedPainel(state, w.week, w.painel) }),
  }));
}

function last(serie: KpiPoint[]): number | null {
  for (let i = serie.length - 1; i >= 0; i--) {
    const v = serie[i]?.valor;
    if (v !== null && v !== undefined) return v;
  }
  return null;
}

export function buildKpis(state: AppState): Kpi[] {
  const b = state.baseline;

  const mk = (
    id: string,
    nome: string,
    descricao: string,
    unidade: "%" | "n",
    direcao: "subir" | "descer",
    metas: { d30: string; d60: string; d90: string },
    baseline: number | null,
    fn: (w: WeekEntry) => number | null,
    nota?: string,
  ): Kpi => {
    const serie = serieFrom(state, fn);
    const kpi: Kpi = {
      id,
      nome,
      descricao,
      unidade,
      direcao,
      metas,
      baseline,
      atual: last(serie),
      serie,
    };
    if (nota) kpi.nota = nota;
    return kpi;
  };

  return [
    mk(
      "limites",
      "Limites respeitados",
      "Limites respeitados ÷ limites recebidos × 100.",
      "%",
      "subir",
      { d30: "75%", d60: "85%", d90: "90%" },
      b ? pct(Math.max(0, b.limitesRecebidos - b.limitesNegociados), b.limitesRecebidos) : null,
      (w) => pct(w.painel.limitesRespeitados, w.painel.limitesRecebidos),
    ),
    mk(
      "mensagens",
      "Mensagens impulsivas",
      "Contagem semanal. Baseline definido nos primeiros 7 dias.",
      "n",
      "descer",
      { d30: "−25%", d60: "−50%", d90: "−70%" },
      b ? b.mensagensImpulsivas : null,
      (w) => w.painel.mensagensImpulsivas,
    ),
    mk(
      "pausa",
      "Pausa antes da ação",
      "Episódios com pausa ≥ 15 min ÷ episódios.",
      "%",
      "subir",
      { d30: "≥50% acima de 15 min", d60: "≥60% acima de 30 min", d90: "≥70% acima de 30 min" },
      null,
      (w) => pct(w.painel.episodiosPausa15, w.painel.episodios),
    ),
    mk(
      "ajuda",
      "Ajuda com consentimento",
      "Ajuda consentida ÷ tentativas totais.",
      "%",
      "subir",
      { d30: "70%", d60: "80%", d90: "90%" },
      b ? pct(b.solucoesConsentidas, b.solucoesOferecidas) : null,
      (w) => pct(w.painel.ajudaConsentida, w.painel.ajudaTentativas),
    ),
    mk(
      "psicologizacoes",
      "Psicologizações não solicitadas",
      "Contagem semanal.",
      "n",
      "descer",
      { d30: "−30%", d60: "−60%", d90: "Próximo de zero em interações comuns" },
      b ? b.psicologizacoes : null,
      (w) => w.painel.psicologizacoes,
    ),
    mk(
      "privacidade",
      "Privacidade",
      "Tentativas conscientes de ultrapassar um limite.",
      "n",
      "descer",
      { d30: "Tendência decrescente", d60: "Zero ou casos excepcionais interrompidos", d90: "Zero violações conscientes" },
      b ? b.privacidade : null,
      (w) => w.painel.privacidade,
    ),
    mk(
      "dr",
      "Escalada desnecessária para DR",
      "Contagem semanal.",
      "n",
      "descer",
      { d30: "−25%", d60: "−50%", d90: "−70%" },
      b ? b.escaladasDR : null,
      (w) => w.painel.escaladasDR,
    ),
    mk(
      "compromissos",
      "Compromissos pessoais",
      "Concluídos ÷ planejados. Contas, horários, tarefas, compromissos, exercício, administração doméstica.",
      "%",
      "subir",
      { d30: "75%", d60: "85%", d90: "90%" },
      b ? pct(b.compromissosCumpridos, b.compromissosPlanejados) : null,
      (w) => pct(w.painel.compromissosCumpridos, w.painel.compromissosPlanejados),
    ),
    mk(
      "autonomia",
      "Autonomia A/B/C",
      "Percentual de episódios A+B (regulei sozinho ou com apoio independente).",
      "%",
      "subir",
      { d30: "60%", d60: "75%", d90: "85%" },
      b ? pct(b.a + b.b, b.a + b.b + b.c) : null,
      (w) => pct(w.painel.a + w.painel.b, w.painel.a + w.painel.b + w.painel.c),
      "O objetivo não é nunca procurar a pessoa. É fazer com que o contato deixe de ser a única ferramenta regulatória.",
    ),
    mk(
      "reparacao",
      "Reparação comportamental",
      "Reparações curtas ÷ reparações totais. Curta = reconhecer + assumir + reparar.",
      "%",
      "subir",
      { d30: "60%", d60: "75%", d90: "85%" },
      null,
      (w) => pct(w.painel.reparacoesCurtas, w.painel.reparacoesTotais),
    ),
  ];
}

export function scorecardSerie(state: AppState): KpiPoint[] {
  return Object.values(state.weeks)
    .sort((a, b) => a.week - b.week)
    .map((w) => ({ semana: w.week, valor: scorecardTotal(w.scorecard) }));
}

export function episodeSerie(state: AppState) {
  const byWeek = new Map<number, { freq: number; intensidade: number[]; duracao: number[]; recuperacao: number[] }>();
  for (const inc of state.incidents) {
    const start = state.startDate;
    if (!start) continue;
    const diff = Math.floor(
      (new Date(inc.date + "T00:00:00").getTime() - new Date(start + "T00:00:00").getTime()) / 86400000,
    );
    if (diff < 0) continue;
    const w = Math.min(13, Math.floor(diff / 7) + 1);
    const cur = byWeek.get(w) ?? { freq: 0, intensidade: [], duracao: [], recuperacao: [] };
    cur.freq += 1;
    cur.intensidade.push(inc.intensidade);
    cur.duracao.push(inc.duracaoMin);
    cur.recuperacao.push(inc.recuperacaoMin);
    byWeek.set(w, cur);
  }
  const avg = (a: number[]) => (a.length ? Math.round((a.reduce((x, y) => x + y, 0) / a.length) * 10) / 10 : null);
  return [...byWeek.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([semana, v]) => ({
      semana,
      frequencia: v.freq,
      intensidade: avg(v.intensidade),
      duracao: avg(v.duracao),
      recuperacao: avg(v.recuperacao),
    }));
}