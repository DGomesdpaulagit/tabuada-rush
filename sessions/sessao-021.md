# Sessão 021 — FASE 7: Moedas, Loja, Missões e Temporadas

**Data:** 2026-05-27  
**Versão produzida:** 2.14.0  
**Status:** ✅ Build limpo, push feito, Vercel auto-deploy disparado  
**Produção:** https://tabuada-rush-rho.vercel.app

---

## O que foi feito nesta sessão

### Fase 7 — Bloco A: Sistema de Moedas e Loja

**`src/constants/shop.js`** (novo)
- `RARITIES`: common / rare / epic / legendary com cores, gems e labels
- `SHOP_ITEMS` (12 itens): 4 molduras, 3 títulos, 5 temas de card
- `SHOP_ITEM_MAP`: lookup rápido por id
- `SHOP_CATEGORIES`: tabs da loja

**`src/pages/ShopPage.jsx`** (novo)
- Tabs de categoria (Molduras / Títulos / Temas)
- Grid de itens com badge de raridade, descrição e preço
- Comprar (deduz moedas, adiciona a `ownedItems`)
- Equipar/Desequipar (toggle em `equippedItems[category]`)
- Toast de confirmação de compra
- Dica de como ganhar moedas

**Cosméticos aplicados no MenuPage:**
- Card de perfil usa o gradiente do tema equipado (`equippedItems.card`)
- Avatar exibe o ring style da moldura equipada (`equippedItems.frame`)
- Título do perfil exibe `displayTitle` do item de título equipado

---

### Fase 7 — Bloco B: Sistema de Missões

**`src/constants/missions.js`** (novo)
- `DAILY_MISSION_POOL` (11 missões): play, daily, correct_single, correct_day, streak, accuracy, score
- `WEEKLY_MISSION_POOL` (7 missões): play, daily, correct_week, streak, score
- `MONTHLY_MISSION_POOL` (5 missões): play, correct_month, streak_month, daily

**`src/utils/missions.js`** (novo)
- `getActiveMissions(missionsData)` — reset automático ao detectar mudança de dia/semana/mês
- `updateMissions(missionsData, result, currentStreak)` — atualiza progresso de todos os períodos
- `countUnclaimedMissions(missionsData)` — retorna contagem para o badge no menu
- `getNewlyCompleted(before, after)` — detecta missões recém-completas (para toasts)
- `claimMission(missionsData, period, missionId)` — marca recompensa como resgatada
- Seleção determinística via LCG com seed de data

**`src/pages/MissionsPage.jsx`** (novo)
- Tabs: Diárias / Semanais / Mensais
- Informação de reset (countdown para diárias)
- Cards de missão: emoji, título, descrição, barra de progresso, valor da recompensa
- Botão "Resgatar" para missões completadas e não resgatadas (adiciona moedas)
- Badge de "Recompensa resgatada" para missões já pagas

---

### Fase 7 — Bloco C: Sistema de Temporadas

**`src/constants/seasons.js`** (novo)
- `SEASONS`: Temporada 1 "Despertar Matemático" (01/05 → 31/07/2026) com 10 marcos de recompensa (100 → 10 000 XP de temporada)
- `getActiveSeason()` — retorna a temporada pelo intervalo de datas
- `calcSeasonXp(result, currentStreak)` — XP de temporada por partida (score×0.3 + bônus diário + bônus ofensiva)

**`src/pages/SeasonsPage.jsx`** (novo)
- Hero com gradiente da temporada, XP atual, barra de progresso geral, datas
- Trilha de recompensas: marcos bloqueados / atingidos / reivindicáveis / resgatados
- Botão "Resgatar" para marcos atingidos (coins ou item adicionado a ownedItems)
- Dica de como ganhar XP de temporada

---

### Integrações

**`src/lib/storage.js`**
- Novos campos em DEFAULTS: `ownedItems`, `equippedItems`, `missionsData`, `seasonXp`, `seasonRewards`, `seasonId`

**`src/App.jsx`** — `handleGameEnd` atualizado:
- Calcula `coinsEarned` (score×0.1 + bônus diário/ofensiva) → adicionado ao state
- Calcula `earnedSeasonXp` via `calcSeasonXp` → adicionado ao state
- Atualiza `missionsData` via `updateMissions` a cada fim de partida
- Detecta `getNewlyCompleted` → dispara toast de "Missão concluída"
- 3 novas rotas: `shop`, `missions`, `seasons`

**`src/pages/MenuPage.jsx`**
- 3 botões novos (Loja 🛍️ / Missões 🗺️ / Temporada 🌱) em grid-cols-3
- Badge numérico vermelho no botão Missões quando há recompensas para resgatar
- Cosméticos do perfil aplicados dinamicamente

---

## Arquivos criados/modificados

| Arquivo | Status |
|---------|--------|
| `src/constants/shop.js` | ✅ Criado |
| `src/constants/missions.js` | ✅ Criado |
| `src/constants/seasons.js` | ✅ Criado |
| `src/utils/missions.js` | ✅ Criado |
| `src/pages/ShopPage.jsx` | ✅ Criado |
| `src/pages/MissionsPage.jsx` | ✅ Criado |
| `src/pages/SeasonsPage.jsx` | ✅ Criado |
| `src/lib/storage.js` | ✅ Modificado |
| `src/App.jsx` | ✅ Modificado |
| `src/pages/MenuPage.jsx` | ✅ Modificado |

---

## Próximos passos

1. **Testar em browser real** — jogar partidas, verificar coins sendo ganhos, completar missões, resgatar temporada
2. **Expansão da Loja** — talvez adicionar mais itens em futuras sessões (avatares, efeitos de partícula, sons personalizados)
3. **Leaderboard global** — Supabase rankings (ainda pendente da Fase original)
4. **Notificações de missão push** — enviar push quando missão expira sem ter sido completada
5. **Segunda temporada** — definir quando a Temporada 1 encerrar (após 31/07/2026)
