import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GameIcon from '../components/GameIcon';
import { RARITIES, SHOP_ITEM_MAP, POTION_MAP } from '../constants/shop';
import { getDailyShopStock } from '../utils/shop';
import { useApp } from '../contexts/AppContext';
import { pageVariants, pageTransition } from '../components/ui';

// [Fase 5, sessão 070] Renova à meia-noite LOCAL — mesmo padrão de
// `resetLabel` do MissionsPage.jsx, cópia local de propósito (mesma
// convenção já usada lá, não vale a pena compartilhar por 2 usos).
function resetLabel() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const ms = tomorrow - now;
  const h  = Math.floor(ms / 3_600_000);
  const m  = Math.floor((ms % 3_600_000) / 60_000);
  return `Renova em ${h}h ${m}m`;
}

// v5.0 · Bloco 1: loja só vende power-ups agora — cosméticos (moldura/card/
// tema de jogo) foram removidos. A economia de moedas vai ser repensada num
// bloco à parte antes de qualquer coisa nova entrar aqui.
//
// [Fase 5, sessão 070] Estoque deixou de ser fixo: `getDailyShopStock()`
// sorteia 1-3 itens (power-up OU poção) por dia, determinístico pela data
// local — sem precisar guardar nada no storage, o resultado já é sempre o
// mesmo pro mesmo dia. Itens fora do sorteio de hoje só voltam a ficar
// compráveis quando saírem de novo (ou, no futuro, forem achados em
// partida — Fase 6). "Recuperar vidas" (Header, `LIFE_REFILL_PRICE`) não
// faz parte desse sorteio — já é sempre visível por fora da Loja, regra
// fixa do plano já satisfeita sem precisar duplicar aqui.
export default function ShopPage({ onBack, embedded = false }) {
  const { data, update } = useApp();
  const [toastMsg, setToastMsg] = useState(null);

  const coins    = data.coins    || 0;
  const powerups = data.powerups || {};
  const potions  = data.potions  || {};

  const stock = getDailyShopStock();
  const shopItemsToday = stock.filter((s) => s.kind === 'powerup').map((s) => SHOP_ITEM_MAP[s.id]);
  const potionsToday   = stock.filter((s) => s.kind === 'potion').map((s) => POTION_MAP[s.id]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  const buyPowerup = (item) => {
    if (coins < item.price) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - item.price,
      powerups: {
        ...(prev.powerups || {}),
        [item.powerupKey]: ((prev.powerups || {})[item.powerupKey] || 0) + 1,
      },
    }));
    showToast(`${item.emoji} ${item.name} adquirido!`);
  };

  // [Fase 4, D046] Preço fixo por enquanto — "preço mínimo" do
  // PLANO_ACAO.md só passa a variar quando a Fase 5 (loja rotativa) trocar
  // esta tela por um sorteio diário.
  const buyPotion = (potion) => {
    if (coins < potion.price) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - potion.price,
      potions: {
        ...(prev.potions || {}),
        [potion.id]: ((prev.potions || {})[potion.id] || 0) + 1,
      },
    }));
    showToast(`${potion.name} adquirida! Ative pela Mochila.`);
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
      {/* Header — escondido quando embutido no hub Recompensas (RewardsPage) */}
      {!embedded && (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-gray-900">Loja</h2>
            <p className="text-xs font-semibold text-gray-400">Power-ups pra usar na partida</p>
          </div>
          <div className="flex items-center gap-1.5 bg-bee/15 border-2 border-bee/30 rounded-2xl px-3 py-1.5">
            <GameIcon name="moedas" size={14} />
            <span className="text-sm font-black text-bee-dark">{coins.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      )}

      <div className="bg-macaw/10 border-2 border-macaw/20 rounded-2xl px-4 py-3">
        <p className="text-xs font-bold text-macaw-dark leading-snug">
          Power-ups são <strong>consumíveis</strong> — cada uso desconta 1 unidade do seu estoque.
          Você pode comprar vários de cada!
        </p>
      </div>

      {/* Estoque de hoje [Fase 5] — sorteio diário, muda à meia-noite local */}
      <div className="flex items-center justify-between gap-2 px-1">
        <p className="text-xs font-black text-fg-muted uppercase tracking-wide">Estoque de hoje</p>
        <p className="text-[11px] font-bold text-fg-muted">{resetLabel()}</p>
      </div>

      {/* Items list */}
      <div className="flex flex-col gap-3">
        {shopItemsToday.map((item) => {
          const rarity    = RARITIES[item.rarity];
          const count     = powerups[item.powerupKey] || 0;
          const canAfford = coins >= item.price;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 bg-surface border-border transition-all"
            >
              {/* Emoji + contador de estoque */}
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-xl bg-surface-2 border-2 border-border flex items-center justify-center text-2xl">
                  {/* `art` é a arte do Davi; `emoji` fica de reserva pra
                      qualquer item novo que ainda não tenha ícone próprio. */}
                  {item.art ? <GameIcon name={item.art} size={30} /> : item.emoji}
                </div>
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-macaw text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow">
                    {count}
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                  <p className="text-sm font-black text-fg leading-tight">{item.name}</p>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${rarity.badge}`}>
                    {rarity.gem} {rarity.label}
                  </span>
                </div>
                <p className="text-xs text-fg-muted font-semibold leading-snug">{item.desc}</p>
                {count > 0 && (
                  <p className="text-[11px] font-bold text-macaw-dark mt-0.5">
                    Estoque: {count} uso{count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                <button
                  onClick={() => buyPowerup(item)}
                  disabled={!canAfford}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                    canAfford
                      ? 'bg-bee/20 text-bee-dark hover:bg-bee/30 border-2 border-bee/40'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  }`}
                >
                  {/* Sem moeda suficiente = item travado: a moedinha fica
                      dessaturada junto com o resto do botão, em vez de ficar
                      dourada e viva num botão apagado. */}
                  <GameIcon
                    name="moedas"
                    size={14}
                    className={canAfford ? '' : 'grayscale opacity-50'}
                  />
                  {item.price.toLocaleString('pt-BR')}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Poções de XP [Fase 4, D046] — só aparece se saiu no sorteio de hoje [Fase 5] */}
      {potionsToday.length > 0 && (
      <div className="flex flex-col gap-2">
        <p className="text-xs font-black text-fg-muted uppercase tracking-wide px-1">Poções de XP</p>
        <div className="flex flex-col gap-3">
          {potionsToday.map((potion) => {
            const count = potions[potion.id] || 0;
            const canAfford = coins >= potion.price;
            return (
              <motion.div
                key={potion.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 bg-surface border-border"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-surface-2 border-2 border-border flex items-center justify-center">
                    <GameIcon name={potion.art} size={30} />
                  </div>
                  {count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-macaw text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow">
                      {count}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-fg leading-tight">{potion.name}</p>
                  <p className="text-xs text-fg-muted font-semibold leading-snug">
                    Dura até {potion.durationMin} min — ative pela Mochila quando quiser
                  </p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => buyPotion(potion)}
                    disabled={!canAfford}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-bee/20 text-bee-dark hover:bg-bee/30 border-2 border-bee/40'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                    }`}
                  >
                    <GameIcon name="moedas" size={14} className={canAfford ? '' : 'grayscale opacity-50'} />
                    {potion.price.toLocaleString('pt-BR')}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      )}

      {/* Como ganhar moedas */}
      <div className="bg-bee/10 border-2 border-bee/20 rounded-2xl p-4">
        <p className="text-xs font-black text-bee-dark mb-2">Como ganhar moedas?</p>
        <ul className="space-y-1.5">
          {[
            { art: 'moedas', text: 'Até 15 moedas por partida (0.3 × acertos)' },
            { art: 'ofensiva', text: '+1 moeda ao manter ofensiva' },
            { art: 'missoes', text: 'Complete missões para bônus maiores' },
          ].map(({ art, text }) => (
            <li key={text} className="flex items-center gap-1.5 text-xs text-bee-dark/80 font-semibold">
              <GameIcon name={art} size={14} />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key="shop-toast"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 left-4 right-4 max-w-sm mx-auto bg-gray-900 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl z-50 text-center"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
