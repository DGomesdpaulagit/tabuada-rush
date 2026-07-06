import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Target, Zap, XCircle, Crosshair, TrendingUp,
  Gauge, Calculator, Flame, Grid3x3,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getAccuracy, formatDate, OPERATIONS, OPERATION_ORDER, getFactKey } from '../utils';
import { analyzeUser } from '../utils/analysis';
import { Progress, StatCard, EmptyState, Button, OperationTabs, pageVariants, pageTransition } from '../components/ui';

const DAY = 86400000;

const MODES_META = [
  { id: 'rush', label: 'Rush', grad: 'from-violet-500 to-purple-600' },
  { id: 'survival', label: 'Sobrevivência', grad: 'from-rose-500 to-pink-600' },
  { id: 'speed', label: 'Velocidade', grad: 'from-amber-400 to-orange-500' },
  { id: 'daily', label: 'Desafio Diário', grad: 'from-emerald-400 to-teal-600' },
];

// Resumo de uma lista de sessões: precisão, erros e tempo médio
function windowStats(list) {
  let c = 0, w = 0, ms = 0, mc = 0;
  for (const s of list) {
    c += s.correct || 0;
    w += s.wrong || 0;
    if (s.avgMs > 0) { ms += s.avgMs; mc += 1; }
  }
  return {
    games: list.length,
    accuracy: getAccuracy(c, c + w),
    errors: w,
    answered: c + w,
    avgMs: mc ? Math.round(ms / mc) : 0,
  };
}

function Delta({ value, suffix = '', invert = false }) {
  if (value == null || value === 0) return null;
  const good = invert ? value < 0 : value > 0;
  return (
    <span className={`text-xs font-black ${good ? 'text-emerald-600' : 'text-rose-500'}`}>
      {value > 0 ? '▲' : '▼'} {Math.abs(value)}{suffix}
    </span>
  );
}

// ── MAPA DE DOMÍNIO ─────────────────────────────────────────────────────────
// Classifica um fato (par a×b) em 4 estados:
//   dominated:  acerta consistente e rápido (<1.5s médio, >=90% acerto, >=3 amostras)
//   practiced:  acerta mas devagar (>=70% acerto, mas tempo médio >=1.5s OU <3 amostras)
//   problem:    taxa de erro >20% (e amostras suficientes)
//   nodata:     menos de 1 amostra
const MASTERY_FAST_MS = 1500;
const MASTERY_MIN_ACC = 90;
const MASTERY_PROBLEM_ERR = 20;
const MASTERY_MIN_SAMPLES = 3;

function classifyFact(stat) {
  if (!stat || (stat.count || 0) < 1) return 'nodata';
  const tot = (stat.correct || 0) + (stat.wrong || 0);
  if (tot === 0) return 'nodata';
  const acc = Math.round((stat.correct / tot) * 100);
  const errRate = 100 - acc;
  const avgMs = stat.count && stat.totalMs ? stat.totalMs / stat.count : 0;
  if (errRate > MASTERY_PROBLEM_ERR && tot >= MASTERY_MIN_SAMPLES) return 'problem';
  if (acc >= MASTERY_MIN_ACC && avgMs > 0 && avgMs < MASTERY_FAST_MS && tot >= MASTERY_MIN_SAMPLES)
    return 'dominated';
  return 'practiced';
}

const MASTERY_COLORS = {
  dominated: { bg: 'bg-emerald-500', text: 'text-white', label: 'Dominado' },
  practiced: { bg: 'bg-amber-400', text: 'text-white', label: 'Praticado' },
  problem:   { bg: 'bg-rose-500', text: 'text-white', label: 'Problemático' },
  nodata:    { bg: 'bg-gray-200', text: 'text-gray-400', label: 'Sem dados' },
};

// [v4.0 · Fase 1] `operation` seleciona a grade via OPERATIONS registry em vez de
// hardcoded — hoje só `mult` (8×10). Fases 2/3 reaproveitam este componente para
// soma/subtração/divisão só registrando a operação lá.
function MasteryMap({ factStats, operation = 'mult' }) {
  const cfg = OPERATIONS[operation] || OPERATIONS.mult;
  const rows = cfg.domainRows;
  const cols = cfg.domainCols;
  const cells = [];
  const counts = { dominated: 0, practiced: 0, problem: 0, nodata: 0 };

  for (const a of rows) {
    for (const b of cols) {
      // [v4.0 · Fase 2] Operações com `isValid` (ex.: subtração não pode dar
      // negativo) têm combinações impossíveis — não contam pro total nem viram fato.
      if (cfg.isValid && !cfg.isValid(a, b)) {
        cells.push({ a, b, invalid: true });
        continue;
      }
      const fk = getFactKey(cfg.id, a, b);
      const stat = factStats[fk];
      const state = classifyFact(stat);
      counts[state] += 1;
      cells.push({ a, b, fk, stat, state });
    }
  }

  const total = cells.filter((c) => !c.invalid).length;
  const dominatedPct = total ? Math.round((counts.dominated / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18 }}
      className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <Grid3x3 size={16} className="text-emerald-500" />
        <p className="font-black text-gray-800">Mapa de Domínio</p>
      </div>
      <p className="text-xs text-gray-400 font-semibold mb-4">
        {total} fatos fundamentais de {cfg.label.toLowerCase()} — sua memória real
      </p>

      {/* Cabeçalho de progresso */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-3 mb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-2xl font-black text-emerald-700 leading-none">
              {counts.dominated}<span className="text-base text-emerald-400">/{total}</span>
            </p>
            <p className="text-[11px] font-bold text-emerald-500 mt-1">Fatos Dominados</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-emerald-700 leading-none">{dominatedPct}%</p>
            <p className="text-[11px] font-bold text-emerald-500 mt-1">do domínio total</p>
          </div>
        </div>
      </div>

      {/* Grade 8×10 */}
      <div className="overflow-x-auto -mx-2 px-2">
        <div className="inline-block min-w-full">
          {/* Cabeçalho de colunas (b = 1..10) */}
          <div className="flex gap-1 mb-1 pl-7">
            {cols.map((b) => (
              <div key={b} className="w-7 text-center text-[10px] font-black text-gray-400">
                {b}
              </div>
            ))}
          </div>
          {/* Linhas (a = 2..9) */}
          {rows.map((a) => (
            <div key={a} className="flex gap-1 mb-1 items-center">
              <div className="w-6 text-center text-[10px] font-black text-gray-500 shrink-0">
                {a}{cfg.symbol}
              </div>
              {cols.map((b) => {
                const cell = cells.find((c) => c.a === a && c.b === b);
                if (cell.invalid) {
                  return (
                    <div
                      key={`${a}-${b}`}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] text-gray-200"
                    >
                      ·
                    </div>
                  );
                }
                const colors = MASTERY_COLORS[cell.state];
                const stat = cell.stat;
                const tot = stat ? (stat.correct || 0) + (stat.wrong || 0) : 0;
                const acc = tot ? Math.round((stat.correct / tot) * 100) : 0;
                const avgMs = stat?.count && stat.totalMs ? Math.round(stat.totalMs / stat.count) : 0;
                const ans = cfg.answer(a, b);
                const titleText =
                  cell.state === 'nodata'
                    ? `${a}${cfg.symbol}${b} — sem dados ainda`
                    : `${a}${cfg.symbol}${b}=${ans} · ${acc}% · ${(avgMs / 1000).toFixed(1)}s · ${colors.label}`;
                return (
                  <div
                    key={`${a}-${b}`}
                    title={titleText}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-black ${colors.bg} ${colors.text}`}
                  >
                    {ans}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {[
          { key: 'dominated', emoji: '🟢', txt: 'Dominado (<1.5s)' },
          { key: 'practiced', emoji: '🟡', txt: 'Praticado' },
          { key: 'problem', emoji: '🔴', txt: 'Problemático (>20% erro)' },
          { key: 'nodata', emoji: '⬜', txt: 'Sem dados' },
        ].map((l) => (
          <div key={l.key} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
            <span className={`inline-block w-3 h-3 rounded ${MASTERY_COLORS[l.key].bg}`} />
            <span>{l.txt}</span>
            <span className="ml-auto text-gray-400">{counts[l.key]}</span>
          </div>
        ))}
      </div>

      {counts.dominated === 0 && counts.practiced === 0 && counts.problem === 0 && (
        <div className="mt-4 rounded-2xl bg-violet-50 border border-violet-100 p-3 text-xs font-bold text-violet-600 text-center">
          Jogue algumas partidas para o mapa começar a colorir.
        </div>
      )}
    </motion.div>
  );
}

function AccTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-lg text-sm">
      <p className="font-bold text-gray-600">{label}</p>
      <p className="font-black text-violet-600">{payload[0].value}% de acerto</p>
    </div>
  );
}

export default function AccuracyCatalogPage({ onBack }) {
  const { data } = useApp();
  const [mapOperation, setMapOperation] = useState('mult'); // aba do Mapa de Domínio (v4.0 · Fase 2)
  const sessions = (data.sessions || []).filter((s) => s && s.date);

  // Sobrevivência tem lógica própria (termina após 3 erros) → excluída das métricas globais
  // Ainda aparece individualmente na seção "Por modo"
  const nonSurvSessions = sessions.filter((s) => s.mode !== 'survival');

  const totalCorrect = nonSurvSessions.reduce((a, s) => a + (s.correct || 0), 0);
  const totalWrong   = nonSurvSessions.reduce((a, s) => a + (s.wrong   || 0), 0);
  const answered = totalCorrect + totalWrong;
  const overallAcc = getAccuracy(totalCorrect, answered);
  const errorRate = answered ? Math.round((totalWrong / answered) * 100) : 0;

  // Janelas de tempo (sem Sobrevivência)
  const now = Date.now();
  const week = windowStats(nonSurvSessions.filter((s) => new Date(s.date).getTime() >= now - 7 * DAY));
  const monthly = analyzeUser(data).monthly;

  // Evolução da precisão: metade recente vs metade anterior (sem Sobrevivência)
  const n = nonSurvSessions.length;
  const half = Math.max(1, Math.min(8, Math.floor(n / 2)));
  const recent = nonSurvSessions.slice(-half);
  const older = n >= half * 2 ? nonSurvSessions.slice(-half * 2, -half) : [];
  const recentAcc = windowStats(recent).accuracy;
  const olderAcc = older.length ? windowStats(older).accuracy : null;
  const accDelta = olderAcc != null ? recentAcc - olderAcc : null;

  // Velocidade — todas as sessões (tempo/resposta é válido em qualquer modo)
  const speedAll = windowStats(sessions).avgMs;
  const speedRecent = windowStats(recent).avgMs;
  const speedBestMs = data.fastestAvgMs || 0;
  const speedDelta = speedAll > 0 && speedRecent > 0 ? speedRecent - speedAll : null;

  // Por modo (inclui Sobrevivência individualmente)
  const perMode = MODES_META.map((m) => {
    const list = sessions.filter((s) => s.mode === m.id);
    const ws = windowStats(list);
    return { ...m, ...ws };
  }).filter((m) => m.games > 0);

  // Desempenho por tabuada (fator a)
  const multTableStats = data.tableStats?.mult || {};
  const tables = Object.keys(multTableStats)
    .map((k) => {
      const t = multTableStats[k];
      const tot = (t.correct || 0) + (t.wrong || 0);
      return {
        a: Number(k),
        acc: tot ? Math.round((t.correct / tot) * 100) : 0,
        count: t.count || tot,
        errors: t.wrong || 0,
        avgMs: t.count && t.totalMs ? Math.round(t.totalMs / t.count) : 0,
      };
    })
    .sort((a, b) => a.a - b.a);
  const hardest = tables.filter((t) => t.count >= 3).sort((a, b) => a.acc - b.acc)[0] || null;

  // Histórico de precisão (por partida, últimas 20 — sem Sobrevivência)
  const chartData = nonSurvSessions.slice(-20).map((s, i) => {
    const tot = (s.correct || 0) + (s.wrong || 0);
    return {
      name: s.date ? formatDate(s.date) : `#${i + 1}`,
      acc: tot ? Math.round(((s.correct || 0) / tot) * 100) : 0,
    };
  });

  const secs = (ms) => (ms > 0 ? `${(ms / 1000).toFixed(1)}s` : '—');

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">Catálogo de Precisão</h2>
          <p className="text-sm text-gray-400 font-semibold">Modos clássicos (Sobrevivência exibida separadamente)</p>
        </div>
      </div>

      {/* ── DESEMPENHO MATEMÁTICO (resumo) ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-violet-200"
      >
        <div className="flex items-center gap-2 mb-4">
          <Crosshair size={18} />
          <p className="font-black text-lg">Desempenho Matemático</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-2xl font-black leading-none">{overallAcc}%</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">Precisão</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-2xl font-black leading-none">{secs(speedAll)}</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">Tempo médio</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-2xl font-black leading-none">{answered}</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">Respondidas</p>
          </div>
        </div>
      </motion.div>

      {/* ── TAXA DE ACERTO ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target size={16} className="text-emerald-500" />
          <p className="font-black text-gray-800">Taxa de Acerto</p>
        </div>

        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-500">Precisão geral</span>
          <span className="text-xs font-black text-emerald-600">{overallAcc}%</span>
        </div>
        <Progress value={overallAcc} className="h-2.5" colorClass="bg-gradient-to-r from-emerald-400 to-teal-500" />

        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs font-bold text-gray-400">Semana</p>
            <p className="text-xl font-black text-gray-900">{week.accuracy}%</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs font-bold text-gray-400">Mês</p>
            <p className="text-xl font-black text-gray-900 flex items-center gap-2">
              {monthly?.accuracy || 0}% <Delta value={monthly?.accDelta} suffix="%" />
            </p>
          </div>
        </div>

        {accDelta != null && (
          <div className="mt-3 rounded-2xl bg-violet-50 border border-violet-100 p-3 flex items-center gap-2">
            <TrendingUp size={15} className="text-violet-500 shrink-0" />
            <p className="text-sm font-bold text-violet-700">
              {accDelta > 0
                ? `Sua precisão subiu ${accDelta}% nas últimas partidas.`
                : accDelta < 0
                ? `Sua precisão caiu ${Math.abs(accDelta)}% — foco nos detalhes!`
                : 'Sua precisão está estável.'}
            </p>
          </div>
        )}

        {/* Precisão por modo */}
        {perMode.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Por modo</p>
            {perMode.map((m) => (
              <div key={m.id} className="mb-3 last:mb-0">
                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                  <span>{m.label}</span>
                  <span className="font-black">{m.accuracy}%</span>
                </div>
                <Progress value={m.accuracy} className="h-2" colorClass={`bg-gradient-to-r ${m.grad}`} />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── VELOCIDADE ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <Zap size={16} className="text-amber-500" />
          <p className="font-black text-gray-800">Velocidade</p>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Tempo médio de resposta</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Geral</p>
            <p className="text-xl font-black text-gray-900 mt-1">{secs(speedAll)}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Recente</p>
            <p className="text-xl font-black text-gray-900 mt-1 flex items-center justify-center gap-1">
              {secs(speedRecent)}
            </p>
            {speedDelta != null && speedDelta !== 0 && (
              <span className={`text-[11px] font-black ${speedDelta < 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {speedDelta < 0 ? '▼ + rápido' : '▲ + lento'}
              </span>
            )}
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 border border-amber-100 text-center">
            <p className="text-[11px] font-bold text-amber-500 uppercase">Melhor</p>
            <p className="text-xl font-black text-amber-600 mt-1">{secs(speedBestMs)}</p>
          </div>
        </div>

        {/* Velocidade por modo */}
        {perMode.some((m) => m.avgMs > 0) && (
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Por modo</p>
            <div className="flex flex-col gap-2">
              {perMode.filter((m) => m.avgMs > 0).map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">{m.label}</span>
                  <span className="font-black text-gray-900">{secs(m.avgMs)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── SISTEMA DE ERROS ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <XCircle size={16} className="text-rose-500" />
          <p className="font-black text-gray-800">Erros</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-rose-50 p-3 border border-rose-100">
            <p className="text-xs font-bold text-rose-400">Total de erros</p>
            <p className="text-xl font-black text-rose-600">{totalWrong}</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
            <p className="text-xs font-bold text-gray-400">Taxa de erro</p>
            <p className="text-xl font-black text-gray-900">{errorRate}%</p>
          </div>
        </div>
        {/* Erros por modo */}
        {perMode.some((m) => m.errors > 0) && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Erros por modo</p>
            <div className="flex flex-col gap-2">
              {perMode.map((m) => (
                <div key={m.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">{m.label}</span>
                  <span className="font-black text-gray-900">{m.errors}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* ── MAPA DE DOMÍNIO (80 fatos fundamentais) ──────────────────────── */}
      <OperationTabs
        operations={OPERATION_ORDER.map((id) => OPERATIONS[id])}
        value={mapOperation}
        onChange={setMapOperation}
      />
      <MasteryMap factStats={data.factStats?.[mapOperation] || {}} operation={mapOperation} />

      {/* ── PRECISÃO POR TABUADA (operação: multiplicação) ───────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Precisão por Tabuada</p>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">
          Onde você mais acerta e mais erra (multiplicação)
        </p>
        {tables.length === 0 ? (
          <EmptyState
            icon="🔢"
            title="Sem dados por tabuada ainda"
            description="Jogue algumas partidas para o jogo mapear seu desempenho em cada tabuada."
          />
        ) : (
          <>
            {hardest && (
              <div className="mb-4 rounded-2xl bg-amber-50 border border-amber-100 p-3 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                <p className="text-sm font-bold text-amber-700">
                  Sua maior dificuldade é a tabuada do {hardest.a} ({hardest.acc}% de acerto). Pratique-a!
                </p>
              </div>
            )}
            <div className="flex flex-col gap-3">
              {tables.map((t) => (
                <div key={t.a}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-black text-gray-700">Tabuada do {t.a}</span>
                    <span className="font-bold text-gray-400 text-xs">
                      {t.errors} {t.errors === 1 ? 'erro' : 'erros'}
                      {t.avgMs > 0 ? ` · ${secs(t.avgMs)}` : ''} · <span className="text-gray-700 font-black">{t.acc}%</span>
                    </span>
                  </div>
                  <Progress
                    value={t.acc}
                    className="h-2"
                    colorClass={
                      t.acc >= 85
                        ? 'bg-emerald-500'
                        : t.acc >= 60
                        ? 'bg-amber-400'
                        : 'bg-rose-500'
                    }
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* ── ESTATÍSTICAS MATEMÁTICAS ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Gauge size={15} className="text-violet-500" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Estatísticas Matemáticas</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Calculator size={16} />} label="Contas respondidas" value={answered} colorClass="bg-violet-100 text-violet-600" delay={0.05} />
          <StatCard icon={<Target size={16} />} label="Total de acertos" value={totalCorrect} colorClass="bg-emerald-100 text-emerald-600" delay={0.1} />
          <StatCard icon={<XCircle size={16} />} label="Total de erros" value={totalWrong} colorClass="bg-rose-100 text-rose-600" delay={0.15} />
          <StatCard icon={<Flame size={16} />} label="Melhor sequência" value={data.bestStreak || 0} colorClass="bg-amber-100 text-amber-600" delay={0.2} />
        </div>
      </div>

      {/* ── HISTÓRICO / EVOLUÇÃO DE PRECISÃO ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Histórico de Precisão</p>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Sua taxa de acerto por partida</p>
        {chartData.length < 2 ? (
          <EmptyState
            icon="📈"
            title="Poucas partidas"
            description="Jogue mais algumas partidas para ver a evolução da sua precisão."
          />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito' }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito' }} tickLine={false} axisLine={false} />
              <Tooltip content={<AccTooltip />} />
              <Line
                type="monotone"
                dataKey="acc"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ fill: '#10B981', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar às Estatísticas
      </Button>
    </motion.div>
  );
}
