import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, Target, Trophy, Flame, Download, Sparkles, Calendar, Crosshair, CheckCircle, XCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getAccuracy, formatDate } from '../utils';
import { analyzeUser } from '../utils/analysis';
import { Button, StatCard, EmptyState, pageVariants, pageTransition } from '../components/ui';
import HitsPage from './HitsPage';
import ErrorsPage from './ErrorsPage';

// Cores por tom das observações da análise
const TONE = {
  positive: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  warning: 'bg-amber-50 border-amber-100 text-amber-700',
  neutral: 'bg-violet-50 border-violet-100 text-violet-700',
};

// Mostra a variação (delta) de um indicador mensal vs o mês anterior
function Delta({ value, suffix = '' }) {
  if (value == null) return null;
  if (value === 0) return <span className="text-xs font-bold text-gray-400">=</span>;
  const up = value > 0;
  return (
    <span className={`text-xs font-black ${up ? 'text-emerald-600' : 'text-rose-500'}`}>
      {up ? '▲' : '▼'} {Math.abs(value)}{suffix}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-lg text-sm">
      <p className="font-bold text-gray-600">{label}</p>
      <p className="font-black text-violet-600">{payload[0].value} pts</p>
    </div>
  );
}

function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StatsPage({ onBack, onNavigate }) {
  const [view, setView] = useState('main'); // 'main' | 'hits' | 'errors'

  // Sub-páginas internas — renderizadas no lugar desta página
  if (view === 'hits')   return <HitsPage   onBack={() => setView('main')} />;
  if (view === 'errors') return <ErrorsPage onBack={() => setView('main')} />;

  const { data } = useApp();
  const sessions = data.sessions || [];
  // Precisão Global exclui Sobrevivência (termina após 3 erros → distorce a taxa)
  const nonSurvSessions = sessions.filter(s => s.mode !== 'survival');
  const nsCorrect = nonSurvSessions.reduce((sum, s) => sum + (s.correct || 0), 0);
  const nsWrong   = nonSurvSessions.reduce((sum, s) => sum + (s.wrong   || 0), 0);
  const accuracy = getAccuracy(nsCorrect, nsCorrect + nsWrong);
  const analysis = analyzeUser(data);
  const monthly = analysis.monthly;

  // Gráfico de evolução considera SOMENTE as partidas do Desafio Diário
  const chartData = sessions
    .filter((s) => s.mode === 'daily')
    .slice(-20)
    .map((s, i) => ({
      name: s.date ? formatDate(s.date) : `#${i + 1}`,
      pts: s.score || 0,
    }));

  const modeCount = (mode) =>
    sessions.filter((s) => s.mode === mode).length;

  const bestMode = (() => {
    const records = data.records || {};
    const entries = Object.entries(records);
    if (!entries.length) return null;
    const best = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    const labels = { rush: 'Rush', survival: 'Sobrevivência', speed: 'Velocidade', daily: 'Diário' };
    return labels[best[0]] || best[0];
  })();

  function exportJSON() {
    const payload = {
      exportedAt: new Date().toISOString(),
      stats: {
        xp: data.xp,
        totalGames: data.totalGames,
        totalCorrect: data.totalCorrect,
        totalWrong: data.totalWrong,
        bestStreak: data.bestStreak,
        bestScore: data.bestScore,
        bestAccuracy: data.bestAccuracy,
        currentStreak: data.currentStreak,
        dailyCompleted: data.dailyCompleted,
        survivalBest: data.survivalBest,
        speedBest: data.speedBest,
      },
      records: data.records || {},
      achievements: data.achievements || [],
      sessions: data.sessions || [],
    };
    downloadFile(
      JSON.stringify(payload, null, 2),
      `tabuada-rush-${new Date().toISOString().split('T')[0]}.json`,
      'application/json'
    );
  }

  function exportCSV() {
    const rows = [
      ['Data', 'Modo', 'Pontos', 'Acertos', 'Erros'],
      ...sessions.map((s) => [
        s.date ? new Date(s.date).toLocaleString('pt-BR') : '',
        s.mode || '',
        s.score ?? 0,
        s.correct ?? 0,
        s.wrong ?? 0,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    downloadFile(
      csv,
      `tabuada-rush-historico-${new Date().toISOString().split('T')[0]}.csv`,
      'text/csv;charset=utf-8;'
    );
  }

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
          <h2 className="text-xl font-black text-gray-900">Estatísticas</h2>
          <p className="text-sm text-gray-400 font-semibold">Sua evolução ao longo do tempo</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<BarChart2 size={16} />}
          label="Partidas Jogadas"
          value={data.totalGames || 0}
          colorClass="bg-violet-100 text-violet-600"
          delay={0.05}
        />
        <StatCard
          icon={<Target size={16} />}
          label="Precisão Global"
          value={`${accuracy}%`}
          colorClass="bg-emerald-100 text-emerald-600"
          delay={0.1}
        />
        <StatCard
          icon={<Trophy size={16} />}
          label="Maior Pontuação"
          value={data.bestScore || 0}
          colorClass="bg-amber-100 text-amber-600"
          delay={0.15}
        />
        <StatCard
          icon={<Flame size={16} />}
          label="Melhor Sequência"
          value={data.bestStreak || 0}
          colorClass="bg-rose-100 text-rose-600"
          delay={0.2}
        />
      </div>

      {/* Catálogo de Precisão — acesso destacado */}
      {onNavigate && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('accuracy')}
          className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl px-4 py-3 border border-violet-100 hover:border-violet-300 transition-colors"
        >
          <span className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
            <Crosshair size={16} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-violet-700 leading-tight">Catálogo de Precisão</p>
            <p className="text-xs font-semibold text-violet-400">Precisão, velocidade, erros e por tabuada</p>
          </div>
        </motion.button>
      )}

      {/* Dashboards: Acertos / Erros */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* Acertos */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setView('hits')}
          className="flex flex-col items-start gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl px-4 py-4 text-white shadow-md shadow-emerald-100 hover:shadow-emerald-200 transition-shadow"
        >
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <CheckCircle size={16} />
          </span>
          <div>
            <p className="text-sm font-black leading-tight">Acertos</p>
            <p className="text-xs font-semibold opacity-75 leading-tight mt-0.5">Precisão e evolução</p>
          </div>
        </motion.button>

        {/* Erros */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setView('errors')}
          className="flex flex-col items-start gap-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl px-4 py-4 text-white shadow-md shadow-rose-100 hover:shadow-rose-200 transition-shadow"
        >
          <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <XCircle size={16} />
          </span>
          <div>
            <p className="text-sm font-black leading-tight">Erros</p>
            <p className="text-xs font-semibold opacity-75 leading-tight mt-0.5">Dificuldades e falhas</p>
          </div>
        </motion.button>
      </motion.div>

      {/* Análise Inteligente */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Análise Inteligente</p>
        </div>
        <p className="text-sm text-gray-500 font-semibold leading-snug mb-4">{analysis.summary}</p>
        <div className="flex flex-col gap-2">
          {analysis.insights.map((ins, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-2xl p-3 border ${TONE[ins.tone] || TONE.neutral}`}
            >
              <span className="text-lg leading-none">{ins.icon}</span>
              <p className="text-sm font-bold leading-snug">{ins.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resumo Mensal automático */}
      {monthly && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar size={16} className="text-violet-500" />
            <p className="font-black text-gray-800 capitalize">Resumo de {monthly.monthName}</p>
          </div>
          <p className="text-xs text-gray-400 font-semibold mb-4">Seu relatório pessoal do mês</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400">Partidas</p>
              <p className="text-xl font-black text-gray-900">{monthly.games}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400">Dias ativos</p>
              <p className="text-xl font-black text-gray-900">{monthly.daysActive}</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400">Precisão</p>
              <p className="text-xl font-black text-gray-900 flex items-center gap-2">
                {monthly.accuracy}% <Delta value={monthly.accDelta} suffix="%" />
              </p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100">
              <p className="text-xs font-bold text-gray-400">Pontos/partida</p>
              <p className="text-xl font-black text-gray-900 flex items-center gap-2">
                {monthly.avgScore} <Delta value={monthly.scoreDelta} />
              </p>
            </div>
          </div>
          {monthly.avgMs > 0 && (
            <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 mt-3 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400">Tempo médio de resposta</span>
              <span className="text-sm font-black text-gray-900 flex items-center gap-2">
                {(monthly.avgMs / 1000).toFixed(1)}s
                {monthly.avgMsDelta != null && monthly.avgMsDelta !== 0 && (
                  <span className={`text-xs font-black ${monthly.avgMsDelta > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {monthly.avgMsDelta > 0 ? '▲' : '▼'} {(Math.abs(monthly.avgMsDelta) / 1000).toFixed(1)}s
                    {monthly.avgMsDelta > 0 ? ' + rápido' : ' + lento'}
                  </span>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between mt-3 px-1 text-sm font-semibold text-gray-500">
            <span>Modo favorito: <b className="text-gray-800">{monthly.favoriteMode}</b></span>
            <span>🔥 {monthly.streak} {monthly.streak === 1 ? 'dia' : 'dias'}</span>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <p className="font-black text-gray-800 mb-1">Evolução — Desafio Diário</p>
        <p className="text-xs text-gray-400 font-semibold mb-4">Pontuação nas suas partidas do Desafio Diário</p>
        {chartData.length < 2 ? (
          <EmptyState
            icon="📈"
            title="Poucos desafios diários"
            description="Jogue mais alguns Desafios Diários para ver sua evolução."
          />
        ) : (
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
                tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'Nunito' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="pts"
                stroke="#7C3AED"
                strokeWidth={2.5}
                dot={{ fill: '#7C3AED', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#7C3AED', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Per-mode breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <p className="font-black text-gray-800 mb-4">Por Modo</p>
        {[
          { id: 'rush', label: 'Rush', gradient: 'from-violet-500 to-purple-600' },
          { id: 'survival', label: 'Sobrevivência', gradient: 'from-rose-500 to-pink-600' },
          { id: 'speed', label: 'Velocidade', gradient: 'from-amber-400 to-orange-500' },
          { id: 'daily', label: 'Desafio Diário', gradient: 'from-emerald-400 to-teal-600' },
        ].map(({ id, label, gradient }) => {
          const count = modeCount(id);
          const maxCount = Math.max(...['rush', 'survival', 'speed', 'daily'].map(modeCount), 1);
          return (
            <div key={id} className="mb-3 last:mb-0">
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-1">
                <span>{label}</span>
                <span className="font-black">{count} partidas</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxCount) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                />
              </div>
            </div>
          );
        })}
      </motion.div>

      {bestMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-100 text-center"
        >
          <p className="text-xs font-bold text-violet-400 uppercase tracking-wide">Modo Favorito</p>
          <p className="text-xl font-black text-violet-700 mt-1">{bestMode}</p>
        </motion.div>
      )}

      {/* Export section */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
        >
          <p className="font-black text-gray-800 mb-1">Exportar Dados</p>
          <p className="text-xs text-gray-400 font-semibold mb-4">
            Baixe seu histórico completo de {sessions.length} partidas
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={exportJSON}
              className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-violet-50 text-violet-700 font-bold text-sm border border-violet-200 hover:bg-violet-100 transition-colors"
            >
              <Download size={14} />
              JSON
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 h-11 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-sm border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Download size={14} />
              CSV
            </button>
          </div>
        </motion.div>
      )}

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
