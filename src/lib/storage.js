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
  livesData: { date: null, remaining: 5 }, // [v6.0 · Bloco 2] pote de vidas diárias — ver getLivesInfo em utils
  leagueId: 'bronze',    // [v6.0 · Bloco 4] liga atual — ver utils/leagues.js
  leagueHighestId: 'bronze', // [v6.0 · escada de ligas] liga mais alta já alcançada (nunca desce com rebaixamento) — define o que fica desbloqueado na tela de Ligas. Auto-curado em applyLeaguePromotion pra saves antigos sem este campo.
  leagueXpBase: 0,       // XP total no momento em que entrou na liga atual (delta = xp - leagueXpBase)
  leagueEnteredAt: null, // data (YYYY-MM-DD) em que entrou na liga atual — informativo
  leaguePodiums: 0,      // nº de vezes que ficou entre os 3 primeiros de uma liga
  leaguePodiumClaimed: false, // já contou pódio nesta permanência na liga atual? (evita contar de novo todo ciclo)
  leagueLastCycleChecked: null, // [recalibração 2026-08-17] nº do último ciclo de 6 dias em que promoção/rebaixamento foi avaliado — ver utils/leagues.js
  diamondPodiumActive: false,   // pódio (top 3) da liga Diamante dá bônus de XP enquanto durar — ver App.jsx handleGameEnd
  createdAt: null,       // [v6.0 · Bloco 6] data do primeiro load — "no jogo desde..." no Perfil (setado uma vez em AppContext)
  powerups: {},              // { life: N, time: N, shield: N, headstart: N, streakInsurance: N, missionFreeze: N } — consumíveis da loja (xp2/XP Dobrado removido — ver D043, substituído pelas Poções de XP)
  ownedItems: [],            // ids dos itens comprados na loja (cosméticos)
  equippedItems: {},         // { frame, card } → id do item equipado em cada slot
  missionsData: null,        // { daily, monthly } — v6.0 · Bloco 5: semanais removidas, controlado por utils/missions.js
  seasonXp: 0,               // XP exclusivo da temporada (separado do XP de nível)
  seasonRewards: [],         // xpRequired[] de recompensas de temporada já resgatadas
  seasonId: 'temporada_1',   // id da temporada ativa no momento do save
  lastPlayDate: null,
  progressLog: [],           // registro da evolução: marcos (nível, XP, ofensiva, recordes) — últimos 50
  // Viés (não exclusividade) pelos fatos mais fracos do jogador em
  // Rush/Sobrevivência/Velocidade/Zen — ligado por padrão, com toggle em Configurações.
  adaptiveDifficulty: true,
  // tableStats/factStats/srsData ficam sob `.mult` (namespace interno — só existe
  // multiplicação no jogo, ver CHANGELOG v3.11-3.16 pro histórico da 4.0).
  tableStats: { mult: {} },  // desempenho por tabuada (fator a): { mult: { [a]: { correct, wrong, totalMs, count, lastPracticed } } }
  factStats: { mult: {} },   // desempenho por fato (par a,b): { mult: { [factKey]: { correct, wrong, totalMs, count, lastPracticed } } }
  srsData: { mult: {} },     // repetição espaçada por fato: { mult: { [factKey]: { interval, nextReview, easeFactor, reps, lastReview } } }
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
