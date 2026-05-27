# Sessão 022 — Calibração v3.0

**Data:** 2026-05-27  
**Versão resultante:** 3.0.0  
**Duração estimada:** ~2h  
**Status:** ✅ Completa — build limpo, commit `e713bbd`, Vercel disparado

---

## 🎯 Objetivo da Sessão

Reestruturar o sistema de progressão do Tabuada Rush para a versão 3.0:
- Tornar XP 100% baseado em performance do jogador
- Balancear dificuldade dos modos (Rush = mais difícil de ganhar XP)
- Tornar o QI Matemático mais difícil de maximizar
- Adicionar botão de reset de progresso
- Estruturar roadmap de features 3.0

---

## ✅ O Que Foi Feito

### 1. XP por modo (performance pura)
**Arquivo:** `src/App.jsx` — `handleGameEnd`

Antes:
```js
const gameXp = Math.round(result.score * 0.2);
const dailyBonus = result.mode === 'daily' ? 12 : 0;
const streakBonus = currentStreak > 1 ? Math.min(currentStreak, 15) : 0;
const xp = (prev.xp || 0) + gameXp + dailyBonus + streakBonus;
```

Depois:
```js
const MODE_XP_MULT = { rush: 0.18, survival: 0.30, speed: 0.25, daily: 0.40, zen: 0 };
const gameXp = Math.round((result.score || 0) * (MODE_XP_MULT[result.mode] ?? 0.20));
const xp = (prev.xp || 0) + gameXp;
```

**Por que:** Rush dura 5 minutos e gera scores altos facilmente. Com multiplicador único, jogadores de Rush acumulavam XP desproporcionalmente. Agora cada modo tem seu fator, e bônus de streak/dia foram removidos — XP é 100% mérito do jogador.

### 2. LEVELS thresholds ×2
**Arquivo:** `src/constants/index.js`

Curva recalibrada: thresholds = original × 2 (equilíbrio entre original e ×3 que era "muito difícil").

Estimativa (2–3 partidas/dia, score ~150, modo misto, ~60 XP/dia):
- Nível 2: ~1 semana | Nível 5: ~1 mês | Nível 10: ~5 meses
- Nível 15: ~1,5 anos | Nível 20: ~4 anos | Nível 28: lendário

### 3. QI Matemático mais difícil
**Arquivo:** `src/utils/index.js` — `computeQI`

Caps elevados para exigir muito mais jogo:

| Componente | Cap antigo | Cap novo |
|------------|-----------|---------|
| `speedBest` (respostas modo Speed) | 30 | 80 |
| `bestDayStreak` (dias consecutivos) | 30 | 120 |
| `totalGames` (partidas totais) | 50 | 300 |

### 4. Reset de progresso (SettingsPage)
**Arquivo:** `src/pages/SettingsPage.jsx`

- Novo componente `ResetButton` com confirmação de 2 etapas (anti-clique acidental)
- Nova seção "Zona de Perigo" no final das configurações
- Versão atualizada para v3.0
- Chama `storage.clear()` + `window.location.reload()`

### 5. Documentação atualizada
- `MEMORY_CORE.md`: versão → 3.0.0, próximas prioridades atualizadas
- `CHANGELOG.md`: entrada `[3.0.0]` adicionada
- `ROADMAP.md`: completamente reescrito com fases 3.0–3.3 e ideias futuras
- `LINKS.md`: criado (faltava no sistema de memória)
- `sessions/sessao-022.md`: este arquivo

---

## 🧮 Comparativo de Progressão (níveis)

| Versão | Nível 5 | Nível 10 | Nível 20 | Filosofia |
|--------|---------|---------|---------|-----------|
| Original (×1) | ~2 semanas | ~2 meses | ~1,5 anos | Fácil demais |
| v2.15 (×3) | ~3 meses | ~1,5 anos | >10 anos | Muito difícil |
| **v3.0 (×2)** | **~1 mês** | **~5 meses** | **~4 anos** | **Equilíbrio** |

---

## 🎮 Multiplicadores XP por Modo

| Modo | Mult | Justificativa |
|------|------|--------------|
| Rush | 0.18 | 5min = scores altos fáceis → menor mult |
| Survival | 0.30 | 3 vidas = pressão real |
| Speed | 0.25 | 60s intenso = recompensa média |
| Daily | 0.40 | 20 questões fixas = mais desafiador |
| Zen | 0 | Treino livre, sem recompensa de XP |

---

## 📋 Próximos Passos (v3.1)

1. **Modo Zen** — sem timer, sem pontuação, treinamento livre
2. **Animação level-up** — explosão de partículas
3. **Mascote matemático** — personagem reativo
4. **INSANE COMBO!** — texto épico + screen shake

---

## 🔗 Links

- **Produção:** https://tabuada-rush-rho.vercel.app
- **Commit:** `e713bbd` — branch `main`
