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
  missaoAlvoPrecisao: 5, // ...menos as de PRECISÃO: +5 pontos percentuais (ver penalizarMissao)
  missaoRecompensa: 2,   // ...mas pagam o dobro de multis
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
// [6.1, sessão 100] O título e a descrição também precisam acompanhar o alvo.
// Sem isso o card se contradizia em três lugares ao mesmo tempo: título
// "120 Acertos", descrição "Acerte 120 contas no total hoje" e barra
// "0 / 180". Era o "números errados" que o Davi reportou.
//
// Troco só o número que É o alvo base, comparando token por token — nada de
// `replace` cego (que estragaria "1 a cada 8 acertos") e nada de lookbehind
// (`(?<!\d)`), que quebra o app inteiro no Safari antigo.
function trocarAlvoNoTexto(texto, alvoBase, alvoNovo) {
  if (!texto) return texto;
  // A dica de ritmo sai: ela foi calibrada pro alvo BASE ("~50/dia" deixa de
  // valer quando o alvo sobe 50%), então mantê-la seria mais um número errado.
  const semDica = texto.replace(/\s*\(~[^)]*\)/g, '');
  // Casa número com separador de milhar ("1.500") ou sem ("120") — sem isso
  // o "1.500 Acertos" virava os tokens "1" e "500" e nunca era trocado.
  return semDica.replace(/\d{1,3}(?:\.\d{3})+|\d+/g, (n) => {
    if (Number(n.replace(/\./g, '')) !== alvoBase) return n;
    return n.includes('.') ? alvoNovo.toLocaleString('pt-BR') : String(alvoNovo);
  });
}

export function penalizarMissao(missao) {
  // ⚠️ Missão de PRECISÃO tem alvo em PORCENTAGEM, então ×1,5 não serve:
  // 80% viraria 120%, impossível. A regra anterior era "teto de 98%", e ela
  // tinha dois problemas que só apareceram na revisão da 6.1 (sessão 100):
  //
  //   1. **Era quase impossível.** 98% é errar 1 conta em 60. O comentário
  //      antigo já dizia que 100% seria "cruel demais" — 98% estava colado.
  //   2. **Achatava as duas missões numa só.** 80% e 90% batiam as duas no
  //      teto, então quem tirasse as duas no mesmo dia via dois cards
  //      idênticos ("Precisão de 98%" duas vezes).
  //
  // Agora a penalidade de precisão é em PONTOS PERCENTUAIS (+5, teto 95),
  // não em porcentagem do alvo: 80 → 85 e 90 → 95. Continua mais duro,
  // continua pagando o dobro, e as duas seguem diferentes uma da outra.
  const alvo =
    missao.type === 'accuracy'
      ? Math.min(95, missao.target + PENALIDADES.missaoAlvoPrecisao)
      : Math.ceil(missao.target * PENALIDADES.missaoAlvo);
  return {
    ...missao,
    target: alvo,
    title: trocarAlvoNoTexto(missao.title, missao.target, alvo),
    desc: trocarAlvoNoTexto(missao.desc, missao.target, alvo),
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
