import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import vuptCocky from '../assets/mascots/vupt-cocky.webp';
import vuptPeekVillain from '../assets/mascots/vupt-peek-villain.webp';
import vuptThumbsup from '../assets/mascots/vupt-thumbsup.webp';
import tucaIdle from '../assets/mascots/tuca-idle.webp';
import tucaGlasses from '../assets/mascots/tuca-glasses.webp';
import tucaReading from '../assets/mascots/tuca-reading.webp';

// Tuca (tartaruga sábia) acompanha Zen/Revisão — treino sem pressão.
// Vupt (lebre apressada) acompanha o Rush — te desafia a ser rápido.
// v5.0 (planejamento): a Vupt correndo saiu de circulação — Rush só usa as
// poses específicas por humor agora. Sem pose pra um humor = não aparece
// nada (fica quieto), em vez de cair num "genérico".
// Balão de fala e voz por enquanto DESLIGADOS (áudio de verdade + frases
// finais vêm depois — ver DECISIONS/sessão).
const CHARACTER_BY_MODE = {
  rush: {
    default: null,
    byMood: {
      slow: { img: vuptCocky, alt: 'Vupt, a lebre, batendo o pé impaciente' },
      insane: { img: vuptPeekVillain, alt: 'Vupt, a lebre, provocando com cara de má' },
      correct: { img: vuptThumbsup, alt: 'Joinha de aprovação' },
    },
  },
  zen: {
    default: { img: tucaIdle, alt: 'Tuca, a tartaruga' },
    byMood: {
      slow: { img: tucaGlasses, alt: 'Tuca ajustando os óculos, pensativo' },
      correct: { img: tucaReading, alt: 'Tuca lendo, satisfeito' },
    },
  },
  review: {
    default: { img: tucaIdle, alt: 'Tuca, a tartaruga' },
    byMood: {
      slow: { img: tucaGlasses, alt: 'Tuca ajustando os óculos, pensativo' },
      correct: { img: tucaReading, alt: 'Tuca lendo, satisfeito' },
    },
  },
};

export default function Mascot({ mode, mood = 'idle' }) {
  const modeConfig = CHARACTER_BY_MODE[mode];
  const character = modeConfig && (modeConfig.byMood[mood] || modeConfig.default);

  if (!character) return null;

  const fromSide = mode === 'rush' ? 140 : -140;

  // v5.0: grande, grudado na borda direita da tela (fixed — escapa do
  // container centralizado do app), vertical mais ou menos na altura do
  // card. "Vaza" pra fora em telas estreitas de propósito, igual à
  // referência que o Davi mandou.
  return createPortal(
    <div className="pointer-events-none fixed right-0 top-1/2 -translate-y-1/2 z-40">
      <AnimatePresence>
        {mood !== 'idle' && (
          <motion.img
            key={mode + mood}
            src={character.img}
            alt={character.alt}
            initial={{ x: fromSide, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: fromSide, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-56 h-56 object-contain object-right select-none"
            draggable={false}
          />
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
