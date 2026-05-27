import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { checkNewAchievements, todayStr, getLevelIdx, getQiInfo, detectProgressEvents } from './utils';
import { LEVELS, ACHIEVEMENTS, STREAK_GOALS, STREAK_REWARD_MILESTONES } from './constants';
import { prefs } from './lib/prefs';
import { audio } from './lib/audioManager';
import { maybeStreakReminder } from './lib/notify';
import { subscribeToPush } from './lib/push';

import MenuPage from './pages/MenuPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import RecordsPage from './pages/RecordsPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import RankingPage from './pages/RankingPage';
import CatalogPage from './pages/CatalogPage';
import AccuracyCatalogPage from './pages/AccuracyCatalogPage';
import SettingsPage from './pages/SettingsPage';
import AuthPage from './pages/AuthPage';
import ShopPage from './pages/ShopPage';
import MissionsPage from './pages/MissionsPage';
import SeasonsPage from './pages/SeasonsPage';
import { calcSeasonXp } from './constants/seasons';
import { updateMissions, getNewlyCompleted } from './utils/missions';

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
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none
        bg-white border border-gray-100 shadow-2xl rounded-3xl px-5 py-4 flex items-center gap-4
        max-w-xs w-full mx-4"
    >
      <span className="text-4xl">{achievement.icon}</span>
      <div>
        <p className="text-xs font-bold text-violet-500 uppercase tracking-wide">Conquista Desbloqueada!</p>
        <p className="font-black text-gray-900">{achievement.title}</p>
        <p className="text-xs text-gray-400 font-semibold">{achievement.desc}</p>
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
    { id: 'qi', icon: '🧠', label: '+5 de QI', desc: 'Bônus permanente de QI' },
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

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const { data, update } = useApp();
  const { user } = useAuth();
  const [screen, setScreen] = useState('menu');
  const [activeMode, setActiveMode] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [goalModalManual, setGoalModalManual] = useState(false);

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
        } else if (choice === 'qi') {
          patch.qiBonus = (prev.qiBonus || 0) + 5;
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

        const dailyCompleted =
          result.mode === 'daily' && result.dailyDate
            ? (prev.dailyCompleted || 0) + 1
            : prev.dailyCompleted || 0;

        const survivalBest =
          result.mode === 'survival'
            ? Math.max(prev.survivalBest || 0, result.correct)
            : prev.survivalBest || 0;
        const speedBest =
          result.mode === 'speed'
            ? Math.max(prev.speedBest || 0, result.correct)
            : prev.speedBest || 0;

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

        // XP v2.15 — calibrado para progressão realista (bem mais difícil):
        //   score × 0.2 por partida + bônus diário + bônus de ofensiva (caps menores).
        //   Combinado com thresholds ×3 em LEVELS → ~7× mais difícil que v2.5.
        //   Estimativa: ~60–80 XP/dia (jogo regular) → nível 5 em ~1.5 meses.
        const gameXp = Math.round(result.score * 0.2);
        const dailyBonus = result.mode === 'daily' ? 12 : 0;
        const streakBonus = currentStreak > 1 ? Math.min(currentStreak, 15) : 0;
        const xp = (prev.xp || 0) + gameXp + dailyBonus + streakBonus;

        // ── Moedas ganhas nesta partida ─────────────────────────────────────
        const coinsEarned =
          Math.max(1, Math.floor((result.score || 0) * 0.1)) +
          (result.mode === 'daily' ? 5 : 0) +
          (currentStreak > 1 ? 2 : 0);

        // ── XP de temporada (separado do XP de nível) ───────────────────────
        const earnedSeasonXp = calcSeasonXp(result, currentStreak);

        // ── Atualiza progresso das missões ──────────────────────────────────
        const updatedMissionsData = updateMissions(prev.missionsData, result, currentStreak);

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
        const tableStats = { ...(prev.tableStats || {}) };
        for (const q of result.questions || []) {
          if (q == null || q.a == null) continue;
          const k = String(q.a);
          const t = tableStats[k]
            ? { ...tableStats[k] }
            : { correct: 0, wrong: 0, totalMs: 0, count: 0 };
          if (q.correct) t.correct += 1;
          else t.wrong += 1;
          if (q.ms > 0) t.totalMs += q.ms;
          t.count += 1;
          tableStats[k] = t;
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
          dailyCompleted,
          survivalBest,
          speedBest,
          modesPlayed: allModesPlayed,
          fastestAvgMs,
          tableStats,
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
          currentDailyDate: result.mode === 'daily' ? today : prev.currentDailyDate,
          currentDailyScore: result.mode === 'daily' ? result.score : prev.currentDailyScore,
          coins: (prev.coins || 0) + coinsEarned,
          seasonXp: (prev.seasonXp || 0) + earnedSeasonXp,
          missionsData: updatedMissionsData,
        };

        // Registro de evolução: anexa os novos marcos atingidos nesta partida.
        const events = detectProgressEvents(prev, nextState);
        nextState.progressLog = [...(prev.progressLog || []), ...events].slice(-50);

        return nextState;
      });

      // Level up check
      const prevLevelIdx = getLevelIdx(data.xp || 0);
      const newLevelIdx = getLevelIdx(newData.xp || 0);
      if (newLevelIdx > prevLevelIdx) {
        showAchievement({
          id: '_levelup',
          icon: LEVELS[newLevelIdx].badge,
          title: `Nível: ${LEVELS[newLevelIdx].name}!`,
          desc: `Você subiu para o nível ${newLevelIdx + 1}`,
        });
      }

      // Subiu de classificação no Ranking de QI?
      const prevQi = getQiInfo(data);
      const newQi = getQiInfo(newData);
      if (newQi.idx > prevQi.idx) {
        showAchievement({
          id: '_qi_up',
          icon: newQi.char.emoji,
          title: 'Nova Classificação!',
          desc: `Agora você é ${newQi.char.name} · QI ${newQi.qi}`,
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

      // Achievement check
      const newAchievements = checkNewAchievements(newData);
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

      setLastResult(result);
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
    if (p.notifications) maybeStreakReminder(data);
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

  const handleStart = useCallback((mode) => {
    setActiveMode(mode);
    setScreen('game');
  }, []);

  const handleReplay = useCallback(() => {
    setScreen('game');
  }, []);

  return (
    <div className="min-h-dvh app-shell font-nunito">
      <div className="max-w-lg mx-auto px-4 py-6 min-h-dvh">
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
          {screen === 'game' && activeMode && (
            <GamePage
              key={`game-${activeMode}`}
              mode={activeMode}
              onEnd={handleGameEnd}
              onBack={() => setScreen('menu')}
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
          {screen === 'records' && (
            <RecordsPage key="records" onBack={() => setScreen('menu')} />
          )}
          {screen === 'stats' && (
            <StatsPage key="stats" onBack={() => setScreen('menu')} onNavigate={setScreen} />
          )}
          {screen === 'accuracy' && (
            <AccuracyCatalogPage key="accuracy" onBack={() => setScreen('stats')} />
          )}
          {screen === 'achievements' && (
            <AchievementsPage key="achievements" onBack={() => setScreen('menu')} />
          )}
          {screen === 'ranking' && (
            <RankingPage key="ranking" onBack={() => setScreen('menu')} />
          )}
          {screen === 'catalog' && (
            <CatalogPage key="catalog" onBack={() => setScreen('menu')} />
          )}
          {screen === 'settings' && (
            <SettingsPage
              key="settings"
              onBack={() => setScreen('menu')}
              onNavigate={setScreen}
            />
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
        </AnimatePresence>
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
