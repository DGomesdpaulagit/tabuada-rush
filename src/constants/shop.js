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
    art: 'ofensiva-congelada',
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
    art: 'pu-congelar',
    name: 'Congelar Missão',
    emoji: '❄️',
    // v6.0 · Bloco 5: agora estende o prazo de um DESAFIO MENSAL aceito
    // (+10 dias) — antes pausava uma missão diária, mas as diárias não têm
    // mais risco nenhum (não precisam de seguro), o risco agora é só nos
    // desafios mensais (ver planejamento-6.0.md seção 7).
    desc: 'Estende em 10 dias o prazo de um desafio mensal aceito — útil quando você vê que não vai conseguir a tempo.',
    price: 50,
    rarity: 'common',
  },

  // ── DENTRO DA PARTIDA (Rush) ─────────────────────────────────────────────
  {
    id: 'powerup_life',
    category: 'powerup',
    powerupKey: 'life',
    art: 'vidas',
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
    art: 'pu-tempo',
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
    art: 'xp',
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
    art: 'pu-escudo',
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
    art: 'pu-largada',
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
