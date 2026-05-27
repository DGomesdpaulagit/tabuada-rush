import { motion } from 'framer-motion';
import { Trophy, BarChart2, Medal, Star, Zap, Heart, Timer, LogIn, Cloud, Sparkles, Settings, TrendingUp, ShoppingBag, Map, Leaf } from 'lucide-react';
import { MODE_LIST, LEVELS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getLevelIdx, getXpProgress, getQiInfo } from '../utils';
import { analyzeUser } from '../utils/analysis';
import { SHOP_ITEM_MAP } from '../constants/shop';
import { countUnclaimedMissions } from '../utils/missions';
import { Button, Progress, pageVariants, pageTransition } from '../components/ui';

const modeIcons = { rush: Zap, survival: Heart, speed: Timer, daily: Star };

export default function MenuPage({ onStart, onNavigate, onEditGoal }) {
  const { data, cloudSyncing } = useApp();
  const { user } = useAuth();

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

  // ── Cosméticos equipados ───────────────────────────────────────────────────
  const equippedItems  = data.equippedItems || {};
  const equippedFrame  = equippedItems.frame  ? SHOP_ITEM_MAP[equippedItems.frame]  : null;
  const equippedCard   = equippedItems.card   ? SHOP_ITEM_MAP[equippedItems.card]   : null;
  const equippedTitle  = equippedItems.title  ? SHOP_ITEM_MAP[equippedItems.title]  : null;
  const frameStyle     = equippedFrame?.frameStyle || '';
  const cardGradient   = equippedCard?.cardGradient  || 'from-violet-600 to-purple-600';
  const displayTitle   = equippedTitle?.displayTitle  || level.title;
  const unclaimedMissions = countUnclaimedMissions(data.missionsData);

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
        {/* Controles: configurações (áudio/som/música agora ficam dentro dela)
            + login apenas quando o usuário NÃO está logado (conta fica nas configs) */}
        <div className="absolute right-0 top-1 flex items-center gap-2">
          <button
            onClick={() => onNavigate('settings')}
            title="Configurações"
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <Settings size={15} />
          </button>

          {!user && (
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
        className={`bg-gradient-to-r ${cardGradient} rounded-3xl p-5 text-white shadow-lg shadow-violet-200`}
      >
        {/* Topo: avatar + título/nível + XP total */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
            className={`w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0 ${frameStyle}`}
          >
            {level.badge}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide truncate">
              {displayTitle}
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

      {/* Catálogo de Progresso — acesso destacado */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('catalog')}
        className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl px-4 py-3 border border-violet-100 hover:border-violet-300 transition-colors"
      >
        <span className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
          <TrendingUp size={16} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-violet-700 leading-tight">Catálogo de Progresso</p>
          <p className="text-xs font-semibold text-violet-400">Veja sua evolução e jornada completa</p>
        </div>
      </motion.button>

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

      {/* ── Fase 7: Loja · Missões · Temporada ──────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onNavigate('shop')}
          className="flex flex-col items-center gap-1.5 py-3 bg-amber-50 border border-amber-200 rounded-2xl hover:bg-amber-100 transition-colors active:scale-[0.97]"
        >
          <ShoppingBag size={18} className="text-amber-600" />
          <span className="text-xs font-black text-amber-700">Loja</span>
        </button>

        <div className="relative">
          <button
            onClick={() => onNavigate('missions')}
            className="w-full flex flex-col items-center gap-1.5 py-3 bg-emerald-50 border border-emerald-200 rounded-2xl hover:bg-emerald-100 transition-colors active:scale-[0.97]"
          >
            <Map size={18} className="text-emerald-600" />
            <span className="text-xs font-black text-emerald-700">Missões</span>
          </button>
          {unclaimedMissions > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 z-10 shadow-sm">
              {unclaimedMissions}
            </span>
          )}
        </div>

        <button
          onClick={() => onNavigate('seasons')}
          className="flex flex-col items-center gap-1.5 py-3 bg-violet-50 border border-violet-200 rounded-2xl hover:bg-violet-100 transition-colors active:scale-[0.97]"
        >
          <Leaf size={18} className="text-violet-600" />
          <span className="text-xs font-black text-violet-700">Temporada</span>
        </button>
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
