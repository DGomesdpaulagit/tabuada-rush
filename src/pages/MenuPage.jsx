import { motion } from 'framer-motion';
import { Trophy, BarChart2, Medal, Star, Zap, Heart, Timer, Volume2, VolumeX, LogIn, LogOut, Cloud, Sparkles, Settings } from 'lucide-react';
import { MODE_LIST, LEVELS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { useAudio } from '../hooks/useAudio';
import { getLevelIdx, getXpProgress, getQiInfo } from '../utils';
import { analyzeUser } from '../utils/analysis';
import { Button, Progress, pageVariants, pageTransition } from '../components/ui';

const modeIcons = { rush: Zap, survival: Heart, speed: Timer, daily: Star };

export default function MenuPage({ onStart, onNavigate, onEditGoal }) {
  const { data, cloudSyncing } = useApp();
  const { user, signOut } = useAuth();
  const { enabled: audioEnabled, toggle: toggleAudio } = useAudio();

  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1];
  const { pct, toNext } = getXpProgress(data.xp || 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyDone = data.currentDailyDate === todayStr;
  const streak = data.currentStreak || 0;
  const bestDayStreak = data.bestDayStreak || 0;
  const coins = data.coins || 0;
  const streakGoal = data.streakGoal; // pode ser null (meta ainda não definida)
  const streakGoalBase = data.streakGoalBase || 0;
  const metaProgress = Math.max(0, streak - streakGoalBase); // progresso rumo à meta atual
  const goalPct = streakGoal ? Math.min((metaProgress / streakGoal) * 100, 100) : 0;
  const qiInfo = getQiInfo(data);
  const analysisHeadline = analyzeUser(data).headline;

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="relative text-center pt-2">
        {/* Controls: audio + auth */}
        <div className="absolute right-0 top-1 flex items-center gap-2">
          <button
            onClick={toggleAudio}
            title={audioEnabled ? 'Desativar sons' : 'Ativar sons'}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            {audioEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => onNavigate('settings')}
            title="Configurações"
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Settings size={15} />
          </button>

          {user ? (
            <button
              onClick={signOut}
              title={`Sair (${user.email})`}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <LogOut size={15} />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              title="Entrar / Criar conta"
              className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 hover:bg-violet-200 transition-colors"
            >
              <LogIn size={15} />
            </button>
          )}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="inline-block"
        >
          <h1 className="text-4xl font-black bg-gradient-to-r from-violet-600 to-purple-500 bg-clip-text text-transparent">
            Tabuada Rush
          </h1>
        </motion.div>
        <p className="text-gray-400 text-sm font-semibold mt-1">
          Memorize a tabuada. 5 minutos por dia.
        </p>

        {/* Cloud sync indicator */}
        {cloudSyncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1 mt-1 text-xs text-violet-400 font-semibold"
          >
            <Cloud size={11} className="animate-pulse" />
            Sincronizando...
          </motion.div>
        )}

        {/* Logged in badge */}
        {user && !cloudSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-1 mt-1 text-xs text-emerald-500 font-semibold"
          >
            <Cloud size={11} />
            {user.email}
          </motion.div>
        )}
      </div>

      {/* ── CARD DE PERFIL DO USUÁRIO ──────────────────────────────────────
          Identidade + evolução + progressão. Mantém o gradiente violeta
          original do projeto; apenas mais completo e informativo. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-violet-200"
      >
        {/* Topo: avatar + título/nível + XP total */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
            className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0"
          >
            {level.badge}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-wide truncate">
              {level.title}
            </p>
            <p className="text-2xl font-black leading-tight truncate">{level.name}</p>
            {/* Classificação intelectual (Ranking de QI) — pequena e integrada */}
            <button
              onClick={() => onNavigate('ranking')}
              className="text-violet-200 text-[11px] font-bold truncate mt-0.5 hover:text-white transition-colors text-left"
            >
              {qiInfo.char.emoji} QI {qiInfo.qi} · {qiInfo.char.name}
            </button>
          </div>
          <div className="text-right shrink-0">
            <p className="text-violet-200 text-xs font-bold">XP Total</p>
            <p className="text-xl font-black">{data.xp || 0}</p>
            <p className="text-amber-200 text-xs font-bold mt-0.5">🪙 {coins}</p>
          </div>
        </div>

        {/* Barra de XP */}
        <Progress value={pct} colorClass="bg-white/60" className="bg-white/20 h-2" />
        <p className="text-violet-200 text-xs mt-2 font-semibold">
          {nextLevel ? `${toNext} XP para ${nextLevel.name}` : 'Nível máximo atingido! 🎉'}
        </p>

        {/* Divisor */}
        <div className="h-px bg-white/15 my-4" />

        {/* Ofensiva diária */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-violet-200 text-xs font-bold uppercase tracking-wide">Ofensiva</p>
              <p className="text-lg font-black leading-tight">
                {streak} {streak === 1 ? 'dia' : 'dias'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-wide">Recorde</p>
            <p className="text-lg font-black leading-tight">
              🏆 {bestDayStreak} {bestDayStreak === 1 ? 'dia' : 'dias'}
            </p>
          </div>
        </div>

        {/* Meta de ofensiva */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-violet-200 text-xs font-bold uppercase tracking-wide">
              Meta de Ofensiva
            </p>
            {streakGoal ? (
              <button
                onClick={onEditGoal}
                className="text-xs font-bold text-white/90 hover:text-white transition-colors"
              >
                {Math.min(metaProgress, streakGoal)}/{streakGoal} dias · alterar
              </button>
            ) : (
              <button
                onClick={onEditGoal}
                className="text-xs font-black bg-white text-violet-700 px-3 py-1 rounded-full hover:bg-violet-50 transition-colors"
              >
                Definir meta
              </button>
            )}
          </div>
          <Progress value={goalPct} colorClass="bg-amber-300" className="bg-white/20 h-1.5" />
        </div>
      </motion.div>

      {/* Insight da Análise Inteligente (toque para ver detalhes) */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => onNavigate('stats')}
        className="flex items-center gap-3 w-full text-left bg-white rounded-2xl px-4 py-3 border border-gray-100 shadow-sm hover:border-violet-200 transition-colors"
      >
        <span className="w-8 h-8 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
          <Sparkles size={15} />
        </span>
        <p className="text-sm font-bold text-gray-600 leading-snug">{analysisHeadline}</p>
      </motion.button>

      {/* Mode grid */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Escolha o modo
        </p>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {MODE_LIST.map((mode) => {
            const Icon = modeIcons[mode.id];
            // O Desafio Diário NÃO é mais bloqueado — fica sempre acessível.
            const dailyDoneToday = mode.id === 'daily' && dailyDone;
            const record = data.records?.[mode.id];
            return (
              <motion.button
                key={mode.id}
                variants={item}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onStart(mode.id)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all
                  bg-gradient-to-br ${mode.gradientLight} border
                  hover:shadow-md ${mode.shadow} hover:shadow-lg
                  ${mode.border}`}
              >
                {/* Indicador discreto (não-bloqueante) de que o diário já foi feito hoje */}
                {dailyDoneToday && (
                  <div className="absolute top-2 right-2 bg-white/80 rounded-full px-2 py-0.5 text-[10px] font-black text-emerald-600">
                    ✓ hoje
                  </div>
                )}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-gradient-to-br ${mode.gradient} shadow-sm`}
                >
                  <Icon size={18} className="text-white" />
                </div>
                <p className={`font-black text-sm ${mode.text}`}>{mode.name}</p>
                <p className="text-gray-400 text-xs mt-0.5 font-semibold">{mode.description}</p>
                {record !== undefined && (
                  <p className="text-gray-500 text-xs mt-2 font-bold">Recorde: {record} pts</p>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => onNavigate('records')} className="w-full">
          <Trophy size={16} />
          Recordes
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('stats')} className="w-full">
          <BarChart2 size={16} />
          Estatísticas
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => onNavigate('achievements')} className="w-full">
          <Star size={16} />
          Conquistas
        </Button>
        <Button variant="secondary" onClick={() => onNavigate('ranking')} className="w-full">
          <Medal size={16} />
          Ranking QI
        </Button>
      </div>

      {/* Footer stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-around py-3 bg-gray-50 rounded-2xl border border-gray-100"
      >
        <div className="text-center">
          <p className="text-lg font-black text-gray-800">{data.totalGames || 0}</p>
          <p className="text-xs font-semibold text-gray-400">Partidas</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-lg font-black text-gray-800">{data.bestStreak || 0}</p>
          <p className="text-xs font-semibold text-gray-400">Melhor Seq.</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-lg font-black text-gray-800">{data.totalCorrect || 0}</p>
          <p className="text-xs font-semibold text-gray-400">Acertos</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
