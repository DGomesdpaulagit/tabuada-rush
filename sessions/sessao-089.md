# Sessão 089 — Balanceamento dos baús (opção B + empurrãozinho de A)

**Data:** 2026-08-27
**Versão:** 6.0.37 → 6.0.38
**Tipo:** Economia

---

## A decisão

Na sessão 088 eu medi que os **baús de loot eram ~93% de toda a renda de
moedas** e levei três opções. O Davi escolheu: **"B, talvez com um
empurrãozinho de A"**.

- **B — baú grande mais raro:** mexe em QUAL baú sai
- **A (leve) — menos baú:** mexe em QUANTAS vezes sai um baú

## O que mudou

**B) `constants/loot.js` → `CHESTS`:** `intervalMax` do **Ouro 40 → 80** e
do **Místico 50 → 120**. Isso não altera a chance de cair um baú: altera o
**peso no sorteio de qual baú é** (`weightedPick` usa peso = 1/intervalo
médio).

**A leve) `TIME_TIERS` → só a coluna `chestPct`:** 30→22, 40 (era 50), 65
(era 80) e 90 (era 100).

**Intocado de propósito:**
- as **faixas de moeda** de cada baú (Ouro continua 500-800, Místico 1000)
  — é a sensação de prêmio, e o Davi não quis mexer
- `powerupPct` e `potionPct` — power-up e poção são consumíveis, não
  inflacionam a carteira, e a reclamação era de moeda

## O efeito, em número

**Qual baú sai, quando sai:**

| Baú | Antes | Agora |
|---|---:|---:|
| Madeira | 48,3% | **56,6%** |
| Ferro | 24,1% | **28,3%** |
| Ouro | 15,3% | **9,1%** |
| Místico | 12,3% | **6,1%** |

**Baú médio: 321 → 236 moedas (−27%).**

**Moedas por partida vindas de baú:**

| Duração da partida | Antes | Agora | |
|---|---:|---:|---:|
| curta (até 5 min) | 96 | **52** | −46% |
| média (até 20 min) | 161 | **94** | −41% |
| longa (até 50 min) | 257 | **153** | −40% |
| ~1h | 321 | **212** | −34% |

Somando com o ajuste da sessão 088 (moeda por partida 8→6 de teto, alvos
das diárias maiores), a renda total cai perto da metade. O Místico virou
evento de verdade: 6% dos baús, que já são 22% das partidas curtas — ou
seja, ~1 a cada 75 partidas curtas.

## Documentação alinhada

`RECURSOS.md` tinha os números antigos em duas tabelas. Atualizado junto,
com nota do porquê — **exatamente o problema que a sessão 088 pegou no
texto da Loja**, que prometeu 15 moedas/partida por duas versões enquanto
o código dava 8. Número de balanceamento que aparece na tela ou em doc
tem que ser atualizado no mesmo commit que muda o código.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/loot.js` | `CHESTS` (Ouro/Místico mais raros) + `chestPct` |
| `RECURSOS.md` | tabelas atualizadas + nota do balanceamento |

---

## Status para retomar

**FASE 8 — reformulação do painel da Arena.** É o que sobrou, e o Davi já
disse que vem com "algumas inovações" que ele ainda vai detalhar. Do jeito
que a gente combinou: ele descreve, eu monto o plano, ele confirma, aí eu
codo.

Aberto também (sem bloquear nada):
- Tipos de pontuação por faixa (100/200/500/1000) — `PENDENCIAS.md`
- Dívidas de layout do menu/loja — `PENDENCIAS.md`
