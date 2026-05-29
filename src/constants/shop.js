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
//
// category: 'powerup' | 'frame' | 'card'
//
// powerup — consumíveis que afetam o gameplay:
//   powerupKey: chave em data.powerups (ex: 'life', 'time', 'xp2')
//   Comprar incrementa o contador. Usar decrementa.
//
// frame — moldura do avatar (cosmético permanente); frameStyle = classe Tailwind
// card  — tema do card de perfil (cosmético permanente); cardGradient = classe Tailwind

export const SHOP_ITEMS = [

  // ── POWER-UPS (consumíveis) ───────────────────────────────────────────────
  {
    id: 'powerup_life',
    category: 'powerup',
    powerupKey: 'life',
    name: 'Vida Extra',
    emoji: '❤️‍🔥',
    desc: 'Sobrevivência: restaura 1 vida quando você perder a última. Não deixa o jogo acabar!',
    price: 80,
    rarity: 'common',
  },
  {
    id: 'powerup_time',
    category: 'powerup',
    powerupKey: 'time',
    name: '+60s Rush',
    emoji: '⏱️',
    desc: 'Rush: adiciona 60 segundos ao cronômetro durante a partida. Use quando o tempo apertar!',
    price: 120,
    rarity: 'rare',
  },
  {
    id: 'powerup_xp2',
    category: 'powerup',
    powerupKey: 'xp2',
    name: 'XP Dobrado',
    emoji: '⚡',
    desc: 'Dobra o XP ganho na sua próxima partida completada (qualquer modo, exceto Zen).',
    price: 200,
    rarity: 'epic',
  },

  // ── MOLDURAS (frame) ─────────────────────────────────────────────────────
  {
    id: 'frame_gold',
    category: 'frame',
    name: 'Moldura Dourada',
    emoji: '🥇',
    desc: 'Contorno dourado para o avatar — sinal de dedicação',
    price: 800,
    rarity: 'rare',
    frameStyle: 'ring-2 ring-amber-400',
  },
  {
    id: 'frame_fire',
    category: 'frame',
    name: 'Moldura de Fogo',
    emoji: '🔥',
    desc: 'Chamas que mostram sua intensidade nos treinos',
    price: 1500,
    rarity: 'epic',
    frameStyle: 'ring-2 ring-orange-400',
  },
  {
    id: 'frame_diamond',
    category: 'frame',
    name: 'Moldura Diamante',
    emoji: '💎',
    desc: 'Brilho de diamante — reservada para os verdadeiros mestres',
    price: 3000,
    rarity: 'epic',
    frameStyle: 'ring-2 ring-cyan-400',
  },
  {
    id: 'frame_galaxy',
    category: 'frame',
    name: 'Moldura Galáxia',
    emoji: '🌌',
    desc: 'O universo no seu perfil — apenas para lendas',
    price: 8000,
    rarity: 'legendary',
    frameStyle: 'ring-2 ring-violet-400 ring-offset-1 ring-offset-violet-900',
  },

  // ── TEMAS DE CARD (card) ─────────────────────────────────────────────────
  {
    id: 'card_ocean',
    category: 'card',
    name: 'Tema Oceano',
    emoji: '🌊',
    desc: 'Gradiente azul profundo e sereno',
    price: 600,
    rarity: 'common',
    cardGradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'card_sunset',
    category: 'card',
    name: 'Tema Pôr do Sol',
    emoji: '🌅',
    desc: 'Tons quentes de laranja e rosa',
    price: 600,
    rarity: 'common',
    cardGradient: 'from-orange-500 to-rose-600',
  },
  {
    id: 'card_forest',
    category: 'card',
    name: 'Tema Floresta',
    emoji: '🌿',
    desc: 'Verde esmeralda que transmite calma',
    price: 600,
    rarity: 'common',
    cardGradient: 'from-emerald-600 to-teal-700',
  },
  {
    id: 'card_night',
    category: 'card',
    name: 'Tema Noturno',
    emoji: '🌙',
    desc: 'Escuro e misterioso para os notívagos',
    price: 1500,
    rarity: 'rare',
    cardGradient: 'from-slate-700 to-gray-900',
  },
  {
    id: 'card_cosmic',
    category: 'card',
    name: 'Tema Cósmico',
    emoji: '✨',
    desc: 'Visual épico de estrelas e cosmos',
    price: 4000,
    rarity: 'epic',
    cardGradient: 'from-indigo-600 via-purple-600 to-pink-600',
  },
];

// Lookup rápido por id
export const SHOP_ITEM_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));

// Categorias para os tabs da loja
export const SHOP_CATEGORIES = [
  { id: 'powerup', label: 'Poder',    emoji: '⚡' },
  { id: 'frame',   label: 'Molduras', emoji: '🖼️' },
  { id: 'card',    label: 'Temas',    emoji: '🎨' },
];
