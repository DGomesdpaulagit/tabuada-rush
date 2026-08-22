// ── POÇÕES DE XP [Fase 4 do PLANO_ACAO.md, sessão 068] ───────────────────────
import { POTION_MAP } from '../constants/shop';

// Poção ativa agora, ou null se nunca ativou / já expirou. Não precisa
// "limpar" `potionActiveId`/`potionActiveUntil` quando o tempo acaba — esta
// função já trata isso como inativo checando o timestamp toda vez que é
// chamada, então os campos ficarem com o valor antigo no storage é
// inofensivo (leitura preguiçosa em vez de expiração proativa).
export function getActivePotion(data) {
  if (!data.potionActiveId || !data.potionActiveUntil) return null;
  if (Date.now() >= data.potionActiveUntil) return null;
  return POTION_MAP[data.potionActiveId] || null;
}

// Multiplicador de XP a aplicar AGORA — 1 quando não há poção ativa. Uso
// direto em App.jsx handleGameEnd, sem precisar checar `getActivePotion`
// duas vezes em quem só quer o número.
export function getActiveXpMultiplier(data) {
  return getActivePotion(data)?.multiplier ?? 1;
}
