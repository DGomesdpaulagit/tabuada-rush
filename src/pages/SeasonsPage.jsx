import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getActiveSeason } from '../constants/seasons';
import { SHOP_ITEM_MAP } from '../constants/shop';
import { pageVariants, pageTransition, Progress } from '../components/ui';

function formatDate(str) {
  const d = new Date(str + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SeasonsPage({ onBack }) {
  const { data, update } = useApp();
  const season        = getActiveSeason();
  const seasonXp      = data.seasonXp      || 0;
  const seasonRewards = data.seasonRewards  || [];

  const maxXp = season.rewards[season.rewards.length - 1].xpRequired;
  const pct   = Math.min((seasonXp / maxXp) * 100, 100);

  // Próximo marco não atingido
  const nextMilestone = season.rewards.find((r) => seasonXp < r.xpRequired);
  const xpToNext      = nextMilestone ? nextMilestone.xpRequired - seasonXp : 0;

  const handleClaim = (rw) => {
    if (seasonXp < rw.xpRequired) return;
    if (seasonRewards.includes(rw.xpRequired)) return;
    update((prev) => {
      const patch = {
        seasonRewards: [...(prev.seasonRewards || []), rw.xpRequired],
      };
      if (rw.reward.type === 'coins') {
        patch.coins = (prev.coins || 0) + rw.reward.amount;
      } else if (rw.reward.type === 'item') {
        const prevOwned = prev.ownedItems || [];
        patch.ownedItems = prevOwned.includes(rw.reward.id)
          ? prevOwned
          : [...prevOwned, rw.reward.id];
      }
      return { ...prev, ...patch };
    });
  };

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
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">Temporada</h2>
          <p className="text-xs font-semibold text-gray-400">Trilha de recompensas exclusivas</p>
        </div>
      </div>

      {/* Season hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-r ${season.gradient} rounded-3xl p-5 text-white shadow-lg`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">{season.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">{season.name}</p>
            <p className="text-xl font-black leading-tight">{season.theme}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/70 text-xs font-bold">XP Temporada</p>
            <p className="text-2xl font-black">{seasonXp.toLocaleString('pt-BR')}</p>
            {nextMilestone && (
              <p className="text-white/70 text-[11px] font-semibold mt-0.5">
                +{xpToNext} para o próximo
              </p>
            )}
          </div>
        </div>

        {/* XP bar */}
        <Progress value={pct} colorClass="bg-white/80" className="bg-white/20 h-2.5 mb-2" />
        <div className="flex justify-between text-xs text-white/60 font-semibold">
          <span>{formatDate(season.startDate)}</span>
          <span>{Math.round(pct)}%</span>
          <span>{formatDate(season.endDate)}</span>
        </div>

        <p className="text-white/75 text-xs font-semibold mt-3 leading-relaxed">
          {season.description}
        </p>
      </motion.div>

      {/* How to earn season XP */}
      <div className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
        <p className="text-xs font-black text-violet-700 mb-2">Como ganhar XP de Temporada?</p>
        <ul className="space-y-1">
          {[
            ['🎮', 'Pontuação da partida × 0.3'],
            ['🌟', '+10 XP por Desafio Diário'],
            ['🔥', '+5 XP ao manter a ofensiva'],
          ].map(([emoji, text]) => (
            <li key={text} className="flex items-center gap-2 text-xs text-violet-600 font-semibold">
              <span>{emoji}</span>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Reward track */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Trilha de Recompensas
        </p>
        <div className="flex flex-col gap-3">
          {season.rewards.map((rw, idx) => {
            const reached    = seasonXp >= rw.xpRequired;
            const claimed    = seasonRewards.includes(rw.xpRequired);
            const canClaim   = reached && !claimed;
            const itemDetails = rw.reward.type === 'item' ? SHOP_ITEM_MAP[rw.reward.id] : null;

            return (
              <motion.div
                key={rw.xpRequired}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  claimed
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : canClaim
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : reached
                    ? 'bg-violet-50 border-violet-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                {/* Status icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    claimed
                      ? 'bg-gray-200'
                      : canClaim
                      ? 'bg-emerald-100'
                      : reached
                      ? 'bg-violet-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {claimed ? (
                    <CheckCircle size={16} className="text-emerald-500" />
                  ) : !reached ? (
                    <Lock size={13} className="text-gray-400" />
                  ) : (
                    <span className="text-sm">✨</span>
                  )}
                </div>

                {/* Reward info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg shrink-0">{rw.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 leading-tight">{rw.label}</p>
                      <p className="text-xs text-gray-400 font-semibold">
                        {rw.xpRequired.toLocaleString('pt-BR')} XP de temporada
                        {itemDetails && ` · ${itemDetails.desc}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="shrink-0">
                  {canClaim ? (
                    <button
                      onClick={() => handleClaim(rw)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-black hover:bg-emerald-600 active:scale-95 transition-all"
                    >
                      Resgatar
                    </button>
                  ) : claimed ? (
                    <span className="text-xs font-bold text-gray-400">Resgatado</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-400">
                      +{(rw.xpRequired - seasonXp).toLocaleString('pt-BR')} XP
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
