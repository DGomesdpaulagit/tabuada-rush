import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUp, ArrowDown, Lock } from 'lucide-react';
import { LEAGUES } from '../constants/leagues';
import { getLeagueStandings } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

// ── LIGAS · CARROSSEL HORIZONTAL [reformulação — pedido do Davi, referência
// Duolingo] ────────────────────────────────────────────────────────────────
// Troca a escada vertical (sessao-053, D031) por uma fileira horizontal
// rolável no topo — mais perto do próprio layout do Duolingo que o Davi
// mandou de referência. Mesma regra de acesso de antes (não mudou, só o
// layout): só fica desbloqueada a liga atual + as que o jogador já
// alcançou algum dia (`leagueHighestId`, nunca desce com rebaixamento — ver
// utils/leagues.js). Ligas bloqueadas ficam sem emoji/nome, só um cadeado.
// Tocar numa liga desbloqueada troca o roster exibido embaixo — sem modal
// dessa vez, é tudo inline (mais perto do Duolingo, que mostra o placar
// direto abaixo da fileira de divisões).
export default function RankingPage({ onBack }) {
  const { data } = useApp();

  const currentLeagueId = LEAGUES.some((l) => l.id === data.leagueId) ? data.leagueId : LEAGUES[0].id;
  const currentIdx = LEAGUES.findIndex((l) => l.id === currentLeagueId);
  const storedHighestIdx = LEAGUES.findIndex((l) => l.id === data.leagueHighestId);
  const highestIdx = Math.max(currentIdx, storedHighestIdx);

  const [selectedId, setSelectedId] = useState(currentLeagueId);
  const selectedLeague = LEAGUES.find((l) => l.id === selectedId) || LEAGUES[currentIdx];
  const isSelectedCurrent = selectedLeague.id === currentLeagueId;
  const standings = getLeagueStandings(data, selectedLeague.id);
  const promotionCut = selectedLeague.promotionCount;
  const relegationCut = standings.total - selectedLeague.relegationCount;

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
          <p className="text-sm text-fg-muted font-semibold">Deslize e toque numa liga já alcançada</p>
        </div>
      </div>

      {/* Fileira horizontal — Bronze à esquerda, Diamante à direita */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x snap-mandatory scroll-smooth">
        {LEAGUES.map((league, idx) => {
          const unlocked = idx <= highestIdx;
          const isCurrent = league.id === currentLeagueId;
          const isSelected = league.id === selectedLeague.id;
          return (
            <button
              key={league.id}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && setSelectedId(league.id)}
              className="flex flex-col items-center gap-1 shrink-0 snap-center w-16"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all
                  ${unlocked ? `bg-gradient-to-br ${league.gradient} text-white` : 'bg-surface-2 text-fg-muted'}
                  ${isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-background scale-110' : 'opacity-90'}
                  ${!unlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {unlocked ? league.emoji : <Lock size={17} />}
              </div>
              <span className={`text-[10px] font-black leading-tight text-center ${unlocked ? 'text-fg' : 'text-fg-muted'}`}>
                {unlocked ? league.name : '???'}
              </span>
              {isCurrent && (
                <span className="text-[8px] font-black text-accent uppercase tracking-wide">você</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detalhe da liga selecionada */}
      <motion.div
        key={selectedLeague.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className={`bg-gradient-to-br ${selectedLeague.gradient} rounded-3xl p-5 text-white shadow-lg`}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
            {selectedLeague.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">
              Liga {LEAGUES.findIndex((l) => l.id === selectedLeague.id) + 1} de {LEAGUES.length}
            </p>
            <p className="text-2xl font-black leading-tight truncate">{selectedLeague.name}</p>
          </div>
          <div className="text-right shrink-0">
            {isSelectedCurrent ? (
              <>
                <p className="text-white/70 text-xs font-bold uppercase tracking-wide">Posição</p>
                <p className="text-3xl font-black tabular-nums">{standings.playerRank}º</p>
                <p className="text-white/70 text-[11px] font-bold">de {standings.total}</p>
              </>
            ) : (
              <p className="text-white/80 text-xs font-bold max-w-[7rem] leading-snug">Você já passou por aqui</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Legenda das zonas */}
      <div className="flex items-center gap-4 px-1 text-xs font-bold flex-wrap">
        {selectedLeague.promotionCount > 0 && (
          <span className="flex items-center gap-1 text-check-dark">
            <ArrowUp size={13} /> Zona de promoção (top {selectedLeague.promotionCount})
          </span>
        )}
        {selectedLeague.relegationCount > 0 && (
          <span className="flex items-center gap-1 text-pen-dark">
            <ArrowDown size={13} /> Zona de rebaixamento (últimos {selectedLeague.relegationCount})
          </span>
        )}
      </div>

      {/* Roster — rola verticalmente entre os personagens da liga selecionada */}
      <div className="flex flex-col gap-2">
        {standings.entries.map((e, i) => {
          const rank = i + 1;
          const inPromotion = rank <= promotionCut;
          const inRelegation = rank > relegationCut;
          return (
            <div
              key={e.name + rank}
              className={`flex items-center gap-3 rounded-2xl p-3 border-2 transition-all
                ${e.isPlayer
                  ? `bg-gradient-to-br ${selectedLeague.gradientLight} ${selectedLeague.border} ring-2 ring-offset-1 ${selectedLeague.text} shadow-sm`
                  : 'bg-surface border-border'}`}
            >
              <span
                className={`w-7 text-center text-xs font-black shrink-0
                  ${inPromotion ? 'text-check-dark' : inRelegation ? 'text-pen-dark' : 'text-fg-muted'}`}
              >
                {rank}
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 bg-surface-2">
                {e.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm truncate ${e.isPlayer ? selectedLeague.text : 'text-fg'}`}>
                  {e.name}
                </p>
                {e.desc && <p className="text-xs text-fg-muted font-semibold truncate">{e.desc}</p>}
              </div>
              <p className="text-sm font-black text-fg-muted tabular-nums shrink-0">{e.xp} XP</p>
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
