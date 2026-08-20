import { motion } from 'framer-motion';
import { Gamepad2, Gift, BarChart2, LogIn, Cloud, Sparkles, Settings, ChevronRight, Brain, Coins } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { countDueFlashcards, countFactsAtRiskAllOps, getModeUnlock } from '../utils';
import { getLeagueStandings } from '../utils/leagues';
import { analyzeUser } from '../utils/analysis';
import { countUnclaimedMissions } from '../utils/missions';
import { Button, Progress, pageVariants, pageTransition } from '../components/ui';
import GameIcon from '../components/GameIcon';

export default function MenuPage({ onStart, onNavigate, onEditGoal }) {
  const { data, cloudSyncing } = useApp();
  const { user } = useAuth();

  const streak = data.currentStreak || 0;
  const bestDayStreak = data.bestDayStreak || 0;
  const coins = data.coins || 0;
  const streakGoal = data.streakGoal; // pode ser null (meta ainda não definida)
  const streakGoalBase = data.streakGoalBase || 0;
  const metaProgress = Math.max(0, streak - streakGoalBase); // progresso rumo à meta atual
  const goalPct = streakGoal ? Math.min((metaProgress / streakGoal) * 100, 100) : 0;
  const analysisHeadline = analyzeUser(data).headline;

  // [v6.0 · Bloco 6] Painel de perfil muda de cor conforme a LIGA atual (era
  // o tier do QI antigo, ver DECISIONS.md D023) — mesma ideia, "veste a
  // cara" de onde o jogador está, sem precisar de cosmético comprável.
  const { league, playerRank, total: leagueTotal } = getLeagueStandings(data);
  const cardGradient = league.gradient;
  const unclaimedMissions = countUnclaimedMissions(data.missionsData);
  const dueFlashcards = countDueFlashcards(data.srsData?.mult || {});
  const factsAtRisk = countFactsAtRiskAllOps(data); // [v4.0 · Fase 4] curva de esquecimento
  const reviewUnlocked = getModeUnlock('review', data).unlocked;

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
              className="w-9 h-9 rounded-xl bg-ink/10 flex items-center justify-center text-ink hover:bg-ink/20 transition-colors"
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
          <h1 className="text-4xl font-black text-ink">
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
            className="flex items-center justify-center gap-1 mt-1 text-xs text-ink font-semibold"
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
          QI-first: uma métrica única de progressão (já é composta — inclui
          nível, precisão, velocidade, ofensiva e consistência, ver
          utils/computeQI). Nível/XP deixam de ser exibidos aqui; XP continua
          existindo internamente (multiplicador de modos) e fica visível em
          detalhe dentro de Estatísticas. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`bg-gradient-to-r ${cardGradient} rounded-3xl p-5 text-white shadow-lg`}
      >
        {/* Topo: liga atual + posição + moedas */}
        <button
          onClick={() => onNavigate('ranking')}
          className="flex items-center gap-3 w-full text-left"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
            className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0"
          >
            {league.emoji}
          </motion.div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide truncate">
              Liga {league.name}
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-black leading-tight">{playerRank}º</p>
              <p className="text-white/70 text-xs font-bold">de {leagueTotal}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-amber-200 text-lg font-black flex items-center gap-1 justify-end">
              <Coins size={16} /> {coins}
            </p>
            <span className="inline-flex items-center gap-0.5 text-white/70 text-[11px] font-bold">
              Ver ligas <ChevronRight size={12} />
            </span>
          </div>
        </button>

        {/* Divisor */}
        <div className="h-px bg-white/15 my-4" />

        {/* Ofensiva diária — recorde vira um detalhe pequeno, não uma coluna
            inteira (menos informação disputando atenção no painel). */}
        <div className="flex items-center gap-2">
          <GameIcon name="ofensiva" size={24} />
          <p className="text-lg font-black leading-tight">
            {streak} {streak === 1 ? 'dia' : 'dias'}
          </p>
          {bestDayStreak > 0 && (
            <span className="text-white/60 text-xs font-bold flex items-center gap-0.5 ml-1">
              <GameIcon name="podio" size={12} /> {bestDayStreak}
            </span>
          )}
        </div>

        {/* Meta de ofensiva */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">
              Meta
            </p>
            {streakGoal ? (
              // Meta travada — não pode ser alterada depois de definida (só muda
              // automaticamente quando é batida, via RewardModal + nova escolha).
              <span className="text-xs font-bold text-white/90">
                {Math.min(metaProgress, streakGoal)}/{streakGoal} dias
              </span>
            ) : (
              <button
                onClick={onEditGoal}
                className="text-xs font-black bg-white text-ink px-3 py-1 rounded-full hover:bg-white/90 transition-colors"
              >
                Definir meta
              </button>
            )}
          </div>
          <Progress value={goalPct} colorClass="bg-amber-300" className="bg-white/20 h-1.5" />
        </div>
      </motion.div>

      {/* Insight da Análise Inteligente (toque para ver detalhes) */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => onNavigate('stats')}
        className="flex items-center gap-3 w-full text-left bg-white rounded-2xl px-4 py-3 border-2 border-[#E0DACB] shadow-sm hover:border-ink/30 transition-colors"
      >
        <span className="w-8 h-8 rounded-xl bg-ink/10 text-ink flex items-center justify-center shrink-0">
          <Sparkles size={15} />
        </span>
        <p className="text-sm font-bold text-gray-600 leading-snug">{analysisHeadline}</p>
      </motion.button>

      {/* ── FATOS A VENCER [v4.0 · Fase 4] ──────────────────────────────────
          Curva de esquecimento: fatos já praticados que o modelo prevê que o
          jogador está prestes a esquecer (combina precisão, velocidade e tempo
          desde a última prática — não é a mesma coisa que o SRS do Flashcard,
          que só olha pra multiplicação e exige avaliação subjetiva). */}
      {factsAtRisk > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          onClick={() => (reviewUnlocked ? onStart('review') : onNavigate('modes'))}
          className="flex items-center gap-3 w-full text-left bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl px-4 py-3 border border-rose-200 hover:border-rose-300 transition-colors"
        >
          <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Brain size={15} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-700 leading-snug">
              {factsAtRisk} {factsAtRisk === 1 ? 'fato prestes a ser esquecido' : 'fatos prestes a serem esquecidos'}
            </p>
            <p className="text-xs text-gray-400 font-semibold">
              {reviewUnlocked ? 'Toque para revisar agora' : 'Toque para ver como desbloquear a Revisão'}
            </p>
          </div>
          <ChevronRight size={18} className="text-rose-400 shrink-0" />
        </motion.button>
      )}

      {/* ── BOTÃO ESCOLHER MODO ─────────────────────────────────────────────
          Leva para ModesPage: Rush (modo principal) + Zen/Revisão (treino). */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        whileHover={{ scale: 1.01, y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('modes')}
        className="w-full flex items-center gap-3 rounded-3xl p-5 bg-ink text-white shadow-lg hover:bg-ink/90 transition-colors"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <Gamepad2 size={22} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] font-black uppercase tracking-wider text-white/70">
            Modos de Jogo
          </p>
          <p className="text-lg font-black leading-tight">Escolher Modo</p>
          <p className="text-xs font-bold text-white/80 mt-0.5">
            {dueFlashcards > 0
              ? `${dueFlashcards} flashcards para revisar`
              : 'Rush · Zen · Revisão'}
          </p>
        </div>
        <ChevronRight size={22} className="text-white shrink-0" />
      </motion.button>

      {/* ── Destinos primários: Recompensas + Estatísticas ────────────────
          Loja/Missões/Temporada viraram abas dentro de um único hub
          (RewardsPage) — a Loja de cosméticos está em standby (economia
          será repensada antes de investir em UI nova pra ela), mas as 3
          continuam acessíveis aqui. Recordes/Conquistas/Ranking viraram
          seções dentro de Estatísticas. */}
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <Button variant="secondary" onClick={() => onNavigate('rewards')} className="w-full">
            <Gift size={16} />
            Recompensas
          </Button>
          {unclaimedMissions > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 z-10 shadow-sm">
              {unclaimedMissions}
            </span>
          )}
        </div>
        <Button variant="secondary" onClick={() => onNavigate('stats')} className="w-full">
          <BarChart2 size={16} />
          Estatísticas
        </Button>
      </div>

      {/* Footer stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-around py-3 bg-surface rounded-2xl border-2 border-border"
      >
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.totalGames || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Partidas</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.bestStreak || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Melhor Seq.</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.totalCorrect || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Acertos</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
