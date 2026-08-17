import { LEVELS, ACHIEVEMENTS, DAILY_LIVES_MAX } from '../constants';
import { CHARACTERS, TIERS, QI_MIN, QI_MAX } from '../constants/characters';

// ── OPERAÇÃO ──────────────────────────────────────────────────────────────
// O Tabuada Rush é (e continua sendo) um jogo de MULTIPLICAÇÃO — decorar a
// tabuada. Essa constante existe porque `getFactKey`/`getFactSpace`/
// `computeCertificates` recebem uma "operação" por assinatura (ver histórico
// em CHANGELOG.md v3.11-3.16 — a 4.0 chegou a suportar soma/subtração/divisão
// e foi revertida por decisão consciente: o jogo estava perdendo o propósito
// original. Ver sessao-042.md).
export const DEFAULT_OPERATION = 'mult';

export const OPERATIONS = {
  mult: {
    id: 'mult',
    label: 'Multiplicação',
    symbol: '×',
    commutative: true, // 3×7 e 7×3 são o mesmo fato → chave normalizada min×max
    domainRows: [2, 3, 4, 5, 6, 7, 8, 9],       // fator `a` do Mapa de Domínio / certificados
    domainCols: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // fator `b`
    answer: (a, b) => a * b,
  },
};

// Chave canônica de um fato para uma operação. Para operações comutativas
// (hoje só `mult`) normaliza min×max — 3×7 e 7×3 caem na mesma chave.
export function getFactKey(operation, a, b) {
  const cfg = OPERATIONS[operation] || OPERATIONS[DEFAULT_OPERATION];
  if (cfg.commutative) {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    return `${lo}x${hi}`;
  }
  return `${cfg.id}:${a}-${b}`;
}

// ── QUESTION GENERATION ────────────────────────────────────────────────────

function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s / 0xffffffff;
  };
}

export function getDailyQuestions(count = 20) {
  const d = new Date();
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  const rand = seededRng(seed);
  return Array.from({ length: count }, () => {
    const a = Math.floor(rand() * 9) + 2;
    const b = Math.floor(rand() * 10) + 1;
    return { a, b, ans: a * b };
  });
}

// includeExtra=true adiciona 11 e 12 ao pool de fatores `a` (a partir do nível 3).
// forcedRow [v4.0 · Fase 5]: usado pelo viés de fatos fracos — quando presente,
// ignora o sorteio e a progressão por diffLevel (mesmo princípio do Modo Difícil).
// tierRange [v6.0 · Bloco 3] [min, max]: quando presente, o fator `a` vem da
// faixa de tabuada ATUAL do jogador (ver constants/LEVELS) em vez dos pools
// fixos abaixo — esses pools viram só o fallback pra quando não há tier
// (chamadas antigas/testes sem contexto de jogador).
export function getRandomQuestion(diffLevel = 1, includeExtra = false, forcedRow = null, tierRange = null) {
  let pool;
  if (tierRange) {
    const [min, max] = tierRange;
    pool = [];
    for (let n = min; n <= max; n++) pool.push(n);
  } else {
    const pools = {
      1: [2, 3, 4, 5],
      2: [2, 3, 4, 5, 6, 7],
      3: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    pool = pools[diffLevel] || pools[1];
    // Tabuada do 11 e 12: apenas no nível 3+ (jogador já aquecido)
    if (includeExtra && diffLevel >= 3) {
      pool = [...pool, 11, 12];
    }
  }
  const a = forcedRow != null ? forcedRow : pool[Math.floor(Math.random() * pool.length)];
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, ans: a * b };
}

// ── MODO COMBINADO — duas operações ───────────────────────────────────────────
// "3 × 7 + 4 = ?" — multiplicação base + adição/subtração de uma constante.
// `c` ∈ [1..9]; metade das vezes subtração (op '-'), metade adição (op '+').
// Garante answer > 0 quando op='-'.
export function getCombinedQuestion() {
  const a = Math.floor(Math.random() * 8) + 2; // 2..9
  const b = Math.floor(Math.random() * 9) + 2; // 2..10
  const op = Math.random() < 0.5 ? '+' : '-';
  let c = Math.floor(Math.random() * 9) + 1;   // 1..9
  // Se subtração, garante c <= a*b para não ficar negativo
  if (op === '-' && c > a * b) c = Math.floor(a * b / 2) || 1;
  const ans = op === '+' ? a * b + c : a * b - c;
  return { a, b, c, op, ans };
}

// [v4.0 · Fase 5] Generaliza a lógica de "fatos mais fracos" do Modo Difícil
// (getHardTabuadaPool, mult-only) para qualquer operação — usado como VIÉS
// (não exclusividade, diferente do Modo Difícil) no Rush/Sobrevivência/
// Velocidade/Zen quando o toggle "Foco em Fraquezas" está ativo nas Configurações.
const WEAK_BIAS_MIN_SAMPLES = 3;
const WEAK_BIAS_POOL_SIZE = 3;
const WEAK_BIAS_PROBABILITY = 0.6; // ~60% viés / 40% aleatório — nunca 100% exclusivo

export function getWeakPool(tableStats = {}) {
  const entries = Object.entries(tableStats)
    .map(([a, s]) => {
      const total = (s.correct || 0) + (s.wrong || 0);
      if (total < WEAK_BIAS_MIN_SAMPLES) return null;
      const errRate = s.wrong / total;
      const avgMs = s.count > 0 ? s.totalMs / s.count : 3000;
      const msScore = Math.min(avgMs / 5000, 1);
      const difficulty = errRate * 0.6 + msScore * 0.4;
      return { a: Number(a), difficulty };
    })
    .filter(Boolean)
    .sort((a, b) => b.difficulty - a.difficulty);
  return entries.slice(0, WEAK_BIAS_POOL_SIZE).map((e) => e.a);
}

// Ponto de entrada único pra gerar uma questão de multiplicação — delega pra
// `getRandomQuestion` (comportamento idêntico ao pré-4.0). O `operation` na
// assinatura é vestigial (sempre 'mult' hoje); mantido só porque outras
// funções (`getFactKey`, `computeCertificates`) ainda recebem esse parâmetro.
//
// `opts.weakBias` + `opts.tableStats` [Fase 5]: com ~60% de chance, força a
// "tabuada" a vir do pool de fatos mais fracos do jogador em vez do sorteio
// normal — um viés suave, não uma exclusividade (diferente do Modo Difícil).
export function generateQuestion(operation = DEFAULT_OPERATION, diffLevel = 1, opts = {}) {
  const { includeExtra, weakBias, tableStats, tierRange } = opts;
  let forcedRow = null;
  if (weakBias && tableStats && Math.random() < WEAK_BIAS_PROBABILITY) {
    const weakPool = getWeakPool(tableStats);
    if (weakPool.length) forcedRow = weakPool[Math.floor(Math.random() * weakPool.length)];
  }
  return getRandomQuestion(diffLevel, includeExtra, forcedRow, tierRange);
}

// [v6.0 · Bloco 3] Faixa de tabuada [min, max] do fator `a` pro nível atual
// do jogador (ver LEVELS.rangeMin/rangeMax em constants).
export function getTierRange(data) {
  const idx = getLevelIdx(data.xp || 0);
  const tier = LEVELS[idx];
  return tier ? [tier.rangeMin, tier.rangeMax] : [2, 10];
}

export function getDiffLevel(questionsAnswered) {
  if (questionsAnswered >= 30) return 3;
  if (questionsAnswered >= 15) return 2;
  return 1;
}

// Modo Difícil ADAPTATIVO: seleciona as 3 tabuadas com maior dificuldade
// individual do jogador (mistura erro + tempo médio). Requer >= 3 amostras
// por tabuada. Se não tiver dados suficientes, cai para o pool clássico 7/8/9.
export function getHardTabuadaPool(tableStats = {}) {
  const entries = Object.entries(tableStats)
    .map(([a, s]) => {
      const total = (s.correct || 0) + (s.wrong || 0);
      if (total < 3) return null; // amostras insuficientes
      const errRate = s.wrong / total;
      const avgMs = s.count > 0 ? s.totalMs / s.count : 3000;
      const msScore = Math.min(avgMs / 5000, 1);   // cap 5000ms
      // difficulty: 60% erro + 40% tempo (erro pesa mais)
      const difficulty = errRate * 0.6 + msScore * 0.4;
      return { a: Number(a), difficulty };
    })
    .filter(Boolean)
    .sort((a, b) => b.difficulty - a.difficulty);

  if (entries.length < 3) return [7, 8, 9]; // fallback
  return entries.slice(0, 3).map((e) => e.a);
}

export function getHardQuestion(tableStats = {}) {
  const pool = getHardTabuadaPool(tableStats);
  const a = pool[Math.floor(Math.random() * pool.length)];
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, ans: a * b };
}

// Gera 15 questões para o Modo Recorde Pessoal. Cada questão anexa `personalBenchmarkMs`
// (tempo médio do jogador para aquele fato) — se sem dados, usa 2500ms como referência.
export function getPersonalRecordQuestions(factStats = {}, count = 15) {
  const PERSONAL_FALLBACK_MS = 2500;
  return Array.from({ length: count }, () => {
    const a = Math.floor(Math.random() * 8) + 2; // 2..9
    const b = Math.floor(Math.random() * 10) + 1;
    const fk = getFactKey('mult', a, b);
    const stat = factStats[fk];
    const benchmark = stat?.count && stat?.totalMs
      ? Math.round(stat.totalMs / stat.count)
      : PERSONAL_FALLBACK_MS;
    return { a, b, ans: a * b, personalBenchmarkMs: benchmark };
  });
}

// Gera 10 questões para o Desafio Semanal: seed = ano + semana ISO.
// Todos os jogadores recebem as mesmas questões na mesma semana.
export function getWeeklyChallengeQuestions(date = new Date(), count = 10) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const seed = d.getUTCFullYear() * 100 + weekNo;
  const rand = seededRng(seed);
  return Array.from({ length: count }, () => {
    const a = Math.floor(rand() * 8) + 2; // 2..9 (pool padrão)
    const b = Math.floor(rand() * 10) + 1;
    return { a, b, ans: a * b };
  });
}

// Chave da semana ISO atual (para detectar quando o jogador já completou o
// desafio desta semana). Idêntica à `getIsoWeekKey` em shop.js mas autônoma aqui.
export function getCurrentWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// Gera questões para o Modo Revisão com score de dificuldade composto:
//   40% taxa de erro | 25% tempo médio de resposta | 15% volume absoluto de erros
//   | 20% "staleness" (dias desde a última prática — motor preditivo, Fase 4)
// Se houver poucos dados (< 2 tentativas por tabuada), usa pool padrão.
export function getRevisionQuestions(tableStats, count = 15, operation = DEFAULT_OPERATION) {
  const cfg = OPERATIONS[operation] || OPERATIONS[DEFAULT_OPERATION];
  const entries = Object.entries(tableStats || {})
    .map(([a, s]) => {
      const total = (s.correct || 0) + (s.wrong || 0);
      const errRate = total > 0 ? (s.wrong || 0) / total : 0;
      // avgMs: tempo médio por acerto — mais lento = mais difícil (cap 6000ms)
      const avgMs = (s.count || 0) > 0 ? (s.totalMs || 0) / s.count : 3000;
      const msScore = Math.min(avgMs / 6000, 1);
      // volume absoluto de erros normalizado (cap 80 erros)
      const wrongVol = Math.min((s.wrong || 0) / 80, 1);
      // staleness: dias desde a última prática, normalizado (satura em 14 dias) —
      // fatos "esquecendo" (curva de esquecimento) entram na revisão mesmo sem erro recente
      const daysSince = s.lastPracticed ? (Date.now() - new Date(s.lastPracticed).getTime()) / 86400000 : 14;
      const staleness = Math.min(Math.max(daysSince, 0) / 14, 1);
      const difficulty = errRate * 0.4 + msScore * 0.25 + wrongVol * 0.15 + staleness * 0.2;
      return { a: Number(a), difficulty, total };
    })
    .filter((t) => t.total >= 2)
    .sort((a, b) => b.difficulty - a.difficulty);

  const pool =
    entries.length >= 2
      ? entries.slice(0, Math.min(5, entries.length)).map((t) => t.a)
      : cfg.domainRows;

  return Array.from({ length: count }, () => {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const b = cfg.domainCols[Math.floor(Math.random() * cfg.domainCols.length)];
    return { a, b, ans: cfg.answer(a, b) };
  });
}

// ── SCORING ────────────────────────────────────────────────────────────────

export function calcPoints(diffLevel, streak, scale = 1) {
  const base = 10;
  const diff = (diffLevel - 1) * 5;
  const combo = streak >= 5 ? Math.floor(streak / 5) * 2 : 0;
  return Math.max(1, Math.round((base + diff + combo) * scale));
}

export function getLevelIdx(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xp) return i;
  }
  return 0;
}

export function getXpProgress(xp) {
  const idx = getLevelIdx(xp);
  const curr = LEVELS[idx];
  const next = LEVELS[idx + 1];
  if (!next) return { pct: 100, toNext: 0, idx };
  const pct = ((xp - curr.xp) / (next.xp - curr.xp)) * 100;
  return { pct: Math.min(pct, 100), toNext: next.xp - xp, idx };
}

export function getAccuracy(correct, total) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

export function getRank(score) {
  if (score >= 1000) return { label: 'Lendário', color: 'text-amber-500' };
  if (score >= 500)  return { label: 'Épico',    color: 'text-violet-600' };
  if (score >= 250)  return { label: 'Raro',     color: 'text-blue-500' };
  if (score >= 100)  return { label: 'Comum',    color: 'text-emerald-600' };
  return { label: 'Iniciante', color: 'text-gray-500' };
}

// ── QI MATEMÁTICO (lúdico — gamificação, NÃO mede QI real) ──────────────────

// Calcula um "QI Matemático" divertido a partir do desempenho do usuário.
// Combina: precisão, velocidade, ofensiva, consistência e progresso (nível).
// computeQI v3.0 — caps elevados: chegar ao QI máximo exige muito mais jogo.
//   Caps anteriores → novos caps (tudo mais difícil):
//   speedBest: 30 → 80  |  bestDayStreak: 30 → 120  |  totalGames: 50 → 300
//   Isso significa que só jogadores muito dedicados chegam perto de QI 200.
export function computeQI(data = {}) {
  const totalCorrect = data.totalCorrect || 0;
  const totalWrong = data.totalWrong || 0;
  const answered = totalCorrect + totalWrong;

  const acc = answered > 0 ? totalCorrect / answered : 0;
  const accPts = acc * 40;                                              // precisão lifetime (0–40)
  const bestAccPts = ((data.bestAccuracy || 0) / 100) * 10;            // melhor precisão (0–10)
  const speedPts = (Math.min(data.speedBest || 0, 80) / 80) * 20;     // cap: 80 respostas (era 30)
  const streakPts =
    (Math.min(data.bestDayStreak || 0, 120) / 120) * 15 +              // cap: 120 dias (era 30)
    (Math.min(data.currentStreak || 0, 60) / 60) * 5;                  // cap: 60 dias (era 15)
  const consistencyPts = (Math.min(data.totalGames || 0, 300) / 300) * 20; // cap: 300 partidas (era 50)
  const levelIdx = getLevelIdx(data.xp || 0);
  const progressPts = (levelIdx / (LEVELS.length - 1)) * 30;           // progresso de nível (0–30)

  const bonus = data.qiBonus || 0; // bônus de QI ganho em recompensas de ofensiva
  const raw = QI_MIN + accPts + bestAccPts + speedPts + streakPts + consistencyPts + progressPts + bonus;
  return Math.max(QI_MIN, Math.min(QI_MAX, Math.round(raw)));
}

// Reinicia a ofensiva se o usuário perdeu um dia OU virou o ano (conquistas e
// recordes NÃO são afetados). Deve rodar ao abrir o app / logar.
//
// SEGURO DE OFENSIVA: se o usuário tem `powerups.streakInsurance > 0` no
// estoque, em vez de zerar a ofensiva, marca como "pendente de restauração"
// (`brokenStreak`) e consome 1 seguro. A restauração efetiva acontece no
// próximo `lastPlayDate` ser definido (i.e., próxima partida em até 24h da
// quebra) — feito separadamente em `tryRestoreInsuredStreak`.
export function applyStreakDecay(data = {}) {
  const last = data.lastPlayDate;
  if (!last) return data;
  const today = todayStr();
  if (last === today) return data; // já praticou hoje — ofensiva intacta

  const y = new Date();
  y.setDate(y.getDate() - 1);
  const yStr = y.toISOString().split('T')[0];

  const missedDay = last !== yStr; // não jogou nem ontem nem hoje → perdeu a ofensiva
  const yearTurn = new Date(last).getFullYear() < new Date(today).getFullYear();

  if ((missedDay || yearTurn) && (data.currentStreak || 0) > 0) {
    const insurance = (data.powerups?.streakInsurance || 0);
    if (insurance > 0) {
      // Consome 1 seguro; mantém ofensiva intacta marcando o "consumo" via flag.
      // O jogador precisa jogar nas próximas 24h após o seguro ser consumido —
      // se não, na próxima abertura o seguro JÁ foi consumido e a ofensiva
      // cai (sem segundo seguro automático).
      return {
        ...data,
        streakInsuredAt: new Date().toISOString(),
        powerups: { ...(data.powerups || {}), streakInsurance: insurance - 1 },
      };
    }
    return { ...data, currentStreak: 0, streakGoalBase: 0, streakInsuredAt: null };
  }
  return data;
}

// Mapeia o QI para uma posição na lista de personagens (índice 0 = mais baixo).
// Retorna progresso fracionário até o próximo personagem.
export function getQiInfo(data = {}) {
  const qi = computeQI(data);
  const len = CHARACTERS.length;
  const span = QI_MAX - QI_MIN || 1;
  const ratio = Math.max(0, Math.min(1, (qi - QI_MIN) / span));
  const pos = ratio * (len - 1);
  const idx = Math.max(0, Math.min(len - 1, Math.floor(pos)));
  const frac = pos - idx; // 0..1 — progresso até o próximo personagem

  const char = CHARACTERS[idx];
  const nextChar = CHARACTERS[idx + 1] || null;
  const tier = TIERS[char.tier];

  return {
    qi,
    idx,
    position: idx + 1,
    total: len,
    char,
    tier,
    nextChar,
    pctToNext: nextChar ? Math.round(frac * 100) : 100,
  };
}

// ── REGISTRO DE EVOLUÇÃO (marcos do progresso) ──────────────────────────────

// Marcos de XP acumulado que viram registro na jornada do usuário.
const XP_MILESTONES = [1000, 5000, 10000, 25000, 50000, 100000, 200000];
// Marcos de ofensiva (recorde de dias) — alinhados às conquistas/recompensas.
const STREAK_MILESTONES = [5, 10, 15, 20, 35, 40, 100, 250, 365];
const MODE_LABELS_PT = {
  rush: 'Rush',
  survival: 'Sobrevivência',
  speed: 'Velocidade',
  daily: 'Desafio Diário',
};

// Compara o estado anterior com o novo e devolve a lista de NOVOS marcos
// atingidos (subida de nível, marcos de XP, ofensiva e melhora de recorde).
// Cada evento: { type, icon, title, detail, date }.
export function detectProgressEvents(prev = {}, next = {}) {
  const events = [];
  const date = new Date().toISOString();

  // Subidas de nível (uma entrada por nível ganho)
  const prevIdx = getLevelIdx(prev.xp || 0);
  const nextIdx = getLevelIdx(next.xp || 0);
  for (let i = prevIdx + 1; i <= nextIdx; i++) {
    events.push({
      type: 'level',
      icon: LEVELS[i].badge,
      title: `Nível ${i + 1}: ${LEVELS[i].name}`,
      detail: LEVELS[i].title,
      date,
    });
  }

  // Marcos de XP acumulado
  for (const m of XP_MILESTONES) {
    if ((prev.xp || 0) < m && (next.xp || 0) >= m) {
      events.push({
        type: 'xp',
        icon: '✨',
        title: `${m.toLocaleString('pt-BR')} XP acumulados`,
        detail: 'Marco de experiência',
        date,
      });
    }
  }

  // Marcos de ofensiva (pelo recorde de dias consecutivos)
  for (const m of STREAK_MILESTONES) {
    if ((prev.bestDayStreak || 0) < m && (next.bestDayStreak || 0) >= m) {
      events.push({
        type: 'streak',
        icon: '🔥',
        title: `${m} dias de ofensiva`,
        detail: 'Sequência diária mantida',
        date,
      });
    }
  }

  // Melhora de recorde por modo (só quando já existia um recorde anterior)
  for (const mode of Object.keys(next.records || {})) {
    const before = prev.records?.[mode];
    const after = next.records[mode];
    if (before != null && after > before) {
      events.push({
        type: 'record',
        icon: '🏆',
        title: `Novo recorde em ${MODE_LABELS_PT[mode] || mode}`,
        detail: `${after} pontos`,
        date,
      });
    }
  }

  return events;
}

// ── SPACED REPETITION (SM-2 simplificado) ───────────────────────────────────
// srsData[fk] = { interval (dias), nextReview (ISO date), easeFactor, reps, lastReview }
// Algoritmo: usuário avalia 'easy' | 'hard' | 'wrong' após responder o fato.

const SRS_INITIAL_INTERVALS_MIN = { wrong: 10, hard: 60 * 24, easy: 3 * 60 * 24 }; // minutos
const SRS_DEFAULT_EASE = 2.5;

// Espaço canônico dos 52 fatos fundamentais da tabuada (chaves via getFactKey,
// deduplicadas por comutatividade — 3×7 e 7×3 caem na mesma chave).
export function getFactSpace(operation = DEFAULT_OPERATION) {
  const cfg = OPERATIONS[operation] || OPERATIONS[DEFAULT_OPERATION];
  const keys = new Set();
  for (const a of cfg.domainRows) {
    for (const b of cfg.domainCols) {
      keys.add(getFactKey(cfg.id, a, b));
    }
  }
  return Array.from(keys);
}

// Alias retrocompatível — sempre foi (e continua sendo) o espaço de multiplicação.
export function getAllFactKeys() {
  return getFactSpace(DEFAULT_OPERATION);
}

// Decompõe uma chave de fato → { a, b, ans }. `operation` default = mult
// (formato "loxhi", como sempre foi antes da 4.0).
export function parseFactKey(fk, operation = DEFAULT_OPERATION) {
  const cfg = OPERATIONS[operation] || OPERATIONS[DEFAULT_OPERATION];
  if (cfg.commutative) {
    const [a, b] = fk.split('x').map(Number);
    return { a, b, ans: cfg.answer(a, b) };
  }
  const [, rest] = fk.split(':'); // formato reservado "op:a-b" (operações futuras)
  const [a, b] = (rest || fk).split('-').map(Number);
  return { a, b, ans: cfg.answer ? cfg.answer(a, b) : null };
}

// Atualiza o registro SRS de um fato dada a avaliação do usuário.
// quality: 'wrong' | 'hard' | 'easy'.
export function updateSrsFact(prev = {}, quality, now = Date.now()) {
  const ease = prev.easeFactor || SRS_DEFAULT_EASE;
  const reps = (prev.reps || 0) + 1;
  let interval; // em minutos
  let newEase = ease;

  if (quality === 'wrong') {
    interval = SRS_INITIAL_INTERVALS_MIN.wrong; // 10 min
    newEase = Math.max(1.3, ease - 0.2);
  } else if (quality === 'hard') {
    // hard: cresce devagar
    const prevDays = (prev.interval || 0) / (24 * 60);
    interval = Math.round(Math.max(1, prevDays * 1.2) * 24 * 60);
    newEase = Math.max(1.3, ease - 0.05);
  } else {
    // easy: cresce no fator de facilidade
    const prevDays = (prev.interval || 0) / (24 * 60);
    if (reps === 1) interval = SRS_INITIAL_INTERVALS_MIN.easy;
    else if (reps === 2) interval = 6 * 24 * 60; // 6 dias
    else interval = Math.round(prevDays * newEase * 24 * 60);
    newEase = Math.min(3.0, ease + 0.05);
  }

  return {
    interval,
    easeFactor: newEase,
    reps,
    nextReview: new Date(now + interval * 60 * 1000).toISOString(),
    lastReview: new Date(now).toISOString(),
  };
}

// Conta quantos fatos estão DUE (vencidos para revisão) hoje.
// Fato novo (sem registro) também conta como pendente.
export function countDueFlashcards(srsData = {}) {
  const all = getAllFactKeys();
  const now = Date.now();
  let due = 0;
  for (const fk of all) {
    const rec = srsData[fk];
    if (!rec || !rec.nextReview) { due += 1; continue; }
    if (new Date(rec.nextReview).getTime() <= now) due += 1;
  }
  return due;
}

// Devolve a próxima fila de revisão (ordenada por: vencidos primeiro, depois novos).
export function getReviewQueue(srsData = {}, limit = 20) {
  const all = getAllFactKeys();
  const now = Date.now();
  const due = [];
  const fresh = [];
  for (const fk of all) {
    const rec = srsData[fk];
    if (!rec || !rec.nextReview) { fresh.push(fk); continue; }
    const ts = new Date(rec.nextReview).getTime();
    if (ts <= now) due.push({ fk, ts });
  }
  due.sort((a, b) => a.ts - b.ts); // mais atrasado primeiro
  const queue = [...due.map((d) => d.fk), ...fresh];
  return queue.slice(0, limit);
}

// ── CURVA DE ESQUECIMENTO [v4.0 · Fase 4] ───────────────────────────────────
// Modelo de decaimento de memória inspirado na curva de Ebbinghaus:
//   R(t) = e^(-t / S)
// R = probabilidade estimada de o jogador ainda lembrar o fato (0-1)
// t = dias desde a última prática (`stat.lastPracticed`)
// S = "força de memória" em dias — quanto maior, mais devagar o fato decai
//
// S é estimada a partir de 3 sinais que JÁ existem em `factStats`/`tableStats`:
//   precisão histórica (correct/total), velocidade média (totalMs/count) e
//   volume de repetição (count) — os mesmos sinais do Mapa de Domínio, só que
//   aqui alimentam uma PREVISÃO (quando vai esquecer) em vez de uma
//   classificação estática (dominado/praticado/problemático).
//
// Diferença para o SRS do Flashcard (updateSrsFact): aquele reage à avaliação
// SUBJETIVA do jogador ("Fácil/Difícil/Errei") só dentro do modo Flashcard.
// Este modelo é PASSIVO — roda sobre os dados de QUALQUER partida, sem exigir
// que o jogador entre num modo específico.

const FORGETTING_MIN_SAMPLES = 2;   // menos que isso: força de memória mínima (esquece rápido)
const FORGETTING_MIN_STRENGTH_DAYS = 1;
const FORGETTING_RECALL_THRESHOLD = 0.5; // abaixo disso, o fato entra em "Fatos a Vencer"

function estimateMemoryStrengthDays(stat) {
  const total = (stat?.correct || 0) + (stat?.wrong || 0);
  if (total < FORGETTING_MIN_SAMPLES) return FORGETTING_MIN_STRENGTH_DAYS;

  const acc = stat.correct / total; // 0-1
  const avgMs = stat.count && stat.totalMs ? stat.totalMs / stat.count : 4000;
  // Rápido (<=1.5s) → speedFactor ~1. Lento (>=4.5s) → speedFactor ~0.
  const speedFactor = Math.max(0, Math.min(1, (4500 - avgMs) / 3000));
  const repFactor = Math.min(total / 10, 1); // satura em 10 repetições

  // Base de 1 dia, multiplicada por precisão/velocidade/repetição — um fato
  // dominado (>=90% acerto, rápido, praticado várias vezes) pode levar ~10 dias
  // pra cair abaixo do limiar de retenção; um fato mal-sabido decai em ~1-2 dias.
  return FORGETTING_MIN_STRENGTH_DAYS + acc * 10 * (0.5 + 0.5 * speedFactor) * (0.3 + 0.7 * repFactor);
}

// Probabilidade estimada (0-1) de o jogador ainda lembrar um fato agora.
// Sem `lastPracticed` (nunca praticado): retorna 0 — não é "esquecido", é "não aprendido"
// (categoria diferente, já coberta pelo estado "sem dados" do Mapa de Domínio).
export function predictRecallProbability(stat, now = Date.now()) {
  if (!stat?.lastPracticed) return 0;
  const daysSince = (now - new Date(stat.lastPracticed).getTime()) / 86400000;
  if (daysSince <= 0) return 1;
  const strength = estimateMemoryStrengthDays(stat);
  return Math.exp(-daysSince / strength);
}

// Fatos de uma operação com recall previsto abaixo do limiar — "a vencer".
// Só conta fatos JÁ praticados (senão seria só "não aprendido ainda").
export function getFactsAtRisk(factStats = {}, now = Date.now()) {
  return Object.entries(factStats || {})
    .filter(([, stat]) => stat?.lastPracticed)
    .map(([fk, stat]) => ({ fk, recall: predictRecallProbability(stat, now) }))
    .filter((e) => e.recall < FORGETTING_RECALL_THRESHOLD)
    .sort((a, b) => a.recall - b.recall); // mais esquecido primeiro
}

// Conta fatos "a vencer" — usado no banner do menu.
export function countFactsAtRiskAllOps(data = {}) {
  return getFactsAtRisk(data.factStats?.mult || {}).length;
}

// ── CERTIFICADOS DE DOMÍNIO POR TABUADA ─────────────────────────────────────
// 8 certificados (tabuadas 2–9). Cada um é desbloqueado quando TODOS os fatos
// daquela tabuada estão "dominated" (mesmo critério do Mapa de Domínio).
// Critério local — espelha classifyFact em AccuracyCatalogPage.

const CERT_FAST_MS = 1500;
const CERT_MIN_ACC = 90;
const CERT_MIN_SAMPLES = 3;

function isFactDominated(stat) {
  if (!stat || (stat.count || 0) < CERT_MIN_SAMPLES) return false;
  const tot = (stat.correct || 0) + (stat.wrong || 0);
  if (tot < CERT_MIN_SAMPLES) return false;
  const acc = Math.round((stat.correct / tot) * 100);
  const avgMs = stat.totalMs / stat.count;
  return acc >= CERT_MIN_ACC && avgMs > 0 && avgMs < CERT_FAST_MS;
}

// Lista de certificados desbloqueados (tabuadas 2..9 — hoje só `mult`; Fases 2/3
// da 4.0 reutilizam a mesma função para as demais operações via `operation`).
// Retorna [{ table: 2..9, dominated, total: 10 }] com flag se já está completo.
export function computeCertificates(factStats = {}, operation = DEFAULT_OPERATION) {
  const cfg = OPERATIONS[operation] || OPERATIONS[DEFAULT_OPERATION];
  const result = [];
  for (const row of cfg.domainRows) {
    let dominated = 0;
    for (const col of cfg.domainCols) {
      const fk = getFactKey(cfg.id, row, col);
      if (isFactDominated(factStats[fk])) dominated += 1;
    }
    result.push({
      table: row,
      dominated,
      total: cfg.domainCols.length,
      unlocked: dominated === cfg.domainCols.length,
    });
  }
  return result;
}

// ── DESBLOQUEIO PROGRESSIVO DE MODOS ─────────────────────────────────────────
// Cada modo (exceto Zen) tem uma condição para ser desbloqueado. A intenção é
// criar uma jornada natural: novo usuário começa só com Zen, e descobre que
// ele dá XP (sem ser dito) — o que destrava Rush, depois os outros modos.
//
// Tipos de condição:
//   'level'         → levelIdx >= value (level zero-indexed; 0 = Iniciante)
//   'totalGames'    → data.totalGames >= value
//   'totalCorrect'  → data.totalCorrect >= value
//   'totalWrong'    → data.totalWrong >= value
//   'bestDayStreak' → data.bestDayStreak >= value
//   'certificates'  → certificados de domínio desbloqueados >= value

// v5.0 · Bloco 1: nenhum modo fica bloqueado — travar por nível/desempenho
// deixava o jogo chato nos primeiros minutos. Tudo liberado desde o início.
export const UNLOCK_RULES = {
  zen: null,
  rush: null,
  review: null,
};

// Avalia o estado de desbloqueio de um modo. Retorna { unlocked, reason, current, target }.
//   - reason: descrição curta para mostrar no card ('Nível 5', '20 acertos', etc)
//   - current/target: progresso atual / meta (para barra de progresso opcional)
export function getModeUnlock(modeId, data = {}) {
  const rule = UNLOCK_RULES[modeId];
  if (!rule) return { unlocked: true, reason: null };

  let current = 0;
  let target = rule.value;
  let reason = '';

  switch (rule.type) {
    case 'level': {
      current = getLevelIdx(data.xp || 0);
      const lvl = LEVELS[rule.value];
      reason = lvl ? `Nível ${rule.value + 1}: ${lvl.name}` : `Nível ${rule.value + 1}`;
      break;
    }
    case 'totalGames':
      current = data.totalGames || 0;
      reason = `${target} partidas jogadas`;
      break;
    case 'totalCorrect':
      current = data.totalCorrect || 0;
      reason = `${target} acertos no total`;
      break;
    case 'totalWrong':
      current = data.totalWrong || 0;
      reason = `${target} erros (precisa do que revisar)`;
      break;
    case 'bestDayStreak':
      current = data.bestDayStreak || 0;
      reason = `${target} dias de ofensiva (recorde)`;
      break;
    case 'certificates':
      current = computeCertificates(data.factStats?.mult || {}).filter((c) => c.unlocked).length;
      reason = `${target} certificados de domínio`;
      break;
    default:
      return { unlocked: true, reason: null };
  }

  return {
    unlocked: current >= target,
    reason,
    current,
    target,
  };
}

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────

export function checkNewAchievements(savedData) {
  const { achievements = [] } = savedData;
  const unlocked = [];

  for (const a of ACHIEVEMENTS) {
    if (!achievements.includes(a.id) && a.check(savedData)) {
      unlocked.push(a);
    }
  }
  return unlocked;
}

// ── DATE HELPERS ──────────────────────────────────────────────────────────

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// [v6.0 · Bloco 2] Vidas diárias — lê o pote sem mutar o storage; se o dia
// virou desde o último registro, reporta o pote cheio (o reset de verdade só
// é gravado na próxima vez que uma vida é perdida ou comprada, ver App.jsx
// loseLife/buyLifeRefill — evita escrever no storage só de olhar a tela).
export function getLivesInfo(data) {
  const today = todayStr();
  const ld = data.livesData;
  const remaining = !ld || ld.date !== today ? DAILY_LIVES_MAX : Math.max(0, ld.remaining);
  return { remaining, max: DAILY_LIVES_MAX };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatDate(isoStr) {
  if (!isoStr) return '—';
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}
