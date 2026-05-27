const KEY = 'tabuada_rush_v2';

export const DEFAULTS = {
  xp: 0,
  totalGames: 0,
  totalCorrect: 0,
  totalWrong: 0,
  bestStreak: 0,
  bestScore: 0,
  bestAccuracy: 0,
  records: {},
  sessions: [],
  achievements: [],
  modesPlayed: [],
  dailyCompleted: 0,
  survivalBest: 0,
  speedBest: 0,
  fastestAvgMs: null,    // menor tempo médio de resposta por partida (recorde de velocidade)
  currentDailyDate: null,
  currentDailyScore: null,
  currentStreak: 0,          // ofensiva diária atual (dias consecutivos praticando)
  bestDayStreak: 0,          // maior ofensiva diária já atingida (recorde — não reseta)
  streakGoal: null,          // meta pessoal de ofensiva (null = ainda não definida → abre modal)
  streakGoalBase: 0,         // valor da ofensiva quando a meta atual foi definida (base do progresso)
  streakRewardsClaimed: [],  // marcos de recompensa (40/100/250/365) já resgatados
  pendingStreakReward: null, // marco com recompensa pendente de escolha (ou null)
  coins: 0,                  // moedas do jogo (economia)
  ownedItems: [],            // ids dos itens comprados na loja
  equippedItems: {},         // { frame, card, title } → id do item equipado em cada slot
  missionsData: null,        // { daily, weekly, monthly } — controlado por utils/missions.js
  seasonXp: 0,               // XP exclusivo da temporada (separado do XP de nível)
  seasonRewards: [],         // xpRequired[] de recompensas de temporada já resgatadas
  seasonId: 'temporada_1',   // id da temporada ativa no momento do save
  qiBonus: 0,                // bônus de QI ganho via recompensas de ofensiva
  lastPlayDate: null,
  progressLog: [],           // registro da evolução: marcos (nível, XP, ofensiva, recordes) — últimos 50
  tableStats: {},            // desempenho por tabuada (fator a): { [a]: { correct, wrong, totalMs, count } }
};

export const storage = {
  get() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
    } catch {
      return { ...DEFAULTS };
    }
  },

  set(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.error('[storage] write error:', e);
    }
  },

  update(updater) {
    const current = this.get();
    const next = updater(current);
    this.set(next);
    return next;
  },

  clear() {
    localStorage.removeItem(KEY);
  },
};
