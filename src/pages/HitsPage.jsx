import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, CheckCircle, TrendingUp, Award, Zap } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { formatDate } from '../utils';
import { StatCard, EmptyState, Progress, pageVariants, pageTransition } from '../components/ui';

// ── Constantes ───────────────────────────────────────────────────────────────

const MODE_LABELS  = { rush: 'Rush', survival: 'Sobrevivência', speed: 'Velocidade', daily: 'Diário' };
const MODE_GRADIENT = {
  rush:     'from-violet-500 to-purple-600',
  survival: 'from-rose-500 to-pink-600',
  speed:    'from-amber-400 to-orange-500',
  daily:    'from-emerald-400 to-teal-600',
};
const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function sessAcc(list) {
  let c = 0, w = 0;
  for (const s of list) { c += s.correct || 0; w += s.wrong || 0; }
  const t = c + w;
  return t ? c / t : 0;
}

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

function generateInsight(filtered) {
  if (!filtered.length) return 'Jogue para ver sua análise de acertos aqui!';

  const correct = filtered.reduce((s, x) => s + (x.correct || 0), 0);
  const wrong   = filtered.reduce((s, x) => s + (x.wrong   || 0), 0);
  const total   = correct + wrong;
  const acc     = total > 0 ? Math.round((correct / total) * 100) : 0;

  const n    = filtered.length;
  const half = Math.max(1, Math.floor(n / 2));
  const recent = filtered.slice(-half);
  const older  = n >= half * 2 ? filtered.slice(-half * 2, -half) : [];

  const recentAcc = sessAcc(recent);
  const olderAcc  = older.length ? sessAcc(older) : null;
  const delta     = olderAcc != null ? Math.round((recentAcc - olderAcc) * 100) : null;

  if (acc >= 92)
    return `Precisão excepcional de ${acc}%! Você está no nível de elite — continue assim!`;
  if (delta != null && delta >= 8)
    return `Sua precisão subiu para ${acc}%! Você evoluiu ${delta}% nas últimas partidas. 🚀`;
  if (acc >= 80)
    return `Boa precisão de ${acc}%! Você acerta consistentemente. Um pouco mais de foco leva ao topo.`;
  if (delta != null && delta >= 3)
    return `Sua precisão de ${acc}% está melhorando! Continue praticando com regularidade.`;
  if (acc >= 65)
    return `Precisão de ${acc}% — você domina as bases. Com treino constante você vai subir muito!`;
  return `Você acerta ${acc}% das contas. Vá com calma nas respostas: qualidade vale mais que velocidade.`;
}

// ── Tooltip personalizado ────────────────────────────────────────────────────

function AccTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-lg text-sm">
      <p className="font-bold text-gray-500">{label}</p>
      <p className="font-black text-emerald-600">{payload[0].value}%</p>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function HitsPage({ onBack }) {
  const { data } = useApp();
  const sessions = useMemo(
    () => (data.sessions || []).filter(s => s && s.date),
    [data.sessions]
  );

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
  const totalCorrect  = filtered.reduce((s, x) => s + (x.correct || 0), 0);
  const totalWrong    = filtered.reduce((s, x) => s + (x.wrong   || 0), 0);
  const totalAnswers  = totalCorrect + totalWrong;
  const accuracy      = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  // Melhor precisão numa única partida (período filtrado)
  const bestSessionAcc = filtered.reduce((best, s) => {
    const t = (s.correct || 0) + (s.wrong || 0);
    const a = t > 0 ? Math.round((s.correct / t) * 100) : 0;
    return Math.max(best, a);
  }, 0);

  // ── Gráfico de evolução ───────────────────────────────────────────────────
  const chartData = filtered.slice(-20).map((s, i) => {
    const t = (s.correct || 0) + (s.wrong || 0);
    return {
      name: s.date ? formatDate(s.date) : `#${i + 1}`,
      acc: t > 0 ? Math.round((s.correct / t) * 100) : 0,
    };
  });

  // ── Acertos por modo ──────────────────────────────────────────────────────
  const modeData = ['rush', 'survival', 'speed', 'daily'].map(mode => {
    const list = filtered.filter(s => s.mode === mode);
    const c = list.reduce((s, x) => s + (x.correct || 0), 0);
    const w = list.reduce((s, x) => s + (x.wrong   || 0), 0);
    const t = c + w;
    return {
      mode,
      label:    MODE_LABELS[mode],
      count:    list.length,
      correct:  c,
      acc:      t > 0 ? Math.round((c / t) * 100) : 0,
      gradient: MODE_GRADIENT[mode],
    };
  }).filter(m => m.count > 0);

  // ── Meses disponíveis no ano ──────────────────────────────────────────────
  const availableMonths = useMemo(() => {
    const set = new Set(
      sessions
        .filter(s => new Date(s.date).getFullYear() === yearFilter)
        .map(s => new Date(s.date).getMonth())
    );
    return Array.from({ length: 12 }, (_, i) => i).filter(m => set.has(m));
  }, [sessions, yearFilter]);

  const insight = useMemo(() => generateInsight(filtered), [filtered]);

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
          <h2 className="text-xl font-black text-gray-900">Dashboard de Acertos</h2>
          <p className="text-sm text-gray-400 font-semibold">Seu desempenho e evolução</p>
        </div>
      </div>

      {/* Smart insight */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 text-white"
      >
        <div className="flex items-center gap-2 mb-2">
          <Target size={16} className="opacity-75" />
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
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Seletor de mês (só quando Período = Mês) */}
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
                        ? 'bg-emerald-500 text-white'
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
            {[['todos','Todos'],['rush','Rush'],['survival','Sobrevivência'],['speed','Velocidade'],['daily','Diário']].map(([v, l]) => (
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

      {/* Conteúdo (com dados) ou estado vazio */}
      {filtered.length > 0 ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Target size={16} />}
              label="Precisão"
              value={`${accuracy}%`}
              colorClass="bg-emerald-100 text-emerald-600"
              delay={0.15}
            />
            <StatCard
              icon={<CheckCircle size={16} />}
              label="Total de Acertos"
              value={totalCorrect.toLocaleString('pt-BR')}
              colorClass="bg-teal-100 text-teal-600"
              delay={0.2}
            />
            <StatCard
              icon={<Award size={16} />}
              label="Melhor Sessão"
              value={`${bestSessionAcc}%`}
              colorClass="bg-violet-100 text-violet-600"
              delay={0.25}
            />
            <StatCard
              icon={<TrendingUp size={16} />}
              label="Partidas"
              value={filtered.length}
              colorClass="bg-blue-100 text-blue-600"
              delay={0.3}
            />
          </div>

          {/* Barra de precisão visual */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-black text-gray-800">Taxa de Acerto</p>
              <span className={`text-lg font-black ${
                accuracy >= 80 ? 'text-emerald-600' : accuracy >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{accuracy}%</span>
            </div>
            <Progress
              value={accuracy}
              colorClass={
                accuracy >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                accuracy >= 60 ? 'bg-gradient-to-r from-amber-400 to-orange-400' :
                'bg-gradient-to-r from-rose-400 to-pink-500'
              }
              className="h-3"
            />
            <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
              <span>{totalCorrect.toLocaleString('pt-BR')} acertos</span>
              <span>{totalWrong.toLocaleString('pt-BR')} erros</span>
            </div>
          </motion.div>

          {/* Evolução da precisão (gráfico) */}
          {chartData.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="font-black text-gray-800 mb-1">Evolução da Precisão</p>
              <p className="text-xs text-gray-400 font-semibold mb-4">
                % de acertos por partida (últimas {Math.min(chartData.length, 20)})
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
                  <Tooltip content={<AccTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="acc"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10B981', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Precisão por modo */}
          {modeData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42 }}
              className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
            >
              <p className="font-black text-gray-800 mb-4">Precisão por Modo</p>
              {modeData.map(({ mode, label, acc, correct, count, gradient }) => (
                <div key={mode} className="mb-3 last:mb-0">
                  <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                    <span>{label}</span>
                    <span>
                      <span className="font-black text-emerald-600">{acc}%</span>
                      <span className="font-semibold text-gray-400 ml-1">
                        · {correct} acertos · {count} {count === 1 ? 'partida' : 'partidas'}
                      </span>
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${acc}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.48 }}
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Sequência / recorde pessoal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.47 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                Maior Sequência de Acertos
              </p>
              <p className="text-3xl font-black text-emerald-700 mt-0.5">
                {data.bestStreak || 0}
              </p>
              <p className="text-xs font-semibold text-emerald-400 mt-0.5">seu recorde pessoal</p>
            </div>
            <span className="text-5xl select-none">🎯</span>
          </motion.div>
        </>
      ) : (
        <EmptyState
          icon="✅"
          title="Nenhuma partida nesse filtro"
          description="Tente ajustar o período, o mês ou o modo para ver seus acertos."
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
