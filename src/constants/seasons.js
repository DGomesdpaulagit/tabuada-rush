// Data LOCAL (YYYY-MM-DD). Cópia proposital do helper de utils/index.js:
// `constants/` não pode importar de `utils/` (utils já importa constants —
// daria ciclo). Ver D040 pro motivo de não usar toISOString aqui.
function localDateStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ── TEMPORADAS ────────────────────────────────────────────────────────────────
// Cada temporada tem: id, nome, tema, identidade visual, datas e trilha de
// recompensas. A trilha define o XP necessário e o prêmio de cada marco.
// reward.type: 'coins' | 'item'
// data.seasonRewards (array de xpRequired já resgatados) controla o histórico.

export const SEASONS = [
  {
    id: 'temporada_1',
    name: 'Temporada 1',
    theme: 'Despertar Matemático',
    emoji: '🌱',
    gradient: 'from-violet-600 to-purple-600',
    gradientLight: 'from-violet-50 to-purple-50',
    startDate: '2026-05-01',
    endDate: '2026-07-31',
    description:
      'A jornada começa. Construa hábitos, acumule XP de temporada e desbloqueie recompensas exclusivas desta fase.',
    rewards: [
      {
        xpRequired: 100,
        emoji: '💰', art: 'moedas',
        label: '50 Moedas',
        reward: { type: 'coins', amount: 50 },
      },
      {
        xpRequired: 300,
        emoji: '💰', art: 'moedas',
        label: '100 Moedas',
        reward: { type: 'coins', amount: 100 },
      },
      {
        xpRequired: 600,
        emoji: '🥇',
        label: 'Moldura Dourada',
        reward: { type: 'item', id: 'frame_gold' },
      },
      {
        xpRequired: 1000,
        emoji: '💰', art: 'moedas',
        label: '200 Moedas',
        reward: { type: 'coins', amount: 200 },
      },
      {
        xpRequired: 1500,
        emoji: '🌊',
        label: 'Tema Oceano',
        reward: { type: 'item', id: 'card_ocean' },
      },
      {
        xpRequired: 2000,
        emoji: '💰', art: 'moedas',
        label: '300 Moedas',
        reward: { type: 'coins', amount: 300 },
      },
      {
        xpRequired: 3000,
        emoji: '🧮',
        label: 'Título Calculista',
        reward: { type: 'item', id: 'title_calculista' },
      },
      {
        xpRequired: 5000,
        emoji: '💰', art: 'moedas',
        label: '500 Moedas',
        reward: { type: 'coins', amount: 500 },
      },
      {
        xpRequired: 7500,
        emoji: '🌿',
        label: 'Tema Floresta',
        reward: { type: 'item', id: 'card_forest' },
      },
      {
        xpRequired: 10000,
        emoji: '💎',
        label: 'Moldura Diamante',
        reward: { type: 'item', id: 'frame_diamond' },
      },
    ],
  },
];

// Temporada ativa (a última da lista, ou por data)
export function getActiveSeason() {
  const today = localDateStr();
  return (
    SEASONS.find((s) => s.startDate <= today && s.endDate >= today) ||
    SEASONS[SEASONS.length - 1]
  );
}

// XP de temporada ganho por partida
// Separado do XP de nível — usado apenas para a trilha da temporada
export function calcSeasonXp(result, currentStreak) {
  const base = Math.round((result.score || 0) * 0.3);
  const dailyBonus = result.mode === 'daily' ? 10 : 0;
  const streakBonus = (currentStreak || 0) > 1 ? 5 : 0;
  return base + dailyBonus + streakBonus;
}
