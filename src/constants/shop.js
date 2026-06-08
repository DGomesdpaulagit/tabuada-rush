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

  // ── CONSUMÍVEIS DE PROGRESSÃO ────────────────────────────────────────────
  // Diferente dos power-ups in-game, estes afetam progressão fora da partida:
  // ofensiva, missões. Comprados antes de precisar — usados quando precisarem.
  {
    id: 'powerup_streak_insurance',
    category: 'powerup',
    powerupKey: 'streakInsurance',
    name: 'Seguro de Ofensiva',
    emoji: '🛡️',
    desc: 'Salva sua ofensiva se você quebrá-la — restaura automaticamente em até 24h.',
    price: 100,
    rarity: 'rare',
  },
  {
    id: 'powerup_mission_freeze',
    category: 'powerup',
    powerupKey: 'missionFreeze',
    name: 'Congelar Missão',
    emoji: '❄️',
    desc: 'Pausa uma missão diária por 24h — útil quando você sabe que não vai conseguir hoje.',
    price: 50,
    rarity: 'common',
  },

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

  // ── TEMAS DE GAMEPAGE (gameTheme) ────────────────────────────────────────
  // Cosméticos que mudam o visual do card de pergunta DURANTE a partida.
  // questionGradient sobrescreve o gradiente padrão do modo.
  // questionBorder sobrescreve a borda padrão.
  {
    id: 'gametheme_neon',
    category: 'gameTheme',
    name: 'Tema Neon',
    emoji: '💠',
    desc: 'Card de pergunta em cores neon vibrantes — destaque máximo durante a partida',
    price: 1000,
    rarity: 'rare',
    questionGradient: 'from-cyan-100 to-fuchsia-100',
    questionBorder: 'border-cyan-300',
  },
  {
    id: 'gametheme_aurora',
    category: 'gameTheme',
    name: 'Tema Aurora',
    emoji: '🌌',
    desc: 'Card de pergunta com gradiente da aurora boreal — verde, roxo e rosa',
    price: 2500,
    rarity: 'epic',
    questionGradient: 'from-emerald-100 via-violet-100 to-pink-100',
    questionBorder: 'border-violet-300',
  },
  {
    id: 'gametheme_lava',
    category: 'gameTheme',
    name: 'Tema Lava',
    emoji: '🔥',
    desc: 'Card de pergunta com gradiente de lava ardente — apenas para mestres',
    price: 5000,
    rarity: 'legendary',
    questionGradient: 'from-amber-100 via-rose-100 to-red-200',
    questionBorder: 'border-rose-400',
  },
];

// Lookup rápido por id
export const SHOP_ITEM_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));

// Categorias para os tabs da loja
export const SHOP_CATEGORIES = [
  { id: 'powerup',   label: 'Poder',    emoji: '⚡' },
  { id: 'frame',     label: 'Molduras', emoji: '🖼️' },
  { id: 'card',      label: 'Card',     emoji: '🎨' },
  { id: 'gameTheme', label: 'Jogo',     emoji: '💠' },
];

// ── OFERTA DA SEMANA ─────────────────────────────────────────────────────────
// Seleciona 3 itens cosméticos com 40% off, determinístico por semana ISO.
// Itens consumíveis (powerup) NÃO entram em oferta — eles já têm preço por uso.
export const WEEKLY_OFFER_DISCOUNT = 0.40;

function lcg(seed) {
  let s = seed >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0xffffffff; };
}

// Número ISO da semana (1-53) + ano, para determinismo cross-device
export function getIsoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return d.getUTCFullYear() * 100 + weekNo;
}

export function getWeeklyOffer(date = new Date()) {
  const eligible = SHOP_ITEMS.filter((i) => i.category !== 'powerup');
  const rand = lcg(getIsoWeekKey(date));
  const pool = [...eligible].sort(() => rand() - 0.5);
  return pool.slice(0, 3).map((item) => ({
    ...item,
    originalPrice: item.price,
    price: Math.round(item.price * (1 - WEEKLY_OFFER_DISCOUNT)),
    onOffer: true,
  }));
}
