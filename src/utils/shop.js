import { SHOP_ITEMS, POTIONS } from '../constants/shop';
import { todayStr } from './index';

// ── LOJA ROTATIVA DIÁRIA [Fase 5 do PLANO_ACAO.md, sessão 070] ───────────────
// Mesmo padrão determinístico das missões (utils/missions.js: LCG semeado
// pela data local) — mas aqui não precisa persistir NADA no storage: o
// sorteio do dia é uma função pura da data, sempre dá o mesmo resultado pro
// mesmo dia e muda sozinho na virada (`todayStr()`, D040 — nunca
// `toISOString()`, que erra o fuso do Brasil).
//
// "Comprar 1 vida" (o pote diário, `LIFE_PRICE`) NÃO entra
// nesse pool — já é um mecanismo à parte, sempre visível no Header, e
// continua assim (regra fixa do plano: nunca sorteado, sempre disponível).

const SHOP_POOL = [
  ...SHOP_ITEMS.map((item) => ({ kind: 'powerup', id: item.id })),
  ...POTIONS.map((potion) => ({ kind: 'potion', id: potion.id })),
];

function dateSeed(str) {
  return str.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1), 0);
}

// Retorna [{ kind: 'powerup'|'potion', id }, ...] — 1 a 3 itens do dia.
export function getDailyShopStock(date = todayStr()) {
  let s = Math.abs(dateSeed(date) + 777777) || 1;
  const next = () => {
    s = ((s * 1664525) + 1013904223) & 0x7fffffff;
    return s;
  };

  const count = (next() % 3) + 1; // 1, 2 ou 3 — quantidade também sorteada
  const used = new Set();
  const result = [];
  while (result.length < count) {
    const idx = next() % SHOP_POOL.length;
    if (!used.has(idx)) {
      used.add(idx);
      result.push(SHOP_POOL[idx]);
    }
  }
  return result;
}
