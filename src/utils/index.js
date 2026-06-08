import { LEVELS, ACHIEVEMENTS } from '../constants';
import { CHARACTERS, TIERS, QI_MIN, QI_MAX } from '../constants/characters';

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

export function getRandomQuestion(diffLevel = 1) {
  const pools = {
    1: [2, 3, 4, 5],
    2: [2, 3, 4, 5, 6, 7],
    3: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  const pool = pools[diffLevel] || pools[1];
  const a = pool[Math.floor(Math.random() * pool.length)];
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, ans: a * b };
}

export function getDiffLevel(questionsAnswered) {
  if (questionsAnswered >= 30) return 3;
  if (questionsAnswered >= 15) return 2;
  return 1;
}

// Gera questões para o Modo Revisão com score de dificuldade composto:
//   50% taxa de erro  |  30% tempo médio de resposta  |  20% volume absoluto de erros
// Se houver poucos dados (< 2 tentativas por tabuada), usa pool padrão.
export function getRevisionQuestions(tableStats, count = 15) {
  const entries = Object.entries(tableStats || {})
    .map(([a, s]) => {
      const total = (s.correct || 0) + (s.wrong || 0);
      const errRate = total > 0 ? (s.wrong || 0) / total : 0;
      // avgMs: tempo médio por acerto — mais lento = mais difícil (cap 6000ms)
      const avgMs = (s.count || 0) > 0 ? (s.totalMs || 0) / s.count : 3000;
      const msScore = Math.min(avgMs / 6000, 1);
      // volume absoluto de erros normalizado (cap 80 erros)
      const wrongVol = Math.min((s.wrong || 0) / 80, 1);
      const difficulty = errRate * 0.5 + msScore * 0.3 + wrongVol * 0.2;
      return { a: Number(a), difficulty, total };
    })
    .filter((t) => t.total >= 2)
    .sort((a, b) => b.difficulty - a.difficulty);

  const pool =
    entries.length >= 2
      ? entries.slice(0, Math.min(5, entries.length)).map((t) => t.a)
      : [2, 3, 4, 5, 6, 7, 8, 9];

  return Array.from({ length: count }, () => {
    const a = pool[Math.floor(Math.random() * pool.length)];
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, ans: a * b };
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

// Lista canônica dos 80 fatos fundamentais (chave normalizada min×max).
export function getAllFactKeys() {
  const keys = new Set();
  for (let a = 2; a <= 9; a++) {
    for (let b = 1; b <= 10; b++) {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      keys.add(`${lo}x${hi}`);
    }
  }
  return Array.from(keys);
}

// Decompõe uma chave "loxhi" → { a, b, ans }
export function parseFactKey(fk) {
  const [a, b] = fk.split('x').map(Number);
  return { a, b, ans: a * b };
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

// Lista de certificados desbloqueados (tabuadas 2..9).
// Retorna [{ table: 2..9, dominated, total: 10 }] com flag se já está completo.
export function computeCertificates(factStats = {}) {
  const result = [];
  for (let a = 2; a <= 9; a++) {
    let dominated = 0;
    for (let b = 1; b <= 10; b++) {
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      const fk = `${lo}x${hi}`;
      if (isFactDominated(factStats[fk])) dominated += 1;
    }
    result.push({
      table: a,
      dominated,
      total: 10,
      unlocked: dominated === 10,
    });
  }
  return result;
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
