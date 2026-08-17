import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import vuptPeek from '../assets/mascots/vupt-peek.webp';
import vuptHide from '../assets/mascots/vupt-peek-villain.webp';
import vuptLean from '../assets/mascots/vupt-cocky.webp';
import tucaReading from '../assets/mascots/tuca-reading.webp';
import tucaGlasses from '../assets/mascots/tuca-glasses.webp';
import tucaCheer from '../assets/mascots/tuca-thumbsup.webp';

// Tuca (tartaruga) torce A FAVOR do jogador — puxada por eventos positivos
// (acerto, combo). Vupt (lebre) torce CONTRA — puxada por eventos negativos
// (erro, sequência de erros).
// v5.0.2: os 2 mascotes convivem em QUALQUER modo agora — antes Vupt só
// aparecia no Rush e Tuca só em Zen/Revisão (travado por `mode`). Quem
// aparece depende do EVENTO (ver `pickMascotFor`/`maybeMascot` em
// GamePage.jsx), o modo só controla a FREQUÊNCIA. Nunca aparecem os dois ao
// mesmo tempo — só existe este componente montado uma vez, sempre com no
// máximo 1 personagem ativo.
export const TUCA_POSES = [
  { id: 'reading', img: tucaReading, alt: 'Tuca, a tartaruga, lendo um livro' },
  { id: 'glasses', img: tucaGlasses, alt: 'Tuca ajustando os óculos, pensativo' },
  { id: 'cheer', img: tucaCheer, alt: 'Tuca dando joia, torcendo por você' },
];

export const VUPT_POSES = [
  { id: 'peek', img: vuptPeek, alt: 'Vupt espiando escondida atrás do cenário' },
  { id: 'hide', img: vuptHide, alt: 'Vupt escondida dentro da caixa de pergunta, com cara de má' },
  { id: 'lean', img: vuptLean, alt: 'Vupt escorada na caixa de pergunta, de braços cruzados' },
];

export const MASCOTS = { tuca: TUCA_POSES, vupt: VUPT_POSES };

// A pose "cheer" (joinha do combo) não segue a regra das outras — o Davi
// pediu ela fixa no canto médio direito da TELA (não do card), um pouco
// menor. Por isso usa position:fixed + portal pro <body> (fixed dentro da
// árvore normal ficaria relativo ao motion.div com transform do entrance
// da GamePage, não à viewport de verdade).
const CHEER_POSE_ID = 'cheer';

// Frases (6 por mascote, sincronizadas com as poses) e áudio ainda não
// vieram do Davi — balão de fala e voz seguem desligados até ele mandar o
// texto final e o áudio gravado (a duração da animação vai acompanhar a
// duração do áudio quando isso chegar). Ver sessão 043/044.

export default function Mascot({ character, pose }) {
  const poses = MASCOTS[character];
  const active = poses && poses.find((p) => p.id === pose);

  if (!active) return null;

  if (pose === CHEER_POSE_ID) {
    return createPortal(
      <div className="pointer-events-none fixed right-0 top-1/2 -translate-y-1/2 z-40 w-56 h-56">
        <AnimatePresence>
          <motion.img
            key={character + pose}
            src={active.img}
            alt={active.alt}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="w-full h-full object-contain object-right select-none"
            draggable={false}
          />
        </AnimatePresence>
      </div>,
      document.body
    );
  }

  // v5.0.1: ancorado de verdade no card (referência de tamanho/posição que
  // o Davi mandou por screenshot) — absolute dentro do próprio card
  // `relative`. `right-full` gruda a borda direita do mascote na borda
  // esquerda do card; a margem negativa puxa de volta pra sobrepor um
  // pouco. Só aparece em telas largas (xl+) — espaço vazio entre a sidebar
  // e a coluna do jogo (max-w-lg centralizada); em telas menores não sobra
  // folga pra caber sem cortar.
  // Largura/altura (w-64 h-64) precisam estar NESTA div, não na img: uma
  // div absolute com `right` definido e width auto encolhe pro
  // "shrink-to-fit" do espaço disponível (quase zero, por causa do -mr-14
  // negativo) — sem width explícito aqui a imagem renderiza minúscula.
  return (
    <div className="hidden xl:block pointer-events-none absolute right-full top-1/2 -translate-y-1/2 -mr-14 z-10 w-64 h-64">
      <AnimatePresence>
        <motion.img
          key={character + pose}
          src={active.img}
          alt={active.alt}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </AnimatePresence>
    </div>
  );
}
