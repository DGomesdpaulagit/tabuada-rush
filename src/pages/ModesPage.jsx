import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Leaf, BookOpen, Lock, Repeat } from 'lucide-react';
import { MODE_LIST, TRAINING_MODE_LIST } from '../constants';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getModeUnlock } from '../utils';
import { pageVariants, pageTransition } from '../components/ui';

// Ícones para cada modo (id → componente) — v5.0: só 3 modos existem
const modeIcons = {
  rush: Zap,
  zen: Leaf,
  review: BookOpen,
};

// Dificuldade textual por modo
const MODE_DIFFICULTY = {
  rush: 'Cresce com você',
  zen: 'Sem pressão',
  review: 'Adaptativo',
};

// Helpers de desbloqueio aplicados a todos os modos via UNLOCK_RULES.
function applyUnlock(mode, data) {
  const unlock = getModeUnlock(mode.id, data);
  return {
    ...mode,
    locked: !unlock.unlocked,
    unlockText: unlock.reason,
    unlockProgress: unlock.target ? { current: unlock.current, target: unlock.target } : null,
  };
}

function ModeCard({ mode, locked, unlockText, record, onStart, badge }) {
  const Icon = modeIcons[mode.id] || Zap;
  const difficulty = MODE_DIFFICULTY[mode.id];

  return (
    <motion.button
      whileHover={locked ? {} : { scale: 1.02, y: -2 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      onClick={locked ? undefined : () => onStart(mode.id)}
      disabled={locked}
      className={`relative overflow-hidden rounded-3xl p-5 text-left transition-all w-full
        bg-gradient-to-br ${mode.gradientLight} border-2
        ${mode.shadow} ${mode.border}
        ${locked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'}`}
    >
      {/* Badge superior direito */}
      {locked && (
        <div className="absolute top-3 right-3 bg-gray-100 rounded-full px-2.5 py-1 text-[10px] font-black text-gray-500 flex items-center gap-1">
          <Lock size={10} />
          {unlockText || 'Bloqueado'}
        </div>
      )}
      {!locked && badge && (
        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2.5 py-1 text-[10px] font-black text-wing">
          {badge}
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br ${mode.gradient} shadow-sm shrink-0`}
        >
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-black text-base ${mode.text} leading-tight`}>{mode.name}</p>
          <p className="text-gray-500 text-xs font-semibold mt-0.5">{mode.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
        {difficulty && (
          <span className="px-2 py-1 rounded-full bg-white/70 text-gray-600">
            {difficulty}
          </span>
        )}
        {record !== undefined && record !== null && (
          <span className="text-gray-700 font-black">{record} pts</span>
        )}
      </div>
    </motion.button>
  );
}

export default function ModesPage({ onStart, onBack, onNavigate }) {
  const { data } = useApp();
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = levelIdx + 1;

  // Aplica regras de desbloqueio nos 3 modos que existem
  const mainModes     = MODE_LIST.map((m) => applyUnlock(m, data));
  const trainingModes = TRAINING_MODE_LIST.map((m) => applyUnlock(m, data));
  const flashcardUnlock = getModeUnlock('flashcard', data);

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
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">Escolher Modo</h2>
          <p className="text-sm text-gray-400 font-semibold">
            Cada modo treina algo diferente — escolha sua jornada
          </p>
        </div>
      </div>

      {/* Rush */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Modo Principal
          </p>
          <span className="text-[10px] font-black text-wing bg-mask/15 px-2 py-0.5 rounded-full">
            Nível {level}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {mainModes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={mode.locked}
              unlockText={mode.unlockText}
              record={data.records?.[mode.id]}
              onStart={onStart}
            />
          ))}
        </div>
      </div>

      {/* Treino: Zen + Revisão */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Treino
        </p>
        <p className="text-[11px] text-gray-400 font-semibold mb-3 px-1">
          Sem competição — feito para aprender no seu ritmo
        </p>
        <div className="flex flex-col gap-3">
          {trainingModes.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={mode.locked}
              unlockText={mode.unlockText}
              record={data.records?.[mode.id]}
              onStart={onStart}
            />
          ))}

          {/* Flashcard (SRS) — fica fora da contagem dos 3 modos por ora;
              é uma ferramenta de memorização separada, não um "modo" de
              partida. Mantido acessível até decidirmos o que fazer com ele. */}
          <motion.button
            whileHover={flashcardUnlock.unlocked ? { scale: 1.02, y: -2 } : {}}
            whileTap={flashcardUnlock.unlocked ? { scale: 0.97 } : {}}
            onClick={flashcardUnlock.unlocked ? () => onNavigate?.('flashcard') : undefined}
            disabled={!flashcardUnlock.unlocked}
            className={`relative overflow-hidden rounded-3xl p-5 text-left w-full transition-all
              bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200
              ${flashcardUnlock.unlocked ? 'hover:shadow-lg' : 'opacity-60 cursor-not-allowed'}`}
          >
            {!flashcardUnlock.unlocked && (
              <div className="absolute top-3 right-3 bg-gray-100 rounded-full px-2.5 py-1 text-[10px] font-black text-gray-500 flex items-center gap-1">
                <Lock size={10} />
                {flashcardUnlock.reason}
              </div>
            )}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gray-500 shadow-sm shrink-0">
                <Repeat size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-base text-gray-700 leading-tight">Flashcard</p>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">
                  Avalie cada fato como Fácil/Difícil/Errei — sistema lembra na hora certa
                </p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
