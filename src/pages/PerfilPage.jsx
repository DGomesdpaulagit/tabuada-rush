import { motion } from 'framer-motion';
import { User, Flame, Trophy, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getQiInfo } from '../utils';
import { pageVariants, pageTransition } from '../components/ui';

// ── PERFIL ─────────────────────────────────────────────────────────────────
// v6.0 · Bloco 1: destino novo na sidebar — por ora um resumo mínimo, real
// pra não deixar link morto. Conquistas/Recordes/Catálogo (que hoje vivem
// em Estatísticas) migram pra cá no Bloco 6, junto com o painel completo
// descrito em planejamento-6.0.md (seção 9).
export default function PerfilPage() {
  const { data } = useApp();
  const { user } = useAuth();
  const qiInfo = getQiInfo(data);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-3 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
          <User size={26} />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-black text-fg truncate">
            {user?.email || 'Jogador'}
          </h1>
          <p className="text-sm text-fg-muted font-semibold">
            {qiInfo.char.emoji} {qiInfo.char.name} · QI {qiInfo.qi}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1">
          <Flame size={18} className="text-streak" />
          <p className="text-xl font-black text-fg">{data.bestDayStreak || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Recorde de ofensiva</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1">
          <Sparkles size={18} className="text-accent" />
          <p className="text-xl font-black text-fg">{data.xp || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">XP total</p>
        </div>
        <div className="bg-surface rounded-2xl p-4 border-2 border-border flex flex-col gap-1 col-span-2">
          <Trophy size={18} className="text-coin" />
          <p className="text-xl font-black text-fg">{qiInfo.char.name}</p>
          <p className="text-xs font-semibold text-fg-muted">Classificação atual (Ligas chega no Bloco 4)</p>
        </div>
      </div>

      <p className="text-sm text-fg-muted font-semibold text-center px-4">
        Conquistas, recordes e catálogo de níveis chegam aqui no próximo bloco.
      </p>
    </motion.div>
  );
}
