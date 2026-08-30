import { CHESTS, LOOT_POWERUPS, LOOT_POTIONS, TIME_TIERS } from '../constants/loot';

// ── SORTEIO DE RECOMPENSAS POR PARTIDA [Fase 6, sessão 071] ──────────────────
// Diferente da loja rotativa (utils/shop.js, determinística por data): aqui o
// sorteio é aleatório de verdade a cada partida — "essas probabilidades são
// uma média", o Davi foi explícito que dá pra vir logo na 1ª partida do dia
// por sorte (raro, mas possível). Isso descarta de cara um sistema de
// "contador até garantir": cada partida é uma rolagem independente.

function avgInterval(entry) {
  return (entry.intervalMin + entry.intervalMax) / 2;
}

// Escolhe 1 item de uma lista, com peso = 1/intervalo médio (quem tem
// intervalo menor — cai com mais frequência — pesa mais no sorteio).
function weightedPick(entries) {
  const weights = entries.map((e) => 1 / avgInterval(e));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < entries.length; i++) {
    r -= weights[i];
    if (r <= 0) return entries[i];
  }
  return entries[entries.length - 1];
}

// Uma chance em % pode passar de 100 (topo da tabela: "garantido, pode ser
// múltiplo"). Leitura: floor(pct/100) unidades garantidas, mais 1 rolagem
// extra com o resto (pct % 100)% de chance de mais uma.
function rollCount(pct) {
  let count = Math.floor(pct / 100);
  const remainder = pct % 100;
  if (Math.random() * 100 < remainder) count += 1;
  return count;
}

function getTimeTier(realSeconds) {
  const minutes = realSeconds / 60;
  return TIME_TIERS.find((t) => minutes <= t.maxMin) || TIME_TIERS[TIME_TIERS.length - 1];
}

// `realSeconds` = duração REAL da partida (App.jsx handleGameEnd, a partir
// de `result.timePlayed` — corrigido no GamePage.jsx pra medir relógio de
// parede de verdade, não mais `cfg.timer - state.time`, que ignorava o
// bônus de tempo por combo/Largada Turbo).
export function rollMatchLoot(realSeconds, multiplicador = 1) {
  const tier = getTimeTier(realSeconds);
  // [sessão 097] `multiplicador` < 1 = jogador na ZONA DE REBAIXAMENTO: a
  // chance de TUDO (baú, power-up e poção) cai pro percentual dado — 25% do
  // normal, número que o Davi definiu. Aplica na chance, não no valor: quem
  // acha um baú de ouro lá continua levando as moedas do baú de ouro; só
  // acha muito menos vezes.
  const pct = (v) => v * multiplicador;

  const chests = [];
  for (let i = 0; i < rollCount(pct(tier.chestPct)); i++) {
    const chest = weightedPick(CHESTS);
    const coins = chest.coinFixed ?? (chest.coinMin + Math.floor(Math.random() * (chest.coinMax - chest.coinMin + 1)));
    chests.push({ id: chest.id, coins });
  }

  const powerupIds = [];
  for (let i = 0; i < rollCount(pct(tier.powerupPct)); i++) {
    powerupIds.push(weightedPick(LOOT_POWERUPS).id);
  }

  const potionIds = [];
  for (let i = 0; i < rollCount(pct(tier.potionPct)); i++) {
    potionIds.push(weightedPick(LOOT_POTIONS).id);
  }

  return { chests, powerupIds, potionIds };
}
