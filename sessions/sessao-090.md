# Sessão 090 — Vida comprada uma a uma (300) + classificação mais compacta

**Data:** 2026-08-27
**Versão:** 6.0.38 → 6.0.39
**Tipo:** Regra de jogo + ajuste visual

---

## 1. Vidas: uma por compra, a 300 moedas

**Regra antiga:** um botão "Repor vidas" por 150 moedas que enchia o pote
INTEIRO de volta a 5.

**Regra nova (pedido do Davi):** cada compra dá **1 vida**, por **300
moedas**. Quem está com 3 de 5 e quer o pote cheio compra duas vezes.

- `LIFE_REFILL_PRICE = 150` virou **`LIFE_PRICE = 300`** — renomeada de
  propósito: o nome antigo dizia "refill" e ia continuar mentindo sobre o
  que o botão faz
- As duas compras (painel de vidas no Header e modal "Sem vidas hoje")
  passaram a somar 1, com `Math.min(DAILY_LIVES_MAX, atual + 1)` — comprar
  nunca passa do teto do dia
- Textos: "Recuperar vidas" → **"Comprar 1 vida"**; no modal, "compra a
  reposição agora" → "compra 1 vida agora pra continuar"

**Efeito na economia:** encher o pote do zero passou de 150 para **1.500
moedas** (5 × 300). Somando com o balanceamento das sessões 088-089, vida
virou item caro de verdade — que era a intenção original registrada no
planejamento ("caro de propósito"), mas que o preço de 150 não sustentava
mais depois do nerf de renda.

## 2. Classificação das ligas mais compacta

O Davi mandou um print do placar do Duolingo: as posições ali formam uma
lista contínua, e as nossas pareciam cards soltos.

- espaço entre linhas: `gap-2` → **`gap-0.5`** (era o principal culpado)
- respiro interno: `py-2.5` → **`py-1.5`**
- avatar: **40px → 36px** — era ele que mandava na altura da linha

Resultado: linha de 58px → **54px**, e a lista virou contínua em vez de
picotada. Cabe uma posição a mais na tela. Não fui mais agressivo de
propósito: abaixo de ~48px a linha fica pequena demais pro dedo no celular
(a linha é clicável, abre a ficha do personagem).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | `LIFE_PRICE = 300` (era `LIFE_REFILL_PRICE = 150`) |
| `src/App.jsx` | compra 1 vida no modal "Sem vidas" |
| `src/components/Header.jsx` | compra 1 vida no painel |
| `src/pages/ShopPage.jsx`, `src/utils/shop.js` | comentários que citavam o nome antigo |
| `src/pages/RankingPage.jsx` | lista compacta |

---

## Status para retomar

**FASE 8 — painel da Arena.** É a próxima e única fase grande em aberto.
O Davi vai descrever o que quer (incluindo as "inovações ligadas a
ícones"), eu monto o plano e ele confirma antes de eu codar.
