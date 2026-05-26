# 📋 Sessão 008 — Sistema de Ofensiva Avançado (metas, reset, recompensas, conquistas)

**Data:** 2026-05-26
**Duração:** Sessão longa (sistema completo de ofensiva)
**Resultado:** ✅ Ofensiva com reset diário/anual, meta no login, escolha de nova meta, conquistas de ofensiva, recompensas em 40/100/250/365 dias e base de moedas — visual preservado

---

## 🎯 OBJETIVO

Sistema completo de ofensiva diária com metas, resets e recompensas (pedido do Davi).

---

## ✅ O QUE FOI FEITO

### 1. Reset da ofensiva (dia perdido / virada de ano)
- `utils/applyStreakDecay(data)`: se o usuário não jogou ontem nem hoje (dia perdido) OU o último dia foi em ano anterior (virada de ano) → `currentStreak = 0` e `streakGoalBase = 0`.
- Roda no `AppContext` ao iniciar **e** ao carregar dados da nuvem (login). Assim a ofensiva reinicia mesmo sem jogar (antes só resetava ao jogar).
- `handleGameEnd` também é ano-aware (virada de ano reinicia em 1).
- **Recordes e conquistas NÃO resetam** (só a ofensiva).

### 2. Meta de ofensiva no login + nova meta ao bater
- Opções: **5, 10, 15, 20, 35, 40 dias** (`STREAK_GOALS`).
- `streakGoal` default `null` → abre **GoalModal** no menu (cobre login e novos ciclos).
- Progresso da meta = `currentStreak − streakGoalBase` (base = ofensiva quando a meta foi definida).
- Ao **bater a meta**, `streakGoal` volta a `null` → modal pede **nova meta** (progresso "volta ao início" via nova base).
- Card de perfil: mostra `progresso/meta · alterar` (abre modal) ou "Definir meta" quando null. Pills antigas removidas (seleção agora no modal).

### 3. Conquistas de ofensiva (página de Conquistas)
- Nova categoria **"Ofensiva"** em `ACHIEVEMENTS`: 5/10/15/20/35/40/100/250/365 dias (check em `bestDayStreak`).
- Aparecem automaticamente na `AchievementsPage` (agrupa por categoria) e disparam o toast de conquista.

### 4. Recompensas por marco de ofensiva (40/100/250/365 dias)
- `STREAK_REWARD_MILESTONES = [40,100,250,365]`.
- Ao atingir um marco (ofensiva absoluta) ainda não resgatado → `pendingStreakReward` setado → **RewardModal** no menu.
- Usuário escolhe: **Subir de Nível** (pula 1 nível), **+5 QI** (`qiBonus`), **+XP** (marco×20), **+Moedas** (marco×5).
- Marco resgatado vai para `streakRewardsClaimed` (não repete). Pode concluir as ofensivas normalmente; os marcos seguem em 100/250/365.

### 5. Moedas (base) e bônus de QI
- Novos campos: `coins` (mostrado discreto no card 🪙) e `qiBonus` (somado em `computeQI`).
- Economia/loja completa fica para bloco futuro — aqui é só a base para a recompensa funcionar.

### 6. Modais (novo, no estilo do projeto)
- `GoalModal` e `RewardModal` em `App.jsx`: overlay `bg-black/50`, card branco `rounded-3xl`, acentos violeta. Renderizados só no menu; recompensa tem prioridade sobre a meta.

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | `STREAK_GOALS` 5-40; `STREAK_REWARD_MILESTONES`; 9 conquistas de Ofensiva |
| `src/lib/storage.js` | defaults: streakGoal null, streakGoalBase, streakRewardsClaimed, pendingStreakReward, coins, qiBonus |
| `src/utils/index.js` | `applyStreakDecay`; `computeQI` soma `qiBonus` |
| `src/contexts/AppContext.jsx` | aplica decay ao iniciar e no login |
| `src/App.jsx` | lógica de ofensiva/meta/recompensa em `handleGameEnd`; GoalModal + RewardModal + handlers |
| `src/pages/MenuPage.jsx` | meta com base/null + botão modal; moedas no card |

---

## 🔧 DECISÕES TÉCNICAS

- **D031 — Decay no AppContext (load/login):** garante reset por dia perdido/ano sem precisar jogar. Recordes/conquistas intactos.
- **D032 — `streakGoalBase`:** progresso da meta é relativo à base; ofensiva absoluta (`currentStreak`) segue para os marcos 40/100/250/365. Permite "nova meta sem zerar a ofensiva".
- **D033 — Recompensa absoluta vs meta relativa:** marcos de recompensa usam ofensiva absoluta; metas pessoais usam base. Independentes; no mesmo dia podem coincidir (recompensa mostra primeiro).
- **D034 — Moedas/qiBonus mínimos agora:** só o necessário p/ a recompensa funcionar; loja completa é bloco futuro.
- **D035 — Validação em Node:** decay e meta/recompensa testados por script (UI headless não simula múltiplos dias).

---

## 🎨 IDENTIDADE VISUAL

✅ Preservada — modais usam os mesmos tokens (rounded-3xl, violeta, font-black). Card de perfil só ganhou linha de meta clicável + 🪙. Sem redesign.

---

## 🐛 OBSERVAÇÕES

- Modais lingeram no preview headless (artefato do `AnimatePresence` sem rAF) — fecham normal no navegador real (como as transições de página já validadas em produção).

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. **Bloco de Economia/Loja:** uso completo das moedas (loja, itens, gasto).
2. Polish restante: leaderboard global via Supabase.
3. Blocos futuros: recompensas avançadas, temporadas, sistema social, dashboard, análise inteligente, gráficos avançados, catálogo, marketplace, missões.
4. Validar em uso real os marcos de ofensiva (testar com datas) e ajustar valores de recompensa se preciso.
