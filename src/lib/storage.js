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
  powerups: {},              // { life: N, time: N, xp2: N } — consumíveis da loja
  ownedItems: [],            // ids dos itens comprados na loja (cosméticos)
  equippedItems: {},         // { frame, card } → id do item equipado em cada slot
  missionsData: null,        // { daily, weekly, monthly } — controlado por utils/missions.js
  seasonXp: 0,               // XP exclusivo da temporada (separado do XP de nível)
  seasonRewards: [],         // xpRequired[] de recompensas de temporada já resgatadas
  seasonId: 'temporada_1',   // id da temporada ativa no momento do save
  qiBonus: 0,                // bônus de QI ganho via recompensas de ofensiva
  lastPlayDate: null,
  progressLog: [],           // registro da evolução: marcos (nível, XP, ofensiva, recordes) — últimos 50
  // [v4.0 · Fase 2] Operação selecionada para Rush/Sobrevivência/Velocidade/Zen/Revisão
  // ('mult' | 'add' | 'sub'). Desafio Diário/Semanal e modos avançados ignoram isto —
  // sempre multiplicação (comparação justa entre jogadores / benchmarks específicos).
  selectedOperation: 'mult',
  // [v4.0] tableStats/factStats/srsData agora namespaced por operação: { mult: {...}, add: {...}, ... }.
  // Só `mult` tem conteúdo até a Fase 1 da 4.0 estar concluída (Fases 2/3 trazem add/sub/div).
  tableStats: { mult: {} },  // desempenho por tabuada (fator a): { [op]: { [a]: { correct, wrong, totalMs, count } } }
  factStats: { mult: {} },   // desempenho por fato (par a,b): { [op]: { [factKey]: { correct, wrong, totalMs, count } } }
  srsData: { mult: {} },     // repetição espaçada por fato: { [op]: { [factKey]: { interval, nextReview, easeFactor, reps, lastReview } } }
};

// Dados de v3.x salvos ANTES da 4.0 guardavam tableStats/factStats/srsData "achatados"
// (sem namespace de operação — só existia multiplicação). Migração automática e
// retrocompatível: se o campo não tem nenhuma chave de operação conhecida, o conteúdo
// inteiro É a multiplicação e vira `{ mult: <conteúdo antigo> }`. Idempotente.
const KNOWN_OPERATIONS = ['mult', 'add', 'sub', 'div'];
function migrateOperationKeyedField(field) {
  if (!field || typeof field !== 'object') return { mult: {} };
  const alreadyNamespaced = KNOWN_OPERATIONS.some((op) =>
    Object.prototype.hasOwnProperty.call(field, op)
  );
  return alreadyNamespaced ? field : { mult: field };
}

export const storage = {
  get() {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
      parsed.tableStats = migrateOperationKeyedField(parsed.tableStats);
      parsed.factStats = migrateOperationKeyedField(parsed.factStats);
      parsed.srsData = migrateOperationKeyedField(parsed.srsData);
      return parsed;
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
