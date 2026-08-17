import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowUp, ArrowDown, Lock, X } from 'lucide-react';
import { LEAGUES } from '../constants/leagues';
import { getLeagueStandings, getLeagueCharacters } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

// ── LIGAS · ESCADA [recalibração — "ver outras ligas"] ───────────────────────
// Substitui a lista única (só a liga atual) por uma trilha vertical com as 10
// ligas. Só fica desbloqueada (clicável) a liga atual + as que o jogador já
// alcançou algum dia (`leagueHighestId`, nunca desce com rebaixamento — ver
// utils/leagues.js enterLeague). Acima disso fica bloqueada: sem emoji, sem
// nome, sem roster — só a posição na escada. Ligas desbloqueadas abrem uma
// folha (sheet) com o roster completo; a liga atual mostra a linha "Você" e
// a posição real (getLeagueStandings já retorna isso só pra
// leagueId === data.leagueId — ver utils/leagues.js), as demais mostram só
// vitrine dos personagens + zonas.
export default function RankingPage({ onBack }) {
  const { data } = useApp();
  const [openLeagueId, setOpenLeagueId] = useState(null);

  const currentLeagueId = LEAGUES.some((l) => l.id === data.leagueId) ? data.leagueId : LEAGUES[0].id;
  const currentIdx = LEAGUES.findIndex((l) => l.id === currentLeagueId);
  const storedHighestIdx = LEAGUES.findIndex((l) => l.id === data.leagueHighestId);
  const highestIdx = Math.max(currentIdx, storedHighestIdx);

  const stepsTopDown = [...LEAGUES].reverse();

  const openLeague = openLeagueId ? LEAGUES.find((l) => l.id === openLeagueId) : null;
  const openStandings = openLeague ? getLeagueStandings(data, openLeague.id) : null;
  const isOpenCurrent = openLeague?.id === currentLeagueId;
  const openPromotionCut = openLeague?.promotionCount ?? 0;
  const openRelegationCut = openStandings ? openStandings.total - openLeague.relegationCount : 0;

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
          <p className="text-sm text-fg-muted font-semibold">Sua jornada — toque numa liga já alcançada</p>
        </div>
      </div>

      {/* Escada */}
      <div className="flex flex-col gap-2.5 py-1">
        {stepsTopDown.map((league, i) => {
          const idx = LEAGUES.length - 1 - i;
          const unlocked = idx <= highestIdx;
          const isCurrent = league.id === currentLeagueId;
          const indent = Math.min(i, LEAGUES.length - 1 - i) * 5;
          const charCount = unlocked ? getLeagueCharacters(league.id).length : 0;

          return (
            <motion.button
              key={league.id}
              type="button"
              disabled={!unlocked}
              onClick={() => unlocked && setOpenLeagueId(league.id)}
              style={{ marginLeft: indent }}
              whileTap={unlocked ? { scale: 0.98 } : undefined}
              className={`flex items-center gap-3 rounded-2xl p-3 border-2 text-left transition-colors
                ${unlocked
                  ? 'bg-surface border-border hover:border-accent cursor-pointer'
                  : 'bg-surface-2/60 border-border/60 cursor-not-allowed'}
                ${isCurrent ? 'ring-2 ring-accent ring-offset-1 ring-offset-background border-accent' : ''}`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0
                  ${unlocked ? `bg-gradient-to-br ${league.gradient} text-white` : 'bg-surface-2 text-fg-muted'}`}
              >
                {unlocked ? league.emoji : <Lock size={17} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-black text-sm ${unlocked ? 'text-fg' : 'text-fg-muted'}`}>
                  {unlocked ? league.name : 'Liga bloqueada'}
                </p>
                <p className="text-xs text-fg-muted font-semibold">
                  {unlocked ? `${charCount} personagens` : 'Chegue na liga anterior pra desbloquear'}
                </p>
              </div>
              {isCurrent && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-accent bg-accent/15 px-2.5 py-1.5 rounded-full shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  você
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar
      </Button>

      {/* Folha de detalhe — roster + zonas da liga aberta */}
      <AnimatePresence>
        {openLeague && openStandings && (
          <motion.div
            key="league-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50"
            onClick={() => setOpenLeagueId(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-surface rounded-t-3xl border-t-2 border-border p-5 pb-6 max-h-[82vh] overflow-y-auto"
            >
              <div className="w-9 h-1 bg-border rounded-full mx-auto mb-4" />

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${openLeague.gradient} flex items-center justify-center text-2xl text-white shrink-0`}
                >
                  {openLeague.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-lg text-fg leading-tight">{openLeague.name}</p>
                  <p className="text-xs text-fg-muted font-semibold">
                    {isOpenCurrent ? `Sua posição: ${openStandings.playerRank}º de ${openStandings.total}` : 'Você já passou por aqui'}
                  </p>
                </div>
                <button
                  onClick={() => setOpenLeagueId(null)}
                  className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 px-1 mb-3 text-xs font-bold flex-wrap">
                {openLeague.promotionCount > 0 && (
                  <span className="flex items-center gap-1 text-check-dark">
                    <ArrowUp size={13} /> Zona de promoção (top {openLeague.promotionCount})
                  </span>
                )}
                {openLeague.relegationCount > 0 && (
                  <span className="flex items-center gap-1 text-pen-dark">
                    <ArrowDown size={13} /> Zona de rebaixamento (últimos {openLeague.relegationCount})
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                {openStandings.entries.map((e, i) => {
                  const rank = i + 1;
                  const inPromotion = rank <= openPromotionCut;
                  const inRelegation = rank > openRelegationCut;
                  return (
                    <div
                      key={e.name + rank}
                      className={`flex items-center gap-3 rounded-2xl p-3 border-2 transition-all
                        ${e.isPlayer
                          ? `bg-gradient-to-br ${openLeague.gradientLight} ${openLeague.border} ring-2 ring-offset-1 ${openLeague.text} shadow-sm`
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
                        <p className={`font-black text-sm truncate ${e.isPlayer ? openLeague.text : 'text-fg'}`}>
                          {e.name}
                        </p>
                        {e.desc && <p className="text-xs text-fg-muted font-semibold truncate">{e.desc}</p>}
                      </div>
                      <p className="text-sm font-black text-fg-muted tabular-nums shrink-0">{e.xp} XP</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
