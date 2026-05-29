# 📝 CHANGELOG

Todas as mudanças notáveis do projeto são documentadas aqui.

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
