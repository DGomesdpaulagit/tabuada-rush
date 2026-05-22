# ⚡ MEMORY_CORE.md — Estado Atual do Projeto

> Atualizar a cada sessão. Manter pequeno e rápido de ler.

---

## 📍 ESTADO ATUAL

**Data:** 2026-05-22  
**Versão:** 2.0.0  
**Status:** ✅ MVP completo e funcional  
**Servidor dev:** `http://localhost:3000` (npm run dev)

---

## ✅ O QUE ESTÁ PRONTO

- [x] Setup React + Vite + Tailwind + Framer Motion + Recharts
- [x] Design system com tokens CSS + paleta por modo
- [x] MenuPage com level card, 4 modos, navegação completa
- [x] GamePage com useReducer + timer + animações de feedback
- [x] Modo Rush (5min countdown + bônus tempo)
- [x] Modo Sobrevivência (3 vidas + tempo decorrido)
- [x] Modo Velocidade (60s countdown)
- [x] Modo Desafio Diário (20 perguntas seed determinística)
- [x] ResultsPage com stats animadas + gradiente por modo
- [x] RecordsPage com cards por modo + empty states
- [x] StatsPage com LineChart Recharts + breakdown por modo
- [x] AchievementsPage com 16 conquistas + estados bloqueado/desbloqueado
- [x] BattlePage modo 2 jogadores local (split screen)
- [x] Persistência localStorage completa
- [x] Sistema de XP e níveis (7 níveis)
- [x] Sistema de conquistas com detecção automática
- [x] Toast de conquista desbloqueada animado
- [x] Toast de level up animado
- [x] Sistema de memória persistente (MEMORY.md, MEMORY_CORE.md, etc.)

---

## 🎯 PRÓXIMA SESSÃO — PRIORIDADES

1. **Testes completos** de todos os modos (especialmente Rush timer=0 e Daily completion)
2. **Melhorias visuais** — feedback mais rico na tela de jogo
3. **Deploy** no Vercel ou GitHub Pages
4. **Streak diário** — lógica de dias consecutivos visível no menu
5. **Exportação de dados** (botão nas stats)

---

## 🐛 BUGS CONHECIDOS

Ver `BUGS.md` para lista completa.

- Survivalmode timer não contava (CORRIGIDO em sessao-001)

---

## 🔑 ARQUIVOS CRÍTICOS

| Arquivo | Importância |
|---------|-------------|
| `src/App.jsx` | Orquestrador geral — handleGameEnd, navegação, toasts |
| `src/pages/GamePage.jsx` | Lógica do jogo — reducer, timer, animações |
| `src/lib/storage.js` | Persistência — KEY: `tabuada_rush_v2` |
| `src/constants/index.js` | MODES, LEVELS, ACHIEVEMENTS |
| `src/utils/index.js` | getDailyQuestions (seed), calcPoints, checkNewAchievements |

---

## 💡 CONTEXTO RÁPIDO PARA IA

Para continuar qualquer sessão, ler nesta ordem:
1. Este arquivo (MEMORY_CORE.md) — 2 min
2. `MEMORY.md` — 5 min (arquitetura completa)
3. `sessions/sessao-001.md` — última sessão
4. `BUGS.md` — problemas ativos
