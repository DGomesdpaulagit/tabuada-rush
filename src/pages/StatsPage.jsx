import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, Target, Download, Sparkles, Calendar, Crosshair } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useApp } from '../contexts/AppContext';
import { getAccuracy, formatDate } from '../utils';
import { analyzeUser } from '../utils/analysis';
import { Button, StatCard, EmptyState, pageVariants, pageTransition } from '../components/ui';
import StreakHeatmap from '../components/StreakHeatmap';
import AccuracyCatalogPage from './AccuracyCatalogPage';
import GameIcon from '../components/GameIcon';

// ── GUIA LATERAL [v6.0 · Bloco 7] ────────────────────────────────────────────
// "Estatísticas é muita coisa" (Davi) — sumário fixo tipo Notion pra navegar
// direto pra seção sem rolar às cegas. Só em telas largas (lg+, mesmo
// breakpoint da Sidebar) — a referência visual que o Davi ia mandar nunca
// chegou nesta sessão, então essa é uma primeira interpretação; ajustar
// quando/se ele mandar o print.
const TOC_SECTIONS = [
  { id: 'stats-resumo', label: 'Resumo' },
  { id: 'stats-catalogo', label: 'Catálogo de Precisão' },
  { id: 'stats-analise', label: 'Análise' },
  { id: 'stats-mensal', label: 'Mês' },
  { id: 'stats-evolucao', label: 'Evolução' },
  { id: 'stats-erros-semana', label: 'Erros da semana' },
  { id: 'stats-exportar', label: 'Exportar' },
];

function TableOfContents() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav className="hidden lg:flex flex-col gap-1 fixed right-4 top-1/2 -translate-y-1/2 z-30">
      {TOC_SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          title={s.label}
          className="group flex items-center justify-end gap-2 py-1"
        >
          <span className="text-[11px] font-bold text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface border border-border rounded-lg px-2 py-0.5 shadow-sm">
            {s.label}
          </span>
          <span className="w-2 h-2 rounded-full bg-border group-hover:bg-accent transition-colors shrink-0" />
        </button>
      ))}
    </nav>
  );
}

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

export default function StatsPage({ onBack }) {
  // 'main' | 'accuracy'
  // [v6.0 · Bloco 6] Recordes/Conquistas/Catálogo migraram pro Perfil.
  // [v6.0 · Bloco 7] Acertos/Erros migraram pra DENTRO do Catálogo de
  // Precisão (ver AccuracyCatalogPage.jsx) — não são mais destinos daqui.
  // "Partidas por modo"/"Power-ups"/"Modo favorito" removidos de vez (pedido
  // explícito do Davi, ver planejamento-6.0.md seção 10).
  const [view, setView] = useState('main');

  if (view === 'accuracy') return <AccuracyCatalogPage onBack={() => setView('main')} />;

  const { data } = useApp();
  const sessions = data.sessions || [];
  // Precisão Global exclui Sobrevivência (modo removido na 5.0 — filtro
  // mantido só por segurança retroativa em sessões salvas antigas)
  const nonSurvSessions = sessions.filter(s => s.mode !== 'survival');
  const nsCorrect = nonSurvSessions.reduce((sum, s) => sum + (s.correct || 0), 0);
  const nsWrong   = nonSurvSessions.reduce((sum, s) => sum + (s.wrong   || 0), 0);
  const accuracy = getAccuracy(nsCorrect, nsCorrect + nsWrong);
  const analysis = analyzeUser(data);
  const monthly = analysis.monthly;

  // [v6.0 · Bloco 7] Evolução considera o Rush (modo principal) — antes
  // filtrava por 'daily' (Desafio Diário), removido na fusão de modos da
  // 5.0, então o gráfico nunca tinha dado pra mostrar.
  const chartData = sessions
    .filter((s) => s.mode === 'rush')
    .slice(-20)
    .map((s, i) => ({
      name: s.date ? formatDate(s.date) : `#${i + 1}`,
      pts: s.score || 0,
    }));

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
      <TableOfContents />

      {/* Header */}
      <div id="stats-resumo" className="flex items-center gap-3 scroll-mt-4">
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
          icon={<GameIcon name="podio" size={17} />}
          label="Maior Pontuação"
          value={data.bestScore || 0}
          colorClass="bg-amber-100 text-amber-600"
          delay={0.15}
        />
        <StatCard
          icon={<GameIcon name="ofensiva" size={17} />}
          label="Melhor Sequência"
          value={data.bestStreak || 0}
          colorClass="bg-rose-100 text-rose-600"
          delay={0.2}
        />
      </div>

      {/* Heatmap de Ofensiva — 365 dias estilo GitHub */}
      <StreakHeatmap sessions={data.sessions || []} />

      {/* Catálogo de Precisão — agora também é onde Acertos e Erros vivem
          (sub-seções, ver AccuracyCatalogPage.jsx) */}
      <motion.button
        id="stats-catalogo"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setView('accuracy')}
        className="scroll-mt-4 flex items-center gap-3 w-full text-left bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl px-4 py-3 border border-violet-100 hover:border-violet-300 transition-colors"
      >
        <span className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
          <Crosshair size={16} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-violet-700 leading-tight">Catálogo de Precisão</p>
          <p className="text-xs font-semibold text-violet-400">Acertos, erros, velocidade e por tabuada</p>
        </div>
      </motion.button>

      {/* Análise Inteligente */}
      <motion.div
        id="stats-analise"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="scroll-mt-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
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
              <span className="text-lg">{ins.icon}</span>
              <p className="text-sm font-bold leading-snug">{ins.text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resumo Mensal automático */}
      {monthly && (
        <motion.div
          id="stats-mensal"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="scroll-mt-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
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
        id="stats-evolucao"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="scroll-mt-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <p className="font-black text-gray-800 mb-1">Evolução — Rush</p>
        <p className="text-xs text-gray-400 font-semibold mb-4">Pontuação nas suas partidas de Rush</p>
        {chartData.length < 2 ? (
          <EmptyState
            icon="📈"
            title="Poucas partidas de Rush"
            description="Jogue mais algumas partidas de Rush para ver sua evolução."
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

      {/* ── Histórico Semanal de Erros ──────────────────────────────────── */}
      {sessions.length > 0 && (() => {
        const last7 = Array.from({ length: 7 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - i));
          return d.toISOString().split('T')[0];
        });
        const errorsByDay = last7.map((day) => {
          const dayErrors = sessions
            .filter((s) => s.date && s.date.startsWith(day))
            .reduce((sum, s) => sum + (s.wrong || 0), 0);
          const d = new Date(day + 'T12:00:00');
          const label = d.toLocaleDateString('pt-BR', { weekday: 'short' });
          const dayNum = d.toLocaleDateString('pt-BR', { day: '2-digit' });
          return { label, dayNum, errors: dayErrors };
        });
        const maxErr = Math.max(...errorsByDay.map((d) => d.errors), 1);
        const totalWeekErr = errorsByDay.reduce((s, d) => s + d.errors, 0);
        return (
          <motion.div
            id="stats-erros-semana"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="scroll-mt-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="font-black text-gray-800">Erros — Últimos 7 Dias</p>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                {totalWeekErr} total
              </span>
            </div>
            <p className="text-xs text-gray-400 font-semibold mb-4">Erros por dia na semana</p>
            <div className="flex items-end justify-between gap-1 h-24">
              {errorsByDay.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end" style={{ height: '64px' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.errors / maxErr) * 64}px` }}
                      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.35 + i * 0.04 }}
                      className={`w-full rounded-t-lg ${d.errors > 0 ? 'bg-rose-400' : 'bg-gray-100'}`}
                      style={{ minHeight: d.errors > 0 ? '4px' : '2px' }}
                    />
                  </div>
                  {d.errors > 0 && (
                    <span className="text-[10px] font-black text-rose-500">{d.errors}</span>
                  )}
                  <span className="text-[9px] font-bold text-gray-400 capitalize">{d.label}</span>
                  <span className="text-[9px] font-semibold text-gray-300">{d.dayNum}</span>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })()}

      {/* Export section */}
      {sessions.length > 0 && (
        <motion.div
          id="stats-exportar"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="scroll-mt-4 bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
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
