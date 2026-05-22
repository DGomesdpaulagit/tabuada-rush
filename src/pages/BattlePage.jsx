import { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Swords } from 'lucide-react';
import { getRandomQuestion } from '../utils';
import { Button, pageVariants, pageTransition } from '../components/ui';

const TOTAL = 10;

function initPlayer(name, color) {
  return { name, color, score: 0, correct: 0, wrong: 0, question: getRandomQuestion(), done: false };
}

function makeState() {
  return {
    phase: 'waiting', // waiting | playing | ended
    p1: initPlayer('Jogador 1', 'violet'),
    p2: initPlayer('Jogador 2', 'rose'),
    time: 0,
    winner: null,
  };
}

function battleReducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...makeState(), phase: 'playing' };
    case 'TICK_UP':
      return { ...state, time: state.time + 1 };
    case 'ANSWER': {
      const pk = action.player; // 'p1' | 'p2'
      const player = state[pk];
      if (player.done) return state;

      const isCorrect = parseInt(action.value, 10) === player.question.ans;
      const newCorrect = isCorrect ? player.correct + 1 : player.correct;
      const newWrong = isCorrect ? player.wrong : player.wrong + 1;
      const newDone = newCorrect >= TOTAL;
      const newQuestion = getRandomQuestion();

      const updated = {
        ...state,
        [pk]: {
          ...player,
          score: player.score + (isCorrect ? 10 : 0),
          correct: newCorrect,
          wrong: newWrong,
          question: newQuestion,
          done: newDone,
          lastCorrect: isCorrect,
        },
      };

      // Check if game ended
      const bothDone = updated.p1.done || updated.p2.done;
      if (newDone || bothDone) {
        const p1Score = updated.p1.correct;
        const p2Score = updated.p2.correct;
        const winner =
          p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
        return { ...updated, phase: 'ended', winner };
      }

      return updated;
    }
    case 'TIMEOUT': {
      const p1Score = state.p1.correct;
      const p2Score = state.p2.correct;
      const winner = p1Score > p2Score ? 'p1' : p2Score > p1Score ? 'p2' : 'draw';
      return { ...state, phase: 'ended', winner };
    }
    default:
      return state;
  }
}

function PlayerPanel({ player, pk, onAnswer, disabled, colorGrad }) {
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState(null);
  const ref = useRef(null);

  const submit = useCallback(() => {
    if (disabled || input.trim() === '') return;
    const correct = parseInt(input, 10) === player.question.ans;
    setFlash(correct ? 'correct' : 'wrong');
    onAnswer(pk, input);
    setInput('');
    setTimeout(() => { setFlash(null); ref.current?.focus(); }, 400);
  }, [disabled, input, player.question.ans, onAnswer, pk]);

  const handleKey = (e) => { if (e.key === 'Enter') submit(); };

  return (
    <div className={`flex flex-col flex-1 rounded-3xl overflow-hidden border-2
      ${pk === 'p1' ? 'border-violet-200' : 'border-rose-200'}`}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${colorGrad} p-4 text-white text-center`}>
        <p className="text-xs font-bold uppercase tracking-wide opacity-80">{player.name}</p>
        <p className="text-3xl font-black">{player.correct}/{TOTAL}</p>
        <div className="flex justify-center gap-4 text-xs mt-1 opacity-80">
          <span>✓ {player.correct}</span>
          <span>✗ {player.wrong}</span>
        </div>
      </div>

      {/* Question */}
      <div className={`flex-1 flex flex-col items-center justify-center p-4 bg-gray-50 gap-3 ${player.done ? 'opacity-40' : ''}`}>
        {player.done ? (
          <div className="text-center">
            <div className="text-4xl mb-2">🎉</div>
            <p className="font-black text-gray-700">Completo!</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.p
                key={`${player.question.a}-${player.question.b}`}
                initial={{ opacity: 0, y: 8 }}
                animate={
                  flash === 'correct' ? { opacity: 1, scale: [1, 1.1, 1], y: 0 } :
                  flash === 'wrong'   ? { opacity: 1, x: [0, -6, 6, -4, 4, 0], y: 0 } :
                  { opacity: 1, y: 0 }
                }
                exit={{ opacity: 0, y: -8 }}
                className="text-4xl font-black text-gray-900"
              >
                {player.question.a} × {player.question.b}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence>
              {flash && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-xs font-black px-3 py-1 rounded-full ${flash === 'correct' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}
                >
                  {flash === 'correct' ? '✓ Certo!' : `✗ Resp: ${player.question.ans}`}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex gap-2 w-full">
              <input
                ref={ref}
                type="number"
                inputMode="numeric"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={disabled || player.done}
                placeholder="?"
                className="flex-1 h-11 text-center text-xl font-black rounded-xl border-2 border-gray-200 bg-white outline-none focus:border-violet-400 transition-colors"
              />
              <button
                onClick={submit}
                disabled={disabled || player.done || input.trim() === ''}
                className={`h-11 px-4 rounded-xl text-white font-black text-sm transition-all disabled:opacity-40
                  bg-gradient-to-r ${colorGrad} shadow-sm`}
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function BattlePage({ onBack }) {
  const [state, dispatch] = useReducer(battleReducer, null, makeState);
  const timerRef = useRef(null);

  useEffect(() => {
    if (state.phase === 'playing') {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_UP' });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    if (state.phase === 'ended') {
      clearInterval(timerRef.current);
    }
  }, [state.phase]);

  const handleAnswer = useCallback((player, value) => {
    dispatch({ type: 'ANSWER', player, value });
  }, []);

  const m = state.time;
  const timeStr = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-4 h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="text-center">
          <p className="font-black text-gray-800 flex items-center gap-2">
            <Swords size={16} className="text-violet-500" />
            Batalha Local
          </p>
          {state.phase === 'playing' && (
            <p className="text-xs text-gray-400 font-semibold">{timeStr}</p>
          )}
        </div>
        <div className="w-10" />
      </div>

      {state.phase === 'waiting' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6 py-8"
        >
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">⚔️</div>
            <h3 className="text-2xl font-black text-gray-900">2 Jogadores</h3>
            <p className="text-gray-400 text-sm font-semibold mt-2 max-w-xs text-center">
              Cada jogador responde no seu lado da tela. Quem acertar {TOTAL} primeiro vence!
            </p>
          </div>
          <Button
            onClick={() => dispatch({ type: 'START' })}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-lg shadow-violet-200"
            size="lg"
          >
            <Swords size={18} />
            Iniciar Batalha
          </Button>
        </motion.div>
      )}

      {state.phase === 'playing' && (
        <div className="flex gap-3 flex-1 min-h-0">
          <PlayerPanel
            player={state.p1}
            pk="p1"
            onAnswer={handleAnswer}
            disabled={state.phase !== 'playing'}
            colorGrad="from-violet-500 to-purple-600"
          />
          <div className="flex flex-col items-center justify-center">
            <div className="w-px bg-gray-200 flex-1" />
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center my-2">
              <span className="text-xs font-black text-gray-500">VS</span>
            </div>
            <div className="w-px bg-gray-200 flex-1" />
          </div>
          <PlayerPanel
            player={state.p2}
            pk="p2"
            onAnswer={handleAnswer}
            disabled={state.phase !== 'playing'}
            colorGrad="from-rose-500 to-pink-600"
          />
        </div>
      )}

      {state.phase === 'ended' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-6"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">
              {state.winner === 'draw' ? '🤝' : '🏆'}
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {state.winner === 'draw'
                ? 'Empate!'
                : `${state[state.winner].name} Venceu!`}
            </h3>
            <p className="text-gray-400 text-sm font-semibold mt-2">
              Jogador 1: {state.p1.correct} acertos · Jogador 2: {state.p2.correct} acertos
            </p>
          </div>
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft size={16} />
              Menu
            </Button>
            <Button
              onClick={() => dispatch({ type: 'START' })}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 border-0 shadow-lg shadow-violet-200"
            >
              Revanche!
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
