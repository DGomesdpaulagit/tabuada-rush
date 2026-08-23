# Sessão 070 — Loja rotativa (Fase 5 do PLANO_ACAO.md)

**Data:** 2026-08-23
**Versão:** 6.0.18 → 6.0.19
**Tipo:** Tela existente (execução do plano)

---

## O que aconteceu

Depois do ajuste de ícones (sessão 069), Davi pediu explicitamente pra
continuar o `PLANO_ACAO.md` — próximo item era a Fase 5.

---

## O que foi feito

### 1. `utils/shop.js` — novo
`getDailyShopStock(date = todayStr())` sorteia 1-3 itens do dia a partir
de um pool combinado dos 7 power-ups + 3 poções (10 entradas). Mesmo
padrão LCG determinístico de `utils/missions.js`, mas **sem precisar
guardar nada no storage** — o sorteio é puramente função da data, sempre
dá o mesmo resultado pro mesmo dia e muda sozinho na virada (`todayStr()`,
D040). A quantidade (1/2/3) também é sorteada, não fixa.

### 2. `ShopPage.jsx`
Troca `SHOP_ITEMS.map`/`POTIONS.map` fixos por `shopItemsToday`/
`potionsToday` (filtrados pelo sorteio via `SHOP_ITEM_MAP`/`POTION_MAP`).
Seção "Poções de XP" só aparece se saiu alguma no sorteio do dia.
Cabeçalho novo "Estoque de hoje" com contagem regressiva até a meia-noite.

### 3. "Recuperar vidas" — nada mudou
Verifiquei: esse mecanismo (`LIFE_REFILL_PRICE`) nunca foi item da
`ShopPage` — sempre foi só o painel do Header, sempre visível, sem
depender da Loja. A regra do plano ("sempre disponível, nunca sorteado")
já estava satisfeita antes da Fase 5 existir.

---

## Verificação

- Simulação em Node do algoritmo pra 10 dias seguidos: quantidade
  variando 1-3, dias com 0 poção no sorteio (confirma que a seção
  condicional tem caso real)
- Hoje (2026-08-23) sorteou `[pocao-xp-1, shield, headstart]` — bateu
  exatamente entre a simulação e a página renderizada de verdade
- `npm run build` limpo
- Compra testada com a lista sorteada: Escudo (100 moedas, 1→2) e Poção
  ×1,5 (100 moedas, 1→2) — descontou certo, incrementou certo
- Os 4 power-ups fora do sorteio de hoje não aparecem na tela — confirma
  que o filtro é real, não decorativo

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/shop.js` | novo — `getDailyShopStock` |
| `src/pages/ShopPage.jsx` | usa o sorteio do dia em vez da lista fixa |
| `PLANO_ACAO.md` | Fase 5 concluída |
| `DECISIONS.md` | D048 |
| `CHANGELOG.md` | entrada 6.0.19 |

---

## Status para retomar

**Fase 5 concluída.** Próxima: **Fase 6 (baús e recompensas por
partida)** — precisa decidir a implementação do "o que conta como 1
partida" pra frequência de drop (conflito #3 do `PLANO_ACAO.md`: usar a
duração REAL da partida, não uma suposição por modo, por causa do bônus
de tempo por combo do Rush).

**Pendências carregadas de antes** (sessão 069): ícone de mochila ainda
é "teste", não confirmado; dúvida se "ícones de controle" também
deveria trocar o `Gamepad2` do `MenuPage.jsx`.
