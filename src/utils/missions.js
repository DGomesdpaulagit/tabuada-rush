import { DAILY_MISSION_POOL, MONTHLY_CHALLENGE_POOL } from '../constants/missions';
import { penalizarMissoes } from './relegation';

// ── Helpers de data ───────────────────────────────────────────────────────────

function dataLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayStr() {
  // Data LOCAL — ver nota em utils/index.js localDateStr (D040). Antes era
  // toISOString(), que fazia o dia virar 3h antes no Brasil.
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function currentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Último dia do mês ATUAL, como string ISO (prazo padrão de um desafio
// mensal aceito hoje).
function endOfMonthStr() {
  const now = new Date();
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return dataLocal(last);
}

function addDaysStr(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return dataLocal(d);
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

// [v6.0 · Bloco 5] Desafios mensais: `pool` (2 opções sorteadas por mês, pra
// aceitar) é renovado toda virada de mês; `accepted` (os que o jogador
// aceitou) NÃO é resetado — um desafio aceito continua valendo em "Mensais"
// até seu próprio prazo passar, mesmo que isso ultrapasse a virada do mês
// (ex.: desafio congelado com +10 dias de prazo). Ver planejamento-6.0.md
// seção 7.
function initMonthlyPool(month, prevAccepted = []) {
  return {
    month,
    pool: pickMissions(MONTHLY_CHALLENGE_POOL, 2, dateSeed(month) + 99999),
    accepted: prevAccepted,
  };
}

// ── Obter missões/desafios ativos (com reset automático) ──────────────────────
// Chamada a cada leitura: verifica se o período mudou e reinicia se necessário,
// preservando progresso das missões que NÃO mudaram de período.
export function getActiveMissions(missionsData, opcoes = {}) {
  // [sessão 097] `opcoes.zonaRebaixamento` deixa as missões mais difíceis e
  // mais bem pagas enquanto o jogador está na zona (ver utils/relegation.js).
  // Aplico na LEITURA, não no save: o progresso guardado continua sendo o
  // real, e sair da zona devolve as missões ao normal sem migração nenhuma.
  const today    = todayStr();
  const monthStr = currentMonthKey();

  const md = missionsData || {};

  const daily = (!md.daily || md.daily.date !== today)
    ? initDaily(today, md.daily?.missions || [])
    : md.daily;
  // [v6.0 · Bloco 5] `Array.isArray(md.monthly.accepted)` detecta o formato
  // ANTIGO (pré-Bloco 5: `{ month, missions }`, sem `pool`/`accepted`) — sem
  // essa checagem, um usuário com dado salvo de antes do Bloco 5 e no MESMO
  // mês corrente ficava com `monthly` no formato velho (sem `accepted`), e
  // `resolveChallenges`/`accepted.map(...)` quebrava o app inteiro no load
  // (bug real encontrado em produção — TypeError "Cannot read properties of
  // undefined (reading 'map')"). Migra pro formato novo automaticamente.
  const monthly = (!md.monthly || md.monthly.month !== monthStr || !Array.isArray(md.monthly.accepted))
    ? initMonthlyPool(monthStr, Array.isArray(md.monthly?.accepted) ? md.monthly.accepted : [])
    : md.monthly;

  if (opcoes.zonaRebaixamento) {
    return {
      daily: { ...daily, missions: penalizarMissoes(daily.missions, true) },
      monthly: { ...monthly, accepted: penalizarMissoes(monthly.accepted, true) },
    };
  }
  return { daily, monthly };
}

// ── Atualizar progresso de uma missão/desafio com base no resultado da partida ─
// ⚠️ [6.1, sessão 100] TRÊS REGRAS QUE PRECISAM ANDAR JUNTAS — ver o bug
// abaixo antes de mexer em qualquer uma delas.
//
// O BUG: na ZONA DE REBAIXAMENTO as 7 missões ficavam IMPOSSÍVEIS. O alvo é
// penalizado na LEITURA (`penalizarMissao`, alvo ×1,5), mas o progresso era
// gravado com `Math.min(p, mission.target)` usando o alvo NORMAL. Resultado:
// a barra travava no alvo normal e nunca alcançava o alvo mostrado —
// "5 / 8 partidas" com 8 partidas jogadas, pra sempre. Reproduzido: 7 de 7.
//
// O `getActiveMissions` já dizia qual era o desenho certo ("aplico na
// LEITURA, não no save: o progresso guardado continua sendo o real") — o
// teto é que quebrava essa promessa. As correções:
//
//   1. Sem teto no save. `progress` guarda o valor REAL, que pode passar do
//      alvo. Quem exibe é que corta (`progressCompact`/`progressLabel` na
//      MissionsPage; as barras já usavam `Math.min(pct, 100)`).
//   2. Sem parada ao completar. O `if (mission.completed) return mission`
//      congelava o progresso no alvo normal — mesmo efeito do teto, por
//      outro caminho. Missão completa continua acumulando; `completed` é
//      recalculado, e `rewardClaimed` é que controla o resgate.
//   3. `accuracy` e `score` gravam a MEDIDA, não o alvo. Antes faziam
//      `p = mission.target` (tudo ou nada), então na zona nunca chegavam ao
//      alvo penalizado. De quebra, a barra passou a ser informativa: quem
//      fez 88% numa missão de 90% vê "88 / 90" em vez de "0 / 90".
function updateOne(mission, result, currentStreak) {
  const sessionTotal = (result.correct || 0) + (result.wrong || 0);
  const sessionAcc   = sessionTotal > 0
    ? Math.round(((result.correct || 0) / sessionTotal) * 100)
    : 0;

  let p = mission.progress;

  switch (mission.type) {
    case 'play':
      p = p + 1;
      break;
    case 'streak':
      p = Math.max(p, result.bestStreak || 0);
      break;
    case 'accuracy':
      p = Math.max(p, sessionAcc);
      break;
    case 'score':
      p = Math.max(p, result.score || 0);
      break;
    case 'correct_single':
      p = Math.max(p, result.correct || 0);
      break;
    case 'correct_day':
    case 'correct_month':
      p = p + (result.correct || 0);
      break;
    case 'streak_month':
      p = Math.max(p, currentStreak || 0);
      break;
    default:
      break;
  }

  // Sem `Math.min` de propósito (regra 1 acima): o valor guardado é o real,
  // pra continuar valendo quando o alvo mostrado muda (zona de rebaixamento).
  const completed = p >= mission.target;
  return { ...mission, progress: p, completed };
}

// ── Atualizar todas as missões/desafios após uma partida ──────────────────────
export function updateMissions(missionsData, result, currentStreak) {
  const active = getActiveMissions(missionsData);
  const upd = (list) => list.map((m) => updateOne(m, result, currentStreak));

  return {
    daily: { ...active.daily, missions: upd(active.daily.missions) },
    monthly: {
      ...active.monthly,
      accepted: active.monthly.accepted.map((c) =>
        c.resolved ? c : updateOne(c, result, currentStreak)
      ),
    },
  };
}

// ── Contar missões diárias completadas e sem resgate ───────────────────────────
// (desafios mensais não têm "resgate" manual — resolvem sozinhos no prazo,
// ver resolveChallenges)
export function countUnclaimedMissions(missionsData) {
  const active = getActiveMissions(missionsData);
  return active.daily.missions.filter((m) => m.completed && !m.rewardClaimed).length;
}

// ── Missões diárias que acabaram de ser concluídas (para toast) ───────────────
export function getNewlyCompleted(before, after) {
  const flat = (md) => getActiveMissions(md).daily.missions;
  const beforeMap = Object.fromEntries(flat(before).map((m) => [m.id, m.completed]));
  return flat(after).filter((m) => m.completed && !beforeMap[m.id]);
}

// ── Congelar missão diária (carry-over para o próximo dia) ───────────────────
export function freezeMission(missionsData, missionId) {
  const active = getActiveMissions(missionsData);
  const missions = active.daily.missions.map((m) =>
    m.id === missionId ? { ...m, frozen: true } : m
  );
  return { ...active, daily: { ...active.daily, missions } };
}

// ── Resgatar recompensa de missão diária ──────────────────────────────────────
export function claimMission(missionsData, missionId) {
  const active = getActiveMissions(missionsData);
  const missions = active.daily.missions.map((m) =>
    m.id === missionId ? { ...m, rewardClaimed: true } : m
  );
  return { ...active, daily: { ...active.daily, missions } };
}

// ── DESAFIOS MENSAIS [v6.0 · Bloco 5] ─────────────────────────────────────────

// Aceita um desafio do pool do mês — vira "ativo", com prazo até o fim do mês
// atual. Não faz nada se já foi aceito (ou já não está mais no pool).
export function acceptChallenge(missionsData, challengeId) {
  const active = getActiveMissions(missionsData);
  const def = active.monthly.pool.find((c) => c.id === challengeId);
  if (!def) return active;
  const already = active.monthly.accepted.some((c) => c.id === challengeId && !c.resolved);
  if (already) return active;
  const accepted = [
    ...active.monthly.accepted,
    {
      ...def,
      acceptedAt: todayStr(),
      deadline: endOfMonthStr(),
      frozen: false,
      resolved: false,
      won: null,
    },
  ];
  return { ...active, monthly: { ...active.monthly, accepted } };
}

// Congela um desafio aceito — estende o prazo em 10 dias. Só funciona 1x por
// desafio (não empilha congelamentos) e só antes de resolver.
export function freezeChallenge(missionsData, challengeId) {
  const active = getActiveMissions(missionsData);
  const accepted = active.monthly.accepted.map((c) =>
    c.id === challengeId && !c.resolved && !c.frozen
      ? { ...c, frozen: true, deadline: addDaysStr(c.deadline, 10) }
      : c
  );
  return { ...active, monthly: { ...active.monthly, accepted } };
}

// Resolve desafios aceitos cujo PRAZO passou (independente de terem virado o
// mês ou não — um desafio congelado pode resolver só no mês seguinte, ver
// planejamento-6.0.md seção 7). Chamada no load do app e em fim de partida.
// Retorna o missionsData atualizado + a lista de resoluções desta chamada
// (pra quem chamar aplicar moeda e mostrar toast).
export function resolveChallenges(missionsData) {
  const active = getActiveMissions(missionsData);
  const today = todayStr();
  const resolutions = [];
  const accepted = active.monthly.accepted.map((c) => {
    if (c.resolved || today <= c.deadline) return c;
    const won = c.progress >= c.target;
    resolutions.push({ challenge: c, won });
    return { ...c, resolved: true, won };
  });
  return { missionsData: { ...active, monthly: { ...active.monthly, accepted } }, resolutions };
}
