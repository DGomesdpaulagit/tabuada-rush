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

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco3 (Tabuada Rush 6.0 — reset completo, EM ANDAMENTO — sessao-046.md)
**Status:** 🔴 A 5.0 foi considerada insatisfatória pelo Davi e está sendo **substituída por
um reset completo (6.0)**, não uma continuação — as pendências da 5.0 (ver seção antiga
abaixo) estão OBSOLETAS, não retomar. O reset está sendo implementado em 7 blocos.
Davi pediu pra seguir direto pelos blocos sem pausa de confirmação a cada um ("vamos
terminar esses blocos"), mas decisões não-óbvias continuam sendo sinalizadas nos
registros (ver D021/D022 pra exemplos — inclusive uma tensão real com o princípio "só
tabuada tradicional" que o Davi confirmou querer mesmo assim, D022). **Blocos 1-3/7
entregues.** Blocos 4-7 (Ligas, Missões, Perfil completo, Estatísticas) ainda não
começaram.
**[v6.0.0-bloco3]** `LEVELS` deixou de ser 28 níveis abstratos e virou 20 faixas de
tabuada literais (2×10 → 190×200) — o fator `a` das perguntas passa a vir da faixa
atual do jogador (`utils/getTierRange`), fator vai até 200 de verdade (confirmado
com o Davi, D022). Calibração de XP por faixa é estimativa documentada. Ver
`sessao-046.md`.
**[v6.0.0-bloco2]** Vidas diárias (pote global de 5, estilo Duolingo) — desconta em
QUALQUER modo (inclusive Zen), bloqueia início de partida nova quando zera, repõe por
150 moedas (pote inteiro). Coexiste com o sistema de vidas por partida que já existia
(Rush, `cfg.lives`) sem substituí-lo — ver `sessao-045.md` e D021.
**[v6.0.0-bloco1]** Reset visual: paleta semântica dark-first via CSS var (tema escuro
é o padrão agora), sidebar com 5 destinos novos (Arena/Ligas/Missões/Loja/Perfil),
header persistente (faixa/ofensiva/moedas/vidas — faixa ainda é placeholder até o
Bloco 3), Perfil novo (resumo mínimo). Ver `sessao-044.md` e `DECISIONS.md` D020.
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

## 🎨 TABUADA RUSH 6.0 — EM ANDAMENTO (v5.0.0 → v6.0.0 · sessão 044+)

> Reset completo pedido pelo Davi — substitui a 5.0, não a continua (pendências da 5.0
> abaixo ficam obsoletas). Spec inteira em `sessions/planejamento-6.0.md`, 7 blocos,
> um por vez, sempre confirmando com o Davi antes de avançar pro próximo.
>
> **Bloco 1/7 — Base visual — ENTREGUE (sessao-044):** tokens de cor semânticos
> dark-first via CSS var, tema escuro como padrão, sidebar nova (Arena/Ligas/Missões/
> Loja/Perfil), header persistente novo, Perfil novo (resumo mínimo). Ver D020.
>
> **Bloco 2/7 — Vidas diárias — ENTREGUE (sessao-045):** pote global de 5/dia estilo
> Duolingo, desconta em qualquer modo, bloqueia início de partida quando zera, repõe
> por 150 moedas. Coexiste com o sistema de vidas por partida (não substituiu). Ver
> D021.
>
> **Bloco 3/7 — Progressão de tabuada — ENTREGUE (sessao-046):** `LEVELS` virou 20
> faixas de tabuada (2×10 → 190×200), motor de perguntas usa a faixa atual do
> jogador pro fator `a`. Fator vai até 200 DE VERDADE — confirmado com o Davi
> mesmo com a tensão contra "só tabuada tradicional". Calibração de XP é
> estimativa. Ver D022.
>
> **Blocos 4-7 — NÃO COMEÇADOS:** (4) Ligas — substitui Ranking de QI, 10 ligas; (5)
> Missões — diárias + mensais com aceite/desconto/congelamento; (6) Perfil completo —
> absorve Conquistas/Recordes/Catálogo; (7) Estatísticas — reorganização (não reset).
>
> **Pontos que o próprio Davi disse "não sei ainda"** (não inventar sozinho, alinhar
> antes de implementar): nº de personagens por liga e tamanho das zonas de promoção/
> rebaixamento, nome de exibição das faixas de tabuada, cálculo de XP/dia realista pra
> bater a meta de 6-10 meses na 1ª faixa. Ver planejamento-6.0.md seção 12.

---

## 🎨 TABUADA RUSH 5.0 — SUBSTITUÍDA PELA 6.0, NÃO RETOMAR (v4.x → v5.0.0 · sessão 043)

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

## 🎯 PRÓXIMA SESSÃO — CONTINUAR O RESET 6.0 (Bloco 4/7 em diante)

**Ler obrigatoriamente antes de começar:** `sessions/planejamento-6.0.md` (spec
completa do reset) → `sessions/sessao-046.md` (Bloco 3, o mais recente) →
`DECISIONS.md` D020-D022.

**A lista de pendências da 5.0 que existia aqui (mascote, paleta restante, StatsPage,
balão de fala, painel por personagem) está OBSOLETA** — Davi confirmou explicitamente
que a 6.0 substitui tudo isso, não são itens paralelos a retomar. Ver `sessao-044.md`
seção 1.

**Davi pediu ritmo contínuo** ("vamos terminar esses blocos") — não pausar pra
confirmação visual a cada bloco como no Bloco 1. Continuar sinalizando decisões
não-óbvias nos registros mesmo assim (ver D021 pro padrão a seguir).

**Ordem dos próximos blocos:**
1. **Bloco 4 — Ligas**: substitui Ranking de QI (10 ligas nomeadas, promoção/
   rebaixamento, XP universal). É a faixa de blocos com mais pontos "não sei ainda"
   no planejamento (nº de personagens por liga, tamanho das zonas de promoção) —
   próxima sessão deve propor números concretos com a lógica por trás (mesmo
   padrão de transparência usado na calibração de XP do Bloco 3), não travar
   esperando resposta perfeita.
2. **Bloco 5 — Missões**: diárias fixas + mensais com aceite/desconto de saldo/
   congelamento (mecânica de "aposta com dívida" já confirmada com o Davi, ver
   planejamento-6.0.md seção 7).
3. **Bloco 6 — Perfil completo**: absorve Conquistas/Recordes/Catálogo (hoje em
   Estatísticas) pro `PerfilPage.jsx` criado no Bloco 1.
4. **Bloco 7 — Estatísticas**: reorganização (não reset) — navegação lateral tipo
   sumário, Acertos/Erros dentro do Catálogo de Precisão.

**Em aberto, sem decisão ainda (Davi disse "não sei" — não inventar sozinho, ver
planejamento-6.0.md seção 12):** nº de personagens por liga e tamanho das zonas de
promoção/rebaixamento, nome de exibição das faixas de tabuada, formato exato do selo
de faixa no header, lista final de power-ups.

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
| `src/components/Sidebar.jsx` | [v6.0] Nav lateral, desktop-only (`lg+`) — 5 destinos: Arena/Ligas/Missões/Loja/Perfil |
| `src/components/Header.jsx` | [v6.0] Barra superior persistente (faixa/ofensiva/moedas/vidas) |
| `src/pages/PerfilPage.jsx` | [v6.0] Novo destino — resumo mínimo, absorve Conquistas/Recordes/Catálogo no Bloco 6 |
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
3. `sessions/planejamento-6.0.md` — spec completa do reset 6.0 (ler antes de qualquer bloco novo)
4. `sessions/sessao-046.md` — última sessão (Bloco 3/7 do reset — progressão de tabuada)
5. `DECISIONS.md` D020-D022 (reset 6.0) — D015-D019 (5.0) são história, não aplicam mais
6. `BUGS.md` — problemas ativos

**Supabase não configurado:** App funciona 100% com localStorage.
Para ativar cloud: criar `.env` com `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
e executar o SQL de `SUPABASE_SETUP.md`.
