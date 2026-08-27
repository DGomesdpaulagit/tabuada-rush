# Sessão 087 — Baú por missão (bloco 2) — FASE 7.1 CONCLUÍDA

**Data:** 2026-08-27
**Versão:** 6.0.35 → 6.0.36
**Tipo:** Implementação (última pendência da Fase 7.1)

---

## O que foi feito

O baú no fim da barra de progresso de cada missão, com o **tier batendo
com a recompensa daquela missão** e **fechado/aberto conforme o
progresso**. Vale nos dois lugares que o Davi pediu: **aba Missões** e
**página 3 do resumo pós-partida** (mesmo componente, `MissionChest`,
exportado de `MissionsPage.jsx`).

### A regra do tier (e o buraco que ela resolve)

`chestForCoins(moedas)` em `constants/loot.js`: devolve **o primeiro baú
cujo TETO alcança o valor**. Deriva de `CHESTS` de propósito — mexeu nos
valores dos baús, as missões acompanham sozinhas.

Isso importa porque **as faixas dos baús têm buracos**: não existe baú de
101-199 nem de 401-499, e tem missão caindo justamente neles (o desafio
mensal de **450** moedas). Pela regra, 450 vira **Ouro** (o primeiro tier
cujo teto, 800, alcança). Sem uma regra explícita, esses casos ficariam
sem baú nenhum.

Na prática hoje:
- **Diárias** (20 a 60 moedas) → todas **Madeira**
- **Mensais** (300 a 400) → **Ferro**; (450 a 800) → **Ouro**
- Missão de 1000 → **Místico**

### Estado visual

- **Incompleta:** baú fechado, com 60% de opacidade
- **Completa:** baú **aberto**, opacidade cheia — o baú abrindo é o
  feedback de "terminei"

---

## Verificação (com tela, não com suposição)

Capturado com três casos na mesma tela:

| Missão | Recompensa | O que aparece |
|---|---|---|
| 20 Acertos — 20/20 | 30 moedas | Madeira **aberto** |
| Sequência de 15 — 9/15 | 55 moedas | Madeira **fechado**, apagado |
| Mestre da Pontuação — 1000/1000 | 1000 moedas | **Místico aberto** |

**Duas coisas que precisei consertar pra conseguir essa foto** — e ambas
valem pra sempre:

1. **A barra de progresso saía zerada nas capturas.** O preenchimento é
   animado (`initial={{ width: 0 }}`), e animação depende de rAF, que não
   roda sem janela sendo pintada (D062). `Progress` passou a usar
   `stillInitial`, igual à casca do resumo.
2. **`scripts/tirar-telas.mjs` ganhou `--preparar "<js>"`** pra montar
   estado que não dá pra pedir pela URL (uma missão concluída, no caso).
   Detalhe que custou algumas tentativas: o patch tem que rodar **antes do
   app iniciar** (`Page.addScriptToEvaluateOnNewDocument`), porque o app
   salva o estado que tem em memória ao sair da página — patch feito na
   página já carregada era desfeito pelo próprio save do unload.

**De quebra, uma dúvida esclarecida:** as missões diárias parecem
"re-sortear" quando o dado é de outro dia. Fui atrás achando que era bug
e **não é**: `getActiveMissions` só reinicia quando `daily.date !== hoje`,
que é exatamente o esperado. O que eu vi era dado de 25/08 sendo aberto
hoje, 27/08.

---

## Com isso, a FASE 7.1 fechou

Todos os itens da revisão visual que o Davi ditou na sessão 078 estão
entregues: confete, ícone de acertos e de erro, XP, ofensiva, calendário
redondo, troféu, página de recompensa (classificação fora, baú aberto,
fundo por recurso) e agora o baú por missão.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/loot.js` | `chestForCoins()` |
| `src/pages/MissionsPage.jsx` | `MissionChest` + uso em diárias e mensais |
| `src/pages/PostGameSummary.jsx` | mesmo baú na página 3 |
| `src/components/ui/index.jsx` | `Progress` respeita o modo parado |
| `scripts/tirar-telas.mjs` | `--preparar` |

---

## Status para retomar

1. **FASE 8 — painel/reformulação da Arena**, com as "inovações" que o
   Davi ainda vai detalhar. É a próxima fase grande, e ele já avisou que
   quer confirmar o plano antes de eu codar.
2. Tipos de pontuação por faixa (100/200/500/1000) — `PENDENCIAS.md`,
   esperando ele definir o que fazer com alvo entre faixas.
3. Dívidas de layout do menu/loja anotadas na sessão 086.
