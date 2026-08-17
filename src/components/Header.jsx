import { Flame, Coins, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getLivesInfo } from '../utils';
import { LEVELS } from '../constants';

// ── HEADER ─────────────────────────────────────────────────────────────────
// v6.0 · Bloco 1: barra superior persistente estilo Duolingo — faixa/nível
// à esquerda, ofensiva/moedas/vidas à direita (planejamento-6.0.md, seção 2).
// Substitui o card "Ofensiva diária" solto que existia antes: agora é só o
// ícone de fogo aqui.
//
// [v6.0 · Bloco 3] O selo à esquerda mostra a faixa de tabuada REAL do
// jogador (ex. "2×10"), não mais um número de nível abstrato — LEVELS agora
// É a progressão de faixas (ver constants/index.js). Vidas são o sistema
// real do Bloco 2 (pote diário, ver utils/getLivesInfo).
export default function Header() {
  const { data } = useApp();
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const streak = data.currentStreak || 0;
  const coins = data.coins || 0;
  const lives = getLivesInfo(data).remaining;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-2.5 bg-surface border-b-2 border-border">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-lg leading-none">{level?.badge}</span>
        <span className="font-black text-sm text-fg">{level?.rangeMin}×{level?.rangeMax}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1 font-black text-sm text-streak">
          <Flame size={17} className="fill-streak" />
          {streak}
        </span>
        <span className="flex items-center gap-1 font-black text-sm text-coin">
          <Coins size={17} />
          {coins}
        </span>
        <span className="flex items-center gap-1 font-black text-sm text-danger">
          <Heart size={17} className="fill-danger" />
          {lives}
        </span>
      </div>
    </header>
  );
}
