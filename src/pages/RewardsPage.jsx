import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Map, ShoppingBag, Leaf } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { countUnclaimedMissions } from '../utils/missions';
import { pageVariants, pageTransition } from '../components/ui';
import MissionsPage from './MissionsPage';
import ShopPage from './ShopPage';
import SeasonsPage from './SeasonsPage';
import GameIcon from '../components/GameIcon';

// Hub único pra Missões / Loja / Temporada — antes eram 3 botões separados no
// menu principal, agora são 3 abas de uma mesma tela (Bloco 1 · v5.0). A Loja
// de cosméticos fica de propósito sem destaque visual maior aqui: a economia
// de moedas/aposta vai ser repensada num bloco à parte antes de investir em
// UI nova pra ela — por ora ela só continua acessível.
const TABS = [
  { id: 'missions', label: 'Missões', icon: Map },
  { id: 'shop', label: 'Loja', icon: ShoppingBag },
  { id: 'seasons', label: 'Temporada', icon: Leaf },
];

export default function RewardsPage({ onBack }) {
  const { data } = useApp();
  const [tab, setTab] = useState('missions');
  const unclaimedMissions = countUnclaimedMissions(data.missionsData);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {/* Header único do hub */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900">Recompensas</h2>
          <p className="text-xs font-semibold text-gray-400">Missões, loja e temporada</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-1.5">
          <GameIcon name="moedas" size={16} />
          <span className="text-sm font-black text-amber-700">{(data.coins || 0).toLocaleString('pt-BR')}</span>
        </div>
      </div>

      {/* Abas */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`relative flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-colors active:translate-y-0.5
              ${tab === id
                ? 'bg-violet-600 border-violet-600 text-white shadow-chunky'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
          >
            <Icon size={18} />
            <span className="text-xs font-black">{label}</span>
            {id === 'missions' && unclaimedMissions > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm">
                {unclaimedMissions}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'missions' && <MissionsPage embedded onBack={onBack} />}
      {tab === 'shop' && <ShopPage embedded onBack={onBack} />}
      {tab === 'seasons' && <SeasonsPage embedded onBack={onBack} />}
    </motion.div>
  );
}
