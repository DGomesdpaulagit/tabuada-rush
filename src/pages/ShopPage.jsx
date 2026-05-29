import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { SHOP_ITEMS, SHOP_CATEGORIES, RARITIES } from '../constants/shop';
import { useApp } from '../contexts/AppContext';
import { pageVariants, pageTransition } from '../components/ui';

export default function ShopPage({ onBack }) {
  const { data, update } = useApp();
  const [activeTab, setActiveTab] = useState('powerup');
  const [toastMsg, setToastMsg] = useState(null);

  const coins         = data.coins         || 0;
  const ownedItems    = data.ownedItems    || [];
  const equippedItems = data.equippedItems || {};
  const powerups      = data.powerups      || {};

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2200);
  };

  // ── Comprar cosmético (permanente) ──────────────────────────────────────────
  const buyCosmetic = (item) => {
    if (coins < item.price || ownedItems.includes(item.id)) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - item.price,
      ownedItems: [...(prev.ownedItems || []), item.id],
    }));
    showToast(`${item.emoji} ${item.name} adquirido!`);
  };

  // ── Comprar consumível (incrementa contador) ────────────────────────────────
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

  const toggleEquip = (item) => {
    update((prev) => {
      const eq = { ...(prev.equippedItems || {}) };
      if (eq[item.category] === item.id) {
        delete eq[item.category];
      } else {
        eq[item.category] = item.id;
      }
      return { ...prev, equippedItems: eq };
    });
  };

  const items = SHOP_ITEMS.filter((i) => i.category === activeTab);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900">Loja</h2>
          <p className="text-xs font-semibold text-gray-400">Power-ups e cosméticos</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-1.5">
          <span className="text-sm">🪙</span>
          <span className="text-sm font-black text-amber-700">{coins.toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2">
        {SHOP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === cat.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Power-ups: explicação */}
      {activeTab === 'powerup' && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3">
          <p className="text-xs font-bold text-violet-600 leading-snug">
            ⚡ Power-ups são <strong>consumíveis</strong> — cada uso desconta 1 unidade do seu estoque.
            Você pode comprar vários de cada!
          </p>
        </div>
      )}

      {/* Items list */}
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const rarity      = RARITIES[item.rarity];
          const isPowerup   = item.category === 'powerup';
          const count       = isPowerup ? (powerups[item.powerupKey] || 0) : 0;
          const owned       = !isPowerup && ownedItems.includes(item.id);
          const equipped    = !isPowerup && equippedItems[item.category] === item.id;
          const canAfford   = coins >= item.price;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                equipped
                  ? 'bg-violet-50 border-violet-300'
                  : owned
                  ? 'bg-gray-50 border-gray-200'
                  : `${rarity.bg} ${rarity.border}`
              }`}
            >
              {/* Emoji + contador de estoque */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 rounded-xl ${rarity.bg} border ${rarity.border} flex items-center justify-center text-2xl`}
                >
                  {item.emoji}
                </div>
                {isPowerup && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-violet-600 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow">
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
                {isPowerup && count > 0 && (
                  <p className="text-[11px] font-bold text-violet-500 mt-0.5">
                    Estoque: {count} uso{count !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Action */}
              <div className="shrink-0">
                {isPowerup ? (
                  // Consumível: sempre pode comprar mais
                  <button
                    onClick={() => buyPowerup(item)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                  >
                    🪙 {item.price.toLocaleString('pt-BR')}
                  </button>
                ) : owned ? (
                  <button
                    onClick={() => toggleEquip(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      equipped
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-violet-100 hover:text-violet-700'
                    }`}
                  >
                    {equipped ? '✓ Equipado' : 'Equipar'}
                  </button>
                ) : (
                  <button
                    onClick={() => buyCosmetic(item)}
                    disabled={!canAfford}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 ${
                      canAfford
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                    }`}
                  >
                    🪙 {item.price.toLocaleString('pt-BR')}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Como ganhar moedas */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <p className="text-xs font-black text-amber-700 mb-2">Como ganhar moedas? 🪙</p>
        <ul className="space-y-1">
          {[
            ['🎮', 'Até 15 moedas por partida (0.3 × acertos)'],
            ['🌟', '+2 moedas por Desafio Diário'],
            ['🔥', '+1 moeda ao manter ofensiva'],
            ['🗺️', 'Complete missões para bônus maiores'],
          ].map(([emoji, text]) => (
            <li key={text} className="flex items-center gap-2 text-xs text-amber-600 font-semibold">
              <span>{emoji}</span>
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
