import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { CHARACTERS, TIERS, TIER_ORDER } from '../constants/characters';
import { getQiInfo } from '../utils';
import { useApp } from '../contexts/AppContext';
import { Button, Progress, pageVariants, pageTransition } from '../components/ui';

export default function RankingPage({ onBack }) {
  const { data } = useApp();
  const info = getQiInfo(data);
  const { qi, idx, position, total, char, tier, nextChar, pctToNext } = info;

  // Agrupa os personagens por categoria, preservando a ordem global (índice).
  const groups = TIER_ORDER.map((t) => ({
    tier: TIERS[t],
    items: CHARACTERS.map((c, i) => ({ c, i })).filter((x) => x.c.tier === t),
  }));

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
          <h2 className="text-xl font-black text-gray-900">Ranking de QI Matemático</h2>
          <p className="text-sm text-gray-400 font-semibold">Sua evolução intelectual no jogo</p>
        </div>
      </div>

      {/* Hero — QI atual do usuário */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${tier.gradient} rounded-3xl p-6 text-white shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0"
          >
            {char.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">
              {tier.classification}
            </p>
            <p className="text-2xl font-black leading-tight truncate">{char.name}</p>
            <p className="text-white/80 text-xs font-semibold mt-0.5 truncate">{char.desc}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">QI</p>
            <motion.p
              key={qi}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="text-3xl font-black tabular-nums"
            >
              {qi}
            </motion.p>
          </div>
        </div>

        {/* Posição + progresso */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/80 text-xs font-bold">
              Posição {position} de {total}
            </p>
            <p className="text-white/80 text-xs font-bold">
              {nextChar ? `${pctToNext}% para ${nextChar.name}` : 'Topo do ranking! 🎉'}
            </p>
          </div>
          <Progress value={pctToNext} colorClass="bg-white/70" className="bg-white/20 h-2" />
        </div>
      </motion.div>

      {/* Lista de classificações por categoria */}
      <div className="flex flex-col gap-5">
        {groups.map(({ tier: t, items }) => (
          <div key={t.id}>
            {/* Cabeçalho da categoria */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <span className="text-lg">{t.emoji}</span>
              <div>
                <p className={`text-sm font-black ${t.text}`}>{t.label}</p>
                <p className="text-xs text-gray-400 font-semibold">{t.classification}</p>
              </div>
            </div>

            {/* Personagens da categoria */}
            <div className="flex flex-col gap-2">
              {items.map(({ c, i }) => {
                const isCurrent = i === idx;
                const unlocked = i <= idx;
                return (
                  <div
                    key={c.name + i}
                    className={`flex items-center gap-3 rounded-2xl p-3 border transition-all
                      ${isCurrent
                        ? `bg-gradient-to-br ${t.gradientLight} ${t.border} ring-2 ring-offset-1 ${t.text} shadow-sm`
                        : 'bg-white border-gray-100'}`}
                  >
                    {/* Posição */}
                    <span className="w-7 text-center text-xs font-black text-gray-400 shrink-0">
                      {i + 1}
                    </span>
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0
                        ${unlocked ? t.badge : 'bg-gray-100 grayscale opacity-50'}`}
                    >
                      {c.emoji}
                    </div>
                    {/* Nome + descrição */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-black text-sm truncate ${isCurrent ? t.text : 'text-gray-800'}`}>
                        {c.name}
                      </p>
                      <p className="text-xs text-gray-400 font-semibold truncate">{c.desc}</p>
                    </div>
                    {/* Marcador "você" */}
                    {isCurrent && (
                      <span className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-full ${t.badge}`}>
                        VOCÊ
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
