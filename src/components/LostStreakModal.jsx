import { motion } from 'framer-motion';
import GameIcon from './GameIcon';

// ── AVISO DE OFENSIVA PERDIDA [sessão 097] ──────────────────────────────────
// Aparece ao ABRIR o jogo depois de perder a ofensiva, no formato que o Davi
// mandou de referência: arte grande, a contagem do que se perdeu, um botão
// forte pra recuperar e um link discreto pra aceitar o zero.
//
// O "desafio especial" da referência é, aqui, **uma partida de Rush** — o
// Davi definiu assim na sessão 098: apertar o botão leva direto pro modo
// principal, e terminar a partida devolve os dias perdidos (ver
// `handleGameEnd` em App.jsx, que lê `ofensivaPerdida.recuperando`).
export default function LostStreakModal({ dias, onRecuperar, onReiniciar }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60"
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="bg-surface border-2 border-border rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <GameIcon name="ofensiva-perdida" size={120} />
        </div>

        <p className="text-lg font-black text-fg leading-snug">
          Você perdeu a sua ofensiva de {dias} {dias === 1 ? 'dia' : 'dias'}...
        </p>
        <p className="text-sm font-bold text-fg-muted mt-1 leading-snug">
          Jogue uma partida agora e traga ela de volta!
        </p>

        <button
          onClick={onRecuperar}
          className="w-full mt-5 py-3.5 rounded-2xl bg-check text-white font-black text-sm uppercase tracking-wide shadow-chunky-check active:translate-y-1 active:shadow-none transition-all"
        >
          Trazer ofensiva de volta
        </button>

        <button
          onClick={onReiniciar}
          className="w-full mt-3 py-2 text-xs font-black text-fg-muted uppercase tracking-wide hover:text-fg transition-colors"
        >
          Reiniciar com 0 dias
        </button>
      </motion.div>
    </motion.div>
  );
}
