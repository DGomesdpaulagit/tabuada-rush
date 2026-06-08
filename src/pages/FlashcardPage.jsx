import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Repeat, ThumbsUp, ThumbsDown, X, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getReviewQueue, parseFactKey, updateSrsFact, countDueFlashcards } from '../utils';
import { Button, pageVariants, pageTransition } from '../components/ui';
import { audio } from '../lib/audioManager';

const QUALITIES = [
  { id: 'wrong', label: 'Errei',    color: 'rose',     icon: X,         desc: 'em ~10 min' },
  { id: 'hard',  label: 'Difícil',  color: 'amber',    icon: ThumbsDown, desc: 'em 1 dia' },
  { id: 'easy',  label: 'Fácil',    color: 'emerald',  icon: ThumbsUp,  desc: '+ tempo' },
];

const COLOR_CLASSES = {
  rose:    { bg: 'bg-rose-500',    light: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-200' },
  amber:   { bg: 'bg-amber-500',   light: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

export default function FlashcardPage({ onBack }) {
  const { data, update } = useApp();

  const [queue] = useState(() => getReviewQueue(data.srsData || {}, 20));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const [sessionStats, setSessionStats] = useState({ easy: 0, hard: 0, wrong: 0 });
  const inputRef = useRef(null);

  const currentFk = queue[idx];
  const fact = currentFk ? parseFactKey(currentFk) : null;
  const isDone = !fact;

  useEffect(() => { audio.resume(); }, []);

  useEffect(() => {
    if (fact && !revealed) {
      setInputVal('');
      setFeedback(null);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [fact, revealed]);

  const handleReveal = useCallback(() => {
    if (!fact) return;
    const val = parseInt(inputVal, 10);
    const correct = val === fact.ans;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) audio.correct();
    else audio.wrong();
    setRevealed(true);
  }, [fact, inputVal]);

  const handleQuality = useCallback(
    (qualityId) => {
      if (!fact) return;
      // Errar a digitação força quality = 'wrong' independente do clique
      const finalQuality = feedback === 'wrong' ? 'wrong' : qualityId;

      update((prev) => {
        const srs = { ...(prev.srsData || {}) };
        srs[currentFk] = updateSrsFact(srs[currentFk] || {}, finalQuality);
        return { ...prev, srsData: srs };
      });

      setSessionStats((s) => ({ ...s, [finalQuality]: s[finalQuality] + 1 }));
      setRevealed(false);
      setIdx((i) => i + 1);
    },
    [fact, currentFk, feedback, update]
  );

  // Tela final da sessão
  if (isDone) {
    const total = sessionStats.easy + sessionStats.hard + sessionStats.wrong;
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex flex-col gap-6"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-xl font-black text-gray-900">Sessão Concluída</h2>
            <p className="text-sm text-gray-400 font-semibold">Você revisou {total} fatos</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-fuchsia-500 to-pink-600 rounded-3xl p-6 text-white text-center shadow-lg shadow-fuchsia-200">
          <Sparkles size={32} className="mx-auto mb-2" />
          <p className="text-3xl font-black">Boa sessão!</p>
          <p className="text-fuchsia-100 text-sm font-bold mt-1">
            O sistema vai lembrar os fatos no momento certo
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
            <p className="text-3xl font-black text-emerald-600">{sessionStats.easy}</p>
            <p className="text-xs font-bold text-emerald-500 mt-1">Fáceis</p>
          </div>
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
            <p className="text-3xl font-black text-amber-600">{sessionStats.hard}</p>
            <p className="text-xs font-bold text-amber-500 mt-1">Difíceis</p>
          </div>
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-center">
            <p className="text-3xl font-black text-rose-600">{sessionStats.wrong}</p>
            <p className="text-xs font-bold text-rose-500 mt-1">Erros</p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 font-semibold">
          Próxima revisão pendente: {countDueFlashcards(data.srsData || {}) - total} fatos
        </p>

        <Button variant="primary" onClick={onBack} className="w-full">
          Voltar ao menu
        </Button>
      </motion.div>
    );
  }

  const due = countDueFlashcards(data.srsData || {});

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
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Repeat size={18} className="text-fuchsia-500" />
            Flashcards
          </h2>
          <p className="text-sm text-gray-400 font-semibold">
            {idx + 1}/{queue.length} · {due} pendentes hoje
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-600"
          initial={{ width: 0 }}
          animate={{ width: `${((idx) / queue.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Card de pergunta */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentFk}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-3xl p-8 border border-fuchsia-200 text-center"
        >
          <p className="text-xs font-black text-fuchsia-500 uppercase tracking-wider mb-3">
            Quanto é?
          </p>
          <p className="text-7xl font-black text-gray-900 tracking-tight">
            {fact.a} × {fact.b}
          </p>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-6"
              >
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Resposta
                </p>
                <p className={`text-5xl font-black ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {fact.ans}
                </p>
                {feedback === 'wrong' && (
                  <p className="text-sm font-bold text-rose-500 mt-2">
                    Você digitou: {inputVal || '—'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Input ou avaliação */}
      {!revealed ? (
        <>
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleReveal(); }}
              placeholder="Sua resposta..."
              className="flex-1 h-14 text-center text-2xl font-black rounded-2xl border-2 border-gray-200 bg-white text-gray-900 focus:border-fuchsia-400 outline-none transition-all"
            />
            <Button
              onClick={handleReveal}
              disabled={inputVal.trim() === ''}
              className="h-14 px-6 bg-gradient-to-r from-fuchsia-500 to-pink-600 border-0 shadow-md"
            >
              Revelar
            </Button>
          </div>
          <p className="text-xs text-center text-gray-400 font-semibold">
            Responda primeiro — depois avalie como foi
          </p>
        </>
      ) : (
        <>
          <p className="text-xs text-center font-bold text-gray-500 uppercase tracking-wide">
            Como foi para você?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUALITIES.map((q) => {
              const Icon = q.icon;
              const c = COLOR_CLASSES[q.color];
              // Se o usuário ERROU a digitação, só permite "Errei"
              const disabled = feedback === 'wrong' && q.id !== 'wrong';
              return (
                <motion.button
                  key={q.id}
                  whileTap={disabled ? {} : { scale: 0.95 }}
                  onClick={() => handleQuality(q.id)}
                  disabled={disabled}
                  className={`relative rounded-2xl p-4 border-2 transition-all flex flex-col items-center gap-1.5
                    ${disabled
                      ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                      : `${c.light} ${c.border} hover:shadow-md`}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.bg} text-white`}>
                    <Icon size={18} />
                  </div>
                  <p className={`text-sm font-black ${disabled ? 'text-gray-400' : c.text}`}>
                    {q.label}
                  </p>
                  <p className="text-[10px] font-bold text-gray-400">{q.desc}</p>
                </motion.button>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
