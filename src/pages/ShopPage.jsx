import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GameIcon from '../components/GameIcon';
import { SHOP_ITEMS, RARITIES } from '../constants/shop';
import { useApp } from '../contexts/AppContext';
import { pageVariants, pageTransition } from '../components/ui';

// v5.0 · Bloco 1: loja só vende power-ups agora — cosméticos (moldura/card/
// tema de jogo) foram removidos. A economia de moedas vai ser repensada num
// bloco à parte antes de qualquer coisa nova entrar aqui.
export default function ShopPage({ onBack, embedded = false }) {
  const { data, update } = useApp();
  const [toastMsg, setToastMsg] = useState(null);

  const coins    = data.coins    || 0;
  const powerups = data.powerups || {};

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

      {/* Items list */}
      <div className="flex flex-col gap-3">
        {SHOP_ITEMS.map((item) => {
          const rarity    = RARITIES[item.rarity];
          const count     = powerups[item.powerupKey] || 0;
          const canAfford = coins >= item.price;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${rarity.bg} ${rarity.border}`}
            >
              {/* Emoji + contador de estoque */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl ${rarity.bg} border-2 ${rarity.border} flex items-center justify-center text-2xl`}
                >
                  {item.emoji}
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
                  <p className="text-sm font-black text-gray-900 leading-tight">{item.name}</p>
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${rarity.bg} ${rarity.textColor} border ${rarity.border} shrink-0`}
                  >
                    {rarity.gem} {rarity.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-semibold leading-snug">{item.desc}</p>
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                    canAfford
                      ? 'bg-bee/20 text-bee-dark hover:bg-bee/30 border-2 border-bee/40'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                  }`}
                >
                  {item.price.toLocaleString('pt-BR')}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Como ganhar moedas */}
      <div className="bg-bee/10 border-2 border-bee/20 rounded-2xl p-4">
        <p className="text-xs font-black text-bee-dark mb-2">Como ganhar moedas?</p>
        <ul className="space-y-1">
          {[
            'Até 15 moedas por partida (0.3 × acertos)',
            '+1 moeda ao manter ofensiva',
            'Complete missões para bônus maiores',
          ].map((text) => (
            <li key={text} className="text-xs text-bee-dark/80 font-semibold">
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
