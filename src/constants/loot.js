// ── BAÚS E DROPS DE PARTIDA [Fase 6 do PLANO_ACAO.md, sessão 071] ────────────
// Números exatos que o Davi deu no PLANO_ACAO.md. `intervalMin`/`intervalMax`
// é o "intervalo médio de partidas" de cada item — usado por utils/loot.js
// pra derivar tanto a chance individual (1/média) quanto o peso relativo
// dentro da própria categoria (baú/power-up/poção).
//
// ⚠️ CHECKLIST AO ADICIONAR ITEM DE LOOT NOVO AQUI (pedido explícito do
// Davi, sessão 073, D051): também adicionar o `id` na tabela `LOOT_GENDER`
// de `pages/PostGameSummary.jsx` (gênero gramatical da frase "Você ganhou
// um(a) [nome]" da página de recompensas) — sem isso cai no masculino por
// padrão, pode sair errado.

// [sessão 089] OURO e MÍSTICO ficaram mais raros (opção B do balanceamento,
// escolhida pelo Davi): `intervalMax` do Ouro 40 → 80 e do Místico 50 → 120.
// Isso NÃO muda a chance de cair um baú — muda o PESO no sorteio de QUAL baú
// é (ver `weightedPick` em utils/loot.js, peso = 1/intervalo médio).
// Efeito: dos baús sorteados, Místico cai de 12,3% pra 6,1% e Ouro de 15,3%
// pra 9,1%; o baú médio vai de 321 pra 236 moedas. Motivo: a medição da
// sessão 088 mostrou que os baús eram ~93% de toda a renda de moedas do jogo
// (ver D066/D067). As FAIXAS DE MOEDA de cada baú ficaram intactas de
// propósito — o Davi não quis mexer na sensação de prêmio.
export const CHESTS = [
  { id: 'bau-madeira', art: 'bau-madeira', name: 'Baú de Madeira',  intervalMin: 3,  intervalMax: 10,  coinMin: 10,  coinMax: 100 },
  { id: 'bau-ferro',   art: 'bau-ferro',   name: 'Baú de Ferro',    intervalMin: 1,  intervalMax: 25,  coinMin: 200, coinMax: 400 },
  { id: 'bau-ouro',    art: 'bau-ouro',    name: 'Baú de Ouro',     intervalMin: 1,  intervalMax: 80,  coinMin: 500, coinMax: 800 },
  { id: 'bau-mistico', art: 'bau-mistico', name: 'Baú Místico',     intervalMin: 1,  intervalMax: 120, coinFixed: 1000 },
];

// [Fase 7.1 bloco 2, sessão 087] Qual baú representa uma recompensa de N
// moedas. Usado pelas missões: cada uma mostra o baú do tier que combina com
// a SUA recompensa (uma diária de 40 moedas mostra madeira; um desafio mensal
// de 800, ouro).
//
// A regra é "o primeiro baú cujo TETO alcança o valor". Isso importa porque as
// faixas dos baús têm buracos (não existe baú de 101-199, nem de 401-499) e há
// missão caindo justamente neles — o desafio mensal de 450 moedas, por
// exemplo, vira Ouro. Deriva de `CHESTS` de propósito: mexeu nos valores dos
// baús, as missões acompanham sozinhas.
export function chestForCoins(coins) {
  const achado = CHESTS.find((c) => coins <= (c.coinFixed ?? c.coinMax));
  return (achado || CHESTS[CHESTS.length - 1]).id;
}

// `id` bate com `SHOP_ITEMS[i].id` (constants/shop.js) — loot só empresta o
// intervalo médio, nome/arte/powerupKey continuam vivendo só na Loja.
export const LOOT_POWERUPS = [
  { id: 'powerup_streak_insurance', intervalMin: 1, intervalMax: 15 },
  { id: 'powerup_mission_freeze',   intervalMin: 1, intervalMax: 5  },
  { id: 'powerup_life',             intervalMin: 1, intervalMax: 7  },
  { id: 'powerup_time',             intervalMin: 1, intervalMax: 10 },
  { id: 'powerup_shield',           intervalMin: 1, intervalMax: 10 },
  { id: 'powerup_headstart',        intervalMin: 1, intervalMax: 6  },
];

// `id` bate com `POTIONS[i].id` (constants/shop.js).
export const LOOT_POTIONS = [
  { id: 'pocao-xp-1', intervalMin: 4, intervalMax: 10 },
  { id: 'pocao-xp-2', intervalMin: 5, intervalMax: 15 },
  { id: 'pocao-xp-3', intervalMin: 1, intervalMax: 15 },
];

// Modificador por tempo REAL de jogo (minutos) — chance por CATEGORIA,
// em %. Acima de 100% vira "garantido + rolagem extra pelo excedente" (ver
// utils/loot.js `rollCount`) — é a leitura mais literal de "garantido, pode
// ser múltiplo" que o próprio PLANO_ACAO.md registra pro topo da tabela.
// Faixas 21-24min e 51+min não tinham número exato no plano original —
// tratadas como parte da faixa vizinha mais próxima (média/aproximação,
// o próprio Davi descreveu essas porcentagens como "uma média").
// [sessão 089] `chestPct` desceu um degrau em todas as faixas (o
// "empurrãozinho da opção A" que o Davi pediu junto com a B): 30→22, 50→40,
// 80→65, 100→90. `powerupPct`/`potionPct` NÃO mudaram — power-up e poção são
// consumíveis, não inflacionam a carteira, e o Davi só reclamou de moeda.
// Somando com a raridade nova do Ouro/Místico, a renda de baú cai ~45%.
export const TIME_TIERS = [
  { maxMin: 5,        chestPct: 22, powerupPct: 60,  potionPct: 50  },
  { maxMin: 20,       chestPct: 40, powerupPct: 90,  potionPct: 70  },
  { maxMin: 50,       chestPct: 65, powerupPct: 100, potionPct: 95  },
  { maxMin: Infinity, chestPct: 90, powerupPct: 200, potionPct: 195 },
];
