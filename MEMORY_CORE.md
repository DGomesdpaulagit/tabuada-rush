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

**Data:** 2026-07-06
**Versão:** 3.13.0 (Tabuada Rush 4.0 · Fase 3 — Divisão entregue · 🎉 Matemática Completa fechada)
**Status:** ✅ Roadmap 3.0 100% entregue (v3.3-3.8) + refinamentos (v3.9-3.10). ✅ Roadmap 4.0 planejado (sessao-034.md, 6 fases). ✅ Fase 1 (fundação) + ✅ Fase 2 (Soma/Subtração) + ✅ **Fase 3 entregue** (sessao-037.md — Divisão, mecanismo `cellFact`). **Pilar "Matemática Completa" 100% fechado.** **🚨 Próxima sessão: Fase 4 da 4.0 (Inteligência Preditiva).**
**Servidor dev:** `http://localhost:3000` (npm run dev) · **Produção:** https://tabuada-rush-rho.vercel.app

---

## ✅ TABUADA RUSH 3.0 — ROADMAP 100% ENTREGUE (v3.3.0 → v3.8.0 · sessões 026-031)

> Filosofia: "praticar → memorizar" via Repetição Espaçada. 6 fases, 20+ features:
> Mapa de Domínio, SRS/Flashcard, Certificados, Modo Inverso, economia reformulada,
> Modo Difícil, Recorde Pessoal, Desafio Semanal, Leaderboards, Heatmap, Share Card,
> Tabuada 11/12, Modo Combinado. Detalhes completos em `sessions/sessao-025.md`
> (planejamento) e `sessions/sessao-031.md` (fechamento).

---

## 🚀 TABUADA RUSH 4.0 — PRÓXIMAS FASES (ler sessao-034.md para detalhes completos)

### FILOSOFIA
> O Tabuada Rush 3.0 ensinou a dominar a tabuada de multiplicação. O 4.0 expande
> esse domínio para a matemática básica completa (soma, subtração, divisão) e usa
> os dados reais de cada sessão para PREVER o esquecimento e adaptar a dificuldade
> antes que o jogador erre — não depois. Uso pessoal, sem meta de negócio: fora de
> escopo social/multiplayer e B2B (ver sessao-031.md "Pós-3.0" se isso mudar).

### FASE 1 — ✅ ENTREGUE (v3.11.0 · sessao-035.md)
1. ✅ Schema namespaced por operação: `tableStats`/`factStats`/`srsData` →
   `{ mult: {...} }`, migração automática e retrocompatível
2. ✅ Registro `OPERATIONS` + `getFactKey`/`getFactSpace` genéricos
3. ✅ Gerador de perguntas unificado `generateQuestion(operation, diffLevel, ...)`
   plugado no GamePage (Inverso, questão inicial, `NEXT` do reducer)
4. ✅ Mapa de Domínio genérico (`MasteryMap` aceita `operation`, lê geometria
   do registro `OPERATIONS` em vez de arrays hardcoded)
5. ✅ **B007** (fix) — contador de certificados na AchievementsPage (`/8`)
   também generalizado para `certificates.length` — ver `BUGS.md`

### FASE 2 — ✅ ENTREGUE (v3.12.0 · sessao-036.md)
6. ✅ `OPERATIONS.add`/`.sub` + `getGridQuestion` + `generateQuestion` com add/sub
7. ✅ Seletor de Operação no ModesPage (Rush/Sobrevivência/Velocidade/Zen/Revisão)
8. ✅ Mapa de Domínio + Certificados com abas por operação (`OperationTabs`)
9. ✅ Mecanismo `isValid` (subtração nunca negativa) propagado em
   `getFactSpace`/`computeCertificates`/`MasteryMap` — grade triangular

### FASE 3 — ✅ ENTREGUE (v3.13.0 · sessao-037.md) · 🎉 MATEMÁTICA COMPLETA
10. ✅ `OPERATIONS.div` com `cellFact` (divisor,quociente) → (dividendo,divisor,quociente)
    — sem `isValid` (toda combinação é válida por construção)
11. ✅ `getFactSpace`/`computeCertificates`/`MasteryMap` generalizados via `cellFact`
12. ✅ Rush/Sobrevivência/Velocidade/Zen respeitam Divisão. Revisão cai pra
    multiplicação (tableStats.div é por dividendo, não dá pra achar "tabuada fraca")
    — decisão explícita, aviso no ModesPage
13. Avaliado reaproveitar o Modo Inverso — decidido manter separado (conceitos diferentes)

### FASE 4 — COMEÇAR AQUI (próxima sessão) — Inteligência Preditiva (Curva de Esquecimento)
14. Modelo de decaimento de memória por fato (acerto histórico + tempo de resposta
    + tempo desde última revisão) → prevê QUANDO o fato será esquecido
15. Painel "Fatos a Vencer" no menu (substitui/complementa banner do Diário)
16. Notificações via `lib/push.js` (infra já existente) para fatos críticos
17. Motor preditivo aplicado às 4 operações

### FASE 5 — Adaptação Universal
18. Generalizar o Modo Difícil adaptativo (v3.10) para Rush/Survival/Speed —
    viés (não exclusividade) pelos fatos mais fracos, em qualquer operação
19. Balanceamento ~60/40 fatos fracos/aleatório para não virar punitivo
20. Toggle em Settings para ligar/desligar o viés adaptativo

### FASE 6 — Perfil de Domínio Unificado
21. Mapa de Domínio, certificados e QI Ranking cobrindo as 4 operações
22. Certificado "Matemática Fundamental Completa"
23. `computeQI` pesa múltiplas operações · visualização radar por operação

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

## 🎯 PRÓXIMA SESSÃO — FASE 4 DA TABUADA RUSH 4.0 (Inteligência Preditiva)

**Ler obrigatoriamente antes de começar:** `sessions/sessao-037.md` (Fase 3,
recém-entregue) + `sessions/sessao-034.md` (roadmap completo)

**Contexto:** Fase 3 (Divisão) entregue em 2026-07-06 (v3.13.0). Com isso, o
pilar **"Matemática Completa"** da 4.0 está 100% fechado — as 4 operações
fundamentais (mult/add/sub/div) têm Mapa de Domínio e Certificados próprios,
selecionáveis via `OperationTabs`. A partir daqui o roadmap muda de eixo:
pilar **"Inteligência Adaptativa"** (previsão, não amplitude de conteúdo).

**Executar nesta ordem:**
1. Modelo de decaimento de memória por fato: combinar taxa de acerto
   histórica + tempo de resposta + tempo desde a última revisão → prever
   QUANDO o fato será esquecido (evolução do SRS do Flashcard, hoje baseado
   só em avaliação subjetiva "Fácil/Difícil/Errei")
2. Painel "Fatos a Vencer" no menu — substitui ou complementa o banner do
   Desafio Diário
3. Notificações via `lib/push.js` (infra já existente desde v2.10) para
   fatos críticos prestes a expirar
4. Aplicar o motor preditivo às 4 operações (não só multiplicação)
5. Build + commit + push + documento

**NÃO pular para Fase 5 sem ter Fase 4 completa.**

**Ação opcional pendente (não bloqueia a 4.0):**
- Publicação Play Store — Davi tem intenção; aguardando decisão de prioridade
  (assets: ícone 512², screenshots, política de privacidade, US$25 dev account,
  método sugerido: PWABuilder)

---

## 🐛 BUGS CONHECIDOS

- Nenhum bug ativo conhecido
- Preview headless (Claude Code) não suporta rAF → animações Framer Motion
  não rodam no preview tool (não é bug do app)

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
| `src/pages/ShopPage.jsx` | Loja de cosméticos (compra/equipa) |
| `src/pages/MissionsPage.jsx` | Missões diárias/semanais/mensais |
| `src/pages/SeasonsPage.jsx` | Trilha de temporada com recompensas |
| `src/constants/shop.js` | Itens da loja, raridades, categorias |
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
3. `sessions/sessao-023.md` — última sessão
4. `BUGS.md` — problemas ativos

**Supabase não configurado:** App funciona 100% com localStorage.
Para ativar cloud: criar `.env` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
e executar o SQL de `SUPABASE_SETUP.md`.
