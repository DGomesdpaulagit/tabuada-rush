// ── MOTOR DE LIGAS [v6.0 · Bloco 4] ──────────────────────────────────────────
// Substitui o antigo "Ranking de QI" (posição estática numa lista de 52
// personagens) por uma competição de verdade: 10 personagens simulados por
// liga + o jogador, ordenados por XP, com promoção/rebaixamento — ver
// sessions/planejamento-6.0.md seção 4 e DECISIONS.md.
import { LEAGUES, LEAGUE_MAP, LEAGUE_CHARACTERS } from '../constants/leagues';
import { todayStr } from './index';

// Hash determinístico string → inteiro (mesmo nome sempre gera a mesma
// "personalidade" pro personagem; mesmo nome+dia sempre gera o mesmo
// "chacoalho" do dia — sem precisar guardar nada no storage).
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
// mistura de ritmo/consistência. Não é sobre inteligência (isso já é a liga
// em que ele está), é sobre o quanto ele "joga".
function characterActivity(character) {
  return 0.4 + seededFloat(seedFromString(character.name)) * 0.5;
}

// XP simulado do personagem numa janela ROLANTE de ~14 dias (não é total
// vitalício de propósito — um personagem de liga alta não pode ficar
// matematicamente imbatível só por "existir há mais tempo"). Base cresce
// com o multiplicador da liga (Diamante > Bronze) + chacoalho diário
// determinístico (por isso o ranking dentro da liga oscila dia a dia, como
// o Davi descreveu no áudio — "uma hora tá o Bob Esponja em 1º...").
const XP_WINDOW_DAYS = 14;
const XP_DAILY_BASE = 60; // ~ritmo estimado de um jogador moderado (ver Bloco 3, D022)

function leagueMultiplier(leagueId) {
  const idx = LEAGUES.findIndex((l) => l.id === leagueId);
  if (idx < 0) return 1;
  return 0.7 + (idx / (LEAGUES.length - 1)) * 0.9; // 0.7 (Bronze) → 1.6 (Diamante)
}

export function getCharacterXp(character, today = todayStr()) {
  const activity = characterActivity(character);
  const base = XP_DAILY_BASE * XP_WINDOW_DAYS * activity * leagueMultiplier(character.league);
  const wobble = (seededFloat(seedFromString(character.name + today)) - 0.5) * base * 0.6; // ±30%
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

// Classificação completa da liga atual: 10 personagens + o jogador,
// ordenados por XP (desc). `playerRank` é 1-indexado.
export function getLeagueStandings(data) {
  const leagueId = LEAGUE_MAP[data.leagueId] ? data.leagueId : LEAGUES[0].id;
  const league = LEAGUE_MAP[leagueId];
  const today = todayStr();
  const entries = getLeagueCharacters(leagueId).map((c) => ({
    ...c,
    xp: getCharacterXp(c, today),
    isPlayer: false,
  }));
  entries.push({ name: 'Você', emoji: '🧑', isPlayer: true, xp: getPlayerLeagueXp(data) });
  entries.sort((a, b) => b.xp - a.xp);
  const playerRank = entries.findIndex((e) => e.isPlayer) + 1;
  return { league, entries, playerRank, total: entries.length };
}

// Avalia promoção/rebaixamento com base na posição ATUAL do jogador. Chamada
// só depois de cada partida (App.jsx handleGameEnd) — DE PROPÓSITO não é
// checada ao abrir o app, senão um jogador recém-promovido (0 XP na liga
// nova) seria rebaixado de volta na hora, sem nunca ter tido a chance de
// jogar ali (ver nota em AppContext.jsx). Isso significa que "não praticar"
// não derruba de liga sozinho por passagem do tempo — só na próxima partida
// jogada, se a posição ainda estiver ruim. Move NO MÁXIMO 1 liga por chamada
// de propósito — zera `leagueXpBase` ao mudar de liga, então promover e
// rebaixar na MESMA passada nunca acontece (chegou com 0 XP na liga nova,
// não cai na zona de rebaixamento por só ter acabado de entrar).
export function applyLeaguePromotion(data) {
  const { league, playerRank, total } = getLeagueStandings(data);
  const idx = LEAGUES.findIndex((l) => l.id === league.id);

  if (playerRank <= league.promotionCount && idx < LEAGUES.length - 1) {
    const newLeague = LEAGUES[idx + 1];
    return {
      data: { ...data, leagueId: newLeague.id, leagueXpBase: data.xp || 0 },
      promoted: true,
      relegated: false,
      newLeague,
    };
  }
  if (playerRank > total - league.relegationCount && idx > 0) {
    const newLeague = LEAGUES[idx - 1];
    return {
      data: { ...data, leagueId: newLeague.id, leagueXpBase: data.xp || 0 },
      promoted: false,
      relegated: true,
      newLeague,
    };
  }
  return { data, promoted: false, relegated: false, newLeague: null };
}
