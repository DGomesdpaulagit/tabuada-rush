import { motion } from 'framer-motion';
import { Home, RotateCcw, Trophy, Target, X, Flame, Clock, Share2 } from 'lucide-react';
import { MODES, LEVELS } from '../constants';
import { getLevelIdx, getAccuracy, getRank, formatTime } from '../utils';
import { getLeagueStandings } from '../utils/leagues';
import { POTIONS, SHOP_ITEM_MAP, POTION_MAP } from '../constants/shop';
import { CHESTS } from '../constants/loot';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';
import { shareCard } from '../lib/shareCard';
import GameIcon from '../components/GameIcon';

export default function ResultsPage({ result, onReplay, onHome }) {
  const { data } = useApp();
  const cfg = MODES[result.mode];
  const accuracy = getAccuracy(result.correct, result.correct + result.wrong);
  const rank = getRank(result.score);
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const isNewRecord = data.records?.[result.mode] === result.score;

  // XP ganho nesta partida (mesmo cálculo de App.jsx)
  const MODE_XP_MULT = { rush: 0.12, survival: 0.20, speed: 0.16, daily: 0.28, zen: 0.10, review: 0.16, hard: 0.22, personal: 0.18, weekly: 0.30, inverse: 0.20, combined: 0.25 };
  const xpBase = Math.round((result.score || 0) * (MODE_XP_MULT[result.mode] ?? 0.20));
  // [D046] Poção de XP ativa durante a partida — `potionMultiplier` vem de
  // App.jsx handleGameEnd (mesmo padrão que o antigo `xp2Used`, D043).
  const potionMultiplier = result.potionMultiplier || 1;
  const xpEarned = Math.round(xpBase * potionMultiplier);

  // [Fase 6, sessão 071] Loot achado nesta partida (baús/power-ups/poções) —
  // vem pronto de App.jsx handleGameEnd (`rollMatchLoot`). Mostrado aqui como
  // um resumo simples; a Fase 7 (páginas de resumo pós-partida) vai substituir
  // isso por uma página dedicada quando existir.
  const loot = result.loot || { chests: [], powerupIds: [], potionIds: [] };
  const lootCoins = loot.chests.reduce((sum, c) => sum + c.coins, 0);
  const hasLoot = loot.chests.length > 0 || loot.powerupIds.length > 0 || loot.potionIds.length > 0;

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
          label: potionMultiplier > 1 ? `XP Ganho ×${potionMultiplier}` : 'XP Ganho',
          value: `+${xpEarned} XP`,
          color: 'bg-amber-100 text-amber-600',
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

      {/* [D046] Banner da Poção de XP ativa — mesmo espírito do banner do
          antigo XP Dobrado (D043), agora genérico pro multiplicador real */}
      {potionMultiplier > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          className="flex items-center gap-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl px-4 py-3 text-white shadow-lg shadow-violet-200"
        >
          <GameIcon name={POTIONS.find((p) => p.multiplier === potionMultiplier)?.art} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black leading-tight">Poção de XP ativa!</p>
            <p className="text-xs font-semibold text-white/75">
              {xpBase} XP base → <span className="font-black text-white">+{xpEarned} XP</span> (×{potionMultiplier})
            </p>
          </div>
        </motion.div>
      )}

      {/* [Fase 6, sessão 071] Recompensas achadas na partida — resumo simples,
          página dedicada fica pra Fase 7 */}
      {hasLoot && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4"
        >
          <p className="text-xs font-black text-amber-700 uppercase tracking-wide mb-2">
            Recompensas encontradas!
          </p>
          <div className="flex flex-col gap-2">
            {loot.chests.map((c, i) => {
              const chest = CHESTS.find((ch) => ch.id === c.id);
              return (
                <div key={`chest-${i}`} className="flex items-center gap-2.5">
                  <GameIcon name={chest?.art} size={28} />
                  <p className="text-sm font-bold text-amber-900">
                    {chest?.name} <span className="text-amber-600">+{c.coins} moedas</span>
                  </p>
                </div>
              );
            })}
            {loot.powerupIds.map((id, i) => {
              const item = SHOP_ITEM_MAP[id];
              return (
                <div key={`pu-${i}`} className="flex items-center gap-2.5">
                  <GameIcon name={item?.art} size={28} />
                  <p className="text-sm font-bold text-amber-900">{item?.name}</p>
                </div>
              );
            })}
            {loot.potionIds.map((id, i) => {
              const potion = POTION_MAP[id];
              return (
                <div key={`pot-${i}`} className="flex items-center gap-2.5">
                  <GameIcon name={potion?.art} size={28} />
                  <p className="text-sm font-bold text-amber-900">{potion?.name}</p>
                </div>
              );
            })}
          </div>
          {lootCoins > 0 && loot.chests.length > 1 && (
            <p className="text-[11px] font-bold text-amber-600 mt-2">Total: +{lootCoins} moedas em baús</p>
          )}
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
            className={`rounded-2xl p-4 border shadow-sm bg-white border-gray-100 ${s.big ? 'col-span-2' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={16} />
              </div>
              <div>
                <p className="text-xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs font-bold text-gray-400">{s.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Share */}
      <Button
        variant="secondary"
        onClick={() => {
          const { league } = getLeagueStandings(data);
          shareCard({
            mode: result.mode,
            score: result.score,
            correct: result.correct,
            wrong: result.wrong,
            accuracy,
            bestStreak: result.bestStreak,
            qiChar: league.emoji,
            qiName: `Liga ${league.name}`,
            isNewRecord,
          });
        }}
        className="w-full"
      >
        <Share2 size={16} />
        Compartilhar resultado
      </Button>

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
