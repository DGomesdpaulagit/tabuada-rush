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

  // Paleta "Caderno Quadriculado" — ink (azul-índigo) é a cor primária,
  // pen (vermelho) marca erro/perigo, check (verde) confirmação.
  const variants = {
    primary: 'bg-ink text-white shadow-chunky hover:bg-ink/90',
    secondary:
      'bg-white text-graphite border-2 border-[#E0DACB] shadow-chunky-white hover:bg-paper',
    ghost:
      'bg-transparent text-graphite-soft hover:bg-paper hover:text-graphite active:translate-y-0 active:scale-95',
    danger: 'bg-pen text-white shadow-chunky-danger hover:bg-pen/90',
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
      className={`bg-white rounded-3xl shadow-sm border-2 border-gray-100 ${className}`}
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
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-ink/10 text-ink-dark',
    success: 'bg-check/10 text-check-dark',
    danger: 'bg-pen/10 text-pen-dark',
    amber: 'bg-bee/20 text-bee-dark',
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
        initial={{ width: 0 }}
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
