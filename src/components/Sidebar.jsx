import { Home, Gamepad2, Gift, BarChart2, Medal, Settings } from 'lucide-react';

// ── SIDEBAR ────────────────────────────────────────────────────────────────
// Nav lateral persistente estilo Duolingo (design.duolingo.com/app screenshot):
// logo no topo, itens empilhados com ícone + label, item ativo destacado.
// Só aparece em telas largas (lg+) — no celular o app continua em coluna
// única, sem barra lateral (ela "some" conforme a tela, como o Davi pediu).
const NAV_ITEMS = [
  { id: 'menu', label: 'Início', icon: Home },
  { id: 'modes', label: 'Modos', icon: Gamepad2 },
  { id: 'rewards', label: 'Recompensas', icon: Gift },
  { id: 'stats', label: 'Estatísticas', icon: BarChart2 },
  { id: 'ranking', label: 'Ranking QI', icon: Medal },
];

export default function Sidebar({ screen, onNavigate }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-dvh sticky top-0 border-r-2 border-swan bg-white px-4 py-6">
      <button
        onClick={() => onNavigate('menu')}
        className="text-2xl font-black text-feather px-2 mb-8 text-left"
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
                  ? 'bg-macaw/10 text-macaw'
                  : 'text-wolf hover:bg-polar hover:text-eel'}`}
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
              ? 'bg-macaw/10 text-macaw'
              : 'text-wolf hover:bg-polar hover:text-eel'}`}
        >
          <Settings size={20} />
          Configurações
        </button>
      </div>
    </aside>
  );
}
