import { motion } from 'framer-motion';

// ── BUTTON ─────────────────────────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled,
  onClick,
  ...props
}) {
  // Efeito "chunky" estilo Duolingo: sombra sólida embaixo simula profundidade;
  // no press, o botão desce até encostar na sombra (translate-y) em vez de só
  // encolher — sensação de botão físico, não só feedback de toque.
  const base =
    'inline-flex items-center justify-center font-black rounded-2xl transition-all select-none disabled:opacity-40 disabled:pointer-events-none active:translate-y-1 active:shadow-none';

  const sizes = {
    sm: 'h-10 px-4 text-sm gap-1.5',
    md: 'h-12 px-6 text-base gap-2',
    lg: 'h-14 px-8 text-lg gap-2',
    icon: 'h-12 w-12',
  };

  // v6.0 · Bloco 1 — accent (verde) é a cor primária; surface/border se
  // adaptam ao tema via CSS vars (ver globals.css), então secondary/ghost
  // já funcionam certo no escuro sem precisar de `dark:` aqui.
  const variants = {
    primary: 'bg-accent text-white shadow-chunky-accent hover:bg-accent/90',
    secondary:
      'bg-surface text-fg border-2 border-border shadow-chunky-surface hover:bg-surface-2',
    ghost:
      'bg-transparent text-fg-muted hover:bg-surface-2 hover:text-fg active:translate-y-0 active:scale-95',
    danger: 'bg-danger text-white shadow-chunky-danger hover:bg-danger/90',
    info: 'bg-check text-white shadow-chunky-check hover:bg-check/90',
  };

  return (
    <motion.button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}

// ── CARD ───────────────────────────────────────────────────────────────────
export function Card({ children, className = '', onClick, ...props }) {
  const Comp = onClick ? motion.div : 'div';
  const motionProps = onClick ? { whileHover: { scale: 1.01 }, whileTap: { scale: 0.98 } } : {};
  return (
    <Comp
      className={`bg-surface rounded-3xl shadow-sm border-2 border-border ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}

// ── BADGE ──────────────────────────────────────────────────────────────────
export function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-surface-2 text-fg-muted',
    primary: 'bg-accent/15 text-accent',
    success: 'bg-success/15 text-success',
    danger: 'bg-danger/15 text-danger',
    amber: 'bg-coin/20 text-coin',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// ── PROGRESS ───────────────────────────────────────────────────────────────
export function Progress({ value = 0, className = '', colorClass = 'bg-violet-500' }) {
  return (
    <div className={`h-2 bg-gray-100 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        /* `?still=1`: sem isso a barra fica em 0% nas capturas de tela, porque
           a animação de preenchimento depende de rAF (ver D062). */
        initial={stillInitial({ width: 0 })}
        animate={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ── EMPTY STATE ────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <p className="font-bold text-gray-700 text-lg mb-1">{title}</p>
      <p className="text-gray-400 text-sm max-w-xs">{description}</p>
    </motion.div>
  );
}

// ── STAT CARD ──────────────────────────────────────────────────────────────
export function StatCard({ icon, label, value, colorClass = 'bg-violet-100 text-violet-600', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col gap-2"
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-xs font-semibold text-gray-400 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

// ── PAGE WRAPPER ───────────────────────────────────────────────────────────
export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const pageTransition = { duration: 0.3, ease: [0.4, 0, 0.2, 1] };

// ── MODO PARADO (só em DEV, com `?still=1`) [sessão 084, D062] ───────────────
// O framer-motion anima via `requestAnimationFrame`, que o navegador NÃO roda
// quando a aba/janela não está sendo pintada (painel do preview fechado,
// Chrome headless com tempo virtual). Resultado: a tela congela no estado
// INICIAL da animação — foi essa a causa raiz do D034, que travou a
// verificação visual por várias sessões seguidas.
//
// Com `?still=1`, `initial` vira `false`: o framer pinta direto o estado
// final, sem animação e sem depender de rAF. É o que faz o script de
// screenshots (`scripts/tirar-telas.mjs`) capturar a tela já assentada.
// Sem o parâmetro, nada muda; e em produção a flag nem existe.
export const STILL_MODE =
  import.meta.env.DEV && new URLSearchParams(window.location.search).has('still');

// Uso: <motion.div initial={stillInitial({ opacity: 0, x: 24 })} ... />
export const stillInitial = (valor) => (STILL_MODE ? false : valor);
