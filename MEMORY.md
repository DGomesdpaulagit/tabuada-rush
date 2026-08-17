# 🧠 MEMORY.md — DNA do Projeto Tabuada Rush

> Arquivo permanente. Nunca resumir. Atualizar seções específicas quando necessário.

---

## 📋 INSTRUÇÃO PERMANENTE — DOCUMENTO DO PROJETO

**Palavra-chave:** "documento"  
**Ação:** Sempre que Davi disser "documento", atualizar o arquivo Word do projeto.  
**Arquivo:** `C:\Users\HP\Documents\TabuadaRush - jogo\Tabuada (2).docx` — fica **dentro da pasta do projeto** e **é commitado no Git** junto com os demais arquivos da sessão.  
**Como:** Usar o skill `anthropic-skills:docx` ou agente → ler o doc completo → identificar onde parou → acrescentar mudanças da sessão atual → salvar mantendo formatação e estilo originais.  
**Conteúdo do doc:** Histórico completo do projeto — versões, funcionalidades, sessões de desenvolvimento, arquitetura.

---

---

## 📌 VISÃO GERAL

**Nome:** Tabuada Rush  
**Versão:** 6.0.0-bloco3 (Reset completo em andamento — Bloco 3/7: progressão de tabuada · sessao-046; ver `sessions/planejamento-6.0.md`)  
**Tipo:** SaaS educacional gamificado — PWA  
**Propósito:** Treino de tabuada de forma rápida, divertida e viciante  
**Origem:** Problema pessoal do criador (Davi) — dificuldade em memorizar tabuada  

---

## 🏗️ ARQUITETURA

### Stack Tecnológica
```
React 18 + Vite 5
TailwindCSS 3
Framer Motion 11
Recharts 2
Lucide React
date-fns 3
```

### Persistência
- **localStorage** (`tabuada_rush_v2`) — sem backend, dados locais do browser
- Service: `src/lib/storage.js` — abstração com get/set/update

### Estrutura de Pastas
```
src/
  constants/index.js     — MODES, LEVELS (28, c/ title), ACHIEVEMENTS, STREAK_GOALS
  constants/characters.js — [v2.4] 104 personagens do Ranking de QI + TIERS
  lib/storage.js         — persistência localStorage (dados do jogo)
  lib/prefs.js           — [v2.8] preferências (tema/acessibilidade/notificações) + applyPrefs
  lib/audioManager.js    — Web Audio (SFX) + [v2.9] música de fundo gerada (startMusic/stopMusic)
  lib/notify.js          — [v2.9] notificações reais; [v2.9.1] via SW showNotification (mobile OK)
  lib/push.js            — [v2.10] Web Push (subscribe/unsubscribe) → salva no Supabase
public/sw.js             — [v2.9.1] Service Worker: notificationclick + [v2.10] push exibe notificação
supabase/functions/send-streak-reminders/ — [v2.10] Edge Function: lembrete de ofensiva (cron diário)
  utils/index.js         — questionGenerator, scoring, dates, computeQI/getQiInfo, applyStreakDecay
                            [v4.0, revertido em parte na v3.17 — ver D014] OPERATIONS só tem `mult`
                            hoje; predictRecallProbability/getFactsAtRisk (curva de esquecimento) e
                            getWeakPool (viés adaptativo) sobrevivem, escopados só pra multiplicação
  utils/analysis.js      — [v2.7] analyzeUser (análise inteligente: textos automáticos data-driven)
  contexts/AppContext.jsx — estado global (data + update)
  components/ui/index.jsx — Button, Card, Badge, Progress, StatCard, EmptyState
  components/Sidebar.jsx — [v5.0] nav lateral, só em telas largas (hidden lg:flex)
  components/Mascot.jsx  — [v5.0] Tuca/Vupt — poses por humor, portal fixo na borda direita, sem balão/voz (desligados)
  assets/mascots/*.webp  — [v5.0] poses animadas (vupt-cocky, vupt-peek-villain, vupt-thumbsup, tuca-idle, tuca-glasses, tuca-reading)
  pages/
    MenuPage.jsx         — [v5.0] Menu QI-first (card muda de cor por tier), 3 destinos primários
    GamePage.jsx         — Gameplay com useReducer (TICK/CORRECT/WRONG/WRONG_SHIELDED/NEXT/END/ADD_TIME); [v5.0] gatilho "slow" (3s) + maybeMascot (frequência controlada)
    ResultsPage.jsx      — Tela de resultados pós-partida
    RewardsPage.jsx      — [v5.0] hub com abas Missões/Loja/Temporada (substitui 3 botões separados no Menu)
    StatsPage.jsx        — [v5.0] Dashboard estatísticas + LineChart Recharts; absorveu Catálogo/Precisão/Acertos/Erros/Recordes/Conquistas como view-switcher interno (reorganização real ainda pendente — ver MEMORY_CORE)
    RankingPage.jsx      — [v2.4] Ranking de QI Matemático (hero + lista por categoria); [v5.0] 52 personagens (era 104)
    SettingsPage.jsx     — [v2.8] Configurações (som, tema, conta, notificações, acessibilidade)
  App.jsx                — Orquestrador: navegação, handleGameEnd, toasts de conquistas
  main.jsx               — Entry point React
  styles/globals.css     — CSS variables + Tailwind base
```

**[v5.0] Páginas absorvidas como seções internas (não são mais rotas próprias):**
`RecordsPage`/`AchievementsPage`/`CatalogPage`/`AccuracyCatalogPage`/`HitsPage`/`ErrorsPage`
continuam existindo como componentes, mas são renderizados de dentro de
`StatsPage` via view-switcher (`view === 'records' | 'achievements' | ...`),
não têm mais entrada direta no Menu.

---

## 🎨 DESIGN SYSTEM

### [v5.0] Paleta "Caderno Quadriculado" (tokens em `tailwind.config.js`)
> Substituiu a paleta violeta original. Passou por uma rodada intermediária
> copiando as cores do Duolingo (tokens `feather`/`macaw`/`bee`/`cardinal`
> ainda existem no Tailwind, usados pelas telas que ainda não migraram —
> ver MEMORY_CORE "PRÓXIMA SESSÃO"). Ver DECISIONS.md D015.

| Token | Valor | Uso |
|-------|-------|-----|
| `paper` (background) | `#FBF7EC` | Fundo do app — papel/creme, não branco puro |
| `ink` (primary) | `#3B4FCC` | Cor primária — azul-índigo |
| `ink-dark` | `#2A3A9E` | Sombra "chunky" do `ink` |
| `pen` (destructive) | `#D64545` | Erro/correção — vermelho-caneta |
| `check` (success) | `#2F9E44` | Acerto/confirmação — verde-caneta |
| `graphite` | `#3A3A3A` | Texto principal — no lugar de preto puro |

**Aplicada até agora:** tokens base (`tailwind.config.js`, `globals.css`),
componentes (`ui/index.jsx`), `MenuPage`. **Pendente:** Modos, Recompensas,
Estatísticas, Loja ainda usam os tokens Duolingo (`feather`/`macaw`/`bee`).

### Botões "chunky" (herdado da rodada Duolingo, mantido)
Sombra sólida embaixo simula profundidade; no clique, o botão desce até
encostar na sombra (`active:translate-y-1 active:shadow-none`) em vez de só
encolher — sensação de botão físico. Classes `shadow-chunky*` no Tailwind.

### Gradientes por Modo (pós-consolidação v5.0 — só 3 modos)
| Modo | Gradiente |
|------|-----------|
| Rush | `from-feather to-mask` (pendente migrar pra `ink`) |
| Zen | `from-macaw to-macaw-dark` (pendente migrar) |
| Revisão | `from-bee to-bee-dark` (pendente migrar) |

### Tipografia
- Fonte: **Nunito** (Google Fonts)
- Pesos: 400, 600, 700, 800, **900 (Black)**
- Aplicado via `font-nunito` no Tailwind

### Border Radius
- Cards: `rounded-3xl` (24px)
- Buttons: `rounded-2xl` (16px)
- Inputs: `rounded-2xl`

---

## 🎮 MODOS DE JOGO — [v5.0] reduzidos de 10 para 3 (ver DECISIONS.md D016)

> Sobrevivência, Velocidade, Desafio Diário, Difícil, Recorde Pessoal,
> Desafio Semanal, Combinado e Inverso foram DELETADOS do código na sessão
> 043 (não só escondidos). `UNLOCK_RULES` também foi zerado — os 3 modos
> abaixo estão liberados desde o primeiro acesso (reverte D008, ver D017).

### Rush (⚡) — fusão de Rush + Sobrevivência + Velocidade + Diário
- Timer: começa em **30s**, cresce **+3s por acerto** (`bonusTime`) — "banco
  de tempo": quanto melhor a sequência, mais tempo de jogo
- Vidas: 3 (diminui a cada erro) — `WRONG_SHIELDED` no reducer não desconta
  vida se o power-up Escudo estiver ativo
- Termina: com 3 erros OU tempo zerado — o que vier primeiro
- É o modo que sustenta a ofensiva diária (qualquer partida conta)
- Único modo com aposta (`bettable = mode === 'rush'` em App.jsx)
- Mascote: Vupt (lebre), poses por humor (`slow`→bate o pé, `insane`→provoca, `correct`→joinha)

### Zen (🧘)
- Timer: não tem (conta elapsed time para stats)
- Sem pressão — sem XP, sem moeda (era 0.10 de multiplicador, zerado na v5.0)
- Mascote: Tuca (tartaruga), poses por humor (`slow`→ajusta óculos, `correct`→lendo)

### Revisão (📚)
- 15 questões focadas nas tabuadas que o jogador mais erra
  (`getRevisionQuestions`)
- Mascote: Tuca (mesmas poses do Zen)

---

## 💾 SCHEMA DE DADOS (localStorage)

```js
{
  xp: 0,                    // XP total acumulado
  totalGames: 0,            // Total de partidas finalizadas
  totalCorrect: 0,          // Total de acertos globais
  totalWrong: 0,            // Total de erros globais
  bestStreak: 0,            // Maior sequência de acertos já registrada
  bestScore: 0,             // Maior pontuação em uma partida
  bestAccuracy: 0,          // Melhor taxa de acerto (0-100)
  records: {                // Recordes por modo — [v5.0] só rush/zen/review recebem valor novo;
    rush: Number,           // chaves de modos removidos (survival/speed/daily/...) podem sobrar
    zen: Number,            // órfãs no storage de contas antigas — inofensivo, não lido por nada
    review: Number,
  },
  powerups: {                // [v5.0] shield/headstart novos — ver constants/shop.js
    life: Number, time: Number, xp2: Number,
    shield: Number,          // protege de 1 erro sem descontar vida (WRONG_SHIELDED)
    headstart: Number,       // +10s no início do Rush
    streakInsurance: Number, missionFreeze: Number,
  },
  sessions: [               // Últimas 100 sessões
    { mode, score, correct, wrong, avgMs, date }  // avgMs [v2.7.1] = tempo médio de resposta (ms)
  ],
  fastestAvgMs: null,       // [v2.7.1] recorde: menor tempo médio de resposta por partida
  achievements: [],         // IDs de conquistas desbloqueadas
  modesPlayed: [],          // Modos já jogados (para conquista 'all_modes')
  dailyCompleted: 0,        // Quantas vezes completou o Desafio Diário
  survivalBest: 0,          // Melhor # acertos no modo Sobrevivência
  speedBest: 0,             // Melhor # acertos no modo Velocidade
  currentDailyDate: null,   // Data do último desafio diário completo
  currentDailyScore: null,  // Pontuação do último desafio diário
  currentStreak: 0,         // Ofensiva diária atual (reset por dia perdido / virada de ano)
  bestDayStreak: 0,         // Recorde de ofensiva diária (NÃO reseta)
  streakGoal: null,         // [v2.6] Meta de ofensiva (null = abre modal). Opções 5/10/15/20/35/40
  streakGoalBase: 0,        // [v2.6] Ofensiva quando a meta foi definida (base do progresso)
  streakRewardsClaimed: [], // [v2.6] Marcos de recompensa já resgatados (40/100/250/365)
  pendingStreakReward: null,// [v2.6] Marco com recompensa pendente de escolha
  coins: 0,                 // [v2.6] Moedas do jogo (economia completa em bloco futuro)
  qiBonus: 0,               // [v2.6] Bônus de QI via recompensas de ofensiva
  lastPlayDate: null,       // Última data que jogou (YYYY-MM-DD)
  progressLog: [],          // [v2.11] Marcos da jornada (nível/XP/ofensiva/recorde) — últimos 50
  // tableStats/factStats/srsData ficam sob `.mult` (namespace interno que
  // sobrou da 4.0 — só existe multiplicação no jogo, ver D014 em DECISIONS.md).
  // Migração automática de dados pré-4.0 (achatados) em storage.js.
  // `lastPracticed` (ISO string) alimenta o modelo de curva de esquecimento
  // (predictRecallProbability) — sobrevivente da 4.0, ver D014.
  tableStats: { mult: {} },  // Desempenho por tabuada: { mult: { [a]: { correct, wrong, totalMs, count, lastPracticed } } }
  factStats: { mult: {} },   // Desempenho por fato (Mapa de Domínio): { mult: { [factKey]: { ..., lastPracticed } } }
  srsData: { mult: {} },     // Repetição espaçada (Flashcard)
  adaptiveDifficulty: true,  // Viés por fatos fracos em Rush/Sobrevivência/Velocidade/Zen (toggle em Configurações)
}
```

---

## 🏆 SISTEMA DE CONQUISTAS

16 conquistas em categorias: Progresso, Pontuação, Sequência, Dedicação, Precisão, Diário, Exploração, Modos.

Verificação automática após cada partida em `handleGameEnd` via `checkNewAchievements(newData)`.

Toast de notificação animado (bottom sheet) ao desbloquear.

---

## 📊 SISTEMA DE PONTUAÇÃO

```
pts = 10 + (diffLevel - 1) × 5 + floor(streak / 5) × 2

diffLevel:
  1 → questionsAnswered < 15   (pool: 2,3,4,5)
  2 → questionsAnswered 15-29  (pool: 2..7)
  3 → questionsAnswered ≥ 30   (pool: 2..10)
```

**XP (v2.5 — modelo "real"):** ganho modesto por partida = `round(score×0.5) + bônus diário (20) + bônus de ofensiva (min(streak,30))`. (Antes, v2.3: score cheio + bônus maiores — subia rápido demais.)

**Níveis (v2.5):** `LEVELS[]` tem **28 níveis** (`name`, `title`, `badge`, `xp`). Curva ÍNGREME (deltas crescentes ~×1.235) para dificultar a progressão: topo **227.900 XP** (era 90.000).
Progressão: Iniciante → Aprendiz → Estudante → … → Mestre → Grão-Mestre → … → Gênio Matemático → Lenda → Lenda Numérica → Mito → Transcendente.
`getLevelIdx()` é baseado puramente em XP (retrocompatível).

---

## 👤 SISTEMA DE PERFIL (v2.3 — Fase 2/Bloco 2)

Card de perfil no MenuPage (mesmo gradiente violeta), com:
- **Avatar:** emoji do nível em círculo `bg-white/15`
- **Título:** `LEVELS[idx].title` — muda conforme o nível (ex.: "Estrategista Numérico", "Calculadora Humana")
- **Nível + XP Total + barra de XP** + "X XP para <próximo>"
- **Ofensiva diária:** atual (🔥 `currentStreak`) + recorde (🏆 `bestDayStreak`)
- **Meta de ofensiva:** `streakGoal` (pills 7/15/30/100) + barra de progresso `currentStreak/streakGoal`

Títulos também aparecem na ResultsPage (abaixo do nome do nível).
Constante `STREAK_GOALS = [7, 15, 30, 100]` em `constants/index.js`.

---

## 🔄 FLUXO DE JOGO

```
MenuPage
  → onStart(mode) → GamePage
    → GamePage reducer (TICK/CORRECT/WRONG/NEXT/END)
    → onEnd(result) → handleGameEnd() em App.jsx
      → storage.update() — salva stats
      → checkNewAchievements() — verifica conquistas
      → setScreen('results')
  → ResultsPage
    → onReplay → GamePage (mesmo modo)
    → onHome → MenuPage
  → RecordsPage
  → StatsPage
  → AchievementsPage
  → RankingPage (Ranking de QI Matemático)
```

---

## 🧠 RANKING DE QI MATEMÁTICO (v2.4 — Fase 2/Bloco 3)

Sistema **lúdico** (NÃO mede QI real) — gamificação/identidade/progressão.

- **Dados:** `src/constants/characters.js` → `CHARACTERS` ([v5.0] **52** — era 104, cortado pela
  metade por pedido do Davi, 13 por tier, mantidos os mais reconhecíveis; ordenados do menor ao maior
  nível intelectual), `TIERS` (baixo/medio/alto/genio com cores e classificação) e `QI_MIN`/`QI_MAX` (70/200).
- **[v5.0] Painel de perfil (MenuPage) muda de cor conforme o tier atual** — usa `qiInfo.tier.gradient`
  diretamente no card. Pendente: tema por PERSONAGEM específico (não só por tier) — ver MEMORY_CORE.
- **Personagens:** FAMOSOS e reconhecíveis (Patrick → Einstein) — `{ name, emoji, tier, desc }`.
  Nomes são apenas rótulos/referências; avatar é emoji (sem imagens externas). Ordem: Patrick Estrela (piso) → Albert Einstein (topo).
- **Cálculo:** `computeQI(data)` em `utils` combina precisão (lifetime + melhor), velocidade (speedBest),
  ofensiva (currentStreak + bestDayStreak), consistência (totalGames) e progresso (nível). Faixa 70–200.
- **Mapeamento:** `getQiInfo(data)` → QI mapeado para índice/posição via `ratio*(len-1)` (limiares
  DERIVADOS do índice — escalável, sem números hardcoded) + progresso até o próximo personagem.
- **Página `RankingPage`:** hero do usuário (QI, personagem, classificação, posição #X/Y, progresso)
  + lista completa por categoria com destaque "VOCÊ" no personagem atual.
- **Perfil (MenuPage):** linha pequena `{emoji} QI {qi} · {personagem}` abaixo do nível, clicável → ranking.
- Acesso: botão "Ranking QI" no menu (ocupa o espaço do antigo "2 Jogadores").

---

## 📖 CATÁLOGO DE PROGRESSO (v2.11 — Fase 5/Bloco 8)

Página dedicada (`CatalogPage`) que reúne a evolução do usuário num só lugar, sem redesign.

- **Acesso:** botão destacado "Catálogo de Progresso" no MenuPage (gradiente violeta claro, `TrendingUp`) → rota `catalog`.
- **Seções:** Progresso Geral (hero violeta) · Experiência (XP no nível + total + barra) · Sua Evolução (semana/mês/total — partidas + precisão) · Marcos de Progresso (4 StatCards) · Catálogo de Níveis (28 níveis: desbloqueado/atual/futuro) · Registro de Evolução (timeline de marcos).
- **Registro (`progressLog`):** `detectProgressEvents(prev, next)` em `utils` compara o estado antes/depois de cada partida e gera marcos `{type,icon,title,detail,date}` (type: level/xp/streak/record). Anexados no `handleGameEnd` (atômico, dentro do `update`), `slice(-50)`. Marcos de XP: 1k/5k/10k/25k/50k/100k/200k. Ofensiva: por `bestDayStreak` cruzando 5/10/15/20/35/40/100/250/365. Recorde: só melhora sobre recorde existente.
- **Evolução:** mês reusa `analyzeUser().monthly`; semana = janela de 7 dias das sessões.

---

## 🎯 CATÁLOGO DE PRECISÃO (v2.12 — Fase 5/Bloco 9)

Página dedicada (`AccuracyCatalogPage`) sobre o desempenho matemático real. Sem redesign.

- **Acesso:** botão "Catálogo de Precisão" DENTRO da `StatsPage` → rota `accuracy` (volta para `stats`). `StatsPage` recebe `onNavigate`.
- **Seções:** Desempenho Matemático (hero) · Taxa de Acerto (geral/semana/mês/por modo + evolução recente×anterior) · Velocidade (geral/recente/melhor=`fastestAvgMs`/por modo) · Erros (total/taxa/por modo) · Precisão por Tabuada · Estatísticas Matemáticas (StatCards) · Histórico de Precisão (LineChart Recharts, verde).
- **`tableStats`:** o jogo é só multiplicação → a quebra é POR TABUADA (fator `a`, 2–10). `GamePage` registra cada questão em `useRef` (`{a,b,correct,ms}`) e envia em `onEnd.questions`; `handleGameEnd` agrega em `tableStats` (`{ [a]: { correct, wrong, totalMs, count } }`), atômico no `update`. Maior dificuldade = menor % de acerto (mín. 3 respostas).
- **Honestidade:** soma/subtração/divisão NÃO existem no jogo → não foram inventadas. "Operação" = tabuada.

---

## 🎭 ANIMAÇÕES (Framer Motion)

| Animação | Trigger | Implementação |
|----------|---------|---------------|
| Entrada de tela | Transição entre páginas | `pageVariants` (opacity+y) com `AnimatePresence mode="wait"` |
| Pergunta nova | `key={a-b-answered}` | scale 0.9→1 + opacity |
| Resposta correta | `inputState === 'correct'` | scale [1, 1.08, 1] spring |
| Resposta errada | `inputState === 'wrong'` | shake horizontal |
| Pontuação | `key={score}` | scale 1.3→1 + cor violeta→preta |
| Combo popup | `streak % 5 === 0` | scale 0→1 spring + exit |
| Conquista toast | após handleGameEnd | bottom sheet spring |
| Cards de resultado | stagger 0.06s | children sequenciais |
| Level card | mount | scale 0.8→1 spring |

---

## 🗓️ MODO DESAFIO DIÁRIO — DETALHE

```js
// seed = YYYYMMDD como integer
// Algoritmo LCG (Linear Congruential Generator)
function seededRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223 >>> 0;
    return s / 0xffffffff;
  };
}
```

Mesmas 20 perguntas para todos usuários no mesmo dia.

---

## 🏟️ MODO BATALHA 2 JOGADORES — REMOVIDO (v2.2, Fase 1/Bloco 1)

Removido completamente em 2026-05-25 (sessão 004). O espaço no menu foi
substituído por um placeholder "Ranking em breve" (botão disabled, ícone Medal),
reservado para a futura página "Ranking de QI Matemático".

---

## 🧩 ANÁLISE INTELIGENTE (v2.7 — Fase 3/Bloco 5)

NÃO é IA real — interpreta dados reais e gera textos automáticos.
- `utils/analysis.js` → `analyzeUser(data)` = `{ headline, summary, insights[], monthly }`.
- Fontes: sessões (`{mode,score,correct,wrong,date}`) + stats. Recente vs anterior p/ tendência.
- Frases VARIADAS e DETERMINÍSTICAS (seed por dados) — evolução, precisão, velocidade, modo
  forte/favorito, ofensiva. Estado inicial acolhedor sem dados.
- [v2.7.1] Velocidade usa TEMPO MÉDIO de resposta real (`avgMs` por sessão, capturado na GamePage):
  compara recente vs anterior. Fallback p/ proxy (modo Velocidade/speedBest) sem dados cronometrados.
- `monthly` = resumo do mês (partidas, dias ativos, precisão+Δ, pontos/partida+Δ, modo favorito).
- UI: StatsPage (cards "Análise Inteligente" + "Resumo de {mês}") e MenuPage (banner de insight → stats).

---

## ⚙️ CONFIGURAÇÕES / TEMA (v2.8 — Fase 4/Bloco 6)

- `SettingsPage` (acesso por engrenagem no header, ao lado do som): Som (efeitos/volume/música),
  Aparência (tema claro/escuro), Acessibilidade (texto grande/reduzir animações/alto contraste),
  Notificações (lembretes), Conta (progresso + login/logout/sync).
- `lib/prefs.js` (`tr_prefs`): theme/music/notifications/largeText/reduceMotion/highContrast.
  `applyPrefs()` aplica classes no `<html>` (`dark`/`large-text`/`reduce-motion`/`high-contrast`),
  chamado em `main.jsx` antes do render. Áudio segue no `audioManager` (tr_audio/tr_volume).
- **Tema escuro (globals.css):** adapta APENAS neutros (bg-white/gray, text-gray, bordas, inputs)
  e converte tints `*-50/-100`/gradientes para versões escuras do MESMO hue. Cores fortes da marca
  preservadas. `darkMode: 'class'` no tailwind.config. NÃO é redesign — foco em legibilidade/contraste.

---

## 📱 RESPONSIVIDADE

- Mobile-first, max-width `max-w-lg` (512px) centralizado
- Grid de modos: `grid-cols-2` em todas as telas
- Input numérico com `inputmode="numeric"` para teclado mobile
- `min-h-dvh` para altura correta em mobile (considera barra de URL)

---

## 🔌 PWA

- `sw.js` — Service Worker (cache básico)
- `manifet.json` — Web App Manifest (typo original mantido no arquivo)
- Icons: `icons/icon-192.png`, `icons/icon-512.png`

---

## 🐢🐇 MASCOTES — TUCA E VUPT (v5.0 — sessao-043)

Inspirados na fábula de Esopo (domínio público — ver DECISIONS.md D018).

- **Tuca** — tartaruga sábia e idosa. Acompanha Zen/Revisão. Poses:
  `tuca-idle` (padrão), `tuca-glasses` (ajustando óculos — humor `slow`),
  `tuca-reading` (lendo — humor `correct`).
- **Vupt** — lebre apressada e convencida. Acompanha o Rush. Poses:
  `vupt-cocky` (batendo o pé — humor `slow`), `vupt-peek-villain`
  (espiando com cara de má — humor `insane`), `vupt-thumbsup` (joinha —
  humor `correct`). `vupt-run` (a lebre correndo) foi REMOVIDA — não é mais
  referenciada em lugar nenhum do código.

**Componente:** `src/components/Mascot.jsx`. Sem pose específica pro humor
atual = não renderiza nada (em vez de cair num "genérico"). Renderizado via
`createPortal(..., document.body)` — necessário porque `position: fixed`
dentro de uma árvore com `motion.div` (Framer Motion aplica `transform`)
vira relativo ao ancestral transformado, não à viewport. Posição: fixo na
borda direita da tela, 224px (`w-56 h-56`), pode vazar pra fora em telas
estreitas (de propósito — replica referência visual do Davi). **Tamanho e
posição ainda não confirmados como finais** — ver MEMORY_CORE.

**Frequência controlada** (`GamePage.jsx`): `mascotShowCountRef` +
`maybeMascot(mood, chance)`. Teto por partida: 2 em modos com tempo
(`cfg.timer !== null`, ou seja Rush), 6 em modos sem tempo (Zen/Revisão).
Cada gatilho só vira aparição real se passar num sorteio (`chance` padrão
0.4) E não tiver batido o teto — espalha as aparições pela partida.
Gatilhos: `slow` (3s parado na mesma questão, `useEffect` dedicado),
`correct`/`combo`/`insane` (dentro de `handleSubmit`, conforme streak).

**Balão de fala e voz (`window.speechSynthesis`) foram REMOVIDOS do
código** (não só desativados) por pedido do Davi — estavam atrapalhando.
Reimplementar SÓ quando ele mandar as frases finais e o áudio de verdade
(gravado ou gerado) — não adivinhar conteúdo antes disso.

**Pipeline de geração de arte** (ver DECISIONS.md D019 pro raciocínio
completo): Davi gera imagem estática no ChatGPT → gera animação
image-to-video no Pika (login Google) → me manda o `.mp4` (fundo branco +
marca d'água "Pippit AI") → processo com script Python usando
`opencv-python-headless` + `Pillow` (instalados via pip nesta sessão — não
havia `ffmpeg`/bibliotecas de vídeo no ambiente):
1. Pinta a marca d'água (retângulo sólido no canto)
2. Flood-fill a partir dos 4 cantos com `cv2.FLOODFILL_FIXED_RANGE`
   (**crítico** — sem essa flag o preenchimento vaza por bordas
   anti-aliased e come partes claras do personagem, ex. comeu a barba
   branca do Tuca na 1ª tentativa)
3. Limpeza morfológica (`MORPH_OPEN` + mantém só o maior componente
   conectado) — tira ruído/manchas residuais
4. Recorte pelo bounding-box **união de todos os frames** (não por frame
   individual — senão o WebP anima com dimensões inconsistentes entre
   frames e a lib de export rejeita)
5. Exporta como WebP animado com alpha (`Image.save(..., save_all=True,
   format="WEBP")`)

Arquivos finais em `src/assets/mascots/*.webp` (~150-700KB cada — só
carregam quando `GamePage` monta, não pesam no load inicial).
