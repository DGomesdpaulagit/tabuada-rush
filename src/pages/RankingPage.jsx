import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { LEAGUES } from '../constants/leagues';
import { getLeagueStandings, getCycleDaysRemaining } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

// ── LIGAS [reformulação — referência literal do Duolingo, pedido do Davi] ────
// Layout copiado da screenshot que o Davi mandou, sem invenção:
//   1. fileira de escudos das divisões no topo (SÓ escudos, sem rótulo de
//      texto embaixo de cada um — era isso que colidia/cortava na versão
//      anterior; o nome aparece uma vez só, grande, embaixo)
//   2. nome da divisão selecionada, centralizado e grande
//   3. "Os N primeiros avançam pra próxima divisão." (= zona de promoção)
//   4. "N dias" — quanto falta pro ciclo virar (getCycleDaysRemaining)
//   5. classificação
// NÃO tem card de "Liga X de 10 / sua posição" — o Davi pediu explicitamente
// pra tirar. Regra de acesso é a mesma de antes (D031, não mudou): só liga
// já alcançada (`leagueHighestId`) é clicável; acima disso, escudo cinza
// com cadeado.
const MEDALS = ['🥇', '🥈', '🥉'];

export default function RankingPage({ onBack }) {
  const { data } = useApp();

  const currentLeagueId = LEAGUES.some((l) => l.id === data.leagueId) ? data.leagueId : LEAGUES[0].id;
  const currentIdx = LEAGUES.findIndex((l) => l.id === currentLeagueId);
  const storedHighestIdx = LEAGUES.findIndex((l) => l.id === data.leagueHighestId);
  const highestIdx = Math.max(currentIdx, storedHighestIdx);

  const [selectedId, setSelectedId] = useState(currentLeagueId);
  const selectedLeague = LEAGUES.find((l) => l.id === selectedId) || LEAGUES[currentIdx];
  const standings = getLeagueStandings(data, selectedLeague.id);
  const daysLeft = getCycleDaysRemaining();

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col"
    >
      {/* Voltar */}
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors mb-4 shrink-0"
      >
        <ArrowLeft size={18} />
      </button>

      {/* 1. Escudos das divisões — só ícones, sem texto embaixo */}
      <div className="flex items-end justify-center gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {LEAGUES.map((league, idx) => {
          const unlocked = idx <= highestIdx;
          const isSelected = league.id === selectedLeague.id;
          return (
            <button
              key={league.id}
              type="button"
              disabled={!unlocked}
              onClick={() => setSelectedId(league.id)}
              title={unlocked ? league.name : 'Divisão bloqueada'}
              className={`shrink-0 rounded-2xl flex items-center justify-center transition-all
                ${isSelected ? 'w-20 h-20 text-4xl' : 'w-14 h-14 text-2xl opacity-70'}
                ${unlocked
                  ? `bg-gradient-to-br ${league.gradient} text-white ${isSelected ? 'shadow-lg' : 'hover:opacity-100'}`
                  : 'bg-surface-2 text-fg-muted cursor-not-allowed'}`}
            >
              {unlocked ? league.emoji : <Lock size={isSelected ? 26 : 18} />}
            </button>
          );
        })}
      </div>

      {/* 2/3/4. Nome + zona de promoção + prazo do ciclo */}
      <div className="text-center mt-4">
        <h2 className="text-2xl font-black text-fg">Divisão {selectedLeague.name}</h2>
        <p className="text-sm text-fg-muted font-semibold mt-1">
          {selectedLeague.promotionCount > 0
            ? `Os ${selectedLeague.promotionCount} primeiros avançam pra próxima divisão.`
            : 'Divisão mais alta — não há pra onde subir.'}
        </p>
        <p className="text-sm font-black text-coin mt-1">
          {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
        </p>
      </div>

      <div className="h-px bg-border my-5" />

      {/* 5. Classificação */}
      <div className="flex flex-col gap-2">
        {standings.entries.map((e, i) => {
          const rank = i + 1;
          const inPromotion = rank <= selectedLeague.promotionCount;
          const inRelegation = rank > standings.total - selectedLeague.relegationCount;
          return (
            <div
              key={e.name + rank}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all
                ${e.isPlayer ? 'bg-surface-2 border-2 border-accent' : 'border-2 border-transparent'}`}
            >
              <span
                className={`w-7 text-center text-sm font-black shrink-0 tabular-nums
                  ${inPromotion ? 'text-check-dark' : inRelegation ? 'text-pen-dark' : 'text-fg-muted'}`}
              >
                {MEDALS[i] || rank}
              </span>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 bg-surface-2">
                {e.emoji}
              </div>
              <p className={`flex-1 min-w-0 font-black text-sm truncate ${e.isPlayer ? 'text-accent' : 'text-fg'}`}>
                {e.name}
              </p>
              <p className="text-sm font-black text-fg-muted tabular-nums shrink-0">{e.xp} XP</p>
            </div>
          );
        })}
      </div>

      <Button variant="secondary" onClick={onBack} className="w-full mt-6">
        <ArrowLeft size={16} />
        Voltar
      </Button>
    </motion.div>
  );
}
