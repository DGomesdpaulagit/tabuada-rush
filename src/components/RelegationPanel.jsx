import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { PENALIDADES, temDivisaoAbaixo } from '../utils/relegation';
import GameIcon from './GameIcon';

// ── AVISO DA ZONA DE REBAIXAMENTO [sessão 097] ──────────────────────────────
// Ideia do Davi: o jogador tem que ter MEDO de ficar aqui. Então o aviso
// aparece uma vez por dia enquanto ele estiver na zona, com a arte do buraco
// engolindo os recursos, e o "Ver mais" abre a lista do que piorou — com as
// artes que ele fez pra cada penalidade.
//
// O "não mostrar novamente" é escape, não desligamento da mecânica: as
// penalidades continuam valendo, só o aviso para de aparecer.

function Consequencia({ arte, titulo, texto }) {
  return (
    <div className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3">
      <GameIcon name={arte} size={54} className="shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-black text-fg leading-tight">{titulo}</p>
        <p className="text-xs font-semibold text-fg-muted leading-snug mt-0.5">{texto}</p>
      </div>
    </div>
  );
}

export default function RelegationPanel({ leagueId, onFechar, onNaoMostrarMais }) {
  const [verMais, setVerMais] = useState(false);
  const rebaixaDeVerdade = temDivisaoAbaixo(leagueId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.94, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 14 }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        className="bg-surface border-2 border-danger/40 rounded-3xl w-full max-w-md max-h-[88vh] overflow-y-auto shadow-2xl"
      >
        {!verMais ? (
          // ── Aviso ──────────────────────────────────────────────────────
          <div className="p-6 text-center">
            <div className="flex justify-center mb-2">
              <GameIcon name="zona-selo" size={230} />
            </div>
            <div className="flex justify-center mb-4">
              <GameIcon name="zona-buraco" size={190} />
            </div>
            <p className="text-lg font-black text-fg leading-snug">
              Você está na zona de rebaixamento!
            </p>
            <p className="text-sm font-semibold text-fg-muted mt-1.5 leading-snug">
              Enquanto estiver aqui, o jogo inteiro fica mais duro: você ganha menos XP e acha
              muito menos recursos.
            </p>

            <button
              onClick={() => setVerMais(true)}
              className="w-full mt-5 py-3.5 rounded-2xl bg-danger text-white font-black text-sm uppercase tracking-wide shadow-chunky-danger active:translate-y-1 active:shadow-none transition-all"
            >
              Ver mais
            </button>
            <button
              onClick={onFechar}
              className="w-full mt-2 py-2.5 text-xs font-black text-fg-muted uppercase tracking-wide hover:text-fg transition-colors"
            >
              Entendi
            </button>
            <button
              onClick={onNaoMostrarMais}
              className="w-full mt-1 py-1.5 text-[11px] font-bold text-fg-muted/70 hover:text-fg-muted transition-colors"
            >
              Não mostrar novamente
            </button>
          </div>
        ) : (
          // ── Página das consequências ───────────────────────────────────
          <div>
            <div className="flex items-center gap-3 px-5 py-4 border-b-2 border-border sticky top-0 bg-surface z-10">
              <button
                onClick={() => setVerMais(false)}
                aria-label="Voltar"
                className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-border flex items-center justify-center text-fg-muted transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <p className="font-black text-fg">O que piorou</p>
            </div>

            <div className="p-5 flex flex-col gap-3">
              <Consequencia
                arte="zona-xp-50"
                titulo={`XP cai ${Math.round((1 - PENALIDADES.xp) * 100)}%`}
                texto="Cada partida rende metade do XP que renderia fora da zona — e é XP que te tira daqui."
              />
              <Consequencia
                arte="zona-recursos-25"
                titulo={`Recursos e baús a ${Math.round(PENALIDADES.loot * 100)}%`}
                texto="A chance de achar baú, power-up e poção cai pra um quarto do normal."
              />
              <Consequencia
                arte="missao-tipo-precisao"
                titulo="Missões mais difíceis (mas pagam mais)"
                texto={`Os alvos sobem ${Math.round((PENALIDADES.missaoAlvo - 1) * 100)}% e a recompensa dobra — o baú de cada missão sobe de tier junto.`}
              />

              <div className="rounded-2xl border-2 border-danger/40 bg-danger/10 p-4 mt-1">
                <p className="text-sm font-black text-danger leading-tight">
                  {rebaixaDeVerdade
                    ? 'E no fim do ciclo você cai de divisão.'
                    : 'Você já está na divisão mais baixa — não tem pra onde cair, mas as penalidades valem igual.'}
                </p>
              </div>

              <div className="mt-2">
                <p className="text-xs font-black text-fg-muted uppercase tracking-wide mb-2">Como sair</p>
                <ul className="flex flex-col gap-2 text-sm font-semibold text-fg-muted">
                  <li className="flex gap-2">
                    <span className="text-danger font-black">1.</span>
                    Jogue o dobro do que você joga normalmente — com metade do XP, é o dobro de
                    partidas pra andar o mesmo tanto.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-danger font-black">2.</span>
                    Priorize acertar: o XP vem da pontuação, e errar corta a pontuação em dois
                    lugares ao mesmo tempo.
                  </li>
                  <li className="flex gap-2">
                    <span className="text-danger font-black">3.</span>
                    Complete as missões do dia. Elas ficaram mais difíceis, mas são a única coisa
                    que pagou MAIS por você estar aqui.
                  </li>
                </ul>
              </div>

              <button
                onClick={onFechar}
                className="w-full mt-3 py-3.5 rounded-2xl bg-accent text-white font-black text-sm uppercase tracking-wide shadow-chunky-accent active:translate-y-1 active:shadow-none transition-all"
              >
                Bora sair daqui
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
