# 🧠 MEMORY.md — DNA do Projeto Tabuada Rush

> Arquivo permanente. Nunca resumir. Atualizar seções específicas quando necessário.

---

## 📌 VISÃO GERAL

**Nome:** Tabuada Rush  
**Versão:** 2.0.0  
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
  constants/index.js     — MODES, LEVELS, ACHIEVEMENTS
  lib/storage.js         — persistência localStorage
  utils/index.js         — questionGenerator, scoring, dates
  contexts/AppContext.jsx — estado global (data + update)
  components/ui/index.jsx — Button, Card, Badge, Progress, StatCard, EmptyState
  pages/
    MenuPage.jsx         — Menu principal com nível, modos, navegação
    GamePage.jsx         — Gameplay com useReducer (TICK/CORRECT/WRONG/NEXT/END)
    ResultsPage.jsx      — Tela de resultados pós-partida
    RecordsPage.jsx      — Recordes por modo
    StatsPage.jsx        — Dashboard estatísticas + LineChart Recharts
    AchievementsPage.jsx — Grade de conquistas desbloqueadas/bloqueadas
    BattlePage.jsx       — Modo 2 jogadores local (split screen)
  App.jsx                — Orquestrador: navegação, handleGameEnd, toasts de conquistas
  main.jsx               — Entry point React
  styles/globals.css     — CSS variables + Tailwind base
```

---

## 🎨 DESIGN SYSTEM

### Paleta de Cores
| Token | Valor | Uso |
|-------|-------|-----|
| Primary | `#7C3AED` violet-600 | Destaque geral |
| Background | `hsl(250 30% 98%)` | Fundo do app |
| Card | `#FFFFFF` | Cards brancos |
| Success | `#10B981` emerald-500 | Acertos |
| Destructive | `#EF4444` rose-500 | Erros |
| Amber | `#F59E0B` | Streaks/combos |

### Gradientes por Modo
| Modo | Gradiente |
|------|-----------|
| Rush | `from-violet-500 to-purple-600` |
| Sobrevivência | `from-rose-500 to-pink-600` |
| Velocidade | `from-amber-400 to-orange-500` |
| Desafio Diário | `from-emerald-400 to-teal-600` |

### Tipografia
- Fonte: **Nunito** (Google Fonts)
- Pesos: 400, 600, 700, 800, **900 (Black)**
- Aplicado via `font-nunito` no Tailwind

### Border Radius
- Cards: `rounded-3xl` (24px)
- Buttons: `rounded-2xl` (16px)
- Inputs: `rounded-2xl`

---

## 🎮 MODOS DE JOGO

### Rush Mode (⚡)
- Timer: 5 minutos (300s) contando regressivamente
- Bônus: +1 segundo por resposta correta
- Dificuldade: progressiva (15 → Nível 2, 30 → Nível 3)
- Objetivo: máxima pontuação

### Sobrevivência (❤️)
- Timer: não tem (conta elapsed time para stats)
- Vidas: 3 (diminui a cada erro)
- Termina: ao perder todas as vidas
- Objetivo: durar o máximo possível

### Velocidade (⏱️)
- Timer: 60 segundos countdown
- Sem bônus de tempo
- Objetivo: máximo de acertos em 60s

### Desafio Diário (🌟)
- Timer: sem (conta elapsed time)
- Perguntas: 20 por dia, geradas com seed determinística (data)
- Seed: `YYYYMMDD → seededRng` — mesmas perguntas para todos no mesmo dia
- Bloqueio: após completar hoje, botão desabilitado até amanhã

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
  records: {                // Recordes por modo
    rush: Number,
    survival: Number,
    speed: Number,
    daily: Number,
  },
  sessions: [               // Últimas 100 sessões
    { mode, score, correct, wrong, date }
  ],
  achievements: [],         // IDs de conquistas desbloqueadas
  modesPlayed: [],          // Modos já jogados (para conquista 'all_modes')
  dailyCompleted: 0,        // Quantas vezes completou o Desafio Diário
  survivalBest: 0,          // Melhor # acertos no modo Sobrevivência
  speedBest: 0,             // Melhor # acertos no modo Velocidade
  currentDailyDate: null,   // Data do último desafio diário completo
  currentDailyScore: null,  // Pontuação do último desafio diário
  currentStreak: 0,         // Sequência de dias jogando
  lastPlayDate: null,       // Última data que jogou (YYYY-MM-DD)
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

XP = pontuação da partida. Levels em `LEVELS[]`:
`Iniciante → Aprendiz → Calculador → Ágil → Expert → Mestre → Lenda`

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
  → BattlePage (modo 2P local, dados não persistidos)
```

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

## 🏟️ MODO BATALHA 2 JOGADORES

- Split screen horizontal (dois painéis side-by-side)
- Cada painel: header com score/vidas próprias, pergunta própria, input próprio
- Vence quem acertar 10 perguntas primeiro
- Dados NÃO são persistidos (sessão temporária)

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
