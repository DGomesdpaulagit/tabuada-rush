import { Home, Trophy, Gift, ShoppingBag, User, Settings } from 'lucide-react';

// ── SIDEBAR ────────────────────────────────────────────────────────────────
// v6.0 · Bloco 1: nav lateral com os 5 destinos primários definidos no reset
// (sessions/planejamento-6.0.md, seção 3) — Arena substitui "Início", Ligas
// substitui "Ranking QI" (mecânica de liga em si é o Bloco 4), Missões/Loja
// deixam de ser abas dentro de "Recompensas" e viram destinos próprios,
// Perfil é novo. Modos/Estatísticas não são destinos de sidebar — são
// alcançados a partir da Arena/Perfil, como no áudio do Davi.
// Só aparece em telas largas (lg+) — no celular ainda não há nav persistente
// (Davi pediu pra decidir o layout mobile depois, ver planejamento-6.0.md).
const NAV_ITEMS = [
  { id: 'menu', label: 'Arena', icon: Home },
  { id: 'ranking', label: 'Ligas', icon: Trophy },
  { id: 'missions', label: 'Missões', icon: Gift },
  { id: 'shop', label: 'Loja', icon: ShoppingBag },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export default function Sidebar({ screen, onNavigate }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-dvh sticky top-0 border-r-2 border-border bg-surface px-4 py-6">
      <button
        onClick={() => onNavigate('menu')}
        className="text-2xl font-black text-accent px-2 mb-8 text-left"
      >
        Tabuada Rush
      </button>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = screen === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-2xl font-black text-sm uppercase tracking-wide transition-colors
                ${active
                  ? 'bg-accent/15 text-accent'
                  : 'text-fg-muted hover:bg-surface-2 hover:text-fg'}`}
            >
              <Icon size={20} />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-3 px-3 py-3 rounded-2xl font-black text-sm uppercase tracking-wide transition-colors w-full
            ${screen === 'settings'
              ? 'bg-accent/15 text-accent'
              : 'text-fg-muted hover:bg-surface-2 hover:text-fg'}`}
        >
          <Settings size={20} />
          Configurações
        </button>
      </div>
    </aside>
  );
}
