import { motion } from 'framer-motion';
import {
  ArrowLeft, Zap, Heart, Timer, Star, Leaf, BookOpen, Lock,
  Repeat, Flame, Trophy, Layers, Plus,
} from 'lucide-react';
import { MODE_LIST, TRAINING_MODE_LIST, MODES } from '../constants';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getCurrentWeekKey, computeCertificates } from '../utils';
import { pageVariants, pageTransition } from '../components/ui';

// Ícones para cada modo (id → componente)
const modeIcons = {
  rush: Zap,
  survival: Heart,
  speed: Timer,
  daily: Star,
  zen: Leaf,
  review: BookOpen,
  flashcard: Repeat,
  inverse: Layers, // ícone neutro de "camadas/fatores" para o modo Inverso
  combined: Plus,
  hard: Flame,
  personal: Trophy,
};

// Dificuldade textual por modo
const MODE_DIFFICULTY = {
  rush: 'Fácil → Médio',
  survival: 'Médio → Difícil',
  speed: 'Médio',
  daily: 'Fácil → Médio',
  zen: 'Sem pressão',
  review: 'Adaptativo',
  flashcard: 'Memorização',
  inverse: 'Difícil',
  hard: 'Muito difícil',
  personal: 'Personalizado',
  combined: 'Cálculo mental',
  weekly: 'Competitivo',
};

// Modos avançados — agora todos reais (definidos em MODES). Hard requer Nível 8+.
// Combined requer N certificados de domínio (cf. minCertificates).
function getAdvancedModes(levelIdx, certsUnlocked) {
  return [
    {
      ...MODES.hard,
      locked: levelIdx + 1 < (MODES.hard.minLevel || 0),
      unlockText: `Nível ${MODES.hard.minLevel}`,
    },
    { ...MODES.personal, locked: false },
    { ...MODES.weekly, locked: false },
    {
      ...MODES.combined,
      locked: certsUnlocked < (MODES.combined.minCertificates || 0),
      unlockText: `${MODES.combined.minCertificates} certificados`,
    },
  ];
}

function ModeCard({ mode, locked, unlockText, dailyDoneToday, record, onStart, badge }) {
  const Icon = modeIcons[mode.id] || Star;
  const difficulty = MODE_DIFFICULTY[mode.id];

  return (
    <motion.button
      whileHover={locked ? {} : { scale: 1.02, y: -2 }}
      whileTap={locked ? {} : { scale: 0.97 }}
      onClick={locked ? undefined : () => onStart(mode.id)}
      disabled={locked}
      className={`relative overflow-hidden rounded-3xl p-5 text-left transition-all w-full
        bg-gradient-to-br ${mode.gradientLight} border
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
      {!locked && dailyDoneToday && (
        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2.5 py-1 text-[10px] font-black text-emerald-600">
          ✓ feito hoje
        </div>
      )}
      {!locked && badge && (
        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2.5 py-1 text-[10px] font-black text-violet-600">
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
          <span className="text-gray-700 font-black">🏆 {record} pts</span>
        )}
      </div>
    </motion.button>
  );
}

// Modos da Fase 2 desbloqueados (definidos em MODES, têm comportamento real).
// Flashcard é um "modo" especial — abre página própria, não passa pelo GamePage.
const PHASE_2_MODES = [
  {
    ...MODES.inverse,
    description: '"= 56" → diga os dois fatores',
  },
];

export default function ModesPage({ onStart, onBack, onNavigate }) {
  const { data } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyDone = data.currentDailyDate === todayStr;
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = levelIdx + 1;
  const currentWeek = getCurrentWeekKey(new Date());
  const weeklyDone = data.weeklyChallenge?.week === currentWeek;
  const certsUnlocked = computeCertificates(data.factStats || {}).filter((c) => c.unlocked).length;

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

      {/* Modos Principais */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
            Modos Principais
          </p>
          <span className="text-[10px] font-black text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
            Nível {level}
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {MODE_LIST.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={false}
              dailyDoneToday={mode.id === 'daily' && dailyDone}
              record={data.records?.[mode.id]}
              onStart={onStart}
              badge={mode.id === 'daily' ? '🌟 Hoje' : null}
            />
          ))}
        </div>
      </div>

      {/* Modos de Treino */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Modos de Treino
        </p>
        <p className="text-[11px] text-gray-400 font-semibold mb-3 px-1">
          Sem competição — feito para aprender no seu ritmo
        </p>
        <div className="flex flex-col gap-3">
          {TRAINING_MODE_LIST.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={false}
              record={data.records?.[mode.id]}
              onStart={onStart}
              badge={mode.id === 'zen' ? 'Sem XP' : null}
            />
          ))}
        </div>
      </div>

      {/* ── Modo Inverso (Fase 2) ────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Recuperação Reversa · Fase 2
        </p>
        <div className="flex flex-col gap-3">
          {PHASE_2_MODES.map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={false}
              record={data.records?.[mode.id]}
              onStart={onStart}
              badge="NOVO"
            />
          ))}
        </div>
      </div>

      {/* ── Modo Flashcard (SRS) ─────────────────────────────────────────── */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Memorização Real · Fase 2
        </p>
        <p className="text-[11px] text-gray-400 font-semibold mb-3 px-1">
          Repetição espaçada — o método científico de memorização
        </p>
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate?.('flashcard')}
          className="relative overflow-hidden rounded-3xl p-5 text-left w-full transition-all
            bg-gradient-to-br from-fuchsia-50 to-pink-50 border border-fuchsia-200 shadow-fuchsia-200 hover:shadow-lg"
        >
          <div className="absolute top-3 right-3 bg-fuchsia-500 text-white rounded-full px-2.5 py-1 text-[10px] font-black">
            NOVO
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-fuchsia-500 to-pink-600 shadow-sm shrink-0">
              <Repeat size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-base text-fuchsia-600 leading-tight">Flashcard</p>
              <p className="text-gray-500 text-xs font-semibold mt-0.5">
                Avalie cada fato como Fácil/Difícil/Errei — sistema lembra na hora certa
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-[11px] font-bold">
            <span className="px-2 py-1 rounded-full bg-white/70 text-gray-600">
              Memorização
            </span>
            <span className="text-fuchsia-600 font-black">SRS · SM-2</span>
          </div>
        </motion.button>
      </div>

      {/* Modos Avançados — agora todos reais (Fase 4) */}
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
          Modos Avançados · Fase 4
        </p>
        <p className="text-[11px] text-gray-400 font-semibold mb-3 px-1">
          Mais desafiadores — pensados para domínio real
        </p>
        <div className="flex flex-col gap-3">
          {getAdvancedModes(levelIdx, certsUnlocked).map((mode) => (
            <ModeCard
              key={mode.id}
              mode={mode}
              locked={mode.locked}
              unlockText={mode.unlockText}
              record={data.records?.[mode.id]}
              onStart={onStart}
              badge={
                mode.id === 'weekly' && weeklyDone
                  ? `✓ ${data.weeklyChallenge?.score || 0} pts`
                  : mode.id === 'weekly'
                  ? 'NOVO 🏆'
                  : null
              }
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
