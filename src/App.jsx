import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { checkNewAchievements, todayStr, getLevelIdx, detectProgressEvents, getRevisionQuestions, getModeUnlock, getFactKey, countFactsAtRiskAllOps, getLivesInfo } from './utils';
import { applyLeaguePromotion } from './utils/leagues';
import { LEAGUE_MAP } from './constants/leagues';
import { LEVELS, ACHIEVEMENTS, STREAK_GOALS, STREAK_REWARD_MILESTONES, DAILY_LIVES_MAX, LIFE_REFILL_PRICE } from './constants';
import { prefs } from './lib/prefs';
import { audio } from './lib/audioManager';
import { maybeStreakReminder, maybeMissionExpireReminder, maybeForgettingReminder } from './lib/notify';
import { subscribeToPush } from './lib/push';

import MenuPage from './pages/MenuPage';
import ModesPage from './pages/ModesPage';
import FlashcardPage from './pages/FlashcardPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import StatsPage from './pages/StatsPage';
import RankingPage from './pages/RankingPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import MissionsPage from './pages/MissionsPage';
import SeasonsPage from './pages/SeasonsPage';
import RewardsPage from './pages/RewardsPage';
import PerfilPage from './pages/PerfilPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { calcSeasonXp } from './constants/seasons';
import { updateMissions, getNewlyCompleted, resolveChallenges } from './utils/missions';

import { motion, AnimatePresence as AP } from 'framer-motion';

// ── ACHIEVEMENT TOAST ──────────────────────────────────────────────────────
function AchievementToast({ achievement, onDone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 80, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onAnimationComplete={() => setTimeout(onDone, 2500)}
      className="fixed bottom-6 left-4 right-4 z-50 pointer-events-none
        bg-white border border-gray-100 shadow-2xl rounded-3xl px-4 py-4 flex items-center gap-3
        max-w-sm mx-auto"
    >
      <span className="text-4xl shrink-0">{achievement.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-violet-500 uppercase tracking-wide">Conquista Desbloqueada!</p>
        <p className="font-black text-gray-900 leading-tight">{achievement.title}</p>
        <p className="text-xs text-gray-400 font-semibold leading-snug">{achievement.desc}</p>
      </div>
    </motion.div>
  );
}

// ── MODAL: DEFINIR META DE OFENSIVA ─────────────────────────────────────────
function GoalModal({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center text-4xl mb-1">🔥</div>
        <h3 className="text-xl font-black text-gray-900 text-center">Defina sua meta de ofensiva</h3>
        <p className="text-sm text-gray-400 font-semibold text-center mt-1 mb-5">
          Quantos dias seguidos você quer praticar?
        </p>
        <div className="grid grid-cols-3 gap-3">
          {STREAK_GOALS.map((g) => (
            <button
              key={g}
              onClick={() => onSelect(g)}
              className="py-4 rounded-2xl bg-violet-50 border border-violet-200 text-violet-700 font-black hover:bg-violet-100 hover:scale-[1.03] active:scale-95 transition-all"
            >
              {g}
              <span className="block text-xs font-bold text-violet-400">dias</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MODAL: ESCOLHER RECOMPENSA DE OFENSIVA (40/100/250/365 dias) ─────────────
function RewardModal({ milestone, onChoose }) {
  const opts = [
    { id: 'level', icon: '⭐', label: 'Subir de Nível', desc: 'Avança 1 nível agora' },
    { id: 'xp', icon: '✨', label: `+${milestone * 20} XP`, desc: 'Ganho direto de XP' },
    { id: 'coins', icon: '🪙', label: `+${milestone * 5} moedas`, desc: 'Moedas do jogo' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center text-4xl mb-1">🎉</div>
        <h3 className="text-xl font-black text-gray-900 text-center">
          Ofensiva de {milestone} dias!
        </h3>
        <p className="text-sm text-gray-400 font-semibold text-center mt-1 mb-5">
          Escolha sua recompensa
        </p>
        <div className="flex flex-col gap-3">
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => onChoose(o.id)}
              className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 active:scale-[0.98] transition-all text-left"
            >
              <span className="text-2xl">{o.icon}</span>
              <div>
                <p className="font-black text-gray-900 text-sm">{o.label}</p>
                <p className="text-xs text-gray-400 font-semibold">{o.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── LEVEL-UP PARTICLE BURST ───────────────────────────────────────────────
const BURST_COLORS = ['#7C3AED', '#A855F7', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#F97316', '#EF4444'];
const BURST_PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  angle: (i / 28) * 360,
  color: BURST_COLORS[i % BURST_COLORS.length],
  distance: 90 + (i % 4) * 30,
  size: 7 + (i % 3) * 4,
}));

function LevelUpBurst({ level, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] flex items-center justify-center">
      {/* Texto central */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.3, 0.6, 1] }}
        className="absolute text-center select-none"
      >
        <div className="text-6xl mb-1">{level?.badge}</div>
        <div className="text-2xl font-black text-white drop-shadow-lg bg-violet-600/80 px-4 py-2 rounded-2xl">
          LEVEL UP!
        </div>
      </motion.div>

      {/* Partículas */}
      {BURST_PARTICLES.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad) * p.distance, y: Math.sin(rad) * p.distance, opacity: 0, scale: 0.2 }}
            transition={{ duration: 0.85, ease: 'easeOut', delay: 0.05 }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              backgroundColor: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        );
      })}
    </div>
  );
}

// ── MODAL DE APOSTA ───────────────────────────────────────────────────────
// Antes de iniciar uma partida nos modos principais, jogador pode apostar
// moedas: se bater seu recorde nesse modo, recebe 3× a aposta; senão perde.
const BET_AMOUNTS = [10, 25, 50];

function BetModal({ mode, modeLabel, currentRecord, coins, onConfirm, onSkip }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center text-4xl mb-1">🎲</div>
        <h3 className="text-xl font-black text-gray-900 text-center">Quer apostar?</h3>
        <p className="text-sm text-gray-400 font-semibold text-center mt-1 mb-4 leading-snug">
          Aposte moedas no <strong className="text-gray-700">{modeLabel}</strong>.<br/>
          {currentRecord > 0
            ? <>Bata seu recorde de <strong className="text-violet-600">{currentRecord} pts</strong> e receba <strong className="text-amber-600">3× a aposta</strong>.</>
            : <>Defina seu primeiro recorde e ganhe <strong className="text-amber-600">3× a aposta</strong>!</>
          }
        </p>
        <p className="text-xs text-center font-bold text-gray-500 mb-3">
          Você tem 🪙 {coins.toLocaleString('pt-BR')}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {BET_AMOUNTS.map((amt) => {
            const can = coins >= amt;
            return (
              <button
                key={amt}
                onClick={() => can && onConfirm(amt)}
                disabled={!can}
                className={`py-3 rounded-2xl font-black text-sm transition-all
                  ${can
                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-200 hover:scale-[1.03] active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                🪙 {amt}
                <span className="block text-[10px] font-bold mt-0.5">
                  ganha {amt * 3}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onSkip}
          className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-600 text-sm font-bold hover:bg-gray-200 active:scale-[0.98] transition-all"
        >
          Jogar sem apostar
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── MODAL: SEM VIDAS HOJE [v6.0 · Bloco 2] ──────────────────────────────────
// Pote diário de vidas zerado (qualquer modo bloqueado até repor). Reposição
// enche o pote de volta a DAILY_LIVES_MAX inteiro, não vida por vida — de
// propósito caro (ver planejamento-6.0.md seção 5, LIFE_REFILL_PRICE).
function NoLivesModal({ coins, onBuy, onClose }) {
  const canBuy = coins >= LIFE_REFILL_PRICE;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-3xl p-6 w-full max-w-sm shadow-2xl border-2 border-border"
      >
        <div className="text-center text-4xl mb-1">💔</div>
        <h3 className="text-xl font-black text-fg text-center">Sem vidas hoje!</h3>
        <p className="text-sm text-fg-muted font-semibold text-center mt-1 mb-4 leading-snug">
          Você usou suas {DAILY_LIVES_MAX} vidas do dia. Volta amanhã com o pote cheio,
          ou compra a reposição agora.
        </p>
        <p className="text-xs text-center font-bold text-fg-muted mb-3">
          Você tem 🪙 {coins.toLocaleString('pt-BR')}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => canBuy && onBuy()}
            disabled={!canBuy}
            className={`w-full py-3 rounded-2xl font-black text-sm transition-all
              ${canBuy
                ? 'bg-accent text-white shadow-chunky-accent hover:bg-accent/90 active:translate-y-1 active:shadow-none'
                : 'bg-surface-2 text-fg-muted cursor-not-allowed'}`}
          >
            🪙 Repor vidas ({LIFE_REFILL_PRICE})
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-surface-2 text-fg-muted text-sm font-bold hover:bg-border transition-all"
          >
            Volto amanhã
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── PWA INSTALL BANNER ────────────────────────────────────────────────────
function InstallBanner({ onInstall, onDismiss }) {
  return (
    <motion.div
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 120, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="fixed bottom-5 left-4 right-4 z-50 bg-white rounded-2xl px-4 py-3.5 shadow-xl border border-violet-100 flex items-center gap-3 max-w-lg mx-auto"
    >
      <span className="text-3xl shrink-0">📱</span>
      <div className="flex-1 min-w-0">
        <p className="font-black text-gray-900 text-sm leading-tight">Instalar o App</p>
        <p className="text-xs text-gray-400 font-semibold">Jogue offline e acesse mais rápido!</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={onDismiss}
          className="text-xs font-bold text-gray-400 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          Agora não
        </button>
        <button
          onClick={onInstall}
          className="text-xs font-black text-white bg-violet-600 px-3 py-1.5 rounded-xl hover:bg-violet-700 transition-colors"
        >
          Instalar
        </button>
      </div>
    </motion.div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const { data, update } = useApp();
  const { user } = useAuth();
  const [screen, setScreen] = useState('menu');
  const [activeMode, setActiveMode] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [goalModalManual, setGoalModalManual] = useState(false);
  const [customQuestions, setCustomQuestions] = useState(null);
  const [showParticles, setShowParticles] = useState(false);
  const [particlesLevel, setParticlesLevel] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [pendingBetMode, setPendingBetMode] = useState(null); // modo que está aguardando confirmação de aposta
  const [pendingNoLivesMode, setPendingNoLivesMode] = useState(null); // [v6.0·Bloco 2] modo bloqueado por falta de vidas
  const deferredPrompt = useRef(null);

  const showAchievement = useCallback((a) => {
    setAchievementQueue((q) => [...q, a]);
  }, []);

  // Escolha de meta de ofensiva (login / nova meta após bater a anterior)
  const chooseGoal = useCallback(
    (g) => {
      update((prev) => ({ ...prev, streakGoal: g, streakGoalBase: prev.currentStreak || 0 }));
      setGoalModalManual(false);
    },
    [update]
  );

  // Escolha de recompensa ao bater marco de ofensiva (40/100/250/365)
  const chooseReward = useCallback(
    (choice) => {
      update((prev) => {
        const m = prev.pendingStreakReward;
        if (m == null) return prev;
        const claimed = [...(prev.streakRewardsClaimed || []), m];
        const patch = { streakRewardsClaimed: claimed, pendingStreakReward: null };
        if (choice === 'level') {
          const idx = getLevelIdx(prev.xp || 0);
          patch.xp = Math.max(prev.xp || 0, LEVELS[Math.min(idx + 1, LEVELS.length - 1)].xp);
        } else if (choice === 'xp') {
          patch.xp = (prev.xp || 0) + m * 20;
        } else if (choice === 'coins') {
          patch.coins = (prev.coins || 0) + m * 5;
        }
        return { ...prev, ...patch };
      });
    },
    [update]
  );

  const handleGameEnd = useCallback(
    (result) => {
      const today = todayStr();

      // Resolução da aposta ativa (calculada com base no estado ANTES do update):
      //   - Se o jogador apostou nesse modo e bateu o recorde do modo → +3× moedas
      //   - Senão → aposta consumida (perdida)
      const activeBet = data.activeBet;
      let betPayout = 0;
      let betResult = null; // 'win' | 'lose' | null
      if (activeBet && activeBet.mode === result.mode) {
        const prevRecord = data.records?.[result.mode] || 0;
        if (result.score > prevRecord) {
          betPayout = activeBet.amount * 3;
          betResult = 'win';
        } else {
          betResult = 'lose';
        }
      }

      // [v6.0 · Bloco 5] Desafios mensais resolvidos nesta partida (prazo
      // passou) — preenchido dentro do update() abaixo, lido depois pra
      // aplicar os toasts (mesmo padrão do bet* acima).
      let challengeResolutions = [];

      const newData = update((prev) => {
        const isNewRecord =
          !prev.records?.[result.mode] || result.score > prev.records[result.mode];
        const modesPlayed = prev.modesPlayed || [];
        const allModesPlayed = modesPlayed.includes(result.mode)
          ? modesPlayed
          : [...modesPlayed, result.mode];

        const totalGames = (prev.totalGames || 0) + 1;
        const totalCorrect = (prev.totalCorrect || 0) + result.correct;
        const totalWrong = (prev.totalWrong || 0) + result.wrong;
        const bestStreak = Math.max(prev.bestStreak || 0, result.bestStreak);
        const bestScore = Math.max(prev.bestScore || 0, result.score);

        const sessionTotal = result.correct + result.wrong;
        const sessionAccuracy =
          sessionTotal > 0 ? Math.round((result.correct / sessionTotal) * 100) : 0;
        const bestAccuracy = Math.max(prev.bestAccuracy || 0, sessionAccuracy);

        // Ofensiva diária (ano-aware): +1 se jogou ontem (mesmo ano), mantém se já jogou
        // hoje, senão reinicia em 1. Virada de ano sempre reinicia.
        const lastPlay = prev.lastPlayDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        const yearTurn =
          lastPlay && new Date(lastPlay).getFullYear() < new Date(today).getFullYear();
        const currentStreak = yearTurn
          ? 1
          : lastPlay === yStr
          ? (prev.currentStreak || 0) + 1
          : lastPlay === today
          ? prev.currentStreak || 1
          : 1;

        // Recorde de ofensiva diária (não reseta nunca)
        const bestDayStreak = Math.max(prev.bestDayStreak || 0, currentStreak);

        // Base da meta: se a ofensiva caiu abaixo da base (reset), rebaseia para 0.
        let streakGoalBase = prev.streakGoalBase || 0;
        if (currentStreak <= streakGoalBase) streakGoalBase = 0;

        // Meta batida? (progresso = ofensiva − base). Ao bater, zera a meta para
        // forçar a escolha de uma nova meta no modal.
        const goal = prev.streakGoal;
        const metaHit = goal != null && currentStreak - streakGoalBase >= goal;
        const nextStreakGoal = metaHit ? null : goal;

        // Marco de recompensa (40/100/250/365) atingido e ainda não resgatado?
        const claimedRewards = prev.streakRewardsClaimed || [];
        const pendingStreakReward =
          STREAK_REWARD_MILESTONES.find(
            (m) => currentStreak >= m && !claimedRewards.includes(m)
          ) ||
          prev.pendingStreakReward ||
          null;

        // XP v3.0 — 100% baseado em desempenho, sem bônus de dias jogados.
        //   Cada modo tem seu próprio xpMultiplier (definido em constants/index.js).
        const MODE_XP_MULT = { rush: 0.20, zen: 0, review: 0.16 };
        // Power-up XP Dobrado: dobra o XP desta partida e consome 1 unidade do estoque
        const xp2Active = (prev.powerups?.xp2 || 0) > 0;
        // [pendência pós-reset] Pódio da Diamante dá XP extra enquanto durar
        // (avaliado por ciclo de 6 dias — ver utils/leagues.js). Checa o
        // estado ANTES desta partida (prev), igual ao xp2Active acima.
        const DIAMOND_PODIUM_BONUS = 1.25;
        const diamondBonusActive = !!prev.diamondPodiumActive;
        const gameXp = Math.round(
          Math.round((result.score || 0) * (MODE_XP_MULT[result.mode] ?? 0.20)) *
            (xp2Active ? 2 : 1) *
            (diamondBonusActive ? DIAMOND_PODIUM_BONUS : 1)
        );
        const xp = (prev.xp || 0) + gameXp;

        // ── Moedas ganhas nesta partida ─────────────────────────────────────
        // v5.0 · Bloco 1: mais difícil de ganhar — precisa praticar mais pra
        // acumular. Zen não gera moeda nenhuma (é treino livre, sem recompensa).
        // Cap: 8 moedas/partida = 0.15 × acertos, +1 bônus se manteve a ofensiva.
        const coinsEarned =
          result.mode === 'zen'
            ? 0
            : Math.min(8, Math.max(1, Math.floor((result.correct || 0) * 0.15))) +
              (currentStreak > 1 ? 1 : 0);

        // ── XP de temporada (separado do XP de nível) ───────────────────────
        const earnedSeasonXp = calcSeasonXp(result, currentStreak);

        // ── Atualiza progresso das missões ──────────────────────────────────
        let updatedMissionsData = updateMissions(prev.missionsData, result, currentStreak);

        // [v6.0 · Bloco 5] Resolve desafios mensais cujo prazo passou (ganhou
        // ou perdeu) — aplica moeda (pode ficar negativa, ver
        // planejamento-6.0.md seção 7) e guarda pra mostrar toast depois.
        const challengeResolution = resolveChallenges(updatedMissionsData);
        updatedMissionsData = challengeResolution.missionsData;
        challengeResolutions = challengeResolution.resolutions;
        const challengeCoinDelta = challengeResolutions.reduce(
          (sum, r) => sum + (r.won ? r.challenge.reward : -r.challenge.penalty),
          0
        );

        const session = {
          mode: result.mode,
          score: result.score,
          correct: result.correct,
          wrong: result.wrong,
          avgMs: result.avgMs || 0, // tempo médio de resposta da partida (ms)
          date: new Date().toISOString(),
        };
        const sessions = [...(prev.sessions || []), session].slice(-100);

        // Recorde de velocidade: menor tempo médio de resposta por partida
        let fastestAvgMs = prev.fastestAvgMs ?? null;
        if (result.avgMs > 0) {
          fastestAvgMs = fastestAvgMs == null ? result.avgMs : Math.min(fastestAvgMs, result.avgMs);
        }

        // Desempenho por tabuada (fator a) — agrega o registro por questão da partida.
        // Também registra factStats por par (a,b) normalizado para o Mapa de Domínio.
        // tableStats/factStats ficam sob `.mult` (só multiplicação existe no jogo).
        const tableStats = { ...(prev.tableStats || {}) };
        const factStats = { ...(prev.factStats || {}) };
        // [v4.0 · Fase 4] `lastPracticed` alimenta o modelo de curva de esquecimento
        // (predictRecallProbability) — precisa saber HÁ QUANTO TEMPO o fato foi praticado.
        const nowIso = new Date().toISOString();
        for (const q of result.questions || []) {
          if (q == null || q.a == null) continue;
          const op = q.operation || 'mult';
          const opTableStats = { ...(tableStats[op] || {}) };
          const k = String(q.a);
          const t = opTableStats[k]
            ? { ...opTableStats[k] }
            : { correct: 0, wrong: 0, totalMs: 0, count: 0 };
          if (q.correct) t.correct += 1;
          else t.wrong += 1;
          if (q.ms > 0) t.totalMs += q.ms;
          t.count += 1;
          t.lastPracticed = nowIso;
          opTableStats[k] = t;
          tableStats[op] = opTableStats;

          // factStats: chave normalizada (getFactKey) para que 3×7 e 7×3 sejam o mesmo fato.
          if (q.b != null) {
            const opFactStats = { ...(factStats[op] || {}) };
            const fk = getFactKey(op, q.a, q.b);
            const f = opFactStats[fk]
              ? { ...opFactStats[fk] }
              : { correct: 0, wrong: 0, totalMs: 0, count: 0 };
            if (q.correct) f.correct += 1;
            else f.wrong += 1;
            if (q.ms > 0) f.totalMs += q.ms;
            f.count += 1;
            f.lastPracticed = nowIso;
            opFactStats[fk] = f;
            factStats[op] = opFactStats;
          }
        }

        const nextState = {
          ...prev,
          xp,
          totalGames,
          totalCorrect,
          totalWrong,
          bestStreak,
          bestScore,
          bestAccuracy,
          modesPlayed: allModesPlayed,
          fastestAvgMs,
          tableStats,
          factStats,
          currentStreak,
          bestDayStreak,
          streakGoalBase,
          streakGoal: nextStreakGoal,
          pendingStreakReward,
          lastPlayDate: today,
          sessions,
          records: {
            ...prev.records,
            ...(isNewRecord ? { [result.mode]: result.score } : {}),
          },
          coins: (prev.coins || 0) + coinsEarned + betPayout + challengeCoinDelta,
          activeBet: null,
          seasonXp: (prev.seasonXp || 0) + earnedSeasonXp,
          missionsData: updatedMissionsData,
          // Consome 1 unidade do XP Dobrado se estava ativo
          powerups: xp2Active
            ? { ...(prev.powerups || {}), xp2: Math.max(0, (prev.powerups?.xp2 || 0) - 1) }
            : (prev.powerups || {}),
        };

        // Registro de evolução: anexa os novos marcos atingidos nesta partida.
        const events = detectProgressEvents(prev, nextState);
        nextState.progressLog = [...(prev.progressLog || []), ...events].slice(-50);

        return nextState;
      });

      // Level up check + partículas de celebração
      const prevLevelIdx = getLevelIdx(data.xp || 0);
      const newLevelIdx = getLevelIdx(newData.xp || 0);
      if (newLevelIdx > prevLevelIdx) {
        showAchievement({
          id: '_levelup',
          icon: LEVELS[newLevelIdx].badge,
          title: `Nível: ${LEVELS[newLevelIdx].name}!`,
          desc: `Você subiu para o nível ${newLevelIdx + 1}`,
        });
        // Dispara explosão de partículas
        setParticlesLevel(LEVELS[newLevelIdx]);
        setShowParticles(true);
      }

      // [v6.0 · Bloco 4] Promoveu/rebaixou de liga com essa partida? Substitui
      // o antigo toast de "subiu de classificação no Ranking de QI" — ver
      // DECISIONS.md (Ligas) e utils/leagues.js. Sempre persiste os campos de
      // liga/pódio (mesmo sem promover/rebaixar — um pódio pode acontecer
      // ficando na mesma liga, ver applyLeaguePromotion).
      const leaguePromo = applyLeaguePromotion(newData);
      update((prev) => ({
        ...prev,
        leagueId: leaguePromo.data.leagueId,
        leagueXpBase: leaguePromo.data.leagueXpBase,
        leagueEnteredAt: leaguePromo.data.leagueEnteredAt,
        leaguePodiums: leaguePromo.data.leaguePodiums,
        leaguePodiumClaimed: leaguePromo.data.leaguePodiumClaimed,
        leagueLastCycleChecked: leaguePromo.data.leagueLastCycleChecked,
        diamondPodiumActive: leaguePromo.data.diamondPodiumActive,
      }));
      if (leaguePromo.promoted || leaguePromo.relegated) {
        showAchievement(
          leaguePromo.promoted
            ? {
                id: '_league_up',
                icon: leaguePromo.newLeague.emoji,
                title: 'Promoção de Liga!',
                desc: `Você subiu pra Liga ${leaguePromo.newLeague.name}`,
              }
            : {
                id: '_league_down',
                icon: leaguePromo.newLeague.emoji,
                title: 'Rebaixamento de Liga',
                desc: `Você caiu pra Liga ${leaguePromo.newLeague.name}`,
              }
        );
      } else if (leaguePromo.podiumAchieved) {
        showAchievement({
          id: '_league_podium',
          icon: '🏆',
          title: 'Pódio!',
          desc: `Você ficou entre os 3 primeiros da Liga ${leaguePromo.data.leagueId ? LEAGUE_MAP[leaguePromo.data.leagueId]?.name : ''}`,
        });
      }

      // New record check
      const isNewRecord =
        !data.records?.[result.mode] || result.score > data.records[result.mode];
      if (isNewRecord && result.score > 0) {
        showAchievement({
          id: '_record',
          icon: '🏆',
          title: 'Novo Recorde!',
          desc: `${result.score} pts em ${result.mode}`,
        });
      }

      // Achievement check — usa newData COM os campos de liga já atualizados
      // (leaguePromo.data), senão uma conquista de "chegou na liga X" só
      // apareceria na partida seguinte (checkNewAchievements corre antes do
      // update() de liga terminar de persistir).
      const newAchievements = checkNewAchievements({ ...newData, ...leaguePromo.data });
      if (newAchievements.length) {
        update((prev) => ({
          ...prev,
          achievements: [...(prev.achievements || []), ...newAchievements.map((a) => a.id)],
        }));
        newAchievements.forEach((a, i) => {
          setTimeout(() => showAchievement(a), i * 3000);
        });
      }

      // Missões recém-completadas → toast
      const newlyCompletedMissions = getNewlyCompleted(data.missionsData, newData.missionsData);
      if (newlyCompletedMissions.length) {
        newlyCompletedMissions.forEach((m, i) => {
          setTimeout(
            () =>
              showAchievement({
                id: `_mission_${m.id}`,
                icon: m.emoji,
                title: `Missão: ${m.title}`,
                desc: `+${m.reward} moedas para resgatar!`,
              }),
            (newAchievements.length + i) * 3000
          );
        });
      }

      // Toast da aposta (win/lose)
      if (betResult === 'win') {
        showAchievement({
          id: '_bet_win',
          icon: '💰',
          title: 'Aposta vencida!',
          desc: `+${betPayout} 🪙 (apostou ${activeBet.amount})`,
        });
      } else if (betResult === 'lose') {
        showAchievement({
          id: '_bet_lose',
          icon: '💸',
          title: 'Aposta perdida',
          desc: `-${activeBet.amount} 🪙 — tente de novo!`,
        });
      }

      // [v6.0 · Bloco 5] Toast de desafio(s) mensal(is) resolvido(s) nesta partida
      challengeResolutions.forEach((r, i) => {
        setTimeout(
          () =>
            showAchievement(
              r.won
                ? {
                    id: `_challenge_win_${r.challenge.id}`,
                    icon: r.challenge.emoji,
                    title: 'Desafio mensal cumprido!',
                    desc: `${r.challenge.title} — +${r.challenge.reward} 🪙`,
                  }
                : {
                    id: `_challenge_lose_${r.challenge.id}`,
                    icon: '💸',
                    title: 'Desafio mensal não cumprido',
                    desc: `${r.challenge.title} — -${r.challenge.penalty} 🪙`,
                  }
            ),
          i * 3000
        );
      });

      // xp2Used: verifica ANTES do update (data ainda tem o valor antigo, xp2 > 0 = estava ativo)
      const xp2Used = (data.powerups?.xp2 || 0) > 0;
      setLastResult({ ...result, xp2Used, betResult, betPayout, betAmount: activeBet?.amount });
      setScreen('results');
    },
    [data, update, showAchievement]
  );

  // Música de fundo (no 1º gesto, p/ a política de autoplay) + lembrete de ofensiva
  useEffect(() => {
    const p = prefs.get();
    let startMusic;
    if (p.music) {
      startMusic = () => {
        audio.startMusic();
        window.removeEventListener('pointerdown', startMusic);
        window.removeEventListener('keydown', startMusic);
      };
      window.addEventListener('pointerdown', startMusic);
      window.addEventListener('keydown', startMusic);
    }
    if (p.notifications) {
      maybeStreakReminder(data);
      maybeMissionExpireReminder(data.missionsData);
      maybeForgettingReminder(countFactsAtRiskAllOps(data));
    }
    return () => {
      if (startMusic) {
        window.removeEventListener('pointerdown', startMusic);
        window.removeEventListener('keydown', startMusic);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mantém a inscrição de push atualizada quando o usuário loga (se notificações ON)
  useEffect(() => {
    if (user && prefs.get().notifications) subscribeToPush(user.id);
  }, [user]);

  // PWA install prompt — captura o evento 'beforeinstallprompt' do browser
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      // Mostra banner após 3s na primeira vez (não briga com outros modais)
      setTimeout(() => setShowInstall(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Inicia partida pulando o fluxo de aposta (também usado quando o jogador
  // recusa apostar). Define modo, prepara questões e abre o GamePage.
  const startGame = useCallback((mode) => {
    if (mode === 'review') {
      setCustomQuestions(getRevisionQuestions(data.tableStats?.mult || {}, 15));
    } else {
      setCustomQuestions(null);
    }
    setActiveMode(mode);
    setScreen('game');
  }, [data.tableStats]);

  // [v6.0 · Bloco 2] Perde 1 vida do pote diário (não é por partida — ver
  // getLivesInfo/DAILY_LIVES_MAX). Reseta o pote pro dia atual antes de
  // descontar, se o último registro for de um dia anterior.
  const loseLife = useCallback(() => {
    update((prev) => {
      const info = getLivesInfo(prev);
      return { ...prev, livesData: { date: todayStr(), remaining: Math.max(0, info.remaining - 1) } };
    });
  }, [update]);

  const handleStart = useCallback((mode) => {
    // Bloqueio defensivo: se o modo está locked, não inicia.
    // (A UI já bloqueia o clique, mas isso protege contra navegação programática.)
    const unlock = getModeUnlock(mode, data);
    if (!unlock.unlocked) return;

    // [v6.0 · Bloco 2] Sem vidas hoje → bloqueia QUALQUER modo até repor
    // (comprar) ou o dia virar. Checa antes da aposta — sem vida, nem chega
    // a apostar.
    if (getLivesInfo(data).remaining <= 0) {
      setPendingNoLivesMode(mode);
      return;
    }

    // Aposta só no Rush — modos de treino (Zen/Revisão) não permitem aposta.
    const bettable = mode === 'rush';
    const hasMinCoins = (data.coins || 0) >= 10;
    if (bettable && hasMinCoins && !data.activeBet) {
      setPendingBetMode(mode);
      return;
    }
    startGame(mode);
  }, [data, startGame]);

  // Compra a reposição do pote de vidas (enche de volta a DAILY_LIVES_MAX) e
  // segue direto pro modo que estava bloqueado — pula o fluxo de aposta
  // nessa entrada específica (evita empilhar modal em cima de modal logo
  // depois de pagar pra desbloquear).
  const handleBuyLifeRefill = useCallback(() => {
    if ((data.coins || 0) < LIFE_REFILL_PRICE) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - LIFE_REFILL_PRICE,
      livesData: { date: todayStr(), remaining: DAILY_LIVES_MAX },
    }));
    const mode = pendingNoLivesMode;
    setPendingNoLivesMode(null);
    if (mode) startGame(mode);
  }, [data.coins, pendingNoLivesMode, update, startGame]);

  // Confirma aposta: desconta moedas, grava data.activeBet e inicia partida.
  const handleConfirmBet = useCallback((amount) => {
    if ((data.coins || 0) < amount) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - amount,
      activeBet: { mode: pendingBetMode, amount },
    }));
    const mode = pendingBetMode;
    setPendingBetMode(null);
    startGame(mode);
  }, [data.coins, pendingBetMode, startGame, update]);

  const handleSkipBet = useCallback(() => {
    const mode = pendingBetMode;
    setPendingBetMode(null);
    startGame(mode);
  }, [pendingBetMode, startGame]);

  const handleReplay = useCallback(() => {
    setScreen('game');
  }, []);

  return (
    <div className="min-h-dvh app-shell font-nunito lg:flex">
      {/* Barra lateral estilo Duolingo — só em telas largas (lg+); no
          celular o app segue em coluna única, sem sidebar. */}
      <Sidebar screen={screen} onNavigate={setScreen} />
      <div className="flex-1 flex flex-col min-h-dvh">
        {/* v6.0 · Bloco 1: barra superior persistente (faixa/ofensiva/moedas/
            vidas) — some durante a partida, que já tem seu próprio HUD. */}
        {screen !== 'game' && <Header />}
        <div className="flex-1 flex justify-center">
        <div className="w-full max-w-lg px-4 py-6">
        <AnimatePresence mode="wait">
          {screen === 'menu' && (
            <MenuPage
              key="menu"
              onStart={handleStart}
              onNavigate={setScreen}
              onEditGoal={() => setGoalModalManual(true)}
            />
          )}
          {screen === 'auth' && (
            <AuthPage
              key="auth"
              onBack={() => setScreen('menu')}
              onSuccess={() => setScreen('menu')}
            />
          )}
          {screen === 'modes' && (
            <ModesPage
              key="modes"
              onStart={handleStart}
              onBack={() => setScreen('menu')}
              onNavigate={setScreen}
            />
          )}
          {screen === 'flashcard' && (
            <FlashcardPage key="flashcard" onBack={() => setScreen('menu')} />
          )}
          {screen === 'game' && activeMode && (
            <GamePage
              key={`game-${activeMode}`}
              mode={activeMode}
              adaptiveDifficulty={data.adaptiveDifficulty !== false}
              customQuestions={customQuestions}
              onEnd={handleGameEnd}
              onBack={() => setScreen('menu')}
              powerups={data.powerups || {}}
              onWrongAnswer={loseLife}
              onUsePowerup={(key) =>
                update((prev) => ({
                  ...prev,
                  powerups: {
                    ...(prev.powerups || {}),
                    [key]: Math.max(0, ((prev.powerups || {})[key] || 0) - 1),
                  },
                }))
              }
            />
          )}
          {screen === 'results' && lastResult && (
            <ResultsPage
              key="results"
              result={lastResult}
              onReplay={handleReplay}
              onHome={() => setScreen('menu')}
            />
          )}
          {screen === 'stats' && (
            <StatsPage key="stats" onBack={() => setScreen('menu')} />
          )}
          {screen === 'ranking' && (
            <RankingPage key="ranking" onBack={() => setScreen('menu')} />
          )}
          {screen === 'settings' && (
            <SettingsPage
              key="settings"
              onBack={() => setScreen('menu')}
              onNavigate={setScreen}
            />
          )}
          {screen === 'rewards' && (
            <RewardsPage key="rewards" onBack={() => setScreen('menu')} />
          )}
          {screen === 'shop' && (
            <ShopPage key="shop" onBack={() => setScreen('menu')} />
          )}
          {screen === 'missions' && (
            <MissionsPage key="missions" onBack={() => setScreen('menu')} />
          )}
          {screen === 'seasons' && (
            <SeasonsPage key="seasons" onBack={() => setScreen('menu')} />
          )}
          {screen === 'perfil' && <PerfilPage key="perfil" />}
        </AnimatePresence>
        </div>
        </div>
      </div>

      {/* Achievement / level-up toasts */}
      <AP>
        {achievementQueue[0] && (
          <AchievementToast
            key={achievementQueue[0].id + achievementQueue[0].title}
            achievement={achievementQueue[0]}
            onDone={() => setAchievementQueue((q) => q.slice(1))}
          />
        )}
      </AP>

      {/* ── Explosão de partículas ao subir de nível ──────────────────── */}
      <AP>
        {showParticles && (
          <LevelUpBurst
            key="burst"
            level={particlesLevel}
            onDone={() => setShowParticles(false)}
          />
        )}
      </AP>

      {/* ── PWA Install Banner ─────────────────────────────────────────── */}
      <AP>
        {showInstall && screen === 'menu' && (
          <InstallBanner
            key="install"
            onInstall={async () => {
              setShowInstall(false);
              if (deferredPrompt.current) {
                deferredPrompt.current.prompt();
                await deferredPrompt.current.userChoice;
                deferredPrompt.current = null;
              }
            }}
            onDismiss={() => setShowInstall(false)}
          />
        )}
      </AP>

      {/* ── Modal de sem vidas [v6.0 · Bloco 2] ─────────────────────────── */}
      <AP>
        {pendingNoLivesMode && (
          <NoLivesModal
            key="no-lives"
            coins={data.coins || 0}
            onBuy={handleBuyLifeRefill}
            onClose={() => setPendingNoLivesMode(null)}
          />
        )}
      </AP>

      {/* ── Modal de aposta ──────────────────────────────────────────── */}
      <AP>
        {pendingBetMode && (
          <BetModal
            key="bet"
            mode={pendingBetMode}
            modeLabel={
              {
                rush: 'Rush',
                survival: 'Sobrevivência',
                speed: 'Velocidade',
                daily: 'Desafio Diário',
              }[pendingBetMode] || pendingBetMode
            }
            currentRecord={data.records?.[pendingBetMode] || 0}
            coins={data.coins || 0}
            onConfirm={handleConfirmBet}
            onSkip={handleSkipBet}
          />
        )}
      </AP>

      {/* Modais de ofensiva — só no menu. Recompensa tem prioridade sobre a meta. */}
      <AP>
        {screen === 'menu' && data.pendingStreakReward != null ? (
          <RewardModal
            key="reward"
            milestone={data.pendingStreakReward}
            onChoose={chooseReward}
          />
        ) : screen === 'menu' && (data.streakGoal == null || goalModalManual) ? (
          <GoalModal
            key="goal"
            onSelect={chooseGoal}
            onClose={goalModalManual ? () => setGoalModalManual(false) : undefined}
          />
        ) : null}
      </AP>
    </div>
  );
}
