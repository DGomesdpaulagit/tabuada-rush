# Sessão 023 — v3.1: Features Visuais e Modos de Treino

**Data:** 2026-05-27  
**Versão resultante:** 3.1.0  
**Status:** ✅ Completa — build limpo, commit `2100d4e`, Vercel disparado

---

## 🎯 Objetivo da Sessão

Implementar todas as features de experiência visual e novos modos de jogo da v3.1:
- Modo Zen e Modo Revisão
- Mascote matemático reativo
- INSANE COMBO + screen shake
- Explosão de partículas ao subir de nível
- Gráfico de erros semanal
- Tempo médio no ResultsPage
- PWA install prompt

---

## ✅ O Que Foi Feito

### 1. Modo Zen (`MODES.zen`)
- `timer: null, lives: null, questions: null, xpMultiplier: 0`
- GamePage: header mostra "🧘 Modo Zen" + tempo decorrido; placar mostra acertos (não pontos)
- Botão "Encerrar Treino" manual (sem fim natural)
- Label "Sem pressão 🌿" na área de dificuldade

### 2. Modo Revisão (`MODES.review`)
- `questions: 15, xpMultiplier: 0.25`
- `getRevisionQuestions(tableStats, 15)` em `utils/index.js`:
  - Lê `data.tableStats`, calcula errRate por tabuada
  - Top 3–5 piores (≥ 2 tentativas), fallback pool completo se pouco dado
- `handleStart` em App.jsx gera questões via `getRevisionQuestions` antes de abrir o jogo
- Passa como `customQuestions` prop para GamePage
- GamePage's `init({mode, customQuestions})` usa as questões passadas

### 3. TRAINING_MODE_LIST
- `constants/index.js`: `group: 'main'` nos 4 modos clássicos, `group: 'training'` em Zen e Revisão
- `MODE_LIST` = apenas main; `TRAINING_MODE_LIST` = apenas training
- MenuPage: nova seção "Treino" com grid 2×1 após os 4 modos principais
- Label "Sem XP" no card do Zen

### 4. Mascote Matemático
**Arquivo:** `src/pages/GamePage.jsx`

```jsx
const MASCOT = {
  idle:    { emoji: '🤓', bg: 'bg-violet-100', text: 'Prontos!' },
  correct: { emoji: '🤩', bg: 'bg-emerald-100', text: 'Isso aí!' },
  wrong:   { emoji: '😬', bg: 'bg-rose-100',    text: 'Ops...' },
  combo:   { emoji: '🔥', bg: 'bg-amber-100',   text: 'Combo!' },
  insane:  { emoji: '🤯', bg: 'bg-purple-100',  text: 'INSANE!' },
};
```

- Aparece entre o card de questão e o input de resposta
- Muda de estado ao acerto/erro/combo/INSANE
- Animação spring (AnimatePresence mode="wait")

### 5. INSANE COMBO + Screen Shake
**Arquivo:** `src/pages/GamePage.jsx`

- Streak ≥ 10 E múltiplo de 5: `isInsane = true`
  - Popup: gradient roxo-rosa, texto "🤯 INSANE COMBO! ×N", 3xl
  - Screen shake: `animate={{ x: [0, -10, 10, -8, 8, -5, 5, 0] }}` no container
- Streak múltiplo de 5, < 10: combo padrão amber/orange (sem shake)
- Mascote vai para `'insane'` no INSANE COMBO

### 6. Explosão de Partículas (Level Up)
**Arquivo:** `src/App.jsx` — componente `LevelUpBurst`

- 28 partículas em 8 cores distintas
- Cada partícula: posição calculada por ângulo (360°/28 por partícula)
- Animação: disparam do centro para fora em 850ms, fade para 0
- Texto "LEVEL UP!" + badge do nível animados no centro (1.2s total)
- Disparado em `handleGameEnd` quando `newLevelIdx > prevLevelIdx`
- Estado: `showParticles`, `particlesLevel`

### 7. PWA Install Banner
**Arquivo:** `src/App.jsx` — componente `InstallBanner`

- Escuta `beforeinstallprompt` (só browsers que suportam instalação)
- Armazena `deferredPrompt.current`
- Após 3s no menu, exibe banner deslizante na base da tela
- Botão "Instalar" → `prompt()` + `userChoice`; "Agora não" → dismiss
- Só aparece quando `screen === 'menu'`

### 8. Stat "Tempo Médio/Resp." no ResultsPage
- Só exibe quando `result.avgMs > 0`
- Valor: `(avgMs / 1000).toFixed(1) + 's'`
- Cor indigo

### 9. Stat "XP Ganho" no ResultsPage
- Calcula `xpEarned = score × MODE_XP_MULT[mode]`
- Só exibe quando `xpEarned > 0` (oculto em Zen)

### 10. Histórico Semanal de Erros no StatsPage
- Array dos últimos 7 dias (hoje − 6 a hoje)
- Para cada dia: soma `s.wrong` de todas as sessions daquele dia
- Gráfico de barras verticais: altura proporcional ao máximo da semana
- Label: dia abreviado (seg, ter...) + número do dia
- Total da semana exibido como badge rosa

---

## 📋 Próximos Passos (v3.2+)

1. Leaderboard global (Supabase)
2. Compartilhar resultado
3. Notificação de missão expirando
4. Expansão da loja
5. Streak calendar heatmap

---

## 🔗 Links

- **Produção:** https://tabuada-rush-rho.vercel.app
- **Commit:** `2100d4e` — branch `main`
