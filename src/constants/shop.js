// ── RARIDADES ────────────────────────────────────────────────────────────────
export const RARITIES = {
  common: {
    label: 'Comum',
    textColor: 'text-gray-500',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    gem: '⚪',
  },
  rare: {
    label: 'Raro',
    textColor: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    gem: '🔵',
  },
  epic: {
    label: 'Épico',
    textColor: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    gem: '💜',
  },
  legendary: {
    label: 'Lendário',
    textColor: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    gem: '✨',
  },
};

// ── ITENS DA LOJA ─────────────────────────────────────────────────────────────
// category: 'frame' | 'title' | 'card'
// Para 'card': cardGradient define o gradiente aplicado no card de perfil
// Para 'frame': frameStyle define o ring do avatar
// Para 'title': o displayTitle sobrescreve o título de nível no card

export const SHOP_ITEMS = [
  // ── MOLDURAS (frame) ────────────────────────────────────────────────────────
  {
    id: 'frame_gold',
    category: 'frame',
    name: 'Moldura Dourada',
    emoji: '🥇',
    desc: 'Um contorno dourado elegante para o avatar',
    price: 500,
    rarity: 'rare',
    frameStyle: 'ring-2 ring-amber-400',
  },
  {
    id: 'frame_diamond',
    category: 'frame',
    name: 'Moldura Diamante',
    emoji: '💎',
    desc: 'Brilho de diamante para os verdadeiros mestres',
    price: 1500,
    rarity: 'epic',
    frameStyle: 'ring-2 ring-cyan-400',
  },
  {
    id: 'frame_fire',
    category: 'frame',
    name: 'Moldura de Fogo',
    emoji: '🔥',
    desc: 'Chamas que mostram sua dedicação',
    price: 800,
    rarity: 'rare',
    frameStyle: 'ring-2 ring-orange-400',
  },
  {
    id: 'frame_galaxy',
    category: 'frame',
    name: 'Moldura Galáxia',
    emoji: '🌌',
    desc: 'O universo cabe no seu perfil',
    price: 5000,
    rarity: 'legendary',
    frameStyle: 'ring-2 ring-violet-400',
  },

  // ── TÍTULOS ESPECIAIS (title) ───────────────────────────────────────────────
  {
    id: 'title_calculista',
    category: 'title',
    name: 'Calculista',
    emoji: '🧮',
    desc: 'Título personalizado de calculista',
    price: 200,
    rarity: 'common',
    displayTitle: 'Calculista',
  },
  {
    id: 'title_genio',
    category: 'title',
    name: 'Gênio Oculto',
    emoji: '🧠',
    desc: 'Mostre que a mente é sua arma secreta',
    price: 1000,
    rarity: 'epic',
    displayTitle: 'Gênio Oculto',
  },
  {
    id: 'title_lenda',
    category: 'title',
    name: 'A Lenda',
    emoji: '👑',
    desc: 'Apenas os melhores carregam esse título',
    price: 3000,
    rarity: 'legendary',
    displayTitle: 'A Lenda',
  },

  // ── TEMAS DE CARD (card) ────────────────────────────────────────────────────
  // cardGradient é a classe Tailwind aplicada ao bg do card de perfil
  {
    id: 'card_ocean',
    category: 'card',
    name: 'Tema Oceano',
    emoji: '🌊',
    desc: 'Gradiente azul profundo e sereno',
    price: 300,
    rarity: 'common',
    cardGradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'card_sunset',
    category: 'card',
    name: 'Tema Pôr do Sol',
    emoji: '🌅',
    desc: 'Tons quentes de laranja e rosa',
    price: 300,
    rarity: 'common',
    cardGradient: 'from-orange-500 to-rose-600',
  },
  {
    id: 'card_forest',
    category: 'card',
    name: 'Tema Floresta',
    emoji: '🌿',
    desc: 'Verde esmeralda que transmite calma',
    price: 300,
    rarity: 'common',
    cardGradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'card_night',
    category: 'card',
    name: 'Tema Noturno',
    emoji: '🌙',
    desc: 'Escuro e misterioso para os notívagos',
    price: 800,
    rarity: 'rare',
    cardGradient: 'from-slate-700 to-gray-900',
  },
  {
    id: 'card_cosmic',
    category: 'card',
    name: 'Tema Cósmico',
    emoji: '✨',
    desc: 'Um visual épico de estrelas e cosmos',
    price: 2000,
    rarity: 'epic',
    cardGradient: 'from-indigo-600 via-purple-600 to-pink-600',
  },
];

// Lookup rápido por id
export const SHOP_ITEM_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));

// Categorias para os tabs da loja
export const SHOP_CATEGORIES = [
  { id: 'frame', label: 'Molduras', emoji: '🖼️' },
  { id: 'title', label: 'Títulos',  emoji: '🏷️' },
  { id: 'card',  label: 'Temas',    emoji: '🎨' },
];
