import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { LEAGUES } from '../constants/leagues';
import { getLeagueStandings } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

// ── LIGAS [v6.0 · Bloco 4] ───────────────────────────────────────────────────
// Substitui o antigo Ranking de QI (posição estática numa lista de 52
// personagens) — agora é competição de verdade: 10 personagens simulados da
// liga atual + o jogador, ordenados por XP. Ver utils/leagues.js pro motor.
export default function RankingPage({ onBack }) {
  const { data } = useApp();
  const { league, entries, playerRank, total } = getLeagueStandings(data);
  const leagueIdx = LEAGUES.findIndex((l) => l.id === league.id);

  const promotionCut = league.promotionCount;
  const relegationCut = total - league.relegationCount;

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
          className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-fg">Ligas</h2>
          <p className="text-sm text-fg-muted font-semibold">Compita por XP com os personagens da sua liga</p>
        </div>
      </div>

      {/* Hero — liga atual */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${league.gradient} rounded-3xl p-6 text-white shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shrink-0">
            {league.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">
              Liga {leagueIdx + 1} de {LEAGUES.length}
            </p>
            <p className="text-2xl font-black leading-tight truncate">{league.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">Posição</p>
            <p className="text-3xl font-black tabular-nums">{playerRank}º</p>
            <p className="text-white/70 text-[11px] font-bold">de {total}</p>
          </div>
        </div>
      </motion.div>

      {/* Legenda das zonas */}
      <div className="flex items-center gap-4 px-1 text-xs font-bold">
        {league.promotionCount > 0 && (
          <span className="flex items-center gap-1 text-check-dark">
            <ArrowUp size={13} /> Zona de promoção (top {league.promotionCount})
          </span>
        )}
        {league.relegationCount > 0 && (
          <span className="flex items-center gap-1 text-pen-dark">
            <ArrowDown size={13} /> Zona de rebaixamento (últimos {league.relegationCount})
          </span>
        )}
      </div>

      {/* Classificação */}
      <div className="flex flex-col gap-2">
        {entries.map((e, i) => {
          const rank = i + 1;
          const inPromotion = rank <= promotionCut;
          const inRelegation = rank > relegationCut;
          return (
            <div key={e.name + rank}>
              {rank === promotionCut + 1 && promotionCut > 0 && (
                <div className="h-px bg-check my-1 opacity-40" />
              )}
              {rank === relegationCut + 1 && league.relegationCount > 0 && (
                <div className="h-px bg-pen my-1 opacity-40" />
              )}
              <div
                className={`flex items-center gap-3 rounded-2xl p-3 border-2 transition-all
                  ${e.isPlayer
                    ? `bg-gradient-to-br ${league.gradientLight} ${league.border} ring-2 ring-offset-1 ${league.text} shadow-sm`
                    : 'bg-surface border-border'}`}
              >
                <span className={`w-7 text-center text-xs font-black shrink-0
                  ${inPromotion ? 'text-check-dark' : inRelegation ? 'text-pen-dark' : 'text-fg-muted'}`}>
                  {rank}
                </span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-surface-2">
                  {e.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-black text-sm truncate ${e.isPlayer ? league.text : 'text-fg'}`}>
                    {e.name}
                  </p>
                  {e.desc && <p className="text-xs text-fg-muted font-semibold truncate">{e.desc}</p>}
                </div>
                <p className="text-sm font-black text-fg-muted tabular-nums shrink-0">{e.xp} XP</p>
              </div>
            </div>
          );
        })}
      </div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar
      </Button>
    </motion.div>
  );
}
