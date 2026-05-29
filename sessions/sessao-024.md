# Sessão 024 — Power-ups funcionais, moedas rebalanceadas, Rush scoring

**Data:** 2026-05-29
**Commit:** 596b116
**Branch:** main → Vercel auto-deploy

---

## O que foi feito

### Rush Scoring corrigido
- Adicionado `scoreScale: 0.25` ao modo Rush em `constants/index.js`
- `calcPoints()` em `utils/index.js` agora aceita parâmetro `scale`
- Dispatch `CORRECT` passa `action.scoreScale || 1`
- Resultado: score médio Rush cai de ~1400 para ~300–400 pts (alinhado com outros modos)

### Loja completamente reformulada (`constants/shop.js` + `pages/ShopPage.jsx`)
- 3 categorias: ⚡ Poder (power-ups), 🖼️ Molduras, 🎨 Temas
- **Power-ups consumíveis** com `powerupKey`: Vida Extra (80🪙), +60s Rush (120🪙), XP Dobrado (200🪙)
- Molduras com preços 800/1500/3000/8000 🪙
- Temas de card com preços 600/600/600/1500/4000 🪙
- Adjetivos de título removidos; contador de estoque visível no badge do item

### Economia de moedas rebalanceada (`App.jsx`)
- **Antes:** `Math.max(1, score × 0.1) + diário 5 + streak 2` → inflação enorme no Rush
- **Depois:** `Math.min(15, acertos × 0.3) + diário 2 + streak 1` → cap de 15 moedas/partida
- Baseado em acertos (não score), elimina inflação do Rush de 5 min

### Power-ups integrados ao gameplay
**GamePage.jsx:**
- Nova assinatura: `({ mode, onEnd, onBack, customQuestions, powerups = {}, onUsePowerup })`
- Modal "Vida Extra": aparece no Survival ao perder última vida (se `powerups.life > 0`)
  - Aceitar → `CONTINUE` (restaura 1 vida), reinicia timer
  - Recusar → chama `onEnd` normalmente
- Botão "+60s Rush": visível no Rush quando `powerups.time > 0`, dispatch `ADD_TIME`
- `handleUseLive`, `handleDeclineLive`, `handleAddTime` implementados

**App.jsx:**
- `GamePage` agora recebe `powerups={data.powerups || {}}` e `onUsePowerup` callback
- `onUsePowerup(key)`: decrementa `powerups[key]` no estado global (min 0)
- XP Dobrado: se `prev.powerups?.xp2 > 0`, dobra `gameXp` e decrementa `xp2`

### Storage
- `DEFAULTS` exportado corretamente (`export const DEFAULTS`)
- Campo `powerups: {}` incluído nos defaults

---

## Arquivos modificados
- `src/constants/index.js` — scoreScale Rush, xpMultipliers
- `src/constants/shop.js` — loja completa reformulada
- `src/lib/storage.js` — DEFAULTS exportado, powerups
- `src/pages/GamePage.jsx` — power-ups UI (modal vida extra, botão +60s)
- `src/pages/ShopPage.jsx` — nova UI com tabs power-up/frame/card
- `src/utils/index.js` — calcPoints(scale), getRevisionQuestions composto
- `src/App.jsx` — coins formula, XP×2, powerups prop ao GamePage

---

## Próximos passos

1. **Testar power-ups** em produção (vida extra no Survival, +60s no Rush, XP Dobrado)
2. **Feedback de XP Dobrado**: mostrar indicador visual "⚡ XP ×2 ativo" no GamePage quando `powerups.xp2 > 0`
3. **ResultsPage**: mostrar "+XP dobrado" quando XP Dobrado foi consumido na partida
4. **ShopPage**: botão "Como usar?" com dica rápida para cada power-up
5. **Conquistas**: considerar conquistas ligadas ao uso de power-ups
