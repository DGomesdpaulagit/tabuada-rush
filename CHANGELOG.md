# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

---

## [3.11.0] — 2026-07-06 — TABUADA RUSH 4.0 · FASE 1 (Fundação Multi-Operação)

**Arquitetura, sem feature visível. Detalhes em `sessions/sessao-035.md`.**

### Adicionado / Alterado
- **Schema multi-operação**: `tableStats`/`factStats`/`srsData` namespaced
  por operação (`{ mult: {...} }`). Migração automática e retrocompatível de
  dados salvos em versões anteriores.
- **`OPERATIONS`** (utils): registro central de operações matemáticas — só
  `mult` tem conteúdo hoje; `add`/`sub`/`div` reservados para Fases 2/3.
- **`getFactKey`/`getFactSpace`/`generateQuestion`**: novas funções genéricas
  que substituem lógica hardcoded de multiplicação. `getAllFactKeys`/
  `parseFactKey`/`computeCertificates` generalizados, 100% retrocompatíveis.
- **`MasteryMap` (Mapa de Domínio)** ganhou prop `operation`, lê geometria da
  grade do registro `OPERATIONS` em vez de arrays hardcoded.
- **Comportamento observável: idêntico ao pré-4.0** — validado por build
  limpo, teste de migração com dado legado real, e execução ao vivo das
  novas funções no bundle via console do navegador.

### Corrigido
- **B007** — contagem de certificados hardcoded (`{certsUnlocked}/8`) na
  AchievementsPage não acompanhou a generalização do `MasteryMap`. Trocado
  para `{certificates.length}` (já derivado de `OPERATIONS`). Ver `BUGS.md`.

---

## [ROADMAP] — 2026-07-02 — TABUADA RUSH 4.0 PLANEJADO

**Amplitude (4 operações) + Inteligência Adaptativa (previsão de esquecimento).
Detalhes em `sessions/sessao-034.md`.**

### Fase 1 (próxima sessão) — Fundação Multi-Operação
- Schema com chave de operação (`factStats`/`tableStats`/`srsData`)
- Gerador de perguntas unificado, Mapa de Domínio genérico, SRS genérico

### Fase 2 — Soma e Subtração
### Fase 3 — Divisão (bootstrap a partir dos dados de multiplicação)
### Fase 4 — Inteligência Preditiva (curva de esquecimento, painel "Fatos a Vencer")
### Fase 5 — Adaptação Universal (viés de fatos fracos em todos os modos)
### Fase 6 — Perfil de Domínio Unificado (certificado completo, QI multi-operação)

Fora de escopo (uso pessoal, sem meta de negócio): social/multiplayer, B2B.

---

## [3.10.0] — 2026-07-02 — Modo Difícil Adaptativo + Leaderboards Ativos

Detalhes em `sessions/sessao-033.md`.

### Adicionado / Alterado
- **Modo Difícil agora é ADAPTATIVO**: em vez do pool fixo 7/8/9, seleciona
  as 3 tabuadas com maior dificuldade PESSOAL do jogador (`tableStats`).
  - Score de dificuldade: 60% taxa de erro + 40% tempo médio
  - Requer ≥3 amostras por tabuada; fallback: 7/8/9 clássico
  - Nova função `getHardTabuadaPool(tableStats)` em utils
  - `getHardQuestion(tableStats)` — assinatura mudou (breaking em teoria, mas só
    o GamePage chama, e foi atualizado)
  - `MODES.hard.description`: "Só tabuadas 7, 8 e 9" → "Suas 3 tabuadas mais difíceis"

### Infraestrutura
- **Leaderboards ATIVOS no Supabase** — migração `create_leaderboard_tables`
  aplicada via MCP no projeto `oevpmbdcvzplbbedrvyt`.
  - Tabelas `leaderboard_daily` e `leaderboard_weekly` criadas com RLS,
    políticas SELECT (todos autenticados) + ALL (dono), índices por
    `(date/week, score desc)`.
  - Página de Leaderboard agora funcional em produção para usuários logados.

---

## [3.9.0] — 2026-06-08 — Correções + Sistema de Desbloqueio Progressivo

**Pós-3.0: bugs corrigidos e refinamento.** Detalhes em `sessions/sessao-032.md`.

### Corrigido
- **Bug crítico — Flashcard:** input não aceitava digitação. Causa: useEffect
  dependia de `fact` (objeto novo a cada render), zerando o input em cada
  keystroke. Trocado para `currentFk` (string estável).
- **UX — Leaderboard:** quando tabelas não existem no Supabase, mostrava
  "Tente novamente em alguns segundos" em vez da mensagem correta.
  `parseError` agora detecta PGRST205, PGRST202 e mais padrões.

### Adicionado
- **Sistema de Desbloqueio Progressivo (`UNLOCK_RULES`)**: todos os modos
  exceto Zen têm condição de desbloqueio.
  - Rush → Nível 2, Sobrevivência → Nível 3, Velocidade → 10 partidas,
    Diário → 100 acertos, Revisão → 20 erros, Flashcard → Nível 4,
    Inverso → Nível 5, Difícil → Nível 8, Recorde Pessoal → Nível 9,
    Semanal → 10 dias de ofensiva, Combinado → 3 certificados
  - Nova função `getModeUnlock(modeId, data)` em utils
  - Bloqueio defensivo em `App.jsx::handleStart` (não confia só na UI)
  - Backward-compat: usuários existentes já satisfazem as condições, ficam
    com tudo desbloqueado automaticamente
- **Modo Zen agora dá XP** (discretamente): `xpMultiplier` 0 → 0.10
  - Badge "Sem XP" → "Pratique 🌿" (não revela XP)
  - Descrição e UI in-game não mencionam XP
  - O jogador descobre ao ver a ResultsPage
  - Permite que usuário novo comece só com Zen e suba de nível para
    destravar Rush e os demais modos

---

## [3.8.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 6 · 🎉 ROADMAP COMPLETO

**Expansão de Conteúdo + Fechamento do Roadmap 3.0.** Detalhes em `sessions/sessao-031.md`.

### Adicionado
- **Tabuada do 11 e 12** (opcional) — toggle persistido em `data.includeExtraTables`
  - Seção "Conteúdo Avançado" no SettingsPage com explicação
  - `getRandomQuestion(diff, includeExtra)` aceita o flag — só inclui 11/12 no nível 3+
  - Aplica em modos com geração randômica (Rush, Survival, Speed, Review, Personal)
  - **NÃO afeta** Daily/Weekly (justiça do leaderboard) nem modos com pool próprio
- **Modo Combinado** — `MODES.combined`
  - "3 × 7 + 4 = ?" ou "5 × 8 − 6 = ?" — cálculo mental com 2 operações
  - 15 questões, xpMultiplier 0.25
  - Op `+` ou `-` 50/50; quando `-`, garante `ans > 0`
  - **Desbloqueado por ≥3 certificados de domínio** (não por nível)
  - Card no ModesPage com badge "🔒 3 certificados" quando bloqueado
  - Renderização adaptada no GamePage (`3 × 7 + 4` em fonte 60px)
- **`getCombinedQuestion()`** novo em `utils/index.js`

### 🎉 Roadmap 3.0 — 100% entregue

| Fase | v | Sessão |
|------|---|--------|
| 1 — Base Pedagógica + Correções | 3.3.0 | 026 |
| 2 — Repetição Espaçada | 3.4.0 | 027 |
| 3 — Economia e Loja | 3.5.0 | 028 |
| 4 — Novos Modos | 3.6.0 | 029 |
| 5 — Social e Retenção | 3.7.0 | 030 |
| 6 — Expansão de Conteúdo | 3.8.0 | 031 |

> O Tabuada Rush 2.x praticava tabuada.
> O Tabuada Rush 3.0 memoriza tabuada.

---

## [3.7.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 5

**Social e Retenção.** Detalhes em `sessions/sessao-030.md`.

### Adicionado
- **Leaderboards globais** (Diário + Semanal) via Supabase
  - Service `src/services/leaderboard.js` — upsert/fetch com graceful degradation
    (detecta `no_table`, `unconfigured`, `error`)
  - Página `LeaderboardPage.jsx` — tabs Diário/Semanal, top 20, medalhas 🥇🥈🥉,
    linha do próprio usuário destacada, "Seu Score" em destaque com QI char
  - Botão "Leaderboard Global" 👑 no MenuPage
  - `handleGameEnd` faz upsert ao terminar daily/weekly se usuário logado
  - **SQL no SUPABASE_SETUP.md:** `leaderboard_daily` + `leaderboard_weekly`
    com RLS (todos leem, dono escreve), índices por (date/week, score desc)
- **Heatmap de Ofensiva 365 dias** — `src/components/StreakHeatmap.jsx`
  - Grade 53 semanas × 7 dias, estilo GitHub
  - 5 níveis de intensidade (cinza → emerald-800)
  - Tooltip por célula com data e nº de partidas
  - Cabeçalho de meses + labels de dia da semana
  - Inserido no topo da StatsPage
- **Compartilhar Resultado** — `src/lib/shareCard.js`
  - Geração de PNG 1080×1080 via Canvas API (sem dependência nova)
  - Paleta dos 10 modos espelhada
  - Card central com SCORE gigante, badge "🏆 NOVO RECORDE!" condicional,
    3 stats (Precisão · Acertos · Sequência), rodapé com personagem QI
  - `shareCard()` tenta Web Share API, faz fallback para download
  - Botão "Compartilhar resultado" na ResultsPage

### Filosofia
> Fase 5 abre o jogo para o mundo. Comparação justa (todos jogam as mesmas
> questões). Visualização do compromisso (heatmap). Identidade compartilhável
> (share card). Retenção via prova social.

---

## [3.6.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 4

**Novos Modos.** Detalhes em `sessions/sessao-029.md`.

### Adicionado
- **Modo Difícil** — `MODES.hard`
  - Pool exclusivo de fatores 7, 8 e 9 · timer 90s · xpMultiplier 0.22
  - Desbloqueado no Nível 8+ (`minLevel: 8`)
  - Geração on-the-fly via `getHardQuestion()`
- **Modo Recorde Pessoal** — `MODES.personal`
  - 15 questões com benchmark por fato (`personalBenchmarkMs` via factStats)
  - "Bateu seu tempo!" → pontos completos · "Correto, mas devagar..." → +1 pt
  - Badge `🎯 Seu tempo: 2.1s` visível no card de pergunta
  - `state.beats` rastreia total batido na partida
  - xpMultiplier 0.18
- **Desafio Semanal Competitivo** — `MODES.weekly`
  - 10 questões idênticas para todos por semana ISO (seed determinístico)
  - Persiste melhor score em `data.weeklyChallenge = { week, score, completedAt }`
  - Badge dinâmico na ModesPage (`NOVO 🏆` ou `✓ {score} pts`)
  - xpMultiplier 0.30 (mais alto — sai 1× por semana)
  - Leaderboard global previsto para Fase 5 (Supabase já configurado)
- **Utilitários novos em `utils/index.js`:**
  - `getHardQuestion()`
  - `getPersonalRecordQuestions(factStats, count)`
  - `getWeeklyChallengeQuestions(date, count)`
  - `getCurrentWeekKey(date)` — "YYYY-Www"
- **ModesPage atualizada** — placeholders bloqueados substituídos por modos reais

### Filosofia
> Fase 4 traz competição honesta. Modo Difícil testa o pior caso. Recorde
> Pessoal compete contra si mesmo. Semanal compete contra todos.

---

## [3.5.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 3

**Economia e Loja Reformulada.** Detalhes em `sessions/sessao-028.md`.

### Adicionado
- **Power-ups Spot** no GamePage:
  - Vida Extra spot-buy no Survival (🪙 80) ao perder última vida
  - +60s Rush spot-buy (🪙 30) quando tempo ≤ 20s e sem estoque
- **Seguro de Ofensiva (🪙 100)** — `powerups.streakInsurance`
  - `applyStreakDecay` consome 1 seguro em vez de zerar a streak
  - Grava `streakInsuredAt` (ISO) — comportamento "uso único por quebra"
- **Congelar Missão Diária (🪙 50)** — `powerups.missionFreeze`
  - Botão em cada missão diária incompleta
  - Consome do estoque OU paga 50 🪙
  - `freezeMission()` em `utils/missions.js`; `initDaily` carrega missões
    com flag `frozen` do dia anterior preservando progresso
- **Apostas de Partida** — modal antes de iniciar modos principais
  - Valores: 10/25/50 🪙 → 30/75/150 🪙 se bater recorde
  - Apenas para rush/survival/speed/daily; modos de treino excluídos
  - `data.activeBet = { mode, amount }` persistido; resolvido no `handleGameEnd`
  - Toast de win/lose mostra resultado
- **Oferta da Semana** — `getWeeklyOffer(date)` em shop.js
  - 3 cosméticos com 40% off rotativos por semana ISO (seed determinístico)
  - Seção própria no topo do ShopPage, badge `-40%`, preço riscado
- **Temas de GamePage** — nova categoria `gameTheme` (3 itens)
  - 💠 Tema Neon (1.000 🪙), 🌌 Tema Aurora (2.500 🪙), 🔥 Tema Lava (5.000 🪙)
  - Aplicados ao gradiente do card de pergunta no GamePage
  - Tab "Jogo" adicionado às categorias da loja

### Filosofia
> Fase 2 deu ao jogador o método de memorização. Fase 3 dá a ele agência
> econômica: decisões de risco (apostar) e proteção do progresso (seguro,
> congelar). A loja agora tem ofertas que mudam — razão para visitar regularmente.

---

## [3.4.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 2

**Repetição espaçada + Modo Inverso + Certificados de Domínio.** Detalhes em `sessions/sessao-027.md`.

### Adicionado
- **Modo Flashcard com SRS (SM-2 simplificado)** — `src/pages/FlashcardPage.jsx`
  - Avaliação 3-níveis: Errei (10 min) · Difícil (1d, cresce devagar) · Fácil (3d, 6d, cresce no ease factor)
  - Persistência por fato em `srsData[fk] = { interval, easeFactor, reps, nextReview, lastReview }`
  - Fila de até 20 fatos por sessão (vencidos primeiro, depois novos)
  - Tela final com resumo `easy/hard/wrong` + pendentes restantes
  - Badge no menu: "🃏 X flashcards para revisar"
- **Modo Inverso** — `MODES.inverse` (15 questões, xpMultiplier 0.20)
  - Mostra "= 56" → dois inputs lado-a-lado para os fatores
  - Aceita qualquer par válido (7×8 e 8×7 ambos passam)
  - Card próprio na ModesPage, seção "Recuperação Reversa · Fase 2"
- **Certificados de Domínio por Tabuada** — 8 certificados (tabuadas 2..9)
  - Desbloqueados quando todos os 10 fatos da tabuada estão `dominated`
  - Critério idêntico ao Mapa de Domínio (<1.5s, ≥90% acerto, ≥3 amostras)
  - Seção dedicada no topo da AchievementsPage (grid 4×2)
  - **Não compráveis** — único caminho é o domínio real
- **Utilitários SRS em `utils/index.js`:**
  - `getAllFactKeys()`, `parseFactKey()`, `updateSrsFact()`
  - `countDueFlashcards()`, `getReviewQueue()`
  - `computeCertificates()`

### Removido
- Banner Desafio Diário do MenuPage (a pedido do usuário) — o desafio continua
  acessível como card principal dentro da ModesPage

### Filosofia
> Fase 1 mostrou ao jogador o que ele DOMINA. Fase 2 ensina a MEMORIZAR.
> SRS é o método científico mais comprovado para memorização de fatos.

---

## [3.3.0] — 2026-06-08 — TABUADA RUSH 3.0 · FASE 1

**Base pedagógica + correções críticas.** Detalhes em `sessions/sessao-026.md`.

### Adicionado
- **Página de Modos (`ModesPage.jsx`)** — todos os modos organizados em 3 seções:
  - Modos Principais (Rush, Sobrevivência, Velocidade, Desafio Diário)
  - Modos de Treino (Zen, Revisão)
  - Modos Avançados (Flashcard, Inverso, Difícil, Recorde Pessoal — placeholders Fase 2+ bloqueados)
  - Cards grandes com gradiente próprio, dificuldade textual, recorde pessoal e badges contextuais
- **Banner Desafio Diário no MenuPage** — card de destaque logo abaixo do perfil.
  - Estado pendente: gradiente âmbar/rosé chamativo, sugere "20 perguntas únicas · +30 XP"
  - Estado feito hoje: gradiente esmeralda discreto + pontuação do dia
  - Toque leva direto ao modo `daily`
- **Botão "Escolher Modo"** no MenuPage — substitui os dois grids de modos antigos.
  Leva para a nova `ModesPage`. Visual roxo destacado.
- **Mapa de Domínio Visual** no Catálogo de Precisão (`AccuracyCatalogPage`):
  - Grade 8×10 mostrando todos os 80 fatos fundamentais (2×1 até 9×10)
  - 4 cores: 🟢 Dominado (<1.5s + ≥90% acerto + ≥3 amostras) · 🟡 Praticado · 🔴 Problemático (>20% erro) · ⬜ Sem dados
  - Cabeçalho de progresso "X/80 fatos dominados (Y%)"
  - Legenda com contagem por estado
- **Persistência de `factStats`** no storage — agregação por par (a,b) normalizado.
  Cada fato registra `{correct, wrong, totalMs, count}`.
  Backward-compatible: bases antigas começam vazias e enchem conforme o jogador joga.

### Corrigido
- **Missão impossível eliminada:** `mm_score_1200` (target inatingível) → `mm_score_350` (atingível no Rush com boa performance)
- **Missão semanal de score ajustada:** `wm_score_800` (limite ~600 no Speed) → `wm_score_500`

### Filosofia
> Tabuada Rush 2.x praticava tabuada. A partir da Fase 1 do 3.0,
> o jogador vê pela primeira vez evidência VISUAL e REAL do que de fato domina.

---

## [ROADMAP] — 2026-06-08 — TABUADA RUSH 3.0 PLANEJADO

**Transformação pedagógica completa. Detalhes em `sessions/sessao-025.md`.**

### Fase 1 (próxima sessão)
- Fix missão impossível (mm_score_1200 → 350 pts)
- Página de Modos (ModesPage) + Banner Desafio Diário no menu
- Mapa de Domínio Visual (grade 8×10 colorida por domínio real)

### Fase 2 — Repetição Espaçada
- Modo Flashcard com SRS (spaced repetition system)
- Certificados de Domínio por tabuada
- Modo Inverso ("= 56, quais os fatores?")

### Fase 3 — Economia reformulada
- Power-ups spot (comprar no momento de perder)
- Seguro de Ofensiva, Congelar Missão, Apostas de Partida
- Oferta da Semana na loja

### Fase 4 — Novos Modos
- Modo Contra o Relógio Pessoal
- Desafio Semanal Competitivo com leaderboard
- Modo Difícil (tabuadas 7, 8, 9)

### Fases 5–6 — Social, Heatmap, Tabuada 11/12, Modo Combinado

---

## [3.2.1] — 2026-05-29 — XP×2 VISUAL, RESULTADOS E STATS DE POWER-UPS

### Adicionado — Badge ⚡ XP ×2 no GamePage
- Badge "⚡ XP ×2" aparece na linha de info durante a partida quando XP Dobrado está ativo

### Adicionado — Destaque de XP Dobrado no ResultsPage
- Banner roxo "XP Dobrado foi usado!" com valor base → dobrado
- Card de XP com fundo e texto violeta quando xp2Used=true

### Adicionado — Painel de Power-ups nas Estatísticas
- Seção "⚡ Power-ups" exibe estoque de cada consumível com cor ativa/vazia
- Link para Loja quando estoque está zerado

---

## [3.2.0] — 2026-05-29 — POWER-UPS, LOJA, MOEDAS E RUSH SCORING

### Adicionado — Power-ups consumíveis na Loja
- **Vida Extra (80🪙):** modal ao perder última vida no Survival — usa 1 vida do estoque
- **+60s Rush (120🪙):** botão visível durante o Rush quando há estoque; adiciona 60s
- **XP Dobrado (200🪙):** dobra o XP da próxima partida concluída; consome 1 unidade

### Modificado — Loja completamente reformulada
- 3 categorias: ⚡ Poder (power-ups consumíveis), 🖼️ Molduras, 🎨 Temas
- Adjetivos de título removidos; contador de estoque visível no badge
- Molduras: 800 / 1500 / 3000 / 8000 🪙 | Temas: 600 / 600 / 600 / 1500 / 4000 🪙
- Tab padrão: "Poder" (power-ups)

### Modificado — Rush scoring (score médio ~300–400 pts)
- `scoreScale: 0.25` no modo Rush; `calcPoints()` recebe parâmetro scale
- Score bruto escalado para nível comparável a Survival/Speed (era ~1400 pts médios)

### Modificado — Economia de moedas (cap 15/partida)
- **Antes:** 0.1 × score (Rush inflava para 140+ moedas); **Agora:** 0.3 × acertos, cap 15
- +2 moedas no Desafio Diário, +1 ao manter ofensiva

### Melhorado — Integração de power-ups no GamePage
- Prop `powerups` e `onUsePowerup` passados ao GamePage pelo App.jsx
- XP×2 consome 1 unidade e dobra o XP ao salvar resultado

---

## [3.1.1] — 2026-05-27 — RANKING, MISSÕES, XP, REVISÃO, TOASTS

### Modificado — Ranking de QI
- Homem-Aranha movido para tier `alto`, posicionado acima de Hermione Granger

### Modificado — Menu Principal
- Botão "Catálogo de Progresso" removido do menu — acesso exclusivo via Estatísticas/Evolução

### Modificado — Missões Semanais (dificuldade real de 1 semana)
- 35 e 60 partidas (~5–9/dia), semana perfeita (7 desafios diários), 1000 e 2000 acertos,
  streak de 20, score de 800, precisão de 95% — targets 3–4× maiores que antes

### Modificado — Missões Mensais (dificuldade real de 1 mês)
- 120 e 250 partidas, 4000 e 8000 acertos, 25 dias de ofensiva, 22 desafios diários,
  score de 1200 em uma única partida

### Modificado — Sistema de XP (~35% mais difícil)
- Rush: 0.18 → 0.12 | Survival: 0.30 → 0.20 | Speed: 0.25 → 0.16
- Daily: 0.40 → 0.28 | Review: 0.25 → 0.16
- Atualizado em `constants/index.js`, `App.jsx` e `ResultsPage.jsx`

### Melhorado — Modo Revisão
- Score de dificuldade composto: 50% taxa de erro + 30% tempo médio de resposta
  (avgMs cap 6000ms) + 20% volume absoluto de erros (cap 80 erros)

### Corrigido — Pop-ups no Mobile
- Toast de conquista e loja: `left-1/2 -translate-x-1/2` → `left-4 right-4 max-w-sm mx-auto` — não corta mais em telas pequenas

---

## [3.1.0] — 2026-05-27 — MODOS ZEN & REVISÃO, MASCOTE, INSANE COMBO, PARTÍCULAS, PWA

### Adicionado — Modos de Treino
- **Modo Zen**: treino livre sem timer/vidas/pontuação/XP — botão "Encerrar Treino" manual
- **Modo Revisão**: 15 questões focadas nas tabuadas com maior taxa de erro (`getRevisionQuestions`)
- `TRAINING_MODE_LIST`: seção "Treino" separada no menu (não mistura com os 4 modos principais)
- `MODES.zen` e `MODES.review` em `constants/index.js`; `getRevisionQuestions` em `utils/index.js`

### Adicionado — Mascote Matemático
- Personagem emoji no GamePage que reage em tempo real: 🤓 idle · 🤩 acerto · 😬 erro · 🔥 combo · 🤯 INSANE
- Animação spring suave com Framer Motion (AnimatePresence mode="wait")

### Adicionado — INSANE COMBO!
- Streak ≥ 10 (múltiplo de 5): texto "🤯 INSANE COMBO! ×N" com gradient roxo-rosa
- Screen shake: container oscila em X via Framer Motion ao INSANE COMBO
- Combo padrão (streak múltiplo de 5, < 10): mantido com amber/orange

### Adicionado — Explosão de Partículas (Level Up)
- Ao subir de nível: 28 partículas coloridas explodem do centro da tela (1,4s)
- Texto "LEVEL UP!" animado com badge do novo nível

### Adicionado — PWA Install Prompt
- Captura `beforeinstallprompt` do browser
- Banner "Instalar o App" aparece após 3s no menu
- Dispara `deferredPrompt.prompt()` no click; banner dismissível

### Modificado — ResultsPage
- Nova stat "Tempo Médio/Resp." (avgMs em segundos) — só exibe se dado disponível
- Nova stat "XP Ganho" — calculado com multiplicador por modo, oculto em Zen

### Adicionado — StatsPage
- Seção "Erros — Últimos 7 Dias": gráfico de barras verticais com erros/dia da semana

### Adicionado — Notificação de Missão Expirando
- `maybeMissionExpireReminder(missionsData)` em `src/lib/notify.js`
- ≤ 2h antes da meia-noite: notifica imediatamente (missões pendentes ou resgates disponíveis)
- 2–6h: agenda `setTimeout` para 1h antes da meia-noite
- Deduplicação por dia via localStorage; mensagens diferenciadas por estado

### Modificado — Reset de Progresso (Cloud)
- `handleReset` em SettingsPage agora apaga também o campo `data` no Supabase antes de limpar localStorage
- Evita restauração automática dos dados ao fazer login novamente
- UI: alerta "☁️ Seus dados na nuvem também serão apagados" quando o usuário está logado
- Estado `loading` com feedback visual durante o processo

---

## [3.0.0] — 2026-05-27 — CALIBRAÇÃO v3.0: XP POR MODO, QI MAIS DIFÍCIL, RESET

### Modificado — Sistema de XP
- XP é agora **100% baseado em performance** (score × multiplicador por modo)
- Rush `0.18` · Survival `0.30` · Speed `0.25` · Daily `0.40`  — Rush penalizado pois 5min gera scores altos facilmente
- **Removidos** bônus de streak diário e bônus de Desafio Diário — XP é mérito do jogador
- Progresso LEVELS recalibrado para curva ×2: nível 5 em ~1 mês, nível 10 em ~5 meses, nível 28 = lendário

### Modificado — QI Matemático (mais difícil)
- `computeQI`: caps elevados para exigir muito mais jogo antes de chegar ao QI máximo
  - `speedBest`: 30 → 80 respostas  |  `bestDayStreak`: 30 → 120 dias  |  `totalGames`: 50 → 300 partidas
- Só jogadores muito dedicados chegam perto de QI 200

### Adicionado — Reset de Progresso
- **`SettingsPage`**: seção "Zona de Perigo" com botão "Resetar Progresso"
- Confirmação em 2 etapas (anti-clique acidental) — apaga localStorage e recarrega o app

---

## [2.14.0] — 2026-05-27 — FASE 7: MOEDAS, LOJA, MISSÕES E TEMPORADAS

### Adicionado — Sistema de Moedas e Loja
- **`constants/shop.js`**: 4 raridades (comum/raro/épico/lendário), 12 itens (4 molduras, 3 títulos, 5 temas de card), `SHOP_ITEM_MAP`, `SHOP_CATEGORIES`
- **`ShopPage.jsx`**: tabs de categoria, grid de itens com badge de raridade, compra (deduz moedas), equipar/desequipar por slot (`frame`/`card`/`title`)
- Cosméticos aplicados no `MenuPage`: card usa gradiente do tema equipado, avatar usa ring da moldura, título do perfil vem do item de título

### Adicionado — Sistema de Missões
- **`constants/missions.js`**: pool de 11 diárias, 7 semanais, 5 mensais
- **`utils/missions.js`**: `getActiveMissions` (reset automático), `updateMissions`, `countUnclaimedMissions`, `getNewlyCompleted`, `claimMission` — seleção determinística via LCG com seed de data
- **`MissionsPage.jsx`**: tabs Diárias/Semanais/Mensais, countdown de reset, cards de missão com barra de progresso, botão "Resgatar" (+moedas)
- Badge numérico vermelho no botão Missões do menu quando há recompensas pendentes
- Toast "Missão concluída" após fim de partida quando nova missão é completada

### Adicionado — Sistema de Temporadas
- **`constants/seasons.js`**: Temporada 1 "Despertar Matemático" (mai–jul 2026), 10 marcos de recompensa (100 → 10 000 XP), `getActiveSeason()`, `calcSeasonXp()`
- **`SeasonsPage.jsx`**: hero com gradiente, barra de XP de temporada, trilha de recompensas com estados (bloqueado/atingido/resgatável/resgatado), dica de ganho de XP

### Modificado
- **`storage.js`**: 6 novos campos em DEFAULTS (`ownedItems`, `equippedItems`, `missionsData`, `seasonXp`, `seasonRewards`, `seasonId`)
- **`App.jsx`**: `handleGameEnd` calcula e salva `coinsEarned`, `earnedSeasonXp`, `updatedMissionsData`; 3 novas rotas (`shop`, `missions`, `seasons`)
- **`MenuPage.jsx`**: 3 botões novos em grid-cols-3 (Loja/Missões/Temporada), cosméticos aplicados dinamicamente

---

## [2.13.0] — 2026-05-27 — DASHBOARDS DE ACERTOS E ERROS (BLOCO 10)

### Adicionado
- **Dashboard de Acertos** (`pages/HitsPage.jsx`) — sub-página interna da StatsPage: texto inteligente automático (topo), filtros (Período: Hoje/Mês/Ano/Todos + seletor de mês + Modo), KPI cards (Precisão, Total Acertos, Melhor Sessão, Partidas), barra visual de taxa de acerto, gráfico de evolução da precisão (LineChart), precisão por modo (barras animadas), destaque de maior sequência
- **Dashboard de Erros** (`pages/ErrorsPage.jsx`) — sub-página interna da StatsPage: texto inteligente automático (construtivo), mesmos filtros, KPI cards (Taxa de Erro, Total Erros, Partidas, Tabuada Difícil), barra visual de taxa de erro, gráfico de evolução dos erros (LineChart), erros por modo (barras coloridas por severidade), erros por tabuada (barras do histório global), destaque da tabuada mais difícil
- Dois botões de acesso (`CheckCircle` emerald / `XCircle` rose) na StatsPage, logo abaixo dos 4 cards principais

### Técnico
- Navegação via `view` state local em `StatsPage` (`'main' | 'hits' | 'errors'`) — sem rota nova no App.jsx, sem remover nada existente
- Filtros reativos via `useMemo`; meses disponíveis calculados a partir dos dados reais

### Mantido
- Toda a StatsPage original intacta (summary cards, análise inteligente, resumo mensal, gráfico diário, por modo, exportação)
- Identidade visual inalterada (paleta violeta/emerald/rose, Nunito, `rounded-3xl`)

---

## [2.12.0] — 2026-05-27 — CATÁLOGO DE PRECISÃO (FASE 5 / BLOCO 9)

### Adicionado
- Página **Catálogo de Precisão** (`pages/AccuracyCatalogPage.jsx`), acessada de dentro da Estatísticas: Desempenho Matemático, Taxa de Acerto (geral/semana/mês/por modo + evolução), Velocidade (geral/recente/melhor/por modo), Erros (total/taxa/por modo), Precisão por Tabuada e Histórico de Precisão (LineChart)
- Tracking por questão no `GamePage` → agregado em `tableStats` (desempenho por tabuada: fator `a`), no `handleGameEnd` e sincronizado com a nuvem
- `tableStats` no storage
- Botão "Catálogo de Precisão" dentro da `StatsPage` (rota `accuracy`)

### Mantido
- Identidade visual inalterada (paleta violeta, Nunito, cards `rounded-3xl`, Recharts no padrão existente). Sem redesign.

---

## [2.11.0] — 2026-05-26 — CATÁLOGO DE PROGRESSO (FASE 5 / BLOCO 8)

### Adicionado
- Página **Catálogo de Progresso** (`pages/CatalogPage.jsx`): Progresso Geral, Experiência (XP), Sua Evolução (semana/mês/total), Marcos de Progresso, Catálogo de Níveis (28) e Registro de Evolução (timeline)
- `detectProgressEvents()` em `utils` — detecta novos marcos (nível, XP, ofensiva, recorde) por partida
- `progressLog` no storage (últimos 50 marcos), preenchido no `handleGameEnd` e sincronizado com a nuvem
- Botão destacado "Catálogo de Progresso" no MenuPage (rota `catalog`)

### Mantido
- Identidade visual inalterada (paleta violeta, Nunito, cards `rounded-3xl`, Framer Motion). Sem redesign.

---

## [2.10.0] — 2026-05-26 — PUSH COM APP FECHADO (WEB PUSH + SUPABASE)

### Adicionado
- Web Push real (notificação com app fechado): `lib/push.js` (subscribe/unsubscribe) + handler `push` no SW
- Tabela `push_subscriptions` + Edge Function `send-streak-reminders` (envia lembrete de ofensiva a quem não jogou hoje)
- Toggle de Lembretes assina/cancela o push (quando logado); reassina ao logar
- `PUSH_SETUP.md` com os 2 passos manuais (segredos VAPID/CRON + agendar cron)

### Pendente (ação do usuário)
- Definir os segredos da Edge Function e agendar o cron no Supabase (SQL pronto). Push exige login; iOS exige PWA instalada.

---

## [2.9.1] — 2026-05-26 — NOTIFICAÇÕES: CORREÇÃO MOBILE (SERVICE WORKER)

### Corrigido
- Service Worker agora é registrado (`public/sw.js`) e as notificações usam `registration.showNotification` → funcionam no mobile/Android (antes `new Notification()` quebrava)
- Ícones movidos para `public/icons/` (resolvem em dev e produção); SW servido em `/sw.js`
- Handler `notificationclick` (foca/abre o app) e `push` prontos (push real depende de backend VAPID — bloco futuro)
- Mensagens de lembrete focadas em ofensiva, com variação

### Limite honesto
- Notificações com app FECHADO/minimizado/tela bloqueada ainda exigem Push API + backend (não entregue nesta versão). iOS exige PWA instalada + Web Push.

---

## [2.9.0] — 2026-05-26 — MÚSICA DE FUNDO REAL + NOTIFICAÇÕES REAIS

### Adicionado
- Música de fundo ambiente gerada via Web Audio API (sem arquivos), com loop suave + drone; toggle nas Configurações
- Notificações reais (Web Notifications API): permissão ao ativar + lembrete local de ofensiva ao abrir o app (1×/dia)
- Música inicia no 1º gesto do usuário (política de autoplay); independente dos efeitos, respeita o volume geral

### Nota
- Notificações com app fechado (Push) ficam para bloco futuro. Identidade visual inalterada.

---

## [2.8.2] — 2026-05-26 — MODO ESCURO: FUNDO GLOBAL DA TELA

### Corrigido
- No modo escuro, a tela inteira agora escurece (html, body e container raiz), não só os cards
- Container raiz passou de `bg-[hsl(...)]` fixo para classe `.app-shell` adaptativa (modo claro inalterado)

---

## [2.8.1] — 2026-05-26 — AJUSTES: HEADER (ÁUDIO) + LOGIN CONDICIONAL

### Removido
- Botão de áudio/volume separado do header do menu (som/música/volume já ficam nas Configurações)

### Alterado
- Botão de login no header só aparece quando o usuário NÃO está logado (logout/conta ficam nas Configurações)

### Nota
- Sem mudança visual; apenas remoção de redundâncias e lógica de exibição

---

## [2.8.0] — 2026-05-26 — FASE 4 / BLOCO 6: CONFIGURAÇÕES GERAIS

### Adicionado
- Página de Configurações (botão de engrenagem ao lado do som no menu)
- Som: efeitos (on/off), volume (slider), música (toggle preparado)
- Tema Claro/Escuro — adapta neutros e contraste, preserva as cores da marca (`darkMode: 'class'`)
- Acessibilidade: texto grande, reduzir animações, alto contraste
- Notificações: toggle de lembretes (estrutura preparada)
- Conta: progresso (nível/QI/XP/moedas), login/logout, status de sincronização
- Preferências persistidas (`lib/prefs.js`), aplicadas no load sem flash

### Nota
- Modo claro inalterado; modo escuro só adapta legibilidade/contraste. Sem redesign.

---

## [2.7.2] — 2026-05-26 — GRÁFICO DE EVOLUÇÃO FOCADO NO DESAFIO DIÁRIO

### Alterado
- O gráfico "Evolução de Pontos" passa a considerar apenas as partidas do Desafio Diário (título e estado vazio atualizados)

---

## [2.7.1] — 2026-05-26 — ANÁLISE: TEMPO MÉDIO DE RESPOSTA REAL

### Adicionado
- Captura de tempo de resposta por questão (GamePage) → `avgMs` por partida + recorde `fastestAvgMs`
- Insights de velocidade baseados em tempo real (recente vs anterior), com fallback para o proxy antigo
- Resumo mensal mostra tempo médio de resposta com variação (mais rápido/lento) vs mês anterior

### Nota
- Retrocompatível (sessões antigas sem tempo usam o proxy). Visual preservado.

---

## [2.7.0] — 2026-05-26 — ANÁLISE INTELIGENTE DO USUÁRIO

### Adicionado
- Motor de análise (`utils/analysis.js`): textos automáticos data-driven (evolução, precisão, velocidade, modos, ofensiva), frases variadas e determinísticas
- Dashboard (StatsPage): card "Análise Inteligente" (resumo + observações por tom) e "Resumo do Mês" (indicadores com deltas vs mês anterior)
- Menu: banner de insight clicável que leva às Estatísticas

### Nota
- Não é IA real — interpreta dados reais do usuário. Identidade visual preservada.

---

## [2.6.0] — 2026-05-26 — SISTEMA DE OFENSIVA AVANÇADO

### Adicionado
- Reset automático da ofensiva ao perder um dia OU virar o ano (recordes/conquistas não resetam)
- Modal de definição de meta no login/novos ciclos (opções 5/10/15/20/35/40 dias)
- Nova meta solicitada ao bater a anterior (progresso relativo à base)
- Conquistas de Ofensiva (5/10/15/20/35/40/100/250/365 dias) na página de Conquistas
- Recompensas por marco de ofensiva (40/100/250/365): escolher Nível / +QI / +XP / Moedas
- Base de moedas (`coins`, exibida no card) e bônus de QI (`qiBonus` somado ao QI)
- Modais GoalModal e RewardModal no estilo do projeto

### Alterado
- Card de perfil: meta agora abre modal (pills removidas); progresso relativo à base; chip de moedas

### Nota
- Identidade visual preservada; retrocompatível

---

## [2.5.1] — 2026-05-26 — POLISH: ANIMAÇÕES DE EVOLUÇÃO

### Adicionado
- Auto-scroll até o personagem atual ao abrir a página de Ranking de QI
- Toast animado "Nova Classificação!" ao subir de personagem no Ranking (além do toast de level-up já existente)

---

## [2.5.0] — 2026-05-26 — DEPLOY AUTOMÁTICO + REBALANCEAMENTO DE XP

### Adicionado
- Rotina de fim de bloco/sessão (`CLAUDE.md`): registros → push → deploy auto → resumo
- Deploy automático via integração Git Vercel↔GitHub (push em `main` publica produção)

### Alterado
- **XP mais "real" / difícil de subir de nível:**
  - Curva de níveis íngreme (deltas crescentes ~×1.235); topo 90.000 → **227.900 XP**
  - Ganho de XP por partida agora é modesto: `round(score×0.5) + bônus diário(20) + ofensiva(≤30)` (antes: score cheio + bônus maiores)

### Nota
- Retrocompatível (níveis por XP); identidade visual inalterada

---

## [2.4.0] — 2026-05-25 — FASE 2 / BLOCO 3: RANKING DE QI MATEMÁTICO

### Adicionado
- **Sistema "Ranking de QI Matemático"** (lúdico — não mede QI real)
- Página de Ranking (`RankingPage.jsx`): hero do usuário (QI, personagem, classificação, posição, progresso) + lista completa por categoria com destaque do personagem atual
- **104 personagens** (`constants/characters.js`) em 4 categorias (baixo/médio/alto/gênio), 26 cada — **personagens famosos e reconhecíveis** (Patrick → Einstein) com nome, emoji/avatar, descrição e posição
- Cálculo de QI (`computeQI`) baseado em precisão, velocidade, ofensiva, consistência e progresso; faixa lúdica 70–200
- `getQiInfo` mapeia QI → posição/personagem/tier + progresso até o próximo
- Botão "Ranking QI" no menu (substitui o placeholder "Ranking em breve")
- Linha de QI/classificação no card de perfil (pequena, integrada, clicável)

### Nota
- Identidade visual, cores e estética originais preservadas (avatares = emoji, tokens de cor do projeto)

---

## [2.3.0] — 2026-05-25 — FASE 2 / BLOCO 2: PERFIL E IDENTIDADE DO USUÁRIO

### Adicionado
- Sistema de níveis expandido: **7 → 28 níveis**, cada um com nome, **título** e emoji/avatar
- Sistema de títulos do usuário (muda conforme o nível) — visível no card de perfil e na ResultsPage
- Sistema de ofensiva diária com recorde (`bestDayStreak`)
- Meta de ofensiva pessoal (`streakGoal`: 7/15/30/100 dias) com barra de progresso e seleção por pills
- Card de perfil expandido: avatar, título, nível, XP, barra de progresso, ofensiva, recorde e meta — no mesmo gradiente violeta
- XP agora também vem de bônus: desafio diário (+30) e ofensiva diária mantida

### Melhorado
- `handleGameEnd`: cálculo de XP integra score + bônus de diário + bônus de ofensiva
- Persistência: novos campos `bestDayStreak` e `streakGoal` (retrocompatível via DEFAULTS)

### Corrigido / Alterado
- **Desafio Diário não fica mais bloqueado** — sempre acessível; badge "✓ hoje" apenas informativo

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.2.0] — 2026-05-25 — FASE 1 / BLOCO 1: REMOÇÃO DO 2 JOGADORES

### Removido
- Modo 2 Jogadores completamente removido (sem código morto)
  - Deletado `src/pages/BattlePage.jsx`
  - Removido import + rota `battle` em `App.jsx`
  - Removido botão "2 Jogadores" e ícone `Swords` do `MenuPage.jsx`

### Adicionado
- Placeholder "Ranking em breve" (botão desabilitado, ícone `Medal`) no lugar do antigo botão 2 Jogadores — reserva o espaço para a futura página "Ranking de QI Matemático"

### Melhorado
- Card de perfil (level card) marcado estruturalmente para futuras adições (ofensiva, ranking, QI, recompensas) — sem alteração visual

### Nota
- Identidade visual, cores, layout e estética originais 100% preservados

---

## [2.1.1] — 2026-05-22 — DEPLOY VERCEL

### Adicionado
- Deploy em produção: https://tabuada-rush-rho.vercel.app
- Variáveis de ambiente configuradas no Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)

### Corrigido
- Conflito de merge no `index.html` resolvido via force push (remote tinha versão v1 vanilla)

---

## [2.1.0] — 2026-05-22 — FASE 2: AUTH + AUDIO + CLOUD

### Adicionado
- Sistema de áudio via Web Audio API (zero arquivos — 100% sintetizado)
  - 10 sons: correct, wrong, combo, levelUp, achievement, gameOver, victory, click, timerWarning, newRecord
  - Mute/unmute com persistência em localStorage
  - Hook `useAudio` para toggle no UI
- Autenticação com Supabase (email/senha)
  - AuthPage com tabs login/cadastro, validação e feedback
  - Login opcional — app funciona 100% sem conta
  - Botão de logout no header do menu
- Sincronização em nuvem via Supabase
  - Migração automática: localStorage → Supabase no primeiro login
  - Sync automático após cada partida
  - Degradação graceful sem credenciais configuradas
- Exportação de dados na StatsPage
  - JSON completo (stats + conquistas + histórico)
  - CSV do histórico de sessões
- Streak diária visível no level card (🔥 N dias)
- Toast "Novo Recorde!" além de level up e conquistas
- `SUPABASE_SETUP.md` — guia passo a passo para configurar backend
- `.env.example` — template de variáveis de ambiente

### Melhorado
- MenuPage: controles de áudio e auth no header
- GamePage: sons em todos os eventos (acerto, erro, combo, timer, fim)
- AppContext: sync automático com cloud quando logado
- Lógica de streak mais precisa (não duplica em jogos múltiplos no mesmo dia)

### Corrigido
- Removido React.StrictMode (conflito com Framer Motion AnimatePresence)
- Bug de streak: mantém valor se já jogou hoje (não incrementa duas vezes)

---

## [2.0.0] — 2026-05-22 — RECONSTRUÇÃO COMPLETA

### Adicionado
- React 18 + Vite 5 substituindo HTML/JS/CSS vanilla
- TailwindCSS 3 com design system completo
- Framer Motion para todas as animações
- Recharts para gráfico de evolução nas estatísticas
- Lucide React para ícones consistentes
- Design system com tokens CSS (paleta por modo)
- Font Nunito (Black 900 para impacto visual)
- Gradientes únicos por modo (violet, rose, amber, emerald)
- GamePage com useReducer (arquitetura limpa de estado)
- AchievementsPage com 16 conquistas e estados visuais
- BattlePage modo 2 jogadores local (split screen)
- Toast animado para conquistas desbloqueadas
- Toast animado para level up
- Sistema de memória persistente (MEMORY.md, etc.)
- .claude/launch.json para preview integrado

### Melhorado
- Modo Sobrevivência agora conta tempo decorrido
- Seed determinística para Desafio Diário (LCG algorithm)
- Persistência mais robusta com defaults completos
- Animações de feedback (shake no erro, pop no acerto)
- Combo popup animado a cada 5 streak
- Progress bar por modo com cor temática
- Empty states elegantes em Recordes e Estatísticas

### Removido
- index.html vanilla (substituído pelo entry point Vite)
- Chart.js (substituído por Recharts)
- Toda lógica inline no HTML

---

## [1.0.0] — 2026-05 — VERSÃO INICIAL

- HTML/CSS/JS vanilla em arquivo único
- 4 modos de jogo básicos
- localStorage simples
- Chart.js para gráfico
- Service Worker básico
