# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

---

## 🗂️ INSTRUÇÃO PERMANENTE — DOCUMENTO

**Quando o usuário (Davi) disser "documento" neste projeto:**
→ Atualizar o arquivo `C:\Users\HP\Documents\TabuadaRush - jogo\Tabuada (2).docx` (dentro da pasta do projeto — pode ser commitado no Git).
→ Ler o documento completo primeiro (via skill `anthropic-skills:docx` ou agente), identificar onde parou, e acrescentar as mudanças da sessão atual mantendo a formatação/estilo existente.
→ Após atualizar, fazer commit do `.docx` junto com os demais arquivos da sessão.
→ O documento registra o histórico completo do projeto: versões, funcionalidades, sessões de desenvolvimento.

---

---

## 📍 ESTADO ATUAL

**Data:** 2026-08-09
**Versão:** 5.0.0 (Tabuada Rush 5.0 — redesign, consolidação de modos, mascotes — sessao-043.md)
**Status:** ⚠️ Sessão gigante, várias frentes abertas simultaneamente. Build limpo o tempo todo, mas HÁ pendências diretas sinalizadas ao Davi (ver seção "PRÓXIMA SESSÃO" abaixo) — não é um estado "fechado" como o fim da sessão 042.
**[v5.0.0]** Redesign completo por pedido do Davi: paleta própria "Caderno Quadriculado" (só aplicada no Menu + tokens base, resto do app pendente), sidebar de navegação (desktop), Menu simplificado (3 destinos primários: Modos/Recompensas/Estatísticas), **modos reduzidos de 10 pra 3** (Rush agora é a fusão de Rush+Sobrevivência+Velocidade+Diário — timer cresce com acerto, 3 vidas —, Zen e Revisão mantidos), **desbloqueio progressivo removido** (tudo liberado desde o início — reverte D008), Ranking de QI 104→52 personagens, Loja só com power-ups (cosméticos removidos, 2 power-ups novos: Escudo e Largada Turbo), economia mais dura (menos moeda por partida, Zen sem XP/moeda), e **mascotes Tuca (tartaruga) e Vupt (lebre)** — fábula de Esopo, arte gerada por IA (ChatGPT+Pika) processada por um pipeline Python próprio (remoção de fundo + WebP animado), integrados no GamePage com frequência controlada (sorteio + teto por partida). Balão de fala e voz do mascote foram DESLIGADOS temporariamente (Davi vai mandar frases/áudio finais). Ver `sessao-043.md` e `DECISIONS.md` D015-D019.
**[v3.17.0]** Tabuada Rush voltou a ser exclusivamente sobre MULTIPLICAÇÃO — esse é o propósito original do projeto (decorar a tabuada) e a 4.0 tinha diluído isso pra "ser bom em matemática" (4 operações). Removido: `OPERATIONS.add/.sub/.div`, seletor de operação, abas de operação, radar cross-operação, certificado "Matemática Fundamental Completa", bônus de amplitude no QI. Mantido: curva de esquecimento, motor preditivo no Modo Revisão, banner "Fatos a Vencer", viés adaptativo por fatos fracos (toggle "Foco em Fraquezas"). Ver `sessao-042.md`.
**[v3.16.1]** Leaderboard Global removido por completo (página, botão, upload de score) — pedido direto do Davi. Desafio Diário/Semanal continuam existindo, só sem comparação global. Tabelas `leaderboard_daily`/`leaderboard_weekly` no Supabase ficaram órfãs (não apagadas — ver `SUPABASE_SETUP.md`).
**Servidor dev:** `http://localhost:3000` (npm run dev) · **Produção:** https://tabuada-rush-rho.vercel.app

---

## ✅ TABUADA RUSH 3.0 — ROADMAP 100% ENTREGUE (v3.3.0 → v3.8.0 · sessões 026-031)

> Filosofia: "praticar → memorizar" via Repetição Espaçada. 6 fases, 20+ features:
> Mapa de Domínio, SRS/Flashcard, Certificados, Modo Inverso, economia reformulada,
> Modo Difícil, Recorde Pessoal, Desafio Semanal, Leaderboards, Heatmap, Share Card,
> Tabuada 11/12, Modo Combinado. Detalhes completos em `sessions/sessao-025.md`
> (planejamento) e `sessions/sessao-031.md` (fechamento).

---

## ⚠️ TABUADA RUSH 4.0 — ENTREGUE E DEPOIS PARCIALMENTE REVERTIDO (v3.11.0 → v3.17.0)

> A 4.0 foi entregue completa (Fases 1-6, sessões 035-040, v3.11.0→v3.16.0)
> com dois pilares: "Matemática Completa" (soma/subtração/divisão) e
> "Inteligência Adaptativa" (curva de esquecimento, viés por fraqueza). Na
> sessão 042, Davi refletiu que o pilar "Matemática Completa" tinha diluído o
> propósito ORIGINAL do projeto (decorar a TABUADA, não "ser bom em
> matemática") — e reverteu essa parte. **Só "Inteligência Adaptativa"
> sobreviveu**, agora escopada só pra multiplicação. Ver `DECISIONS.md` D014
> e `sessions/sessao-042.md` pro registro completo da decisão e da reversão.
>
> **O que existe hoje (pós-reversão):** curva de esquecimento
> (`predictRecallProbability`/`getFactsAtRisk`), motor preditivo no Modo
> Revisão, banner "Fatos a Vencer", viés adaptativo por fatos fracos em
> Rush/Sobrevivência/Velocidade/Zen (toggle "Foco em Fraquezas"). **O que foi
> removido:** `OPERATIONS.add/.sub/.div`, seletor de operação, abas de
> operação, radar cross-operação, certificado "Matemática Fundamental
> Completa", bônus de amplitude no QI.
>
> **Bugs corrigidos ao longo do caminho (histórico):** B007 (contador de
> certificados hardcoded) e B008 (`tableStats` sempre `.mult` no GamePage)
> — ver `BUGS.md`.

**Sem roadmap formal em aberto.** Próxima sessão: ver seção abaixo.

---

## 🎨 TABUADA RUSH 5.0 — EM ANDAMENTO (v4.x → v5.0.0 · sessão 043)

> Sessão 043 foi um redesign grande e não terminou 100% fechado — várias
> frentes ficaram pela metade de propósito (build limpo em todas, mas UI
> inconsistente entre telas até a próxima sessão terminar a migração). Ver
> `sessions/sessao-043.md` (registro completo, cronológico, inclui os
> caminhos tentados e descartados) e `DECISIONS.md` D015-D019.
>
> **Entregue nesta sessão:** paleta "Caderno Quadriculado" (só Menu +
> tokens base), sidebar desktop, Menu QI-first com 3 destinos primários,
> modos reduzidos de 10→3 (Rush fundido, Zen, Revisão), desbloqueio
> progressivo removido, Ranking de QI 104→52, Loja só power-ups (+Escudo
> +Largada Turbo), economia mais dura, mascotes Tuca/Vupt com pipeline de
> animação próprio.
>
> **NÃO entregue (pendência direta, sem ambiguidade — ver PRÓXIMA SESSÃO):**
> paleta nas telas restantes, reorganização de verdade da StatsPage,
> tamanho/posição final do mascote, balão de fala + voz (desligados,
> esperando conteúdo final do Davi), painel temático por personagem
> específico (não só por tier).
>
> **Pausado por decisão do Davi, não é bug nem esquecimento:** Modo
> História (narrativa infinita) — ver D018.

---

## ✅ O QUE ESTÁ PRONTO

- [x] Setup React + Vite + Tailwind + Framer Motion + Recharts
- [x] Design system com tokens CSS + paleta por modo
- [x] MenuPage com level card, streak, auth button, audio toggle
- [x] GamePage com useReducer + timer + animações + sons
- [x] Modo Rush / Sobrevivência / Velocidade / Desafio Diário
- [x] ResultsPage com stats animadas + gradiente por modo
- [x] RecordsPage / StatsPage / AchievementsPage / BattlePage
- [x] Persistência localStorage completa
- [x] Sistema de XP e níveis (7 níveis)
- [x] Sistema de conquistas (16 conquistas)
- [x] Toast de conquista + level up + novo recorde animados
- [x] **[NOVO v2.1] Sistema de áudio — Web Audio API (audioManager.js)**
  - Sons: correct, wrong, combo, levelUp, achievement, gameOver, victory, timerWarning, newRecord, click
  - Mute/unmute persistido em localStorage
  - Hook useAudio.js para toggle no menu
- [x] **[NOVO v2.1] Supabase Auth — email/senha**
  - AuthContext.jsx com signIn, signUp, signOut
  - AuthPage.jsx com UI premium (login/register)
  - Tela acessível via botão Login no MenuPage
  - Graceful degradation quando Supabase não configurado
- [x] **[NOVO v2.1] Cloud Sync (Supabase)**
  - sync.js: loadCloudData + saveCloudData
  - AppContext atualizado: auto-sync no update()
  - Migração automática: localStorage → Supabase no primeiro login
  - Dados preservados offline (localStorage sempre ativo)
- [x] **[NOVO v2.1] Exportação de dados (StatsPage)**
  - Exportar JSON completo
  - Exportar CSV do histórico de sessões
- [x] **[NOVO v2.1] Streak diária visível no level card**
  - 🔥 N dias exibido no card de nível
- [x] Sistema de memória persistente (MEMORY.md, MEMORY_CORE.md, etc.)
- [x] **[v2.2 — Fase 1/Bloco 1] Modo 2 Jogadores removido** (BattlePage deletado, rota e botão removidos, sem código morto)
- [x] **[v2.2] Espaço de Ranking preparado** — placeholder "Ranking em breve" (Medal, disabled) no MenuPage
- [x] **[v2.3 — Fase 2/Bloco 2] Sistema de níveis 28 níveis** com `name` + `title` + `badge` + `xp`
- [x] **[v2.3] Sistema de títulos** do usuário (muda por nível), visível no perfil e ResultsPage
- [x] **[v2.3] XP integrado** — score + bônus de diário (+30) + bônus de ofensiva
- [x] **[v2.3] Ofensiva diária + recorde** (`currentStreak` + `bestDayStreak`)
- [x] **[v2.3] Meta de ofensiva** (`streakGoal` 7/15/30/100) com progresso, no card de perfil
- [x] **[v2.3] Card de perfil completo** (avatar, título, nível, XP, ofensiva, recorde, meta)
- [x] **[v2.3] Desafio Diário desbloqueado** (sempre acessível; badge "✓ hoje" informativo)
- [x] **[v2.4 — Fase 2/Bloco 3] Ranking de QI Matemático** — página `RankingPage` + botão "Ranking QI"
- [x] **[v2.4] 104 personagens** (`constants/characters.js`) em 4 categorias (26 cada)
- [x] **[v2.4] computeQI / getQiInfo** (`utils`) — QI lúdico 70–200 → posição/personagem
- [x] **[v2.4] QI no card de perfil** (linha pequena, clicável → ranking)
- [x] **[v2.11 — Fase 5/Bloco 8] Catálogo de Progresso** (`CatalogPage`): Progresso Geral, XP, Evolução (semana/mês/total), Marcos, Catálogo de Níveis (28), Registro de Evolução
- [x] **[v2.11] `progressLog`** no storage + `detectProgressEvents()` (marcos de nível/XP/ofensiva/recorde) anexados no `handleGameEnd`
- [x] **[v2.12 — Fase 5/Bloco 9] Catálogo de Precisão** (`AccuracyCatalogPage`, acesso dentro da Estatísticas): precisão (geral/semana/mês/modo), velocidade, erros, precisão por tabuada, histórico (LineChart)
- [x] **[v2.12] `tableStats`** no storage — GamePage registra por questão (`{a,b,correct,ms}`) → `handleGameEnd` agrega por tabuada (fator `a`)
- [x] **[v2.13 — Bloco 10] Dashboards de Acertos e Erros** — sub-páginas internas da StatsPage
- [x] **[v3.0 — Calibração] XP puro por performance + QI mais difícil + Reset de progresso**
  - XP = score × multiplicador por modo (Rush 0.18, Survival 0.30, Speed 0.25, Daily 0.40)
  - Removidos bônus de streak/dia — XP é 100% mérito do jogador
  - LEVELS com thresholds ×2 (equilíbrio): nível 5 em ~1 mês, nível 10 em ~5 meses
  - computeQI mais difícil: caps speedBest→80, totalGames→300, bestDayStreak→120
  - SettingsPage: botão "Resetar Progresso" com confirmação de 2 etapas (Zona de Perigo)
- [x] **[v2.14 — FASE 7] Sistema de Moedas, Loja, Missões e Temporadas**
  - `constants/shop.js`: 4 raridades, 12 itens (molduras/títulos/temas de card)
  - `ShopPage.jsx`: compra e equipa itens; cosméticos refletem no card de perfil (MenuPage)
  - `constants/missions.js` + `utils/missions.js`: pools diário/semanal/mensal, LCG determinístico, reset automático
  - `MissionsPage.jsx`: progresso, resgates, badge de notificação no menu
  - `constants/seasons.js` + `SeasonsPage.jsx`: Temporada 1 "Despertar Matemático", trilha 10 marcos, XP separado
  - `handleGameEnd` integrado: coins earned, season XP, missions update a cada partida
- [x] **[v3.1] Modos Zen e Revisão, mascote, INSANE COMBO, partículas level-up, PWA**
  - `MODES.zen`: treino livre, XP zero, botão "Encerrar Treino"
  - `MODES.review`: 15 questões focadas nas piores tabuadas (`getRevisionQuestions`)
  - `TRAINING_MODE_LIST`: seção "Treino" separada no menu
  - GamePage: mascote reativo (🤓/🤩/😬/🔥/🤯), INSANE COMBO ao streak ≥ 10, screen shake
  - ResultsPage: stat "Tempo Médio/Resp." + "XP Ganho"
  - StatsPage: gráfico "Erros — Últimos 7 Dias" (barras por dia da semana)
  - App: `LevelUpBurst` (28 partículas coloridas ao subir nível), `InstallBanner` (PWA)

---

## 🎯 PRÓXIMA SESSÃO — PENDÊNCIAS DIRETAS DA 5.0 (sem ambiguidade)

**Ler obrigatoriamente antes de começar:** `sessions/sessao-043.md` (registro
completo e cronológico — inclui os caminhos tentados e descartados, útil pra
não repetir esforço) + `DECISIONS.md` D015-D019.

**Ordem sugerida (Davi validou essa priorização no fim da sessão 043):**
1. **Tamanho/posição final do mascote** — Davi vai mandar imagens de
   referência mostrando escala e posição exatas. A versão atual (224px,
   fixo na borda direita via portal) é aproximação, não confirmada.
2. **Migrar a paleta "Caderno Quadriculado" nas telas restantes** —
   Modos/Recompensas/Estatísticas/Loja ainda usam os tokens verdes/azuis
   do Duolingo (tentativa abandonada, ver D015). Só depois disso remover
   os tokens Duolingo do `tailwind.config.js`.
3. **Reorganizar a `StatsPage` de verdade** — hoje é um catch-all que
   absorveu 6 telas antigas como abas internas; Davi já sinalizou que
   "ainda tá bagunçada", isso foi um remendo, não a solução final.
4. **Reativar balão de fala + voz do mascote** — só quando o Davi mandar
   as frases finais e o áudio (gravado ou gerado). Não reimplementar sem
   esse conteúdo.
5. **Painel temático por personagem específico** (não só por tier) — Davi
   quer, ex., "painel do Goku" quando o QI cair nesse personagem
   específico. Precisa de uma estrutura de cor/tema por personagem (52
   combinações) que ainda não existe.

**Em aberto, sem decisão ainda (não é pendência técnica — é decisão de
produto que precisa de conversa):**
- Economia de moedas/aposta — Davi disse explicitamente "não sei o que
  fazer, precisa ser uma ideia muito boa". Não inventar sozinho.
- `ACHIEVEMENTS.survival_30`/`.speed_20`/`.daily_first`/`.daily_7`
  referenciam stats de modos removidos (nunca mais incrementam) — decisão
  de conquistas pendente, não tocado nesta sessão.

**Pausado por decisão explícita do Davi, não retomar sem ele pedir:** Modo
História (narrativa infinita) — ver D018.

---

## 🐛 BUGS CONHECIDOS

- Nenhum bug ativo conhecido no APP em si.
- **Ambiente de preview (Claude Code, não é bug do app):** o Browser pane
  desta sessão não compôs frames (`screenshot` falha, cliques via
  `computer`/dispatch de evento não produzem navegação observável) —
  testado exaustivamente na sessão 043 (aba nova, servidor reiniciado, ref
  click, coordinate click, dispatch nativo, handler React direto — sempre
  o mesmo resultado). Leitura (`get_page_text`/`read_page`/JS de inspeção)
  funciona normal. Recomendação: não tentar screenshot/clique nesse
  ambiente — verificar por build limpo + inspeção de DOM via JS, e pedir
  confirmação visual ao Davi quando precisar de certeza.

---

## 🔑 ARQUIVOS CRÍTICOS

| Arquivo | Importância |
|---------|-------------|
| `src/App.jsx` | Orquestrador geral + handleGameEnd + toasts |
| `src/pages/GamePage.jsx` | Lógica do jogo + áudio integrado |
| `src/lib/storage.js` | localStorage KEY: `tabuada_rush_v2` |
| `src/lib/audioManager.js` | Web Audio API singleton |
| `src/lib/supabase.js` | Cliente Supabase + isSupabaseConfigured |
| `src/contexts/AuthContext.jsx` | Auth state + signIn/signUp/signOut |
| `src/contexts/AppContext.jsx` | Data state + cloud sync |
| `src/services/sync.js` | loadCloudData + saveCloudData |
| `src/pages/HitsPage.jsx` | Dashboard de Acertos (sub-página interna de StatsPage) |
| `src/pages/ErrorsPage.jsx` | Dashboard de Erros (sub-página interna de StatsPage) |
| `src/pages/ShopPage.jsx` | Loja — só power-ups desde a 5.0 (cosméticos removidos) |
| `src/pages/RewardsPage.jsx` | [v5.0] Hub com abas Missões/Loja/Temporada |
| `src/pages/MissionsPage.jsx` | Missões diárias/semanais/mensais |
| `src/pages/SeasonsPage.jsx` | Trilha de temporada com recompensas |
| `src/components/Sidebar.jsx` | [v5.0] Nav lateral, desktop-only (`lg+`) |
| `src/components/Mascot.jsx` | [v5.0] Sistema de mascote — Tuca/Vupt, poses por humor, frequência controlada em `GamePage` |
| `src/assets/mascots/*.webp` | [v5.0] Poses animadas (geradas por IA + pipeline Python de remoção de fundo — ver D019) |
| `src/constants/shop.js` | Itens da loja — só `powerup` desde a 5.0 |
| `src/constants/missions.js` | Pools de missões por período |
| `src/constants/seasons.js` | Temporadas, calcSeasonXp |
| `src/utils/missions.js` | Lógica completa de missões |
| `src/constants/index.js` | MODES, LEVELS, ACHIEVEMENTS |
| `src/utils/index.js` | getDailyQuestions, calcPoints, checkNewAchievements |
| `SUPABASE_SETUP.md` | Guia passo a passo para configurar backend |
| `.env.example` | Template de variáveis de ambiente |

---

## 🔁 ROTINA DE FIM DE BLOCO/SESSÃO (obrigatória — pedida pelo Davi)

Ao concluir cada bloco/sessão: (1) registros completos (.md = vault Obsidian),
(2) commit + `git push origin main`, (3) deploy Vercel AUTOMÁTICO via integração Git
(o push dispara — não usar CLI, token expirou), (4) resumo final ao usuário: o que foi
feito + próximos passos/sessões/etapas. Detalhes em `CLAUDE.md`. Dar o link do projeto

---

## 💡 CONTEXTO RÁPIDO PARA IA

Para continuar qualquer sessão, ler nesta ordem:
1. Este arquivo (MEMORY_CORE.md) — 2 min
2. `MEMORY.md` — 5 min (arquitetura completa)
3. `sessions/sessao-043.md` — última sessão (redesign 5.0, longa — vale ler inteira antes de propor mudança visual/de modos)
4. `DECISIONS.md` D015-D019 — decisões da 5.0
5. `BUGS.md` — problemas ativos

**Supabase não configurado:** App funciona 100% com localStorage.
Para ativar cloud: criar `.env` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
e executar o SQL de `SUPABASE_SETUP.md`.
