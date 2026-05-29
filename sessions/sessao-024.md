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

## Bloco 2 — XP×2 visual + ResultsPage + painel Stats

**Commit:** c1c9109

### GamePage — badge ⚡ XP ×2
- Badge "⚡ XP ×2" aparece na linha de info (ao lado do streak) quando `powerups.xp2 > 0`
- AnimatePresence para entrada/saída suave

### ResultsPage — destaque quando XP Dobrado foi usado
- `xp2Used` calculado em App.jsx antes do update (`data.powerups.xp2 > 0`) e enviado no `result`
- Banner roxo "XP Dobrado foi usado!" com cálculo base → dobrado visível
- Card de XP com fundo violeta e label "XP Ganho ⚡×2"
- `xpEarned` já reflete o ×2 na tela de resultados

### StatsPage — painel de estoque de power-ups
- Seção "⚡ Power-ups" com os 3 consumíveis e contador de estoque
- Cores ativas vs cinza quando vazio
- Link para Loja quando sem estoque

## Próximos passos

1. **Testar em produção**: vida extra no Survival, +60s no Rush, XP Dobrado
2. **Conquistas ligadas a power-ups** (ex: "Use 10 power-ups")
3. **ShopPage**: tooltip/dica de como usar cada power-up em jogo
