import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home } from 'lucide-react';
import { MODES } from '../constants';
import { getRandomQuestion, getDailyQuestions, getDiffLevel, calcPoints, formatTime } from '../utils';
import { Button, Progress } from '../components/ui';

// ── REDUCER ────────────────────────────────────────────────────────────────

function init(mode) {
  const cfg = MODES[mode];
  const dailyQs = mode === 'daily' ? getDailyQuestions(cfg.questions || 20) : null;
  return {
    phase: 'playing',
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    lives: cfg.lives ?? null,
    time: cfg.timer ?? 0,
    question: dailyQs ? dailyQs[0] : getRandomQuestion(1),
    dailyQs,
    dailyIdx: 0,
    answered: 0,
    lastCorrect: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'TICK': {
      const t = state.time - 1;
      return t <= 0 ? { ...state, time: 0, phase: 'ended' } : { ...state, time: t };
    }
    case 'TICK_UP':
      return { ...state, time: state.time + 1 };
    case 'CORRECT': {
      const streak = state.streak + 1;
      const pts = calcPoints(getDiffLevel(state.answered), streak);
      const addTime = action.modeId === 'rush' ? MODES.rush.bonusTime : 0;
      return {
        ...state,
        phase: 'feedback',
        score: state.score + pts,
        correct: state.correct + 1,
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        answered: state.answered + 1,
        lastCorrect: true,
        time: state.time + addTime,
      };
    }
    case 'WRONG': {
      const newLives = state.lives !== null ? state.lives - 1 : null;
      const ended = newLives !== null && newLives <= 0;
      return {
        ...state,
        phase: ended ? 'ended' : 'feedback',
        wrong: state.wrong + 1,
        streak: 0,
        answered: state.answered + 1,
        lastCorrect: false,
        lives: newLives,
      };
    }
    case 'NEXT': {
      const nextDailyIdx = state.dailyIdx + 1;
      const isDailyDone = state.dailyQs && nextDailyIdx >= state.dailyQs.length;
      if (isDailyDone) return { ...state, phase: 'ended' };
      const nextQ = state.dailyQs
        ? state.dailyQs[nextDailyIdx]
        : getRandomQuestion(getDiffLevel(state.answered));
      return {
        ...state,
        phase: 'playing',
        question: nextQ,
        dailyIdx: state.dailyQs ? nextDailyIdx : state.dailyIdx,
        lastCorrect: null,
      };
    }
    case 'END':
      return { ...state, phase: 'ended' };
    default:
      return state;
  }
}

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function GamePage({ mode, onEnd, onBack }) {
  const cfg = MODES[mode];
  const [state, dispatch] = useReducer(reducer, mode, init);
  const [inputVal, setInputVal] = useState('');
  const [inputState, setInputState] = useState('idle'); // idle | correct | wrong
  const [showCombo, setShowCombo] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  // Timer
  useEffect(() => {
    if (cfg.timer === null) {
      // survival & daily: count up to track elapsed time
      timerRef.current = setInterval(() => {
        if (phaseRef.current === 'playing' || phaseRef.current === 'feedback') {
          dispatch({ type: 'TICK_UP' });
        }
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    // countdown modes (rush, speed)
    timerRef.current = setInterval(() => {
      if (phaseRef.current === 'playing' || phaseRef.current === 'feedback') {
        dispatch({ type: 'TICK' });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cfg.timer, cfg.lives]);

  // Handle game end
  useEffect(() => {
    if (state.phase === 'ended') {
      clearInterval(timerRef.current);
      const timePlayed = cfg.timer
        ? cfg.timer - state.time
        : state.time;
      setTimeout(() => {
        onEnd({
          mode,
          score: state.score,
          correct: state.correct,
          wrong: state.wrong,
          bestStreak: state.bestStreak,
          timePlayed,
          totalQuestions: cfg.questions || state.answered,
          dailyDate: mode === 'daily' ? new Date().toISOString().split('T')[0] : null,
        });
      }, 300);
    }
  }, [state.phase]);

  // Focus input on question change
  useEffect(() => {
    if (state.phase === 'playing') {
      setInputVal('');
      setInputState('idle');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [state.question, state.phase]);

  const handleSubmit = useCallback(() => {
    if (state.phase !== 'playing') return;
    const val = parseInt(inputVal, 10);
    if (isNaN(val) || inputVal.trim() === '') return;

    if (val === state.question.ans) {
      setInputState('correct');
      dispatch({ type: 'CORRECT', modeId: mode });
      if ((state.streak + 1) % 5 === 0 && state.streak + 1 >= 5) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 900);
      }
      setTimeout(() => dispatch({ type: 'NEXT' }), 420);
    } else {
      setInputState('wrong');
      dispatch({ type: 'WRONG' });
      setTimeout(() => dispatch({ type: 'NEXT' }), 950);
    }
  }, [state.phase, state.question, state.streak, inputVal, mode]);

  const handleKey = useCallback(
    (e) => { if (e.key === 'Enter') handleSubmit(); },
    [handleSubmit]
  );

  // Derived
  const urgent = cfg.timer && state.time <= 15;
  const progress = cfg.timer
    ? (state.time / cfg.timer) * 100
    : cfg.questions
    ? ((state.dailyIdx) / cfg.questions) * 100
    : 0;

  const diffLevel = getDiffLevel(state.answered);
  const diffLabels = ['', 'Nível 1', 'Nível 2', 'Nível 3'];
  const diffColors = ['', 'text-gray-400', 'text-amber-500', 'text-rose-500'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <Home size={18} />
        </button>

        <div
          className={`text-center transition-colors ${urgent ? 'text-rose-500' : cfg.text}`}
        >
          <p className="text-xs font-bold uppercase tracking-wide opacity-60">
            {cfg.timer ? 'Tempo' : cfg.questions ? 'Questão' : 'Tempo'}
          </p>
          <p className={`text-3xl font-black tabular-nums ${urgent ? 'animate-pulse' : ''}`}>
            {cfg.questions
              ? `${state.dailyIdx + 1}/${cfg.questions}`
              : formatTime(state.time)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Pontos</p>
          <motion.p
            key={state.score}
            initial={{ scale: 1.3, color: '#7C3AED' }}
            animate={{ scale: 1, color: '#111827' }}
            transition={{ duration: 0.25 }}
            className="text-3xl font-black tabular-nums"
          >
            {state.score}
          </motion.p>
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={cfg.timer ? progress : (cfg.questions ? progress : 0)}
        colorClass={urgent ? 'bg-rose-500' : `bg-gradient-to-r ${cfg.gradient}`}
        className="h-1.5"
      />

      {/* Mode info row */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {cfg.lives !== null && (
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: i >= (state.lives ?? 3) ? 0.7 : 1, opacity: i >= (state.lives ?? 3) ? 0.3 : 1 }}
                  className="text-xl"
                >
                  ❤️
                </motion.span>
              ))}
            </div>
          )}
          <AnimatePresence>
            {state.streak >= 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-black"
              >
                🔥 {state.streak}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className={`text-xs font-bold ${diffColors[diffLevel]}`}>
          {diffLabels[diffLevel]}
        </span>
      </div>

      {/* Question card */}
      <div className={`bg-gradient-to-br ${cfg.gradientLight} rounded-3xl p-8 border ${cfg.border}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${state.question?.a}-${state.question?.b}-${state.answered}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={
              inputState === 'correct'
                ? { opacity: 1, scale: [1, 1.08, 1], y: 0 }
                : inputState === 'wrong'
                ? { opacity: 1, scale: 1, y: 0, x: [0, -8, 8, -6, 6, -3, 3, 0] }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.25, type: inputState === 'correct' ? 'spring' : 'tween' }}
            className="text-center"
          >
            <p className="text-7xl font-black text-gray-900 tracking-tight">
              {state.question?.a} × {state.question?.b}
            </p>
            <p className={`text-sm font-bold mt-2 ${cfg.text} opacity-70`}>Qual o resultado?</p>
          </motion.div>
        </AnimatePresence>

        {/* Feedback overlay */}
        <AnimatePresence>
          {state.phase === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 text-center"
            >
              {state.lastCorrect ? (
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg shadow-emerald-200">
                  <span>✓</span>
                  <span>Correto! +{calcPoints(diffLevel, state.streak)}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg shadow-rose-200">
                  <X size={16} />
                  <span>Errou! Resp: {state.question?.ans}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Answer input */}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Sua resposta..."
          disabled={state.phase !== 'playing'}
          className={`flex-1 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all
            ${inputState === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : ''}
            ${inputState === 'wrong'   ? 'border-rose-400   bg-rose-50   text-rose-700'    : ''}
            ${inputState === 'idle'    ? 'border-gray-200   bg-white     text-gray-900 focus:border-violet-400' : ''}
          `}
        />
        <Button
          onClick={handleSubmit}
          disabled={state.phase !== 'playing' || inputVal.trim() === ''}
          className={`h-14 px-6 bg-gradient-to-r ${cfg.gradient} border-0 shadow-md`}
        >
          OK
        </Button>
      </div>

      {/* Combo popup */}
      <AnimatePresence>
        {showCombo && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              bg-gradient-to-r from-amber-400 to-orange-500 text-white
              px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl shadow-amber-300 pointer-events-none"
          >
            🔥 COMBO ×{state.streak}!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
