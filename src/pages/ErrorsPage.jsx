import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, XCircle, AlertTriangle, TrendingDown, BarChart2, BookOpen } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils';
import { StatCard, EmptyState, Progress, pageVariants, pageTransition } from '../components/ui';

// ── Constantes ───────────────────────────────────────────────────────────────

// [v6.0 · Bloco 7 — pendência] Só os 3 modos reais desde a fusão da 5.0.
const MODE_LABELS = { rush: 'Rush', zen: 'Zen', review: 'Revisão' };
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function filterSessions(sessions, timeFilter, monthFilter, yearFilter, modeFilter) {
  const now = new Date();
  let out = sessions;

  if (timeFilter === 'dia') {
    const today = now.toISOString().split('T')[0];
    out = out.filter(s => s.date && new Date(s.date).toISOString().split('T')[0] === today);
  } else if (timeFilter === 'mes') {
    out = out.filter(s => {
      if (!s.date) return false;
      const d = new Date(s.date);
      return d.getMonth() === monthFilter && d.getFullYear() === yearFilter;
    });
  } else if (timeFilter === 'ano') {
    out = out.filter(s => s.date && new Date(s.date).getFullYear() === yearFilter);
  }

  if (modeFilter !== 'todos') {
    out = out.filter(s => s.mode === modeFilter);
  }
  return out;
}

function generateErrorInsight(filtered, tableStats) {
  if (!filtered.length) return 'Jogue para ver sua análise de erros aqui!';

  const correct   = filtered.reduce((s, x) => s + (x.correct || 0), 0);
  const wrong     = filtered.reduce((s, x) => s + (x.wrong   || 0), 0);
  const total     = correct + wrong;
  const errorRate = total > 0 ? Math.round((wrong / total) * 100) : 0;

  // Tabuada com maior taxa de erro
  let hardestTable = null;
  let hardestRate  = 0;
  if (tableStats) {
    for (const [a, stats] of Object.entries(tableStats)) {
      const t = (stats.correct || 0) + (stats.wrong || 0);
      if (t < 3) continue;
      const rate = (stats.wrong || 0) / t;
      if (rate > hardestRate) { hardestRate = rate; hardestTable = a; }
    }
  }

  // Modo com maior taxa de erro (mín. 5 respostas)
  let hardestMode = null;
  let hardestModeRate = 0;
  const modeMap = {};
  for (const s of filtered) {
    if (!s.mode) continue;
    if (!modeMap[s.mode]) modeMap[s.mode] = { c: 0, w: 0 };
    modeMap[s.mode].c += s.correct || 0;
    modeMap[s.mode].w += s.wrong   || 0;
  }
  for (const [mode, { c, w }] of Object.entries(modeMap)) {
    const t = c + w;
    if (t < 5) continue;
    const rate = w / t;
    if (rate > hardestModeRate) { hardestModeRate = rate; hardestMode = mode; }
  }

  if (errorRate === 0)
    return 'Incrível! Você não cometeu erros no período selecionado. Precisão perfeita! 🌟';
  if (errorRate <= 8) {
    if (hardestTable)
      return `Excelente controle: apenas ${errorRate}% de erros! A tabuada do ${hardestTable} merece atenção especial.`;
    return `Apenas ${errorRate}% de erros — desempenho muito acima da média! Continue assim.`;
  }
  if (errorRate <= 20) {
    if (hardestMode)
      return `Taxa de erro de ${errorRate}%. O modo ${MODE_LABELS[hardestMode]} é onde você erra mais — que tal focar nele?`;
    if (hardestTable)
      return `Taxa de erro de ${errorRate}%. A tabuada do ${hardestTable} é seu maior desafio — pratique mais!`;
    return `Taxa de erro de ${errorRate}%. Com consistência e foco você vai reduzir esse número rapidamente.`;
  }
  if (hardestTable)
    return `${errorRate}% de erros. Praticar a tabuada do ${hardestTable} vai fazer grande diferença no seu desempenho!`;
  return `Taxa de erro de ${errorRate}%. Vá com calma: precisão é mais importante que velocidade.`;
}

// ── Tooltip personalizado ────────────────────────────────────────────────────

function ErrTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-lg text-sm">
      <p className="font-bold text-gray-500">{label}</p>
      <p className="font-black text-rose-500">{payload[0].value}% erros</p>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function ErrorsPage({ onBack }) {
  const { data } = useApp();
  const sessions   = useMemo(() => (data.sessions || []).filter(s => s && s.date), [data.sessions]);
  const tableStats = data.tableStats?.mult || {};

  const now = new Date();
  const [timeFilter,  setTimeFilter]  = useState('todos');
  const [monthFilter, setMonthFilter] = useState(now.getMonth());
  const [yearFilter]                  = useState(now.getFullYear());
  const [modeFilter,  setModeFilter]  = useState('todos');

  const filtered = useMemo(
    () => filterSessions(sessions, timeFilter, monthFilter, yearFilter, modeFilter),
    [sessions, timeFilter, monthFilter, yearFilter, modeFilter]
  );

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const totalCorrect = filtered.reduce((s, x) => s + (x.correct || 0), 0);
  const totalWrong   = filtered.reduce((s, x) => s + (x.wrong   || 0), 0);
  const totalAnswers = totalCorrect + totalWrong;
  const errorRate    = totalAnswers > 0 ? Math.round((totalWrong / totalAnswers) * 100) : 0;

  // Sessão com maior taxa de erro (no período)
  const worstSessionErr = filtered.reduce((best, s) => {
    const t = (s.correct || 0) + (s.wrong || 0);
    const r = t > 0 ? Math.round(((s.wrong || 0) / t) * 100) : 0;
    return r > best ? r : best;
  }, 0);

  // ── Gráfico de evolução ───────────────────────────────────────────────────
  const chartData = filtered.slice(-20).map((s, i) => {
    const t = (s.correct || 0) + (s.wrong || 0);
    return {
      name: s.date ? formatDate(s.date) : `#${i + 1}`,
      err: t > 0 ? Math.round(((s.wrong || 0) / t) * 100) : 0,
    };
  });

  // ── Erros por modo ────────────────────────────────────────────────────────
  const modeData = ['rush', 'zen', 'review'].map(mode => {
    const list = filtered.filter(s => s.mode === mode);
    const c = list.reduce((s, x) => s + (x.correct || 0), 0);
    const w = list.reduce((s, x) => s + (x.wrong   || 0), 0);
    const t = c + w;
    return {
      mode,
      label:     MODE_LABELS[mode],
      count:     list.length,
      wrong:     w,
      errorRate: t > 0 ? Math.round((w / t) * 100) : 0,
    };
  }).filter(m => m.count > 0);
  const maxModeErr = Math.max(...modeData.map(m => m.errorRate), 1);

  // ── Erros por tabuada (sempre global — tableStats não é por sessão) ────────
  const tableData = Object.entries(tableStats)
    .map(([a, stats]) => {
      const t = (stats.correct || 0) + (stats.wrong || 0);
      return {
        a:         parseInt(a),
        correct:   stats.correct || 0,
        wrong:     stats.wrong   || 0,
        total:     t,
        errorRate: t > 0 ? Math.round(((stats.wrong || 0) / t) * 100) : 0,
      };
    })
    .filter(r => r.total >= 1)
    .sort((a, b) => b.errorRate - a.errorRate);

  const maxTableErr   = Math.max(...tableData.map(r => r.errorRate), 1);
  const hardestTable  = tableData[0];

  // ── Meses disponíveis ─────────────────────────────────────────────────────
  const availableMonths = useMemo(() => {
    const set = new Set(
      sessions
        .filter(s => new Date(s.date).getFullYear() === yearFilter)
        .map(s => new Date(s.date).getMonth())
    );
    return Array.from({ length: 12 }, (_, i) => i).filter(m => set.has(m));
  }, [sessions, yearFilter]);

  const insight = useMemo(() => generateErrorInsight(filtered, tableStats), [filtered, tableStats]);

  // ── Render ────────────────────────────────────────────────────────────────
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
          <h2 className="text-xl font-black text-gray-900">Dashboard de Erros</h2>
          <p className="text-sm text-gray-400 font-semibold">Dificuldades e pontos de melhoria</p>
        </div>
      </div>

      {/* Smart insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="opacity-75" />
          <span className="text-xs font-black opacity-75 uppercase tracking-widest">Análise Automática</span>
        </div>
        <p className="font-black text-base leading-snug">{insight}</p>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex flex-col gap-4"
      >
        {/* Período */}
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Período</p>
          <div className="flex gap-2 flex-wrap">
            {[['todos','Todos'],['dia','Hoje'],['mes','Mês'],['ano','Ano']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setTimeFilter(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  timeFilter === v
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de mês */}
        {timeFilter === 'mes' && (
          <div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Mês</p>
            <div className="flex gap-1.5 flex-wrap">
              {Array.from({ length: 12 }, (_, i) => i).map(m => {
                const has = availableMonths.includes(m);
                return (
                  <button
                    key={m}
                    onClick={() => has && setMonthFilter(m)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      monthFilter === m
                        ? 'bg-rose-500 text-white'
                        : has
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {MONTHS[m]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modo */}
        <div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Modo</p>
          <div className="flex gap-2 flex-wrap">
            {[['todos','Todos'],['rush','Rush'],['zen','Zen'],['review','Revisão']].map(([v, l]) => (
              <button
                key={v}
                onClick={() => setModeFilter(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${
                  modeFilter === v
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Conteúdo */}
      {filtered.length > 0 ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<XCircle size={16} />}
              label="Taxa de Erro"
              value={`${errorRate}%`}
              colorClass="bg-rose-100 text-rose-600"
              delay={0.15}
            />
            <StatCard
              icon={<AlertTriangle size={16} />}
              label="Total de Erros"
              value={totalWrong.toLocaleString('pt-BR')}
              colorClass="bg-orange-100 text-orange-600"
              delay={0.2}
            />
            <StatCard
              icon={<BarChart2 size={16} />}
              label="Partidas"
              value={filtered.length}
              colorClass="bg-violet-100 text-violet-600"
              delay={0.25}
            />
            {hardestTable ? (
              <StatCard
                icon={<TrendingDown size={16} />}
                label="Tabuada Difícil"
                value={`×${hardestTable.a}`}
                colorClass="bg-amber-100 text-amber-600"
                delay={0.3}
              />
            ) : (
              <StatCard
                icon={<TrendingDown size={16} />}
                label="Pior Sessão"
                value={`${worstSessionErr}%`}
                colorClass="bg-amber-100 text-amber-600"
                delay={0.3}
              />
            )}
          </div>

          {/* Barra de taxa de erro visual */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-black text-gray-800">Taxa de Erro</p>
              <span className={`text-lg font-black ${
                errorRate <= 10 ? 'text-emerald-600' : errorRate <= 25 ? 'text-amber-500' : 'text-rose-500'
              }`}>{errorRate}%</span>
            </div>
            <Progress
              value={errorRate}
              colorClass={
                errorRate <= 10 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                errorRate <= 25 ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                'bg-gradient-to-r from-rose-500 to-pink-500'
              }
              className="h-3"
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
              <span>{totalWrong.toLocaleString('pt-BR')} erros</span>
              <span>{totalAnswers.toLocaleString('pt-BR')} respostas no total</span>
            </div>
          </motion.div>

          {/* Evolução dos erros (gráfico) */}
          {chartData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="font-black text-gray-800 mb-1">Evolução dos Erros</p>
              <p className="text-xs text-gray-400 font-semibold mb-4">
                % de erros por partida (últimas {Math.min(chartData.length, 20)})
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ErrTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="err"
                    stroke="#F43F5E"
                    strokeWidth={2.5}
                    dot={{ fill: '#F43F5E', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#F43F5E', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Erros por modo */}
          {modeData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="font-black text-gray-800 mb-4">Erros por Modo</p>
              {modeData.map(({ mode, label, errorRate: er, wrong, count }) => (
                <div key={mode} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                    <span>{label}</span>
                    <span>
                      <span className={`font-black ${er >= 25 ? 'text-rose-500' : er >= 12 ? 'text-amber-500' : 'text-emerald-600'}`}>{er}%</span>
                      <span className="font-semibold text-gray-400 ml-1">
                        · {wrong} erros · {count} {count === 1 ? 'partida' : 'partidas'}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(er / maxModeErr) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.48 }}
                      className={`h-full rounded-full ${
                        er >= 25 ? 'bg-gradient-to-r from-rose-500 to-pink-500' :
                        er >= 12 ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                        'bg-gradient-to-r from-emerald-400 to-teal-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Erros por tabuada */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.47 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
          >
            <p className="font-black text-gray-800 mb-1">Erros por Tabuada</p>
            <p className="text-xs text-gray-400 font-semibold mb-4">Histórico completo (fator 2 a 10)</p>
            {tableData.length > 0 ? (
              tableData.map(({ a, errorRate: er, wrong, total }) => {
                const color = er >= 30
                  ? 'from-rose-500 to-pink-500'
                  : er >= 15
                  ? 'from-amber-400 to-orange-400'
                  : 'from-emerald-400 to-teal-500';
                const textColor = er >= 30 ? 'text-rose-600' : er >= 15 ? 'text-amber-600' : 'text-emerald-600';
                return (
                  <div key={a} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                      <span>Tabuada do {a}</span>
                      <span>
                        <span className={`font-black ${textColor}`}>{er}%</span>
                        <span className="font-semibold text-gray-400 ml-1">({wrong}/{total})</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(er / maxTableErr) * 100}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.52 }}
                        className={`h-full bg-gradient-to-r ${color} rounded-full`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                icon="📊"
                title="Dados insuficientes"
                description="Jogue mais partidas para ver a análise detalhada por tabuada."
              />
            )}
          </motion.div>

          {/* Destaque da tabuada mais difícil */}
          {hardestTable && hardestTable.errorRate > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.52 }}
              className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-black text-amber-500 uppercase tracking-widest">
                  Maior Desafio
                </p>
                <p className="text-2xl font-black text-amber-700 mt-0.5">
                  Tabuada do {hardestTable.a}
                </p>
                <p className="text-xs font-semibold text-amber-500 mt-0.5">
                  {hardestTable.errorRate}% de erros · {hardestTable.wrong} de {hardestTable.total} respostas
                </p>
              </div>
              <span className="text-4xl select-none">📚</span>
            </motion.div>
          )}
        </>
      ) : (
        <EmptyState
          icon="❌"
          title="Nenhuma partida nesse filtro"
          description="Tente ajustar o período, o mês ou o modo para ver seus erros."
        />
      )}

      {/* Botão Voltar */}
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar às Estatísticas
      </button>
    </motion.div>
  );
}
