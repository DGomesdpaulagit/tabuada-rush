import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SHOP_ITEMS, MOCHILA_GROUPS } from '../constants/shop';
import { useApp } from '../contexts/AppContext';
import { pageVariants, pageTransition } from '../components/ui';
import GameIcon from '../components/GameIcon';

// ── MOCHILA [Fase 3 do PLANO_ACAO.md, sessão 067] ────────────────────────────
// Só mostra o que o jogador TEM agora (comprado na Loja ou achado jogando —
// Fase 6), agrupado do jeito que o Davi definiu: Arena / Vida / Ofensiva /
// Missões. Diferente da Loja: sem preço, sem botão de comprar — é inventário,
// não vitrine. Item com estoque 0 não aparece (mochila vazia de verdade não
// mostra nada, igual uma mochila real).
//
// Poções (Fase 4) ainda não existem no storage — a seção só aparece quando
// `data.potions` tiver algo; até lá, fica de fora (não é esquecimento, é que
// o recurso não existe ainda).
export default function MochilaPage({ onBack }) {
  const { data } = useApp();
  const powerups = data.powerups || {};
  const potions = data.potions || {};

  const groups = MOCHILA_GROUPS.map((g) => ({
    ...g,
    items: SHOP_ITEMS.filter((i) => i.group === g.id && (powerups[i.powerupKey] || 0) > 0),
  })).filter((g) => g.items.length > 0);

  const potionEntries = Object.entries(potions).filter(([, count]) => count > 0);
  const isEmpty = groups.length === 0 && potionEntries.length === 0;

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

          {/* Poções — Fase 4, só aparece quando existir alguma no estoque */}
          {potionEntries.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-1">
                <GameIcon name="pocao-xp-2" size={16} />
                <p className="text-xs font-black text-fg-muted uppercase tracking-wide">Poções</p>
              </div>
              {potionEntries.map(([key, count]) => (
                <div
                  key={key}
                  className="flex items-center gap-3 p-3 rounded-2xl border-2 bg-surface border-border"
                >
                  <div className="w-11 h-11 rounded-xl bg-surface-2 border-2 border-border flex items-center justify-center shrink-0">
                    <GameIcon name={key} size={26} />
                  </div>
                  <p className="flex-1 min-w-0 text-sm font-black text-fg">{key}</p>
                  <span className="shrink-0 min-w-[28px] h-7 px-2 rounded-full bg-accent/15 text-accent text-xs font-black flex items-center justify-center">
                    ×{count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
