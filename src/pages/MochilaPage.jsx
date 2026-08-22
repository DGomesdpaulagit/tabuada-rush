import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SHOP_ITEMS, MOCHILA_GROUPS, POTIONS } from '../constants/shop';
import { useApp } from '../contexts/AppContext';
import { getActivePotion } from '../utils/potions';
import { pageVariants, pageTransition } from '../components/ui';
import GameIcon from '../components/GameIcon';

function formatHora(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// ── MOCHILA [Fase 3/4 do PLANO_ACAO.md, sessões 067-068] ─────────────────────
// Só mostra o que o jogador TEM agora (comprado na Loja ou achado jogando —
// Fase 6), agrupado do jeito que o Davi definiu: Arena / Vida / Ofensiva /
// Missões. Diferente da Loja: sem preço, sem botão de comprar (exceto ativar
// poção, que não é compra) — é inventário, não vitrine. Item com estoque 0
// não aparece (mochila vazia de verdade não mostra nada, igual uma mochila
// real).
export default function MochilaPage({ onBack }) {
  const { data, update } = useApp();
  const powerups = data.powerups || {};
  const potions = data.potions || {};
  const [justActivated, setJustActivated] = useState(null); // poção pra tela de ativação

  const groups = MOCHILA_GROUPS.map((g) => ({
    ...g,
    items: SHOP_ITEMS.filter((i) => i.group === g.id && (powerups[i.powerupKey] || 0) > 0),
  })).filter((g) => g.items.length > 0);

  const potionsInStock = POTIONS.filter((p) => (potions[p.id] || 0) > 0);
  const activePotion = getActivePotion(data);
  const isEmpty = groups.length === 0 && potionsInStock.length === 0;

  // [D046] Só uma poção ativa por vez — ativar uma nova enquanto já tem uma
  // rodando não estava especificado no plano, e "acumular"/"substituir" sem
  // pedir são dois comportamentos igualmente arbitrários. Bloquear é o único
  // dos três que não inventa regra nenhuma.
  const activarPocao = (potion) => {
    if (activePotion || (potions[potion.id] || 0) === 0) return;
    const until = Date.now() + potion.durationMin * 60000;
    update((prev) => ({
      ...prev,
      potions: { ...(prev.potions || {}), [potion.id]: (prev.potions?.[potion.id] || 0) - 1 },
      potionActiveId: potion.id,
      potionActiveUntil: until,
    }));
    setJustActivated({ ...potion, until });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-fg">Mochila</h2>
          <p className="text-sm text-fg-muted font-semibold">Seus recursos guardados</p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <GameIcon name="mochila" size={64} className="opacity-40" />
          <p className="font-black text-fg">Sua mochila está vazia</p>
          <p className="text-sm text-fg-muted font-semibold max-w-xs">
            Compre power-ups na Loja ou ache jogando pra ver eles aqui.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map((g) => (
            <div key={g.id} className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <GameIcon name={g.art} size={16} />
                <p className="text-xs font-black text-fg-muted uppercase tracking-wide">{g.label}</p>
              </div>
              {g.items.map((item) => {
                const count = powerups[item.powerupKey] || 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border-2 bg-surface border-border"
                  >
                    <div className="w-11 h-11 rounded-xl bg-surface-2 border-2 border-border flex items-center justify-center shrink-0">
                      {item.art ? <GameIcon name={item.art} size={26} /> : <span className="text-xl">{item.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-fg leading-tight">{item.name}</p>
                      <p className="text-xs text-fg-muted font-semibold leading-snug truncate">{item.desc}</p>
                    </div>
                    <span className="shrink-0 min-w-[28px] h-7 px-2 rounded-full bg-accent/15 text-accent text-xs font-black flex items-center justify-center">
                      ×{count}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Poções [Fase 4, D046] — só aparece quando tem alguma em estoque */}
          {potionsInStock.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <GameIcon name="pocao-xp-2" size={16} />
                <p className="text-xs font-black text-fg-muted uppercase tracking-wide">Poções</p>
              </div>

              {activePotion && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-violet-500/15 text-violet-400 text-xs font-black">
                  <GameIcon name={activePotion.art} size={16} />
                  {activePotion.name} ativa até {formatHora(data.potionActiveUntil)}
                </div>
              )}

              {potionsInStock.map((potion) => {
                const count = potions[potion.id] || 0;
                const isThisOneActive = activePotion?.id === potion.id;
                const blocked = !!activePotion && !isThisOneActive;
                return (
                  <div
                    key={potion.id}
                    className="flex items-center gap-3 p-3 rounded-2xl border-2 bg-surface border-border"
                  >
                    <div className="w-11 h-11 rounded-xl bg-surface-2 border-2 border-border flex items-center justify-center shrink-0">
                      <GameIcon name={potion.art} size={26} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-fg leading-tight">{potion.name}</p>
                      <p className="text-xs text-fg-muted font-semibold leading-snug">
                        Dura até {potion.durationMin} min
                      </p>
                    </div>
                    <span className="shrink-0 min-w-[28px] h-7 px-2 rounded-full bg-accent/15 text-accent text-xs font-black flex items-center justify-center">
                      ×{count}
                    </span>
                    <button
                      onClick={() => activarPocao(potion)}
                      disabled={blocked || isThisOneActive}
                      className="shrink-0 px-3 py-2 rounded-xl text-xs font-black bg-violet-500/15 text-violet-400 hover:bg-violet-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isThisOneActive ? 'Ativa' : 'Ativar'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tela de ativação — referência roxa que o Davi mandou (Fase 4) */}
      <AnimatePresence>
        {justActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-full max-w-sm rounded-3xl p-8 text-center text-white shadow-2xl bg-gradient-to-br from-violet-600 to-purple-700"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }}
                className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/15 flex items-center justify-center"
              >
                <GameIcon name={justActivated.art} size={56} />
              </motion.div>
              <p className="text-2xl font-black leading-tight mb-1">Poção ativada!</p>
              <p className="text-white/80 text-sm font-semibold mb-6">
                XP ×{justActivated.multiplier} pelos próximos {justActivated.durationMin} min —
                vale até <span className="font-black text-white">{formatHora(justActivated.until)}</span>.
              </p>
              <button
                onClick={() => setJustActivated(null)}
                className="w-full py-3 rounded-2xl bg-white text-violet-700 font-black text-sm active:scale-[0.98] transition-transform"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
