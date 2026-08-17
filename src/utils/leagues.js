// ── MOTOR DE LIGAS [v6.0 · Bloco 4, recalibrado 2026-08-17] ──────────────────
// Substitui o antigo "Ranking de QI" (posição estática numa lista de 52
// personagens) por uma competição de verdade: personagens simulados por liga
// + o jogador, ordenados por XP, com promoção/rebaixamento — ver
// sessions/planejamento-6.0.md seção 4, sessions/sessao-052.md e
// DECISIONS.md D030 pro recalibramento pós-reset.
//
// MODELO DE TEMPO (pedido explícito do Davi na recalibração):
//   - XP simulado dos personagens atualiza a cada 12h (2x por dia)
//   - Promoção/rebaixamento (e pódio) só é AVALIADO uma vez por CICLO de 6
//     dias — não mais a cada partida/load. `getCurrentCycle()` é um relógio
//     GLOBAL (mesmo pra todo mundo, baseado numa época fixa), então todas as
//     ligas — não só a do jogador — estão "rodando" o mesmo ciclo o tempo
//     todo (mesmo se ele não estiver vendo). Ver applyLeaguePromotion.
import { LEAGUES, LEAGUE_MAP, LEAGUE_CHARACTERS } from '../constants/leagues';
import { todayStr } from './index';

// Hash determinístico string → inteiro (mesmo nome sempre gera a mesma
// "personalidade" pro personagem; mesma string+período sempre gera o mesmo
// "chacoalho" — sem precisar guardar nada no storage).
function seedFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 31) + str.charCodeAt(i)) >>> 0;
  return h || 1;
}
function seededFloat(seed) {
  let x = seed;
  x ^= x << 13; x >>>= 0;
  x ^= x >>> 17;
  x ^= x << 5; x >>>= 0;
  return (x >>> 0) / 0xffffffff;
}

// "Nível de atividade" fixo do personagem (0.4–0.9), sorteado 1x por nome —
// mistura de ritmo/consistência. Personagens de liga alta (Diamante etc.)
// já têm um multiplicador de liga bem maior por cima disso (ver
// leagueMultiplier) — a intenção do Davi é que lá em cima o personagem
// "viva dentro do jogo, jogue toda hora" (ex. Einstein), quase impossível
// de destronar; embaixo (Bronze) tem gente tipo o Patrick Estrela que quase
// não pontua.
function characterActivity(character) {
  return 0.4 + seededFloat(seedFromString(character.name)) * 0.5;
}

// [v6.0 · Bloco 4] XP simulado do personagem — atualiza a cada 12h (não é
// contínuo nem vitalício: janela ROLANTE, senão personagem de liga alta
// vira matematicamente imbatível só por "existir há mais tempo"). Base
// cresce com o multiplicador da liga (Diamante >> Bronze) + chacoalho que
// muda 2x por dia (por isso o ranking oscila, como o Davi descreveu —
// "uma hora tá o Bob Esponja em 1º...").
const XP_WINDOW_DAYS = 14;
const XP_DAILY_BASE = 100; // ~ritmo estimado de um jogador moderado (ver D022/D030)

function halfDaySlot() {
  const h = new Date().getHours();
  return `${todayStr()}-${h < 12 ? 'AM' : 'PM'}`;
}

function leagueMultiplier(leagueId) {
  const idx = LEAGUES.findIndex((l) => l.id === leagueId);
  if (idx < 0) return 1;
  // 0.7 (Bronze) → 2.2 (Diamante) — faixa mais larga que antes: personagens
  // do topo precisam ser MUITO mais difíceis de superar (pedido do Davi).
  return 0.7 + (idx / (LEAGUES.length - 1)) * 1.5;
}

export function getCharacterXp(character, slot = halfDaySlot()) {
  const activity = characterActivity(character);
  const base = XP_DAILY_BASE * XP_WINDOW_DAYS * activity * leagueMultiplier(character.league);
  const wobble = (seededFloat(seedFromString(character.name + slot)) - 0.5) * base * 0.6; // ±30%
  return Math.max(0, Math.round(base + wobble));
}

export function getLeagueCharacters(leagueId) {
  return LEAGUE_CHARACTERS.filter((c) => c.league === leagueId);
}

// XP do jogador DENTRO da liga atual — desde que entrou nela (leagueXpBase),
// não o XP vitalício. Mesmo princípio do streakGoalBase pra meta de ofensiva.
export function getPlayerLeagueXp(data) {
  return Math.max(0, (data.xp || 0) - (data.leagueXpBase || 0));
}

// Classificação completa da liga atual: todos os personagens do pote dessa
// liga + o jogador, ordenados por XP (desc). `playerRank` é 1-indexado.
// Funciona pra QUALQUER liga (não só a do jogador) — passe `leagueIdOverride`
// pra consultar outra (a arquitetura já suporta "ver outras divisões", ainda
// não decidido se vira UI — ver planejamento-6.0.md).
export function getLeagueStandings(data, leagueIdOverride = null) {
  const leagueId = leagueIdOverride || (LEAGUE_MAP[data.leagueId] ? data.leagueId : LEAGUES[0].id);
  const league = LEAGUE_MAP[leagueId];
  const slot = halfDaySlot();
  const entries = getLeagueCharacters(leagueId).map((c) => ({
    ...c,
    xp: getCharacterXp(c, slot),
    isPlayer: false,
  }));
  const isPlayersLeague = leagueId === (data.leagueId || LEAGUES[0].id);
  if (isPlayersLeague) {
    entries.push({ name: 'Você', emoji: '🧑', isPlayer: true, xp: getPlayerLeagueXp(data) });
  }
  entries.sort((a, b) => b.xp - a.xp);
  const playerRank = isPlayersLeague ? entries.findIndex((e) => e.isPlayer) + 1 : null;
  return { league, entries, playerRank, total: entries.length };
}

const PODIUM_RANK = 3;

// Empacota a troca de liga (promoção ou rebaixamento): reseta o XP-base, o
// flag de pódio e marca a data de entrada (informativo).
function enterLeague(data, newLeagueId) {
  return {
    ...data,
    leagueId: newLeagueId,
    leagueXpBase: data.xp || 0,
    leaguePodiumClaimed: false,
    leagueEnteredAt: todayStr(),
  };
}

// [v6.0 · recalibração 2026-08-17] Relógio GLOBAL de ciclos de 6 dias — não
// depende de quando o jogador entrou na liga, é o mesmo pra todo mundo (e
// pra todas as ligas, mesmo as que o jogador não está vendo — o Davi foi
// explícito: "todas vão ter essa oscilação", não só a do jogador).
const CYCLE_DAYS = 6;
const LEAGUE_EPOCH_MS = new Date('2026-01-01T00:00:00Z').getTime();

export function getCurrentCycle() {
  const days = Math.floor((Date.now() - LEAGUE_EPOCH_MS) / 86400000);
  return Math.floor(days / CYCLE_DAYS);
}

// Avalia promoção/rebaixamento/pódio com base na posição do jogador — mas
// SÓ UMA VEZ POR CICLO (6 dias, ver getCurrentCycle). Chamar isso a cada
// partida OU a cada load do app é seguro: se o ciclo atual já foi avaliado
// (`leagueLastCycleChecked`), é um no-op instantâneo. Isso também resolve
// de vez o bug de "ping-pong" documentado em D023/D027 (jogador promovido
// sendo rebaixado de volta na hora) — como só existe UMA avaliação por
// ciclo, não tem como promover e reavaliar na mesma passada nunca mais.
export function applyLeaguePromotion(data) {
  const cycle = getCurrentCycle();
  const noop = { data, promoted: false, relegated: false, newLeague: null, podiumAchieved: false };
  if (data.leagueLastCycleChecked === cycle) return noop;

  const { league, playerRank, total } = getLeagueStandings(data);
  const idx = LEAGUES.findIndex((l) => l.id === league.id);

  let base = { ...data, leagueLastCycleChecked: cycle };

  let podiumAchieved = false;
  if (playerRank <= PODIUM_RANK && !data.leaguePodiumClaimed) {
    base = { ...base, leaguePodiums: (data.leaguePodiums || 0) + 1, leaguePodiumClaimed: true };
    podiumAchieved = true;
  }

  // [pendência pós-reset] Pódio da Diamante dá bônus de XP enquanto durar —
  // reavaliado a cada ciclo (6 dias), consumido em App.jsx handleGameEnd.
  base = { ...base, diamondPodiumActive: league.id === 'diamante' && playerRank <= PODIUM_RANK };

  if (playerRank <= league.promotionCount && idx < LEAGUES.length - 1) {
    const newLeague = LEAGUES[idx + 1];
    return { data: enterLeague(base, newLeague.id), promoted: true, relegated: false, newLeague, podiumAchieved };
  }
  // Nunca cai mais de 1 liga por ciclo (pedido explícito do Davi).
  if (playerRank > total - league.relegationCount && idx > 0) {
    const newLeague = LEAGUES[idx - 1];
    return { data: enterLeague(base, newLeague.id), promoted: false, relegated: true, newLeague, podiumAchieved };
  }
  return { data: base, promoted: false, relegated: false, newLeague: null, podiumAchieved };
}
