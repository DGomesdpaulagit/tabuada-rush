import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home } from 'lucide-react';
import { MODES } from '../constants';
import { SHOP_ITEM_MAP } from '../constants/shop';
import { getDiffLevel, calcPoints, formatTime, generateQuestion, getTierRange } from '../utils';
import { Button, Progress } from '../components/ui';
import { audio } from '../lib/audioManager';
import { useApp } from '../contexts/AppContext';
import Mascot, { TUCA_POSES, VUPT_POSES, MASCOTS } from '../components/Mascot';
import GameIcon from '../components/GameIcon';

// ── REDUCER ────────────────────────────────────────────────────────────────

// [v4.0 · Fase 5] Modos elegíveis pro viés de fatos fracos (Rush/Zen — Revisão
// fica de fora porque já tem seu próprio mecanismo de priorização, ver
// getRevisionQuestions).
const ADAPTIVE_BIAS_MODES = ['rush', 'zen'];

function init(args) {
  const { mode, customQuestions } = args;
  const cfg = MODES[mode];
  const tableStats = args.tableStats || {};
  const adaptiveDifficulty = args.adaptiveDifficulty !== false;
  // [v6.0 · Bloco 3] Faixa de tabuada atual do jogador — o fator `a` das
  // perguntas geradas (Rush/Zen) sai daqui, não mais de um pool fixo 2-10/12.
  const tierRange = args.tierRange || [2, 10];
  const genOpts = {
    includeExtra: args.includeExtraTables,
    weakBias: adaptiveDifficulty && ADAPTIVE_BIAS_MODES.includes(mode),
    tableStats,
    tierRange,
  };
  // Revisão usa customQuestions (getRevisionQuestions, focado nos fatos mais
  // errados). Rush e Zen geram perguntas sob demanda (sem lista fixa).
  const qs = customQuestions || null;
  return {
    phase: 'playing',
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    lives: cfg.lives ?? null,
    time: cfg.timer ?? 0,
    question: qs ? qs[0] : generateQuestion('mult', 1, genOpts),
    mode,
    includeExtraTables: !!args.includeExtraTables,
    adaptiveDifficulty,
    tableStats,
    tierRange,
    dailyQs: qs,
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
      // Modo Recorde Pessoal: só pontua de verdade se BATEU o próprio tempo.
      // Acertou mas devagar → +1 ponto simbólico (registrou que acertou).
      const basePts = calcPoints(getDiffLevel(state.answered), streak, action.scoreScale || 1);
      const pts = action.isPersonal && !action.beatPersonal ? 1 : basePts;
      const addTime = action.modeId === 'rush' ? MODES.rush.bonusTime : 0;
      return {
        ...state,
        phase: 'feedback',
        score: state.score + pts,
        correct: state.correct + 1,
        beats: (state.beats || 0) + (action.beatPersonal ? 1 : 0),
        streak,
        bestStreak: Math.max(state.bestStreak, streak),
        answered: state.answered + 1,
        lastCorrect: true,
        lastPts: pts,
        lastBeatPersonal: !!action.beatPersonal,
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
    // Power-up Escudo: mesma penalidade de WRONG, mas a vida não é descontada.
    case 'WRONG_SHIELDED': {
      return {
        ...state,
        phase: 'feedback',
        wrong: state.wrong + 1,
        streak: 0,
        answered: state.answered + 1,
        lastCorrect: false,
        shielded: true,
      };
    }
    case 'NEXT': {
      const nextDailyIdx = state.dailyIdx + 1;
      const isDailyDone = state.dailyQs && nextDailyIdx >= state.dailyQs.length;
      if (isDailyDone) return { ...state, phase: 'ended' };
      const nextQ = state.dailyQs
        ? state.dailyQs[nextDailyIdx]
        : generateQuestion('mult', getDiffLevel(state.answered), {
            includeExtra: state.includeExtraTables,
            weakBias: state.adaptiveDifficulty && ADAPTIVE_BIAS_MODES.includes(state.mode),
            tableStats: state.tableStats,
            tierRange: state.tierRange,
          });
      return {
        ...state,
        phase: 'playing',
        question: nextQ,
        dailyIdx: state.dailyQs ? nextDailyIdx : state.dailyIdx,
        lastCorrect: null,
      };
    }
    case 'ADD_TIME':
      return { ...state, time: state.time + (action.amount ?? 60) };
    case 'CONTINUE':
      // Retoma a partida (modo com vidas) com 1 vida restaurada
      return { ...state, phase: 'playing', lives: 1 };
    case 'END':
      return { ...state, phase: 'ended' };
    default:
      return state;
  }
}

// ── COMPONENT ──────────────────────────────────────────────────────────────

export default function GamePage({ mode, adaptiveDifficulty = true, onEnd, onBack, customQuestions, powerups = {}, onUsePowerup, onWrongAnswer }) {
  const cfg = MODES[mode];
  const { data, update } = useApp();

  // Tema de GamePage equipado (sobrescreve o gradiente padrão do modo)
  const equippedGameTheme = data.equippedItems?.gameTheme
    ? SHOP_ITEM_MAP[data.equippedItems.gameTheme]
    : null;
  const questionGradient = equippedGameTheme?.questionGradient || cfg.gradientLight;
  const questionBorder   = equippedGameTheme?.questionBorder   || cfg.border;

  // customQuestions precisa ser passado para init — usamos ref para evitar stale closure
  const initArgRef = useRef({
    mode,
    adaptiveDifficulty,
    customQuestions,
    includeExtraTables: !!data.includeExtraTables,
    tableStats: data.tableStats?.mult || {},
    tierRange: getTierRange(data), // [v6.0 · Bloco 3]
  });
  const [state, dispatch] = useReducer(reducer, initArgRef.current, init);

  const [inputVal, setInputVal] = useState('');
  // Modo Inverso: dois inputs (fatores a e b). inputVal segue como "a" para reaproveitar lógica.
  const [inputValB, setInputValB] = useState('');
  const [inputState, setInputState] = useState('idle');
  const [showCombo, setShowCombo] = useState(false);
  const [isInsane, setIsInsane] = useState(false);
  const [shake, setShake] = useState(false);
  // { character: 'tuca'|'vupt', pose } | null — null = nenhum mascote na tela.
  const [mascotShow, setMascotShow] = useState(null);
  // Power-up: vida extra no Survival
  const [showLifePrompt, setShowLifePrompt] = useState(false);
  const pendingEndRef = useRef(null); // callback de onEnd adiado

  // Frequência do mascote: em modos com tempo (Rush) no máximo 2 aparições
  // por partida NO TOTAL (some qual mascote for) — pouco tempo pra
  // distrair. Em Zen/Revisão não tem teto, pode aparecer o quanto o treino
  // durar. Tuca e Vupt convivem no mesmo pote — não é mais travado por
  // modo (ver Mascot.jsx) — quem aparece depende do EVENTO: acerto/combo
  // puxa a Tuca, erro/sequência de erros puxa a Vupt, e "demorou pra
  // responder" sorteia entre os dois. Em eventos de destaque (combo,
  // sequência de erros) a chance é quase certeza (0.95) — nos demais,
  // sorteio normal, pra não ficar repetitivo nem sempre nas primeiras
  // oportunidades.
  const mascotShowCountRef = useRef(0);
  const mascotCap = cfg.timer !== null ? 2 : Infinity;
  // Sequência de erros seguidos (não entra no reducer — só serve pro
  // gatilho do mascote, reseta a cada acerto).
  const wrongStreakRef = useRef(0);

  const randomPose = (poses) => poses[Math.floor(Math.random() * poses.length)].id;

  const maybeMascot = useCallback((character, pose, chance = 0.35) => {
    if (mascotShowCountRef.current >= mascotCap) return false;
    if (Math.random() > chance) return false;
    mascotShowCountRef.current += 1;
    setMascotShow({ character, pose });
    return true;
  }, [mascotCap]);

  const inputRef = useRef(null);
  const inputRefB = useRef(null);
  const timerRef = useRef(null);
  const phaseRef = useRef(state.phase);
  phaseRef.current = state.phase;

  // Medição de tempo de resposta por questão
  const questionShownAt = useRef(0);
  const responseTimes = useRef([]);
  // Registro por questão (Catálogo de Precisão)
  const questionLog = useRef([]);

  // Resume audio context on first interaction
  useEffect(() => { audio.resume(); }, []);

  // Power-up Largada Turbo: consome 1 unidade e soma +10s já no início do Rush.
  useEffect(() => {
    if (mode === 'rush' && (data.powerups?.headstart || 0) > 0) {
      onUsePowerup?.('headstart');
      dispatch({ type: 'ADD_TIME', amount: 10 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer
  useEffect(() => {
    if (cfg.timer === null) {
      timerRef.current = setInterval(() => {
        if (phaseRef.current === 'playing' || phaseRef.current === 'feedback') {
          dispatch({ type: 'TICK_UP' });
        }
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (phaseRef.current === 'playing' || phaseRef.current === 'feedback') {
        dispatch({ type: 'TICK' });
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cfg.timer, cfg.lives]);

  // Timer warning sound (últimos 5s)
  useEffect(() => {
    if (cfg.timer && state.time > 0 && state.time <= 5 && state.phase === 'playing') {
      audio.timerWarning();
    }
  }, [state.time, cfg.timer, state.phase]);

  // Cutuca do mascote: se demorar mais de 3s na mesma pergunta, dá um
  // empurrão. Evento neutro — sorteia entre Tuca e Vupt (50/50). Some
  // sozinho assim que a próxima pergunta aparece.
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const t = setTimeout(() => {
      if (phaseRef.current === 'playing') {
        const character = Math.random() < 0.5 ? 'tuca' : 'vupt';
        maybeMascot(character, randomPose(MASCOTS[character]), 0.4);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [state.question, state.phase, maybeMascot]);

  // Handle game end
  useEffect(() => {
    if (state.phase === 'ended') {
      clearInterval(timerRef.current);

      const timePlayed = cfg.timer ? cfg.timer - state.time : state.time;
      const times = responseTimes.current;
      const avgMs = times.length
        ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
        : 0;

      const callEnd = () => onEnd({
        mode,
        score: state.score,
        correct: state.correct,
        wrong: state.wrong,
        bestStreak: state.bestStreak,
        timePlayed,
        avgMs,
        totalQuestions: cfg.questions || state.answered,
        questions: questionLog.current,
      });

      // Verifica se pode usar Vida Extra (perdeu todas as vidas num modo com
      // vidas — hoje só o Rush) ou comprar uma agora (Power-up Spot).
      const diedFromLives = cfg.lives !== null && state.lives !== null && state.lives <= 0;
      const canBuyLifeSpot = (data.coins || 0) >= 80;
      if (diedFromLives && ((powerups.life || 0) > 0 || canBuyLifeSpot)) {
        audio.gameOver();
        pendingEndRef.current = callEnd;
        setShowLifePrompt(true);
        return;
      }

      if (state.correct > 0) audio.victory();
      else audio.gameOver();
      setTimeout(callEnd, 300);
    }
  }, [state.phase]);

  // Focus input + marca quando a questão foi exibida
  useEffect(() => {
    if (state.phase === 'playing') {
      setInputVal('');
      setInputValB('');
      setInputState('idle');
      questionShownAt.current = Date.now();
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [state.question, state.phase]);

  const handleSubmit = useCallback(() => {
    if (state.phase !== 'playing') return;

    const isInverse = !!cfg.inverse;
    const valA = parseInt(inputVal, 10);
    const valB = isInverse ? parseInt(inputValB, 10) : null;
    if (isNaN(valA) || inputVal.trim() === '') return;
    if (isInverse && (isNaN(valB) || inputValB.trim() === '')) return;

    const dt = questionShownAt.current ? Date.now() - questionShownAt.current : 0;
    if (dt > 0 && dt < 60000) responseTimes.current.push(dt);

    // No modo inverso: aceita qualquer par cujo produto bata com a resposta.
    // Garante que os fatores estão no escopo válido (1..10).
    const isCorrect = isInverse
      ? valA >= 1 && valA <= 10 && valB >= 1 && valB <= 10 && valA * valB === state.question.ans
      : valA === state.question.ans;

    // Modo Recorde Pessoal: marca `beatPersonal` se acertou E foi mais rápido
    // que o tempo médio do jogador para aquele fato (benchmark anexado em init).
    const isPersonal = !!cfg.personal;
    const benchmark = state.question?.personalBenchmarkMs || 0;
    const beatPersonal = isPersonal && isCorrect && dt > 0 && benchmark > 0 && dt < benchmark;

    questionLog.current.push({
      a: state.question.a,
      b: state.question.b,
      correct: isCorrect,
      ms: dt > 0 && dt < 60000 ? dt : 0,
      ...(isPersonal ? { beatPersonal, benchmarkMs: benchmark } : {}),
    });

    if (isCorrect) {
      setInputState('correct');
      wrongStreakRef.current = 0;
      dispatch({
        type: 'CORRECT',
        modeId: mode,
        scoreScale: cfg.scoreScale || 1,
        isPersonal,
        beatPersonal,
      });

      const newStreak = state.streak + 1;
      let mascotFired = false;

      // ── INSANE COMBO (≥ 10) ou COMBO normal (múltiplo de 5) ──────────
      // Tuca comemora com o jogador — em combo é quase certeza (0.95) de
      // aparecer, sempre na pose de joia.
      if (newStreak >= 10 && newStreak % 5 === 0) {
        audio.combo();
        setIsInsane(true);
        setShowCombo(true);
        mascotFired = maybeMascot('tuca', 'cheer', 0.95);
        // Screen shake
        setShake(true);
        setTimeout(() => setShake(false), 500);
        setTimeout(() => { setShowCombo(false); setIsInsane(false); }, 1200);
      } else if (newStreak % 5 === 0 && newStreak >= 5) {
        audio.combo();
        setIsInsane(false);
        setShowCombo(true);
        mascotFired = maybeMascot('tuca', 'cheer', 0.95);
        setTimeout(() => setShowCombo(false), 900);
      } else {
        audio.correct();
        mascotFired = maybeMascot('tuca', randomPose(TUCA_POSES), 0.35);
      }
      setTimeout(() => {
        dispatch({ type: 'NEXT' });
        if (mascotFired) setMascotShow(null);
      }, 420);
    } else {
      setInputState('wrong');
      wrongStreakRef.current += 1;
      let mascotFired = false;
      // Power-up Escudo: se tiver em estoque, se ativa sozinho e protege a
      // vida dessa vez (só funciona em modos com vidas, ex. Rush).
      const hasShield = cfg.lives !== null && (data.powerups?.shield || 0) > 0;
      if (hasShield) {
        audio.wrong();
        onUsePowerup?.('shield');
        dispatch({ type: 'WRONG_SHIELDED' });
        mascotFired = maybeMascot('tuca', randomPose(TUCA_POSES), 0.5);
      } else {
        audio.wrong();
        dispatch({ type: 'WRONG' });
        // [v6.0 · Bloco 2] Todo erro (em qualquer modo) desconta 1 vida do
        // pote diário global — independente do sistema de vidas por
        // partida (cfg.lives) que já existia. Escudo protege dos dois.
        onWrongAnswer?.();
        // Sequência de erros: Vupt torce contra — a cada 3 erros seguidos
        // (espelha o combo de acerto, que refaz a cada 5) é quase certeza
        // (0.95) de aparecer; erro avulso é sorteio normal.
        const isErrorStreak = wrongStreakRef.current >= 3 && wrongStreakRef.current % 3 === 0;
        mascotFired = maybeMascot('vupt', randomPose(VUPT_POSES), isErrorStreak ? 0.95 : 0.35);
      }
      setTimeout(() => {
        dispatch({ type: 'NEXT' });
        if (mascotFired) setMascotShow(null);
      }, 950);
    }
  }, [state.phase, state.question, state.streak, inputVal, inputValB, mode, cfg.inverse, cfg.lives, data.powerups, onUsePowerup, onWrongAnswer, maybeMascot]);

  const handleKey = useCallback(
    (e) => { if (e.key === 'Enter') handleSubmit(); },
    [handleSubmit]
  );

  // ── Power-up handlers ──────────────────────────────────────────────────────
  const restartTimer = () => {
    timerRef.current = setInterval(() => {
      if (phaseRef.current === 'playing' || phaseRef.current === 'feedback') {
        dispatch({ type: cfg.timer === null ? 'TICK_UP' : 'TICK' });
      }
    }, 1000);
  };

  const handleUseLive = () => {
    onUsePowerup?.('life');
    dispatch({ type: 'CONTINUE' });
    setShowLifePrompt(false);
    restartTimer();
  };

  // SPOT-BUY: compra 1 vida por 80 moedas e usa na hora
  const handleBuyLifeSpot = () => {
    if ((data.coins || 0) < 80) return;
    update((prev) => ({ ...prev, coins: (prev.coins || 0) - 80 }));
    dispatch({ type: 'CONTINUE' });
    setShowLifePrompt(false);
    restartTimer();
  };

  const handleDeclineLive = () => {
    setShowLifePrompt(false);
    pendingEndRef.current?.();
    pendingEndRef.current = null;
  };

  const handleAddTime = () => {
    onUsePowerup?.('time');
    dispatch({ type: 'ADD_TIME' });
  };

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

  const isZen = mode === 'zen';
  const isReview = mode === 'review';
  const isInverse = !!cfg.inverse;
  const isPersonalMode = !!cfg.personal;
  const isCombined = !!cfg.combined;

  return (
    <motion.div
      animate={shake ? { x: [0, -10, 10, -8, 8, -5, 5, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-4"
    >
      {/* ── Vida Extra: prompt ao perder última vida no Survival ─────────── */}
      <AnimatePresence>
        {showLifePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <p className="text-5xl mb-3">❤️‍🔥</p>
              <p className="text-xl font-black text-gray-900 mb-1">Perdeu a última vida!</p>
              <p className="text-sm text-gray-500 font-semibold mb-4">
                Estoque: <span className="font-black text-violet-600">{powerups.life || 0} Vida{(powerups.life || 0) !== 1 ? 's' : ''} Extra</span>
                {' · '}
                Moedas: <span className="font-black text-amber-600"><GameIcon name="moedas" size={14} className="inline-block align-text-bottom" /> {data.coins || 0}</span>
              </p>
              <div className="flex flex-col gap-2">
                {(powerups.life || 0) > 0 && (
                  <button
                    onClick={handleUseLive}
                    className="w-full py-3 rounded-2xl bg-violet-600 text-white font-black text-sm hover:bg-violet-700 active:scale-[0.98] transition-all"
                  >
                    ❤️ Usar Vida do Estoque
                  </button>
                )}
                {(data.coins || 0) >= 80 && (
                  <button
                    onClick={handleBuyLifeSpot}
                    className="w-full py-3 rounded-2xl bg-amber-500 text-white font-black text-sm hover:bg-amber-600 active:scale-[0.98] transition-all"
                  >
                    <GameIcon name="moedas" size={15} className="inline-block align-text-bottom" /> Comprar Vida Agora (80)
                  </button>
                )}
                <button
                  onClick={handleDeclineLive}
                  className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                  Encerrar partida
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Initial entrance */}
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

          <div className={`text-center transition-colors ${urgent ? 'text-rose-500' : cfg.text}`}>
            {isZen ? (
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-wide opacity-60 text-teal-500">Modo Zen</p>
                <p className="text-2xl font-black text-teal-600">🧘 {formatTime(state.time)}</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-wide opacity-60">
                  {cfg.timer ? 'Tempo' : cfg.questions ? 'Questão' : 'Tempo'}
                </p>
                <p className={`text-3xl font-black tabular-nums ${urgent ? 'animate-pulse' : ''}`}>
                  {cfg.questions
                    ? `${state.dailyIdx + 1}/${cfg.questions}`
                    : formatTime(state.time)}
                </p>
              </>
            )}
          </div>

          <div className="text-right">
            {isZen ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Acertos</p>
                <p className="text-3xl font-black tabular-nums text-teal-600">{state.correct}</p>
              </div>
            ) : (
              <div>
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
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isZen && (
          <Progress
            value={cfg.timer ? progress : (cfg.questions ? progress : 0)}
            colorClass={urgent ? 'bg-rose-500' : `bg-gradient-to-r ${cfg.gradient}`}
            className="h-1.5"
          />
        )}

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
            {/* Badge XP Dobrado ativo */}
            <AnimatePresence>
              {(powerups.xp2 || 0) > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-1 bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full text-xs font-black"
                >
                  ⚡ XP ×2
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <span className={`text-xs font-bold ${isZen ? 'text-teal-500' : diffColors[diffLevel]}`}>
            {isZen ? 'Sem pressão 🌿' : isReview ? '📚 Revisão' : diffLabels[diffLevel]}
          </span>
        </div>

        {/* Question card — usa tema equipado se houver. relative pro mascote
            aparecer ancorado no canto, interagindo com o card. */}
        <div className={`relative bg-gradient-to-br ${questionGradient} rounded-3xl p-8 border ${questionBorder}`}>
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
              {isInverse ? (
                <>
                  <p className="text-7xl font-black text-gray-900 tracking-tight">
                    = {state.question?.ans}
                  </p>
                  <p className={`text-sm font-bold mt-2 ${cfg.text} opacity-70`}>
                    Quais os dois fatores?
                  </p>
                </>
              ) : isCombined ? (
                <>
                  <p className="text-6xl font-black text-gray-900 tracking-tight">
                    {state.question?.a} × {state.question?.b} {state.question?.op} {state.question?.c}
                  </p>
                  <p className={`text-sm font-bold mt-2 ${cfg.text} opacity-70`}>
                    Qual o resultado? (multiplicação primeiro)
                  </p>
                </>
              ) : (
                <>
                  <p className="text-7xl font-black text-gray-900 tracking-tight">
                    {state.question?.a} × {state.question?.b}
                  </p>
                  <p className={`text-sm font-bold mt-2 ${cfg.text} opacity-70`}>Qual o resultado?</p>
                  {isPersonalMode && state.question?.personalBenchmarkMs > 0 && (
                    <p className="text-xs font-bold mt-2 text-yellow-600 bg-yellow-100 inline-block px-2.5 py-1 rounded-full">
                      🎯 Seu tempo: {(state.question.personalBenchmarkMs / 1000).toFixed(1)}s
                    </p>
                  )}
                </>
              )}
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
                  <div className={`inline-flex items-center gap-2 text-white px-4 py-2 rounded-2xl font-bold shadow-lg
                    ${isPersonalMode && state.lastBeatPersonal
                      ? 'bg-yellow-500 shadow-yellow-200'
                      : 'bg-emerald-500 shadow-emerald-200'}`}>
                    <span>{isPersonalMode && state.lastBeatPersonal ? '⚡' : '✓'}</span>
                    <span>
                      {isZen
                        ? 'Correto!'
                        : isPersonalMode
                        ? state.lastBeatPersonal
                          ? `Bateu seu tempo! +${state.lastPts}`
                          : 'Correto, mas devagar...'
                        : `Correto! +${calcPoints(diffLevel, state.streak)}`}
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-2 rounded-2xl font-bold shadow-lg shadow-rose-200">
                    <X size={16} />
                    <span>
                      Errou!{' '}
                      {isInverse
                        ? `Era ${state.question?.a} × ${state.question?.b}`
                        : `Resp: ${state.question?.ans}`}
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mascote — Tuca (tartaruga) torce a favor, Vupt (lebre) torce
              contra; quem aparece depende do evento (acerto/erro/combo/
              demora), não mais do modo. Ancorado no canto do card, brota
              da lateral quando tem algo a dizer. */}
          <Mascot character={mascotShow?.character} pose={mascotShow?.pose} />
        </div>

        {/* Answer input(s) */}
        {isInverse ? (
          <div className="flex gap-2 items-center">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (inputVal.trim() && !inputValB.trim()) inputRefB.current?.focus();
                  else handleSubmit();
                }
              }}
              placeholder="a"
              disabled={state.phase !== 'playing'}
              className={`w-20 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all
                ${inputState === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : ''}
                ${inputState === 'wrong'   ? 'border-rose-400   bg-rose-50   text-rose-700'    : ''}
                ${inputState === 'idle'    ? 'border-gray-200   bg-white     text-gray-900 focus:border-indigo-400' : ''}
              `}
            />
            <span className="text-2xl font-black text-gray-400">×</span>
            <input
              ref={inputRefB}
              type="number"
              inputMode="numeric"
              value={inputValB}
              onChange={(e) => setInputValB(e.target.value)}
              onKeyDown={handleKey}
              placeholder="b"
              disabled={state.phase !== 'playing'}
              className={`w-20 h-14 text-center text-2xl font-black rounded-2xl border-2 outline-none transition-all
                ${inputState === 'correct' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : ''}
                ${inputState === 'wrong'   ? 'border-rose-400   bg-rose-50   text-rose-700'    : ''}
                ${inputState === 'idle'    ? 'border-gray-200   bg-white     text-gray-900 focus:border-indigo-400' : ''}
              `}
            />
            <Button
              onClick={handleSubmit}
              disabled={state.phase !== 'playing' || inputVal.trim() === '' || inputValB.trim() === ''}
              className={`h-14 px-6 ml-auto bg-gradient-to-r ${cfg.gradient} border-0 shadow-md`}
            >
              OK
            </Button>
          </div>
        ) : (
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
        )}

        {/* Botão Encerrar — apenas no modo Zen (sem fim natural) */}
        {isZen && (
          <button
            onClick={() => dispatch({ type: 'END' })}
            className="w-full py-3 rounded-2xl border border-teal-200 text-teal-600 text-sm font-black hover:bg-teal-50 active:scale-[0.98] transition-all"
          >
            🧘 Encerrar Treino
          </button>
        )}

        {/* Botão +60s — Rush, quando há estoque OU pode comprar agora */}
        <AnimatePresence>
          {mode === 'rush' && (powerups.time || 0) > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleAddTime}
              className="w-full py-2.5 rounded-2xl border border-violet-200 bg-violet-50 text-violet-700 text-sm font-black hover:bg-violet-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              ⏱️ Usar +60s Rush
              <span className="bg-violet-200 text-violet-800 text-xs font-black px-2 py-0.5 rounded-full">
                ×{powerups.time}
              </span>
            </motion.button>
          )}
          {/* SPOT-BUY: comprar +30s agora por 30 moedas (Rush em tempo crítico ≤ 20s) */}
          {mode === 'rush' && (powerups.time || 0) === 0 && state.time > 0 && state.time <= 20 && (data.coins || 0) >= 30 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => {
                update((prev) => ({ ...prev, coins: (prev.coins || 0) - 30 }));
                dispatch({ type: 'ADD_TIME' });
              }}
              className="w-full py-2.5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 text-sm font-black hover:bg-amber-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <GameIcon name="moedas" size={15} className="inline-block align-text-bottom" /> Comprar +60s Agora (30)
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* COMBO popup */}
      <AnimatePresence>
        {showCombo && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
              pointer-events-none px-8 py-4 rounded-3xl font-black shadow-2xl
              ${isInsane
                ? 'bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white text-3xl shadow-purple-400'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white text-2xl shadow-amber-300'
              }`}
          >
            {isInsane ? `🤯 INSANE COMBO! ×${state.streak}` : `🔥 COMBO ×${state.streak}!`}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
