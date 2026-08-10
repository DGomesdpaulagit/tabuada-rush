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
};

// ── ITENS DA LOJA ─────────────────────────────────────────────────────────────
// v5.0 · Bloco 1: a loja deixou de vender cosméticos (moldura/card/tema de jogo)
// — só power-ups (consumíveis que afetam o gameplay) continuam existindo.
// powerupKey: chave em data.powerups. Comprar incrementa o contador, usar decrementa.

export const SHOP_ITEMS = [

  // ── PROGRESSÃO (fora da partida) ────────────────────────────────────────
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

  // ── DENTRO DA PARTIDA (Rush) ─────────────────────────────────────────────
  {
    id: 'powerup_life',
    category: 'powerup',
    powerupKey: 'life',
    name: 'Vida Extra',
    emoji: '❤️‍🔥',
    desc: 'Restaura 1 vida quando você perder a última. Não deixa o jogo acabar!',
    price: 80,
    rarity: 'common',
  },
  {
    id: 'powerup_time',
    category: 'powerup',
    powerupKey: 'time',
    name: '+60s no relógio',
    emoji: '⏱️',
    desc: 'Adiciona 60 segundos ao cronômetro durante a partida. Use quando o tempo apertar!',
    price: 120,
    rarity: 'rare',
  },
  {
    id: 'powerup_xp2',
    category: 'powerup',
    powerupKey: 'xp2',
    name: 'XP Dobrado',
    emoji: '⚡',
    desc: 'Dobra o XP ganho na sua próxima partida completada.',
    price: 200,
    rarity: 'epic',
  },
  {
    id: 'powerup_shield',
    category: 'powerup',
    powerupKey: 'shield',
    name: 'Escudo',
    emoji: '🛡️',
    desc: 'Protege você do próximo erro — a vida não é descontada dessa vez. Se ativa sozinho.',
    price: 100,
    rarity: 'rare',
  },
  {
    id: 'powerup_headstart',
    category: 'powerup',
    powerupKey: 'headstart',
    name: 'Largada Turbo',
    emoji: '🚀',
    desc: 'Começa a próxima partida de Rush já com +10s no relógio.',
    price: 90,
    rarity: 'common',
  },
];

// Lookup rápido por id
export const SHOP_ITEM_MAP = Object.fromEntries(SHOP_ITEMS.map((i) => [i.id, i]));

// Categorias para os tabs da loja (só uma agora, mantida pra facilitar
// adicionar categorias novas de power-up no futuro sem mexer na UI)
export const SHOP_CATEGORIES = [
  { id: 'powerup', label: 'Poder', emoji: '⚡' },
];
