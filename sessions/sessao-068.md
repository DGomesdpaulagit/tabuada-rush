# Sessão 068 — Poções de XP (Fase 4 do PLANO_ACAO.md)

**Data:** 2026-08-22
**Versão:** 6.0.16 → 6.0.17
**Tipo:** Recurso novo (execução do plano)

---

## O que aconteceu

Davi disse "bora pra mais" em resposta à pergunta de começar a Fase 4
ou esperar ele ver a Mochila rodando primeiro — interpretado como
autorização pra seguir direto pra Fase 4.

---

## O que foi feito

### 1. Storage — `potions`, `potionActiveId`, `potionActiveUntil`
Campo `data.potions` novo e **separado** de `data.powerups` (pedido
explícito do Davi). `potionActiveId`/`potionActiveUntil` guardam qual
poção está ativa e quando expira (timestamp ms) — persistente, sobrevive
fechar o app.

### 2. `constants/shop.js` — `POTIONS`/`POTION_MAP`
As 3 variações com multiplicador + `durationMin` + `price` batendo exato
com a tabela do plano (x1,5/40min/100, x2/25min/250, x3/15min/450).

### 3. `utils/potions.js` — novo
`getActivePotion(data)`/`getActiveXpMultiplier(data)` — checam
`Date.now() >= potionActiveUntil` na hora da leitura em vez de expirar
proativamente os campos do storage.

### 4. XP por TEMPO, não por partida
`App.jsx` (`handleGameEnd`) aplica `getActiveXpMultiplier` no cálculo de
XP sempre que uma partida termina dentro da janela ativa — diferente do
antigo XP Dobrado (D043), que valia só pra 1 partida.

### 5. Compra — `ShopPage.jsx`
Seção "Poções de XP" nova, preço fixo (o "mínimo" da tabela) — a Fase 5
(loja rotativa) ainda não existe, então isso dá um caminho de aquisição
real sem antecipar o design dela.

### 6. Ativação — `MochilaPage.jsx`
Botão "Ativar" por poção em estoque + overlay de tela cheia nas cores
roxas de referência do Davi (gradiente violeta→roxo, "Poção ativada!",
multiplicador/duração/horário, botão "Continuar").

### 7. Resultado — `ResultsPage.jsx`
Banner "Poção de XP ativa!" (XP base → XP final ×multiplicador) e label
do stat de XP mudando pra "XP Ganho ×N" quando aplicável.

---

## Decisão sinalizada pro Davi

**Só 1 poção ativa por vez.** Não especificado no plano — as 3 saídas
possíveis (bloquear/acumular/substituir) inventam regra de balanceamento
igualmente. Escolhi **bloquear** (botão "Ativar" desabilitado enquanto
outra está ativa) por não descartar o estoque nem inventar stacking.
Ver D046 pro raciocínio completo.

---

## Verificação

Via `?screen=` (DEV) + injeção direta de `localStorage`, mesma limitação
de sempre (Browser pane com `document.hidden === true`, D034):

- Loja: 3 poções com nome/preço/ícone corretos, 0 imagem quebrada
- Compra da x3 descontou 450 moedas e setou `potions['pocao-xp-3']: 1`
  — **bug no meu próprio script de teste** encontrado e corrigido no
  caminho (seletor DOM subia níveis demais e clicava no card errado)
- Mochila: seção "Poções" aparece com estoque e botão "Ativar" — **2º bug
  de teste** (não do app): checagem de texto `'Poções'` falhava por causa
  do CSS `uppercase` mudar o `innerText` visual; corrigido com regex
  case-insensitive
- Ativar x3: setou timer (15 min), decrementou estoque 1→0, mostrou o
  overlay
- Com x3 ativa, botão "Ativar" da x1,5 restante ficou desabilitado —
  confirma o bloqueio
- Simulação isolada da fórmula de XP contra o storage real: x3 ativa →
  20 XP base vira 60 XP, confirmando a wiring de `App.jsx`/
  `ResultsPage.jsx` sem precisar completar uma partida inteira

**Não testado:** efeito de XP numa partida completa jogada de ponta a
ponta neste ambiente (impraticável de simular) — verificado só via
revisão de código + simulação isolada da fórmula, não end-to-end real.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/storage.js` | campos `potions`/`potionActiveId`/`potionActiveUntil` |
| `src/constants/shop.js` | `POTIONS`/`POTION_MAP` |
| `src/utils/potions.js` | novo — `getActivePotion`/`getActiveXpMultiplier` |
| `src/App.jsx` | multiplicador de poção no cálculo de XP + `lastResult` |
| `src/pages/ShopPage.jsx` | seção "Poções de XP" + `buyPotion` |
| `src/pages/MochilaPage.jsx` | seção de poções real + ativação + overlay |
| `src/pages/ResultsPage.jsx` | banner + label de XP multiplicado |
| `PLANO_ACAO.md` | Fase 4 concluída |
| `DECISIONS.md` | D046 |
| `CHANGELOG.md` | entrada 6.0.17 |

---

## Status para retomar

**Fase 4 concluída.** Próxima: **Fase 5 (loja com estoque rotativo
diário)** — sorteio de 1-3 itens por dia (meia-noite local, reaproveitar
`localDateStr()`), "Recuperar vidas" sempre garantido fora do sorteio.

**Pendente de confirmação do Davi:** regra de 1 poção ativa por vez
(bloquear em vez de acumular/substituir) — ver seção acima e D046.

**Pendente de olhada dele:** Mochila (sessão 067) e agora também a tela
de ativação de poção — nunca vistas rodando de verdade neste ambiente
(mesma limitação, D034).
