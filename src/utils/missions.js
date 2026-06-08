import {
  DAILY_MISSION_POOL,
  WEEKLY_MISSION_POOL,
  MONTHLY_MISSION_POOL,
} from '../constants/missions';

// ── Helpers de data ───────────────────────────────────────────────────────────

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function currentWeekStart() {
  const now = new Date();
  // Segunda-feira como início da semana
  const day = now.getDay(); // 0=Dom, 1=Seg...
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split('T')[0];
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// ── Seleção determinística de missões ─────────────────────────────────────────
// Usa um LCG simples para escolher N missões distintas a partir de um seed.
function pickMissions(pool, n, seed) {
  const result = [];
  const used = new Set();
  let s = Math.abs(seed) || 1;
  const max = pool.length;
  while (result.length < Math.min(n, max)) {
    s = ((s * 1664525) + 1013904223) & 0x7fffffff;
    const idx = s % max;
    if (!used.has(idx)) {
      used.add(idx);
      result.push({
        ...pool[idx],
        progress: 0,
        completed: false,
        rewardClaimed: false,
      });
    }
  }
  return result;
}

function dateSeed(str) {
  // Converte uma string de data/chave num seed numérico estável
  return str.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

// ── Inicializadores por período ───────────────────────────────────────────────

function initDaily(date, frozenCarryOver = []) {
  // Missões congeladas do dia anterior carregam progresso intacto. Limpa o
  // flag `frozen` para que voltem ao ciclo normal a partir de agora.
  const fresh = pickMissions(DAILY_MISSION_POOL, 3, dateSeed(date));
  const carried = frozenCarryOver
    .filter((m) => m.frozen && !m.rewardClaimed)
    .map((m) => ({ ...m, frozen: false }));
  // Evita duplicatas se o sorteio do dia repetir uma carregada
  const carriedIds = new Set(carried.map((m) => m.id));
  const filteredFresh = fresh.filter((m) => !carriedIds.has(m.id));
  return { date, missions: [...carried, ...filteredFresh].slice(0, 3 + carried.length) };
}

function initWeekly(weekStart) {
  return { weekStart, missions: pickMissions(WEEKLY_MISSION_POOL, 2, dateSeed(weekStart) + 7777) };
}

function initMonthly(month) {
  return { month, missions: pickMissions(MONTHLY_MISSION_POOL, 2, dateSeed(month) + 99999) };
}

// ── Obter missões ativas (com reset automático) ───────────────────────────────
// Chamada a cada leitura: verifica se o período mudou e reinicia se necessário,
// preservando progresso das missões que NÃO mudaram de período.
export function getActiveMissions(missionsData) {
  const today    = todayStr();
  const weekStr  = currentWeekStart();
  const monthStr = currentMonthKey();

  const md = missionsData || {};

  const daily   = (!md.daily   || md.daily.date      !== today)
    ? initDaily(today, md.daily?.missions || [])
    : md.daily;
  const weekly  = (!md.weekly  || md.weekly.weekStart !== weekStr)  ? initWeekly(weekStr)    : md.weekly;
  const monthly = (!md.monthly || md.monthly.month    !== monthStr) ? initMonthly(monthStr)  : md.monthly;

  return { daily, weekly, monthly };
}

// ── Atualizar progresso de uma missão com base no resultado da partida ────────
function updateOne(mission, result, currentStreak) {
  if (mission.completed) return mission;

  const sessionTotal = (result.correct || 0) + (result.wrong || 0);
  const sessionAcc   = sessionTotal > 0
    ? Math.round(((result.correct || 0) / sessionTotal) * 100)
    : 0;

  let p = mission.progress;

  switch (mission.type) {
    case 'play':
      p = p + 1;
      break;
    case 'daily':
      if (result.mode === 'daily') p = p + 1;
      break;
    case 'streak':
      p = Math.max(p, result.bestStreak || 0);
      break;
    case 'accuracy':
      if (sessionAcc >= mission.target) p = mission.target;
      break;
    case 'score':
      if ((result.score || 0) >= mission.target) p = mission.target;
      break;
    case 'correct_single':
      p = Math.max(p, result.correct || 0);
      break;
    case 'correct_day':
    case 'correct_week':
    case 'correct_month':
      p = p + (result.correct || 0);
      break;
    case 'streak_month':
      p = Math.max(p, currentStreak || 0);
      break;
    default:
      break;
  }

  const progress  = Math.min(p, mission.target);
  const completed = progress >= mission.target;
  return { ...mission, progress, completed };
}

// ── Atualizar todas as missões após uma partida ───────────────────────────────
export function updateMissions(missionsData, result, currentStreak) {
  const active = getActiveMissions(missionsData);
  const upd = (list) => list.map((m) => updateOne(m, result, currentStreak));

  return {
    daily:   { ...active.daily,   missions: upd(active.daily.missions) },
    weekly:  { ...active.weekly,  missions: upd(active.weekly.missions) },
    monthly: { ...active.monthly, missions: upd(active.monthly.missions) },
  };
}

// ── Contar missões completadas e sem resgate ──────────────────────────────────
export function countUnclaimedMissions(missionsData) {
  const active = getActiveMissions(missionsData);
  let count = 0;
  const check = (ms) => ms.forEach((m) => { if (m.completed && !m.rewardClaimed) count++; });
  check(active.daily.missions);
  check(active.weekly.missions);
  check(active.monthly.missions);
  return count;
}

// ── Missões que acabaram de ser concluídas (para toast) ───────────────────────
// Compara antes e depois e retorna as que ficaram completed=true agora.
export function getNewlyCompleted(before, after) {
  const flat = (md) => {
    const a = getActiveMissions(md);
    return [
      ...a.daily.missions,
      ...a.weekly.missions,
      ...a.monthly.missions,
    ];
  };
  const beforeMap = Object.fromEntries(flat(before).map((m) => [m.id, m.completed]));
  return flat(after).filter((m) => m.completed && !beforeMap[m.id]);
}

// ── Congelar missão diária (carry-over para o próximo dia) ───────────────────
// Marca `frozen: true` na missão. No próximo reset diário, a missão será
// preservada (com progresso) e voltará ao ciclo normal — `frozen` é zerado.
export function freezeMission(missionsData, missionId) {
  const active = getActiveMissions(missionsData);
  const missions = active.daily.missions.map((m) =>
    m.id === missionId ? { ...m, frozen: true } : m
  );
  return { ...active, daily: { ...active.daily, missions } };
}

// ── Resgatar recompensa de missão ─────────────────────────────────────────────
export function claimMission(missionsData, period, missionId) {
  const active = getActiveMissions(missionsData);
  const section = active[period];
  if (!section) return missionsData;
  const missions = section.missions.map((m) =>
    m.id === missionId ? { ...m, rewardClaimed: true } : m
  );
  return { ...active, [period]: { ...section, missions } };
}
