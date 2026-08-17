import { motion } from 'framer-motion';
import {
  ArrowLeft, TrendingUp, Star, Flame, Trophy, Sparkles,
  Calendar, Lock, Check, Target, Award, History,
} from 'lucide-react';
import { LEVELS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getXpProgress, getAccuracy, formatDate } from '../utils';
import { getLeagueStandings } from '../utils/leagues';
import { analyzeUser } from '../utils/analysis';
import { Progress, StatCard, EmptyState, Button, pageVariants, pageTransition } from '../components/ui';

const DAY = 86400000;

// Cor do ponto do registro por tipo de marco
const LOG_TONE = {
  level: 'bg-violet-100 text-violet-600',
  xp: 'bg-amber-100 text-amber-600',
  streak: 'bg-rose-100 text-rose-600',
  record: 'bg-emerald-100 text-emerald-600',
};

// Resumo de uma janela de tempo (partidas + precisão) a partir das sessões
function windowSummary(sessions, fromTs, toTs) {
  const list = sessions.filter((s) => {
    const t = new Date(s.date).getTime();
    return t >= fromTs && t < toTs;
  });
  let c = 0, w = 0;
  for (const s of list) { c += s.correct || 0; w += s.wrong || 0; }
  return { games: list.length, accuracy: getAccuracy(c, c + w) };
}

export default function CatalogPage({ onBack }) {
  const { data } = useApp();

  const xp = data.xp || 0;
  const levelIdx = getLevelIdx(xp);
  const level = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1];
  const { pct, toNext } = getXpProgress(xp);
  const xpInLevel = xp - level.xp;
  const levelSpan = nextLevel ? nextLevel.xp - level.xp : 0;
  const { league, playerRank, total: leagueTotal } = getLeagueStandings(data);

  const totalAnswers = (data.totalCorrect || 0) + (data.totalWrong || 0);
  const overallAcc = getAccuracy(data.totalCorrect || 0, totalAnswers);

  // Evolução: esta semana / este mês / total
  const sessions = (data.sessions || []).filter((s) => s && s.date);
  const now = Date.now();
  const week = windowSummary(sessions, now - 7 * DAY, now + DAY);
  const monthly = analyzeUser(data).monthly;

  // Registro de evolução (mais recente primeiro)
  const log = [...(data.progressLog || [])].reverse();

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
          <h2 className="text-xl font-black text-gray-900">Catálogo de Progresso</h2>
          <p className="text-sm text-gray-400 font-semibold">Sua jornada, evolução e crescimento</p>
        </div>
      </div>

      {/* ── PROGRESSO GERAL (resumo) ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-violet-200"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
            {level.badge}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-wide truncate">
              {level.title}
            </p>
            <p className="text-2xl font-black leading-tight truncate">{level.name}</p>
            <p className="text-violet-200 text-[11px] font-bold truncate mt-0.5">
              {league.emoji} Liga {league.name} · {playerRank}º de {leagueTotal}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-xl font-black leading-none">{data.xp || 0}</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">XP Total</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-xl font-black leading-none">🔥 {data.currentStreak || 0}</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">Ofensiva</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3 text-center">
            <p className="text-xl font-black leading-none">{data.totalGames || 0}</p>
            <p className="text-violet-200 text-[11px] font-bold mt-1">Partidas</p>
          </div>
        </div>
      </motion.div>

      {/* ── CATÁLOGO DE XP ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Experiência (XP)</p>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-violet-50 p-3 border border-violet-100">
            <p className="text-xs font-bold text-violet-400">XP no nível atual</p>
            <p className="text-xl font-black text-violet-700">
              {xpInLevel}{nextLevel ? ` / ${levelSpan}` : ''}
            </p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-3 border border-amber-100">
            <p className="text-xs font-bold text-amber-500">XP total acumulado</p>
            <p className="text-xl font-black text-amber-600">{data.xp || 0}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-gray-500">Progresso até o próximo nível</span>
          <span className="text-xs font-black text-violet-600">{Math.round(pct)}%</span>
        </div>
        <Progress value={pct} className="h-2.5" colorClass="bg-gradient-to-r from-violet-500 to-purple-600" />
        <p className="text-xs text-gray-400 font-semibold mt-2">
          {nextLevel ? `Faltam ${toNext} XP para ${nextLevel.name}` : 'Nível máximo atingido! 🎉'}
        </p>
      </motion.div>

      {/* ── EVOLUÇÃO (semana / mês / total) ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Sua Evolução</p>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Crescimento ao longo do tempo</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Semana</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{week.games}</p>
            <p className="text-[11px] font-bold text-gray-400">partidas</p>
            <p className="text-xs font-black text-emerald-600 mt-1">{week.accuracy}%</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Mês</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{monthly?.games || 0}</p>
            <p className="text-[11px] font-bold text-gray-400">partidas</p>
            <p className="text-xs font-black text-emerald-600 mt-1">{monthly?.accuracy || 0}%</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 border border-gray-100 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{data.totalGames || 0}</p>
            <p className="text-[11px] font-bold text-gray-400">partidas</p>
            <p className="text-xs font-black text-emerald-600 mt-1">{overallAcc}%</p>
          </div>
        </div>
      </motion.div>

      {/* ── MARCOS DE PROGRESSO ──────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <Award size={15} className="text-violet-500" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Marcos de Progresso</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<Star size={16} />}
            label="Nível alcançado"
            value={levelIdx + 1}
            colorClass="bg-violet-100 text-violet-600"
            delay={0.05}
          />
          <StatCard
            icon={<Flame size={16} />}
            label="Ofensiva recorde"
            value={`${data.bestDayStreak || 0} dias`}
            colorClass="bg-rose-100 text-rose-600"
            delay={0.1}
          />
          <StatCard
            icon={<Trophy size={16} />}
            label="Maior pontuação"
            value={data.bestScore || 0}
            colorClass="bg-amber-100 text-amber-600"
            delay={0.15}
          />
          <StatCard
            icon={<Target size={16} />}
            label="Total de acertos"
            value={data.totalCorrect || 0}
            colorClass="bg-emerald-100 text-emerald-600"
            delay={0.2}
          />
        </div>
      </div>

      {/* ── CATÁLOGO DE NÍVEIS ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="font-black text-gray-800">Catálogo de Níveis</p>
          <span className="text-xs font-black text-violet-600">{levelIdx + 1}/{LEVELS.length}</span>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Toda a sua jornada de progressão</p>
        <div className="flex flex-col gap-2">
          {LEVELS.map((lv, i) => {
            const unlocked = i < levelIdx;
            const current = i === levelIdx;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-2xl p-3 border transition-colors ${
                  current
                    ? 'bg-violet-50 border-violet-200'
                    : unlocked
                    ? 'bg-white border-gray-100'
                    : 'bg-gray-50 border-gray-100 opacity-60'
                }`}
              >
                <span className={`text-2xl shrink-0 ${!unlocked && !current ? 'grayscale opacity-50' : ''}`}>
                  {lv.badge}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-black text-sm truncate ${current ? 'text-violet-700' : unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                      {lv.name}
                    </p>
                    <span className="text-[10px] font-bold text-gray-300">Nv {i + 1}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold truncate">{lv.title}</p>
                  {current && nextLevel && (
                    <div className="mt-1.5">
                      <Progress value={pct} className="h-1.5" colorClass="bg-violet-500" />
                    </div>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  {unlocked && (
                    <span className="w-5 h-5 inline-flex items-center justify-center bg-emerald-500 rounded-full text-white">
                      <Check size={12} />
                    </span>
                  )}
                  {current && (
                    <span className="text-[10px] font-black bg-violet-600 text-white px-2 py-0.5 rounded-full">
                      ATUAL
                    </span>
                  )}
                  {!unlocked && !current && (
                    <div className="flex flex-col items-end gap-0.5">
                      <Lock size={12} className="text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-300">{lv.xp} XP</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── REGISTRO DE EVOLUÇÃO (histórico de marcos) ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-1">
          <History size={16} className="text-violet-500" />
          <p className="font-black text-gray-800">Registro de Evolução</p>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Marcos importantes da sua jornada</p>
        {log.length === 0 ? (
          <EmptyState
            icon="🧭"
            title="Sua jornada começa agora"
            description="Seus marcos (níveis, XP, ofensivas e recordes) aparecerão aqui conforme você evolui."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {log.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                className="flex items-center gap-3"
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${LOG_TONE[e.type] || 'bg-gray-100 text-gray-500'}`}>
                  {e.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm text-gray-900 truncate">{e.title}</p>
                  <p className="text-[11px] text-gray-400 font-semibold truncate">{e.detail}</p>
                </div>
                <span className="text-[11px] font-bold text-gray-300 shrink-0">{formatDate(e.date)}</span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
