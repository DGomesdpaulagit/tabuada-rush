import { LEAGUES, LEAGUE_MAP } from '../constants/leagues';
import { getLeagueStandings } from './leagues';

// ── ZONA DE REBAIXAMENTO: AS PENALIDADES [sessão 097] ───────────────────────
// Ideia do Davi: "quero que o usuário tenha MEDO de entrar na zona de
// rebaixamento". Enquanto ele estiver lá, o jogo inteiro fica mais duro —
// e as regras moram todas aqui, num lugar só, pra não se contradizerem.
//
// Os números vieram da arte que ele mesmo fez: "XP -50%" e "25%".
export const PENALIDADES = {
  xp: 0.5,               // ganha metade do XP
  loot: 0.25,            // 25% da chance normal de baú, power-up e poção
  missaoAlvo: 1.5,       // missões pedem 50% a mais
  missaoRecompensa: 2,   // ...mas pagam o dobro de moedas
};

// A Bronze não tem divisão abaixo dela (`relegationCount: 0`), mas o Davi foi
// explícito: ela TAMBÉM sofre as penalidades — "temos que fazer o usuário não
// querer de forma alguma ir pra zona de rebaixamento". Então lá a zona existe
// como as últimas posições, só que sem queda de divisão no fim do ciclo.
export const ZONA_BRONZE = 5;

export function tamanhoDaZona(league) {
  return league?.relegationCount || ZONA_BRONZE;
}

// Primeira posição (1-based) que já conta como zona de rebaixamento.
export function primeiraPosicaoDaZona(total, league) {
  return total - tamanhoDaZona(league) + 1;
}

// Posição informada OU a atual do jogador. Aceita `standings` pronto pra não
// recalcular a classificação inteira quem já tem ela em mãos.
export function emZonaDeRebaixamento(data = {}, standings = null) {
  const { league, playerRank, total } = standings || getLeagueStandings(data);
  if (!playerRank || !total) return false;
  return playerRank >= primeiraPosicaoDaZona(total, league);
}

// Multiplicadores prontos pra quem calcula XP e loot.
export function multiplicadorXp(data, standings = null) {
  return emZonaDeRebaixamento(data, standings) ? PENALIDADES.xp : 1;
}

export function multiplicadorLoot(data, standings = null) {
  return emZonaDeRebaixamento(data, standings) ? PENALIDADES.loot : 1;
}

// Missão com a penalidade aplicada: alvo maior, recompensa maior.
//
// ⚠️ O BAÚ DA MISSÃO ACOMPANHA SOZINHO e isso é de propósito: o tier vem de
// `chestForCoins(recompensa)` (constants/loot.js), então dobrar a recompensa
// pode subir o baú de Madeira pra Ferro, por exemplo. Era exatamente o pedido
// do Davi ("com a interação dos baús lá, não esqueça disso nunca").
//
// O `completed` é recalculado porque o alvo mudou: uma missão que estava
// concluída com o alvo normal volta a ficar em andamento com o alvo penalizado
// — o que é justo, já que a recompensa dela também dobrou.
export function penalizarMissao(missao) {
  // ⚠️ Missão de PRECISÃO tem alvo em PORCENTAGEM: multiplicar por 1,5 dava
  // "Precisão de 135%", que é impossível de cumprir. Nessas, o alvo sobe só
  // até o teto de 98% (100% seria partida perfeita, cruel demais) — e a
  // recompensa dobra igual.
  const alvo =
    missao.type === 'accuracy'
      ? Math.min(98, Math.ceil(missao.target * PENALIDADES.missaoAlvo))
      : Math.ceil(missao.target * PENALIDADES.missaoAlvo);
  return {
    ...missao,
    target: alvo,
    reward: Math.round((missao.reward || 0) * PENALIDADES.missaoRecompensa),
    completed: (missao.progress || 0) >= alvo,
    penalizada: true,
  };
}

export function penalizarMissoes(lista = [], naZona = false) {
  return naZona ? lista.map(penalizarMissao) : lista;
}

// A liga TEM divisão abaixo? (a Bronze não tem — lá a zona pune, mas não
// rebaixa de verdade)
export function temDivisaoAbaixo(leagueId) {
  const idx = LEAGUES.findIndex((l) => l.id === leagueId);
  return idx > 0;
}

// Chave do dia, pro painel aparecer UMA vez por dia (e não a cada abertura).
export function chaveDoDia(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// Deve mostrar o painel de aviso agora? Só se está na zona, ainda não viu
// hoje e não pediu pra não ver mais.
export function deveAvisarDaZona(data = {}, standings = null) {
  if (data.zonaAvisoDesligado) return false;
  if (!emZonaDeRebaixamento(data, standings)) return false;
  return data.zonaAvisoVistoEm !== chaveDoDia();
}

export { LEAGUE_MAP };
