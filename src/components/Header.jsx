import { Flame, Coins, Heart } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx } from '../utils';
import { LEVELS } from '../constants';

// ── HEADER ─────────────────────────────────────────────────────────────────
// v6.0 · Bloco 1: barra superior persistente estilo Duolingo — faixa/nível
// à esquerda, ofensiva/moedas/vidas à direita (planejamento-6.0.md, seção 2).
// Substitui o card "Ofensiva diária" solto que existia antes: agora é só o
// ícone de fogo aqui.
//
// O selo de nível é um PLACEHOLDER visual (usa o sistema de 28 níveis atual)
// até o Bloco 3 trocar por faixa de tabuada real (2-10 → 200). O contador de
// vidas também é placeholder (5 fixo) até o Bloco 2 implementar o sistema
// real de vidas diárias — não existe ainda um campo `data.lives` no storage.
export default function Header() {
  const { data } = useApp();
  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const streak = data.currentStreak || 0;
  const coins = data.coins || 0;
  const lives = data.lives ?? 5; // TODO Bloco 2: sistema real de vidas diárias

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-2.5 bg-surface border-b-2 border-border">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-lg leading-none">{level?.badge}</span>
        <span className="font-black text-sm text-fg">{levelIdx + 1}</span>
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
