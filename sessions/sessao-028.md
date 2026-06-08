# Sessão 028 — Tabuada Rush 3.0 · FASE 3 (Economia e Loja Reformulada)

**Data:** 2026-06-08
**Versão:** 3.4.0 → **3.5.0**
**Tipo:** Implementação (Fase 3 do roadmap 3.0)
**Próxima sessão:** Fase 4 — Novos Modos (Recorde Pessoal, Desafio Semanal, Modo Difícil)

---

## Resumo executivo

Fase 3 dá ao jogo um sistema econômico maduro:

1. **Power-ups Spot** — comprar item de socorro no momento de perder
2. **Seguro de Ofensiva** (100🪙) — salva a ofensiva se você quebrar
3. **Congelar Missão** (50🪙) — pausa uma missão diária por 24h
4. **Apostas de Partida** (10/25/50🪙) — modal antes de iniciar; 3× se recorde
5. **Oferta da Semana** — 3 cosméticos com 40% off, rotativo por segunda-feira
6. **Temas de GamePage** — cosméticos visuais aplicados ao card de pergunta

---

## 1. Power-ups Spot

**Arquivo:** `src/pages/GamePage.jsx`

### Vida Extra Spot (Survival)
- O prompt ao perder a última vida agora oferece duas opções:
  - "Usar Vida do Estoque" — apenas se `powerups.life > 0`
  - "🪙 Comprar Vida Agora (80)" — apenas se `coins >= 80`
- Ambos os botões reaparecem juntos quando aplicável; "Encerrar partida" sempre disponível.

### +60s Spot (Rush)
- Quando Rush em tempo crítico (`state.time <= 20`) e o jogador NÃO tem
  `powerups.time` mas tem >= 30 🪙: aparece botão âmbar
  **"🪙 Comprar +60s Agora (30)"**.
- A mesma lógica de `restartTimer()` foi extraída em helper para reaproveitar
  entre `handleUseLive` e `handleBuyLifeSpot`.

---

## 2. Seguro de Ofensiva

**Arquivos:** `src/constants/shop.js`, `src/utils/index.js`

### Item da loja
```js
{
  id: 'powerup_streak_insurance',
  category: 'powerup', powerupKey: 'streakInsurance',
  name: 'Seguro de Ofensiva', emoji: '🛡️', price: 100,
}
```

### Lógica em `applyStreakDecay`
Quando a ofensiva está prestes a quebrar (jogador perdeu um dia):
- Se `powerups.streakInsurance > 0`: consome 1 seguro, registra
  `streakInsuredAt` (ISO timestamp), **mantém a ofensiva intacta**
- Se sem seguro: zera a ofensiva como antes

Comportamento de janela de 24h: a função grava o instante do uso do seguro;
o jogador continua tendo a ofensiva ativa enquanto não perder outro dia.
Se perder de novo (já sem seguro novo), aí sim a ofensiva quebra.

---

## 3. Congelar Missão Diária

**Arquivos:** `src/constants/shop.js`, `src/utils/missions.js`, `src/pages/MissionsPage.jsx`

### Item da loja
```js
{ id: 'powerup_mission_freeze', powerupKey: 'missionFreeze', price: 50 }
```

### Lógica em `missions.js`
- Nova função pública: `freezeMission(missionsData, missionId)` — marca
  `mission.frozen = true`.
- `initDaily(date, frozenCarryOver=[])` agora aceita carregar missões
  congeladas do dia anterior. Elas mantêm o progresso intacto, têm o flag
  `frozen` zerado (volta ao ciclo normal a partir do próximo reset).
- `getActiveMissions` passa as missões do dia anterior para `initDaily`
  quando detecta mudança de data.

### UI no `MissionsPage`
- Para cada missão diária **incompleta e não congelada**: botão "Congelar"
  que consome 1 do estoque OU paga 50 🪙 (em ordem de prioridade)
- Quando congelada: aparece badge "❄️ Congelada — sobrevive até amanhã"

---

## 4. Apostas de Partida

**Arquivo:** `src/App.jsx`

### Fluxo
1. Jogador clica em um modo principal (rush/survival/speed/daily) na ModesPage
2. Se tem >= 10 🪙 e não há `activeBet`, modal **BetModal** aparece
3. Opções: 🪙 10 / 🪙 25 / 🪙 50 (ganha 30 / 75 / 150 respectivamente)
   ou "Jogar sem apostar"
4. Aposta confirmada → grava `data.activeBet = { mode, amount }` e desconta moedas
5. Ao final da partida em `handleGameEnd`:
   - Se `score > prevRecord` → **+3× aposta** em moedas
   - Senão → aposta perdida (já foi descontada)
6. Toast indica resultado (`💰 Aposta vencida! +X 🪙` ou `💸 Aposta perdida`)
7. `activeBet` é limpo após resolução

### Componente `BetModal`
- Mostra: nome do modo, recorde atual, moedas disponíveis
- 3 botões com valores fixos + "Jogar sem apostar"
- Valores indisponíveis (sem moedas) ficam desabilitados sem somem
- Modais de treino/flashcard/inverso **NÃO** disparam aposta

### Modos excluídos
- Zen, Revisão, Inverso e Flashcard: nunca disparam aposta (alguns são modos
  de treino sem recorde competitivo; o Inverso é um modo único e ainda não
  tem leaderboard interno).

---

## 5. Oferta da Semana

**Arquivos:** `src/constants/shop.js`, `src/pages/ShopPage.jsx`

### `getWeeklyOffer(date)`
- Filtra cosméticos (não-power-ups) elegíveis
- Embaralha deterministicamente usando seed da **semana ISO atual**
  (`getIsoWeekKey()` → `ano*100 + semana`)
- Retorna 3 itens com `originalPrice` (preço cheio) e `price` (40% off)
- Resultado idêntico para todos os jogadores na mesma semana

### UI no `ShopPage`
- Seção dedicada no topo da loja: "OFERTA DA SEMANA" (rose)
- Grid de 3 cards compactos: emoji + nome truncado + preço riscado + preço promocional
- Badge `-40%` no canto superior
- Estado `✓ Você tem` quando já possui o item
- Click compra direto via `buyCosmetic`
- Subtítulo: "Renova toda segunda"

---

## 6. Temas de GamePage

**Arquivos:** `src/constants/shop.js`, `src/pages/GamePage.jsx`

### Nova categoria `gameTheme`
3 itens com `questionGradient` (gradiente do card) e `questionBorder` (cor da borda):

| Item | Preço | Raridade | Gradiente |
|------|-------|----------|-----------|
| 💠 Tema Neon | 1.000 | Rare | cyan-100 → fuchsia-100 |
| 🌌 Tema Aurora | 2.500 | Epic | emerald-100 → violet-100 → pink-100 |
| 🔥 Tema Lava | 5.000 | Legendary | amber-100 → rose-100 → red-200 |

### Categoria adicionada em `SHOP_CATEGORIES`
```js
{ id: 'gameTheme', label: 'Jogo', emoji: '💠' }
```

### Aplicação no `GamePage`
```js
const equippedGameTheme = data.equippedItems?.gameTheme
  ? SHOP_ITEM_MAP[data.equippedItems.gameTheme] : null;
const questionGradient = equippedGameTheme?.questionGradient || cfg.gradientLight;
const questionBorder   = equippedGameTheme?.questionBorder   || cfg.border;
```

O card de pergunta usa `questionGradient`/`questionBorder` em vez dos defaults
do modo. Quando nada está equipado, comportamento idêntico ao anterior.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/shop.js` | + Seguro · Congelar · 3 temas de GamePage · `gameTheme` em categorias · `getWeeklyOffer` · `getIsoWeekKey` |
| `src/utils/index.js` | `applyStreakDecay` consome seguro em vez de zerar streak |
| `src/utils/missions.js` | + `freezeMission` · `initDaily` carrega missões congeladas |
| `src/pages/GamePage.jsx` | spot-buy de vida e +60s · tema equipado no card |
| `src/pages/ShopPage.jsx` | seção Oferta da Semana (3 cards 40% off) |
| `src/pages/MissionsPage.jsx` | botão Congelar (estoque ou 50🪙) · badge "congelada" |
| `src/App.jsx` | `BetModal` · `pendingBetMode` · `handleConfirmBet/Skip` · resolução de aposta no `handleGameEnd` |
| `CHANGELOG.md` | entrada [3.5.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-028.md` | este arquivo |

---

## Decisões técnicas

1. **Spot-buy só em momentos críticos** — Rush spot-buy só quando ≤20s
   restam. Survival sempre que perdeu a última vida. Evita "comprar e
   desperdiçar" cedo na partida.
2. **Apostas: bater RECORDE, não só pontuar** — recompensa esforço genuíno,
   não score baixinho. Quem nunca jogou o modo (record=0) ganha já na
   primeira tentativa (qualquer score > 0).
3. **Apostas pulam treino** — Zen/Revisão/Flashcard/Inverso não disparam
   modal. Isso preserva o caráter relaxado do treino.
4. **Seguro: 1 uso por quebra, não acumula** — comportamento alinhado ao
   descrito no roadmap (sessão 025).
5. **Congelar herda progresso** — a missão congelada é literalmente a mesma
   instância carregada para o dia seguinte. Não cria duplicata.
6. **Oferta da Semana exclui consumíveis** — cosméticos cumulam valor
   permanente; power-ups não. Promover power-ups quebraria o equilíbrio.
7. **Gradient/border separados em vez de tema único** — manter os modos com
   sua identidade (gradient `cfg.gradient` ainda usado no botão OK e
   feedback). Tema sobrescreve só o card central.

---

## Próximos passos (Fase 4 — Novos Modos)

1. **Modo Contra o Relógio Pessoal** — bater seus próprios tempos por fato
   (usa `factStats[fk].totalMs/count` como benchmark)
2. **Desafio Semanal Competitivo** — 10 questões iguais para todos por
   semana, leaderboard via Supabase
3. **Modo Difícil** — pool exclusivo 7/8/9, timer 90s, xpMultiplier 0.22,
   desbloqueado no Nível 8+

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 23s, 0 erros)
- **Dev server:** sem erros de console
- **Tamanhos:** index.js 1.104 kB / gzip 308 kB
- **Backward-compat:** todos campos novos (`activeBet`, `streakInsuredAt`,
  `frozen`, `powerups.streakInsurance/missionFreeze`, `equippedItems.gameTheme`)
  iniciam como undefined/0 — sem migração.
