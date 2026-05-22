import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, Target, Trophy, Flame, Download } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getAccuracy, formatDate } from '../utils';
import { Button, StatCard, EmptyState, pageVariants, pageTransition } from '../components/ui';

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

export default function StatsPage({ onBack }) {
  const { data } = useApp();
  const sessions = data.sessions || [];
  const totalAnswers = (data.totalCorrect || 0) + (data.totalWrong || 0);
  const accuracy = getAccuracy(data.totalCorrect || 0, totalAnswers);

  const chartData = sessions
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

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <p className="font-black text-gray-800 mb-4">Evolução de Pontos</p>
        {chartData.length < 2 ? (
          <EmptyState
            icon="📈"
            title="Poucas partidas"
            description="Jogue mais algumas partidas para ver seu gráfico de evolução."
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
