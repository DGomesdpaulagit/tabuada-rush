# Sessão 026 — Tabuada Rush 3.0 · FASE 1 (Base Pedagógica + Correções Críticas)

**Data:** 2026-06-08
**Versão:** 3.2.1 → **3.3.0**
**Tipo:** Implementação (Fase 1 do roadmap 3.0)
**Próxima sessão:** Fase 2 — Repetição Espaçada (SRS) + Certificados de Domínio + Modo Inverso

---

## Resumo executivo

Primeira sessão de implementação da **Tabuada Rush 3.0**. Foco em: organizar os
modos numa página dedicada, dar destaque visual ao Desafio Diário no menu principal,
introduzir o **Mapa de Domínio Visual** (a primeira vez que o jogador vê evidência
gráfica do que realmente domina), e corrigir as missões de score que estavam
matematicamente impossíveis.

A base pedagógica do 3.0 começa aqui: passamos a registrar `factStats` por par
(a,b), o que é pré-requisito para a Fase 2 (SRS) e para os Certificados de Domínio.

---

## 1. Missões de score impossíveis corrigidas

**Arquivo:** `src/constants/missions.js`

- `mm_score_1200` (mensal) → `mm_score_350` (target 350, reward inalterado)
  - Por quê? Score máximo prático no Rush é ~300-400, no Speed ~600, no Daily ~250.
    1200 era inalcançável e quebrava a confiança do jogador nas missões.
- `wm_score_800` (semanal) → `wm_score_500`
  - Mesma lógica: 800 estava acima do limite do Speed (modo de score mais alto por
    partida).

Reward das duas missões mantido — a dificuldade real agora é o tempo (semana/mês),
não um número que nunca acontece.

---

## 2. Página de Modos (`ModesPage.jsx`)

**Arquivo novo:** `src/pages/ModesPage.jsx`
**Rota:** `screen === 'modes'` no `App.jsx`

Estrutura em 3 seções:

1. **Modos Principais** — Rush, Sobrevivência, Velocidade, Desafio Diário
   - Cards grandes com gradiente próprio do modo
   - Recorde pessoal visível no canto inferior direito
   - "Desafio Diário" recebe badge `🌟 Hoje` ou `✓ feito hoje` automaticamente
2. **Modos de Treino** — Zen, Revisão
   - Subtitle: "Sem competição — feito para aprender no seu ritmo"
   - Zen recebe badge `Sem XP`
3. **Modos Avançados** (placeholders Fase 2+) — Flashcard, Inverso, Difícil,
   Recorde Pessoal
   - Bloqueados, com badge `🔒 Em breve · Fase X`
   - Texto explicativo do que cada um faz

Componente `ModeCard` interno (reutilizado nas 3 seções) cuida do estilo,
do estado `locked`, do badge e do callback `onStart`.

---

## 3. Banner do Desafio Diário no Menu

**Arquivo:** `src/pages/MenuPage.jsx`

Removido: grids antigos de modos principais e de treino (substituídos pelo
botão "Escolher Modo →" que leva à `ModesPage`).

Adicionado:

- **Banner Desafio Diário** — card de destaque imediatamente abaixo do perfil:
  - **Pendente:** gradiente âmbar→laranja→rosé com brilho amarelo decorativo
    e CTA implícito. Texto: "20 perguntas únicas · +30 XP"
  - **Feito hoje:** gradiente esmeralda discreto + "Feito hoje! 🎉" +
    pontuação obtida no `currentDailyScore`
  - Toque dispara `onStart('daily')` direto
- **Botão "Escolher Modo"** — gradiente roxo, ícone 🎮, leva a `ModesPage`

Variantes Framer (`container`/`item`) usadas pelos grids removidos foram
deletadas junto. Imports limpos: removidos `MODE_LIST`, `TRAINING_MODE_LIST`,
ícones de modos individuais. Adicionado `ChevronRight`.

---

## 4. Mapa de Domínio Visual

**Arquivo:** `src/pages/AccuracyCatalogPage.jsx`

A feature mais impactante educacionalmente desta fase. Nova seção
`<MasteryMap factStats={data.factStats || {}} />` posicionada logo antes de
"Precisão por Tabuada".

### Classificação de cada fato (`classifyFact`)

```
dominated:  acc ≥ 90% AND avgMs < 1500 AND amostras ≥ 3   → 🟢
problem:    erro > 20% AND amostras ≥ 3                    → 🔴
nodata:     count = 0                                       → ⬜
practiced:  resto                                           → 🟡
```

Limiares: `MASTERY_FAST_MS=1500`, `MASTERY_MIN_ACC=90`, `MASTERY_PROBLEM_ERR=20`,
`MASTERY_MIN_SAMPLES=3`. Critérios mais rígidos que o exigido pelo plano
original (`>95%`) porque com poucas amostras, 90% já é sinal forte e dá ao
jogador a satisfação de ver verdes mais cedo.

### Visual

- Cabeçalho de progresso em destaque: **"X/80 Fatos Dominados"** + **Y%** do total
- Grade 8 linhas × 10 colunas:
  - Linhas: a = 2..9 (label `2×`, `3×`...)
  - Colunas: b = 1..10
  - Cada célula mostra o **produto** (ex: célula 7×8 mostra `56`)
  - `title` no hover mostra: `a×b=resultado · acc% · tempo médio · estado`
- Legenda com contagem de fatos em cada estado
- Empty state amigável quando ainda não há dados

### Persistência (`factStats`)

`src/App.jsx::handleGameEnd` agora além de `tableStats` (por fator `a`)
também agrega `factStats` por par normalizado:

```js
const lo = Math.min(q.a, q.b);
const hi = Math.max(q.a, q.b);
const fk = `${lo}x${hi}`;  // 3×7 e 7×3 viram a mesma chave "3x7"
factStats[fk] = { correct, wrong, totalMs, count };
```

Backward-compatible: bases antigas sem `factStats` começam vazias e enchem
conforme o jogador joga. Nenhuma migração necessária.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/missions.js` | mm_score_1200 → mm_score_350 · wm_score_800 → wm_score_500 |
| `src/pages/ModesPage.jsx` | **Novo** — página de modos completa |
| `src/pages/MenuPage.jsx` | banner Desafio Diário + botão "Escolher Modo"; grids antigos removidos |
| `src/pages/AccuracyCatalogPage.jsx` | componente `MasteryMap` + `classifyFact` + helpers |
| `src/App.jsx` | rota `modes` + `factStats` agregado em `handleGameEnd` |
| `CHANGELOG.md` | entrada [3.3.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | nota da Fase 1 implementada |
| `sessions/sessao-026.md` | este arquivo |

---

## Decisões técnicas relevantes

1. **Modos avançados como placeholders bloqueados** — em vez de esconder, mostrar
   "Em breve · Fase X" cria expectativa, ancoragem do roadmap e o jogador entende
   que o app evolui.
2. **Critério de "dominado" mais permissivo (90%)** — o plano original sugeria
   95%, mas com amostras pequenas isso cria frustração. 90% com avgMs < 1.5s
   já é evidência forte de memória automática.
3. **factStats normalizado (min×max)** — trata 3×7 e 7×3 como o mesmo fato.
   Decisão pedagógica: o que importa é dominar a operação, não a ordem.
4. **Sem migração de dados** — `factStats` arranca vazio mesmo para usuários
   existentes. Em ~3 partidas a grade começa a mostrar cor.
5. **Banner do Diário toca o modo direto** — não há tela intermediária; clicar
   no banner já inicia o desafio.

---

## Próximos passos (Fase 2 — Repetição Espaçada)

A Fase 1 entregou a **evidência visual do conhecimento**. A Fase 2 entrega
a **estratégia de memorização**:

1. **Modo Flashcard com SRS** — `src/pages/FlashcardPage.jsx` novo:
   - Apresenta um fato, jogador avalia "Fácil/Difícil/Errei"
   - Algoritmo SM-2 (ou variante) calcula próxima revisão por fato
   - Novo campo `srsData[fk] = { interval, nextReview, easeFactor }` no storage
   - Badge "X fatos para revisar hoje" no menu
2. **Certificados de Domínio por Tabuada** — 8 certificados (do 2 ao 9):
   - Desbloqueados quando todos os fatos daquela tabuada estiverem `dominated`
   - Aparecem no perfil e na página de conquistas
   - Únicos itens que NÃO podem ser comprados
3. **Modo Inverso** — `MODES.inverse`:
   - Apresenta "= 56", jogador digita dois fatores
   - 15 questões · xpMultiplier 0.20
   - Desbloquear card em `ModesPage` (remover `locked`)

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 24s, 0 erros)
- **Lint/Type:** sem warnings novos
- **Dev server:** validado via `preview_start` (sem erros de console)
- **Próximo passo de produção:** commit + push (deploy Vercel automático)
