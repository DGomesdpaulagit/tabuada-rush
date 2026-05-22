import { motion } from 'framer-motion';
import { Trophy, BarChart2, Swords, Star, Zap, Heart, Timer } from 'lucide-react';
import { MODE_LIST, LEVELS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getXpProgress } from '../utils';
import { Button, Progress, pageVariants, pageTransition } from '../components/ui';

const modeIcons = { rush: Zap, survival: Heart, speed: Timer, daily: Star };

export default function MenuPage({ onStart, onNavigate }) {
  const { data } = useApp();
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const { pct, toNext } = getXpProgress(data.xp || 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyDone = data.currentDailyDate === todayStr;

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
      <div className="text-center pt-2">
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
      </div>

      {/* Level card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-5 text-white shadow-lg shadow-violet-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-violet-200 text-xs font-bold uppercase tracking-wide">Seu Nível</p>
            <p className="text-2xl font-black mt-0.5">
              {level.badge} {level.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-violet-200 text-xs font-bold">XP Total</p>
            <p className="text-xl font-black">{data.xp || 0}</p>
          </div>
        </div>
        <Progress value={pct} colorClass="bg-white/60" className="bg-white/20 h-2" />
        {LEVELS[levelIdx + 1] && (
          <p className="text-violet-200 text-xs mt-2 font-semibold">
            {toNext} XP para {LEVELS[levelIdx + 1].name}
          </p>
        )}
      </motion.div>

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
            const isDailyDone = mode.id === 'daily' && dailyDone;
            const record = data.records?.[mode.id];
            return (
              <motion.button
                key={mode.id}
                variants={item}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => !isDailyDone && onStart(mode.id)}
                className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all
                  bg-gradient-to-br ${mode.gradientLight} border
                  ${isDailyDone ? 'opacity-60 cursor-default' : `hover:shadow-md ${mode.shadow} hover:shadow-lg`}
                  ${mode.border}`}
              >
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
                {isDailyDone && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl">
                    <div className="text-center">
                      <div className="text-2xl">✅</div>
                      <p className="text-xs font-bold text-gray-600 mt-1">Feito hoje!</p>
                    </div>
                  </div>
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
        <Button variant="secondary" onClick={() => onNavigate('battle')} className="w-full">
          <Swords size={16} />
          2 Jogadores
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
