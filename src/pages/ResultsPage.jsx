import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy, Target, X, Flame, Clock } from 'lucide-react';
import { MODES, LEVELS } from '../constants';
import { getLevelIdx, getAccuracy, getRank, formatTime } from '../utils';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

export default function ResultsPage({ result, onReplay, onHome }) {
  const { data } = useApp();
  const cfg = MODES[result.mode];
  const accuracy = getAccuracy(result.correct, result.correct + result.wrong);
  const rank = getRank(result.score);
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const isNewRecord = data.records?.[result.mode] === result.score;

  // XP ganho nesta partida (mesmo cálculo de App.jsx)
  const MODE_XP_MULT = { rush: 0.12, survival: 0.20, speed: 0.16, daily: 0.28, zen: 0, review: 0.16 };
  const xpBase = Math.round((result.score || 0) * (MODE_XP_MULT[result.mode] ?? 0.20));
  const xp2Used = result.xp2Used || false;
  const xpEarned = xp2Used ? xpBase * 2 : xpBase;

  const stats = [
    {
      icon: Trophy,
      label: 'Pontuação',
      value: result.score,
      color: 'bg-violet-100 text-violet-600',
      big: true,
    },
    {
      icon: Target,
      label: 'Acertos',
      value: result.correct,
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: X,
      label: 'Erros',
      value: result.wrong,
      color: 'bg-rose-100 text-rose-600',
    },
    {
      icon: Flame,
      label: 'Melhor Seq.',
      value: result.bestStreak,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Target,
      label: 'Precisão',
      value: `${accuracy}%`,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Clock,
      label: 'Tempo',
      value: formatTime(result.timePlayed || 0),
      color: 'bg-gray-100 text-gray-600',
    },
    // Tempo médio de resposta — só mostra quando disponível
    ...(result.avgMs > 0
      ? [{
          icon: Clock,
          label: 'Tempo Médio/Resp.',
          value: `${(result.avgMs / 1000).toFixed(1)}s`,
          color: 'bg-indigo-100 text-indigo-600',
        }]
      : []),
    // XP ganho — não mostra em modo Zen (xp = 0)
    ...(xpEarned > 0
      ? [{
          icon: Trophy,
          label: xp2Used ? 'XP Ganho ⚡×2' : 'XP Ganho',
          value: xp2Used ? `+${xpEarned} XP` : `+${xpEarned} XP`,
          color: xp2Used ? 'bg-violet-100 text-violet-600' : 'bg-amber-100 text-amber-600',
          highlight: xp2Used,
        }]
      : []),
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {/* Trophy hero */}
      <div className={`bg-gradient-to-br ${cfg.gradient} rounded-3xl p-8 text-center text-white shadow-xl ${cfg.shadow} shadow-lg`}>
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <p className="text-white/70 text-sm font-bold uppercase tracking-wide mb-1">
            Fim de Jogo — {cfg.name}
          </p>
          <motion.p
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            className="text-6xl font-black"
          >
            {result.score}
          </motion.p>
          <p className="text-white/80 text-sm font-semibold mt-1">pontos</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-black bg-white/20`}>
              {rank.label}
            </span>
            {isNewRecord && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.5 }}
                className="inline-block px-3 py-1 rounded-full text-xs font-black bg-white/30"
              >
                🎉 Novo Recorde!
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Banner XP Dobrado */}
      {xp2Used && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl px-4 py-3 text-white shadow-lg shadow-violet-200"
        >
          <span className="text-2xl">⚡</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black leading-tight">XP Dobrado foi usado!</p>
            <p className="text-xs font-semibold text-white/75">
              {xpBase} XP base → <span className="font-black text-white">+{xpEarned} XP</span> (×2)
            </p>
          </div>
        </motion.div>
      )}

      {/* Level info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
      >
        <span className="text-3xl">{level.badge}</span>
        <div>
          <p className="font-black text-gray-800">{level.name}</p>
          <p className="text-xs text-violet-500 font-bold">{level.title}</p>
          <p className="text-xs text-gray-400 font-semibold">{data.xp} XP acumulados</p>
        </div>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-3"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            className={`rounded-2xl p-4 border shadow-sm ${s.big ? 'col-span-2' : ''} ${
              s.highlight
                ? 'bg-violet-50 border-violet-200'
                : 'bg-white border-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={16} />
              </div>
              <div>
                <p className={`text-xl font-black ${s.highlight ? 'text-violet-700' : 'text-gray-900'}`}>{s.value}</p>
                <p className={`text-xs font-bold ${s.highlight ? 'text-violet-400' : 'text-gray-400'}`}>{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onHome} size="icon">
          <Home size={18} />
        </Button>
        <Button onClick={onReplay} className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-lg shadow-violet-200">
          <RotateCcw size={16} />
          Jogar Novamente
        </Button>
      </div>
    </motion.div>
  );
}
