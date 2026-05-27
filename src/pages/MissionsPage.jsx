import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getActiveMissions, claimMission } from '../utils/missions';
import { pageVariants, pageTransition, Progress } from '../components/ui';

// ── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'daily',   label: 'Diárias',  emoji: '☀️' },
  { id: 'weekly',  label: 'Semanais', emoji: '📅' },
  { id: 'monthly', label: 'Mensais',  emoji: '🗓️' },
];

// ── Texto do próximo reset ────────────────────────────────────────────────────
function resetLabel(tab) {
  const now = new Date();
  if (tab === 'daily') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ms = tomorrow - now;
    const h  = Math.floor(ms / 3_600_000);
    const m  = Math.floor((ms % 3_600_000) / 60_000);
    return `Renova em ${h}h ${m}m`;
  }
  if (tab === 'weekly') return 'Renova na segunda-feira';
  return 'Renova no 1º dia do mês';
}

// ── Texto de progresso por tipo ───────────────────────────────────────────────
function progressLabel(mission) {
  const { progress: p, target: t } = mission;
  switch (mission.type) {
    case 'play':          return `${p}/${t} partidas`;
    case 'daily':         return `${p}/${t} desafios diários`;
    case 'streak':        return `${p}/${t} acertos seguidos`;
    case 'streak_month':  return `${p}/${t} dias de ofensiva`;
    case 'accuracy':      return `${p}/${t}% de precisão`;
    case 'score':         return `${p}/${t} pontos`;
    default:              return `${p}/${t} acertos`;
  }
}

// ── Componente ────────────────────────────────────────────────────────────────
export default function MissionsPage({ onBack }) {
  const { data, update } = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  const active      = getActiveMissions(data.missionsData);
  const missionList = active[activeTab]?.missions || [];

  // Contagem de moedas disponíveis para resgatar nesta aba
  const claimableCoins = missionList
    .filter((m) => m.completed && !m.rewardClaimed)
    .reduce((s, m) => s + (m.reward || 0), 0);

  const handleClaim = (mission) => {
    if (!mission.completed || mission.rewardClaimed) return;
    update((prev) => ({
      ...prev,
      missionsData: claimMission(prev.missionsData, activeTab, mission.id),
      coins: (prev.coins || 0) + (mission.reward || 0),
    }));
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-gray-900">Missões</h2>
          <p className="text-xs font-semibold text-gray-400">Complete para ganhar moedas</p>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-2xl px-3 py-1.5">
          <span className="text-sm">🪙</span>
          <span className="text-sm font-black text-amber-700">{data.coins || 0}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === t.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Reset info + claimable indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
          <Clock size={11} />
          {resetLabel(activeTab)}
        </div>
        {claimableCoins > 0 && (
          <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            +{claimableCoins} 🪙 para resgatar
          </span>
        )}
      </div>

      {/* Mission cards */}
      <div className="flex flex-col gap-3">
        {missionList.map((mission) => {
          const pct      = Math.min((mission.progress / mission.target) * 100, 100);
          const canClaim = mission.completed && !mission.rewardClaimed;

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                mission.rewardClaimed
                  ? 'bg-gray-50 border-gray-200 opacity-60'
                  : canClaim
                  ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5 shrink-0">{mission.emoji}</span>
                <div className="flex-1 min-w-0">
                  {/* Title + reward */}
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-sm font-black text-gray-900 leading-tight">{mission.title}</p>
                    <span className="text-xs font-black text-amber-600 shrink-0">🪙 {mission.reward}</span>
                  </div>
                  {/* Description */}
                  <p className="text-xs text-gray-400 font-semibold mb-2">{mission.desc}</p>
                  {/* Progress bar */}
                  <Progress
                    value={pct}
                    colorClass={mission.completed ? 'bg-emerald-500' : 'bg-violet-500'}
                    className="bg-gray-200 h-1.5 mb-1"
                  />
                  <p className="text-xs font-bold text-gray-400">{progressLabel(mission)}</p>
                </div>
              </div>

              {/* Claim button */}
              {canClaim && (
                <button
                  onClick={() => handleClaim(mission)}
                  className="mt-3 w-full py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-black hover:bg-emerald-600 active:scale-[0.98] transition-all"
                >
                  🎁 Resgatar +{mission.reward} moedas
                </button>
              )}

              {/* Claimed badge */}
              {mission.rewardClaimed && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle size={12} />
                  Recompensa resgatada
                </div>
              )}
            </motion.div>
          );
        })}

        {missionList.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-semibold">Nenhuma missão ativa</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
