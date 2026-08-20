import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Star, BookMarked, ChevronRight, Calendar } from 'lucide-react';
import GameIcon from '../components/GameIcon';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getLevelIdx } from '../utils';
import { getLeagueStandings } from '../utils/leagues';
import { LEVELS } from '../constants';
import { pageVariants, pageTransition } from '../components/ui';
import RecordsPage from './RecordsPage';
import AchievementsPage from './AchievementsPage';
import CatalogPage from './CatalogPage';

// ── PERFIL [v6.0 · Bloco 6] ──────────────────────────────────────────────────
// Absorve Conquistas/Recordes/Catálogo (antes seções da StatsPage — ver
// planejamento-6.0.md seção 9) e substitui o card QI-first do Menu como
// identidade central do jogador: faixa de tabuada (Bloco 3) + liga (Bloco 4)
// em vez do sistema antigo de "QI" (ver DECISIONS.md D023 — essa é a última
// tela pendente de migrar, junto com Menu/Settings/Results/Catalog).
function formatMemberSince(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export default function PerfilPage() {
  const { data } = useApp();
  const { user } = useAuth();
  const [view, setView] = useState('main');

  if (view === 'records')      return <RecordsPage      onBack={() => setView('main')} />;
  if (view === 'achievements') return <AchievementsPage  onBack={() => setView('main')} />;
  if (view === 'catalog')      return <CatalogPage       onBack={() => setView('main')} />;

  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const { league, playerRank, total } = getLeagueStandings(data);
  const memberSince = formatMemberSince(data.createdAt);
  const achievementsCount = (data.achievements || []).length;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-6"
    >
      {/* Cabeçalho — identidade */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <User size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-black text-fg truncate">
            {user?.email || 'Jogador'}
          </h1>
          {memberSince && (
            <p className="text-xs text-fg-muted font-semibold flex items-center gap-1">
              <Calendar size={11} />
              No jogo desde {memberSince}
            </p>
          )}
        </div>
      </div>

      {/* Card principal — faixa de tabuada + liga */}
      <div className={`bg-gradient-to-br ${league.gradient} rounded-3xl p-5 text-white shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-3xl shrink-0">
            {level?.badge}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">Faixa atual</p>
            <p className="text-xl font-black leading-tight truncate">{level?.name}</p>
          </div>
        </div>
        <div className="h-px bg-white/15 my-4" />
        <div className="flex items-center gap-3">
          <span className="text-3xl">{league.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-bold uppercase tracking-wide">Liga</p>
            <p className="text-lg font-black leading-tight">{league.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black tabular-nums">{playerRank}º</p>
            <p className="text-white/70 text-[11px] font-bold">de {total}</p>
          </div>
        </div>
      </div>

      {/* Stats resumidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1">
          <GameIcon name="ofensiva" size={20} />
          <p className="text-xl font-black text-fg">{data.bestDayStreak || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Recorde de ofensiva</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1">
          <GameIcon name="xp" size={20} />
          <p className="text-xl font-black text-fg">{data.xp || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">XP total</p>
        </div>
        {/* [pendência pós-reset] "Pódios conquistados nas ligas", do áudio
            original do Perfil (planejamento-6.0.md seção 9) — não tinha sido
            implementado no Bloco 6, ver utils/leagues.js applyLeaguePromotion */}
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1">
          <GameIcon name="podio" size={20} />
          <p className="text-xl font-black text-fg">{data.leaguePodiums || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Pódios nas ligas</p>
        </div>
      </div>

      {/* Acesso: Conquistas / Recordes / Catálogo */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setView('achievements')}
          className="flex items-center gap-3 w-full text-left bg-surface rounded-2xl px-4 py-3.5 border-2 border-border hover:border-accent/40 transition-colors"
        >
          <span className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
            <Star size={16} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-fg">Conquistas</p>
            <p className="text-xs text-fg-muted font-semibold">{achievementsCount} desbloqueadas</p>
          </div>
          <ChevronRight size={18} className="text-fg-muted shrink-0" />
        </button>
        <button
          onClick={() => setView('records')}
          className="flex items-center gap-3 w-full text-left bg-surface rounded-2xl px-4 py-3.5 border-2 border-border hover:border-coin/40 transition-colors"
        >
          <span className="w-9 h-9 rounded-xl bg-coin/15 text-coin flex items-center justify-center shrink-0">
            <GameIcon name="podio" size={18} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-fg">Recordes</p>
            <p className="text-xs text-fg-muted font-semibold">Sua melhor pontuação por modo</p>
          </div>
          <ChevronRight size={18} className="text-fg-muted shrink-0" />
        </button>
        <button
          onClick={() => setView('catalog')}
          className="flex items-center gap-3 w-full text-left bg-surface rounded-2xl px-4 py-3.5 border-2 border-border hover:border-blue-400/40 transition-colors"
        >
          <span className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
            <BookMarked size={16} />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-fg">Catálogo</p>
            <p className="text-xs text-fg-muted font-semibold">Progresso, faixas e evolução</p>
          </div>
          <ChevronRight size={18} className="text-fg-muted shrink-0" />
        </button>
      </div>
    </motion.div>
  );
}
