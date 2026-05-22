import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useApp } from './contexts/AppContext';
import { useAuth } from './contexts/AuthContext';
import { checkNewAchievements, todayStr, getLevelIdx } from './utils';
import { LEVELS, ACHIEVEMENTS } from './constants';

import MenuPage from './pages/MenuPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';
import RecordsPage from './pages/RecordsPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import BattlePage from './pages/BattlePage';
import AuthPage from './pages/AuthPage';

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

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const { data, update } = useApp();
  const { user } = useAuth();
  const [screen, setScreen] = useState('menu');
  const [activeMode, setActiveMode] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [achievementQueue, setAchievementQueue] = useState([]);

  const showAchievement = useCallback((a) => {
    setAchievementQueue((q) => [...q, a]);
  }, []);

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
        const xp = (prev.xp || 0) + result.score;

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

        // Day streak: increment if last play was yesterday, keep if today, reset otherwise
        const lastPlay = prev.lastPlayDate;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        const currentStreak =
          lastPlay === yStr
            ? (prev.currentStreak || 0) + 1
            : lastPlay === today
            ? prev.currentStreak || 1
            : 1;

        const session = {
          mode: result.mode,
          score: result.score,
          correct: result.correct,
          wrong: result.wrong,
          date: new Date().toISOString(),
        };
        const sessions = [...(prev.sessions || []), session].slice(-100);

        return {
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
          currentStreak,
          lastPlayDate: today,
          sessions,
          records: {
            ...prev.records,
            ...(isNewRecord ? { [result.mode]: result.score } : {}),
          },
          currentDailyDate: result.mode === 'daily' ? today : prev.currentDailyDate,
          currentDailyScore: result.mode === 'daily' ? result.score : prev.currentDailyScore,
        };
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

      setLastResult(result);
      setScreen('results');
    },
    [data, update, showAchievement]
  );

  const handleStart = useCallback((mode) => {
    setActiveMode(mode);
    setScreen('game');
  }, []);

  const handleReplay = useCallback(() => {
    setScreen('game');
  }, []);

  return (
    <div className="min-h-dvh bg-[hsl(250,30%,98%)] font-nunito">
      <div className="max-w-lg mx-auto px-4 py-6 min-h-dvh">
        <AnimatePresence mode="wait">
          {screen === 'menu' && (
            <MenuPage
              key="menu"
              onStart={handleStart}
              onNavigate={setScreen}
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
            <StatsPage key="stats" onBack={() => setScreen('menu')} />
          )}
          {screen === 'achievements' && (
            <AchievementsPage key="achievements" onBack={() => setScreen('menu')} />
          )}
          {screen === 'battle' && (
            <BattlePage key="battle" onBack={() => setScreen('menu')} />
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
    </div>
  );
}
