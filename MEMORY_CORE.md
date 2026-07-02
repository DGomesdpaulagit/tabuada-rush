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

**Data:** 2026-06-08
**Versão:** 3.10.0 (Modo Difícil adaptativo + Leaderboards ATIVOS)
**Status:** ✅ Roadmap 3.0 completo (v3.3-3.8) + refinamentos (v3.9) + leaderboards ativados (v3.10, sessao-033). **🚨 Próxima sessão: Davi vai iniciar planejamento da VERSÃO 4.0.**
**Servidor dev:** `http://localhost:3000` (npm run dev) · **Produção:** https://tabuada-rush-rho.vercel.app

---

## 🚀 TABUADA RUSH 3.0 — PRÓXIMAS FASES (ler sessao-025.md para detalhes completos)

### FILOSOFIA
> O Tabuada Rush 2.x praticava tabuada. O 3.0 vai MEMORIZAR tabuada.
> Método: Repetição Espaçada (Spaced Repetition System — SRS).
> O nível deve representar domínio real, não tempo jogado.

### FASE 1 — ✅ ENTREGUE (v3.3.0 · sessao-026.md)
1. ✅ Missão `mm_score_1200` → `mm_score_350` (+ `wm_score_800` → `wm_score_500`)
2. ✅ `ModesPage.jsx` com 3 seções (Principais, Treino, Avançados-bloqueados)
3. ✅ Banner Desafio Diário no MenuPage (pendente âmbar / feito esmeralda) + botão "Escolher Modo"
4. ✅ Mapa de Domínio Visual (grade 8×10) + persistência `factStats` por par (a,b) normalizado
   - 🟢 Dominado: <1.5s · ≥90% acerto · ≥3 amostras
   - 🟡 Praticado · 🔴 Problemático (>20% erro) · ⬜ Sem dados

### FASE 2 — ✅ ENTREGUE (v3.4.0 · sessao-027.md)
5. ✅ Modo Flashcard com SRS (SM-2 simplificado) — `FlashcardPage.jsx` · srsData por fato
6. ✅ Certificados de Domínio (8, tabuadas 2-9) — derivados de factStats, não compráveis
7. ✅ Modo Inverso — `MODES.inverse`, 15 q, 2 inputs lado-a-lado, aceita qualquer par

### FASE 3 — ✅ ENTREGUE (v3.5.0 · sessao-028.md)
8. ✅ Power-ups Spot — vida (80🪙) no Survival, +60s (30🪙) no Rush em tempo crítico
9. ✅ Seguro de Ofensiva (100🪙) — `applyStreakDecay` consome em vez de zerar
10. ✅ Congelar Missão Diária (50🪙) — carrega para o dia seguinte com progresso intacto
11. ✅ Apostas de Partida — 10/25/50 → 3× se bater recorde; modal antes dos modos principais
12. ✅ Oferta da Semana — 3 cosméticos com 40% off, seed ISO week
13. ✅ Temas de GamePage — categoria `gameTheme`, 3 itens (Neon/Aurora/Lava), aplicados ao card de pergunta

### FASE 4 — ✅ ENTREGUE (v3.6.0 · sessao-029.md)
13. ✅ Modo Recorde Pessoal — benchmark por fato via factStats, "bateu/devagar"
14. ✅ Desafio Semanal Competitivo — 10 q por semana ISO, `weeklyChallenge` no storage (leaderboard UI fica para Fase 5)
15. ✅ Modo Difícil — pool 7/8/9, timer 90s, xpMult 0.22, gen on-the-fly, desbloqueado Nível 8+

### FASE 5 — ✅ ENTREGUE (v3.7.0 · sessao-030.md)
16. ✅ Leaderboards Diário + Semanal (Supabase, graceful degradation) — service + página + botão menu
17. ✅ Heatmap de Ofensiva 365 dias — `StreakHeatmap.jsx`, 5 níveis de intensidade, tooltips
18. ✅ Compartilhar Resultado — `shareCard.js` (Canvas → PNG 1080² + Web Share API + fallback download)

### FASE 6 — ✅ ENTREGUE (v3.8.0 · sessao-031.md) · 🎉 ROADMAP COMPLETO
19. ✅ Tabuada do 11 e 12 — toggle em `data.includeExtraTables`, ativa só no nível 3+ da partida, Daily/Weekly imunes
20. ✅ Modo Combinado — `MODES.combined`, "3×7+4" ou "5×8-6", desbloqueado por ≥3 certificados de domínio

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

## 🎯 PRÓXIMA SESSÃO — INICIAR VERSÃO 4.0 (Davi vai puxar em nova conversa)

**Contexto:** roadmap 3.0 100% entregue + leaderboards ativos + Modo Difícil
adaptativo. Davi decidiu começar a 4.0.

**Antes de tudo:** ler nesta ordem
1. Este arquivo (MEMORY_CORE.md)
2. `sessions/sessao-033.md` (última sessão · v3.10)
3. `sessions/sessao-031.md` seção "Pós-3.0" (ideias soltas para 4.0)
4. `sessions/sessao-025.md` (como foi feito o planejamento da 3.0 — modelo)

**Recomendação de método (aprendido na 3.0):**
- Fazer uma **sessão inteira só de planejamento** (como foi a 025) antes de
  qualquer código
- Definir a **filosofia central** da 4.0 (a 3.0 foi "prática → memorização")
- Dividir em **fases numeradas** com entregas claras
- Cada fase vira 1 sessão de implementação + 1 push/versão

**Direções candidatas da 4.0** (ver sessao-031 e resposta do assistant na sessao-033):
- **Alto impacto pedagógico:** Divisão/Subtração + Modo Combinado v2
- **Social/Retenção:** Multiplayer 1v1 real-time (Supabase Realtime) · Grupos/Turmas · Feed de amigos
- **Personalização:** Avatares reais evoluindo com certificados · Sons personalizados
- **Analytics avançado:** Curva de aprendizado por fato · Preditor de esquecimento
- **B2B educacional:** Dashboard professor · Google Classroom · assinatura escolar
- **Técnica:** Offline first-class · outras bases numéricas

**Ação pendente pós-3.0 (não bloqueia 4.0):**
- Publicação Play Store — Davi tem intenção; aguardando decisão de prioridade
  (assets: ícone 512², screenshots, política de privacidade, US$25 dev account,
  método sugerido: PWABuilder)

O roadmap 3.0 está 100% entregue (sessões 026-031 · versões 3.3.0 → 3.8.0).

**Possíveis caminhos para a próxima sessão:**
1. **Polimento e bug-fixing** — testar end-to-end, ajustar UX, observar
   métricas de retenção e iterar.
2. **Pequenas iterações da 3.x** — refinamentos pontuais baseados em
   feedback de uso real (não há roadmap formal ainda).
3. **Início do planejamento da 4.0** — se houver visão, fazer um documento
   de visão como o `sessao-025.md` foi para o 3.0. Ideias soltas em
   `sessoes/sessao-031.md` seção "Pós-3.0".
4. **Ação opcional pendente:** rodar SQL de leaderboard (SUPABASE_SETUP.md
   seção 3.1) para ativar os rankings globais — Fase 5 já tem toda a
   infraestrutura, falta só o SQL no painel do Supabase.

**Não há urgência.** O produto 3.0 está completo e estável.

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
