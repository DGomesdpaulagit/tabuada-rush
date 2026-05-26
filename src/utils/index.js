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

// ── SCORING ────────────────────────────────────────────────────────────────

export function calcPoints(diffLevel, streak) {
  const base = 10;
  const diff = (diffLevel - 1) * 5;
  const combo = streak >= 5 ? Math.floor(streak / 5) * 2 : 0;
  return base + diff + combo;
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
export function computeQI(data = {}) {
  const totalCorrect = data.totalCorrect || 0;
  const totalWrong = data.totalWrong || 0;
  const answered = totalCorrect + totalWrong;

  const acc = answered > 0 ? totalCorrect / answered : 0;
  const accPts = acc * 40;                                          // precisão (lifetime)
  const bestAccPts = ((data.bestAccuracy || 0) / 100) * 10;          // melhor precisão
  const speedPts = (Math.min(data.speedBest || 0, 30) / 30) * 20;    // velocidade (modo Velocidade)
  const streakPts =
    (Math.min(data.bestDayStreak || 0, 30) / 30) * 15 +              // ofensiva (recorde)
    (Math.min(data.currentStreak || 0, 15) / 15) * 5;                // ofensiva (atual)
  const consistencyPts = (Math.min(data.totalGames || 0, 50) / 50) * 20; // consistência
  const levelIdx = getLevelIdx(data.xp || 0);
  const progressPts = (levelIdx / (LEVELS.length - 1)) * 30;         // progresso geral

  const bonus = data.qiBonus || 0; // bônus de QI ganho em recompensas de ofensiva
  const raw = QI_MIN + accPts + bestAccPts + speedPts + streakPts + consistencyPts + progressPts + bonus;
  return Math.max(QI_MIN, Math.min(QI_MAX, Math.round(raw)));
}

// Reinicia a ofensiva se o usuário perdeu um dia OU virou o ano (conquistas e
// recordes NÃO são afetados). Deve rodar ao abrir o app / logar.
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
    return { ...data, currentStreak: 0, streakGoalBase: 0 };
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
