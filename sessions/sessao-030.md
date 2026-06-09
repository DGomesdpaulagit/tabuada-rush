# Sessão 030 — Tabuada Rush 3.0 · FASE 5 (Social e Retenção)

**Data:** 2026-06-08
**Versão:** 3.6.0 → **3.7.0**
**Tipo:** Implementação (Fase 5 — Social e Retenção)
**Próxima sessão:** Fase 6 — Expansão de Conteúdo (Tabuada 11/12 opcional, Modo Combinado)

---

## Resumo executivo

Fase 5 fecha o ciclo social e de retenção do Tabuada Rush 3.0:

1. **Leaderboards globais** (Diário + Semanal) via Supabase, com graceful
   degradation quando tabelas não existem ou Supabase está offline.
2. **Heatmap de Ofensiva 365 dias** estilo GitHub na StatsPage.
3. **Compartilhar Resultado** — gera um PNG 1080×1080 do resumo da partida
   via Canvas API, usa Web Share API se disponível, senão faz download.

---

## 1. Leaderboards Globais

**Arquivos:** `src/services/leaderboard.js` (novo), `src/pages/LeaderboardPage.jsx` (novo),
`src/App.jsx`, `SUPABASE_SETUP.md`.

### Schema (novo SQL em `SUPABASE_SETUP.md`)
Duas tabelas com RLS: todos autenticados leem, só o dono escreve.
```sql
public.leaderboard_daily  (user_id, date,  display_name, score, updated_at)
public.leaderboard_weekly (user_id, week,  display_name, score, updated_at)
```
Índices em `(date, score desc)` e `(week, score desc)` para top-N rápido.

### Service `leaderboard.js`
- `upsertDailyScore({ userId, date, displayName, score })`
- `fetchDailyLeaderboard(date)` → `{ ok, entries[] }` (top 20)
- `upsertWeeklyScore({ userId, week, displayName, score })`
- `fetchWeeklyLeaderboard(week)`

**Graceful degradation:** detecta `42P01` (relation does not exist) e retorna
`{ ok: false, reason: 'no_table' }` — UI mostra mensagem amigável em vez de
erro. Idêntico para `unconfigured` (sem `.env`) e erros genéricos.

### Integração em `App.jsx::handleGameEnd`
```js
if (user) {
  if (result.mode === 'daily' && result.dailyDate) {
    upsertDailyScore({ userId: user.id, date: result.dailyDate, displayName, score });
  } else if (result.mode === 'weekly') {
    upsertWeeklyScore({ userId: user.id, week: getCurrentWeekKey(new Date()), ... });
  }
}
```
- `displayName` = parte antes do `@` do email
- `.catch(() => {})` — não quebra a UI se Supabase falhar
- Só dispara para os 2 modos competitivos relevantes

### `LeaderboardPage.jsx`
- Tabs **Diário** / **Semanal**
- Mostra "Seu Score" em destaque (gradient violeta) com o personagem QI
- Top 20 com:
  - Medalha 🥇 🥈 🥉 para os 3 primeiros
  - Linha do próprio usuário com destaque violeta + "(você)"
  - Timestamp da última atualização (dia/hora)
- Estados de erro:
  - Sem login → "Faça login para sincronizar"
  - `no_table` → "Leaderboard ainda não foi ativado · veja SUPABASE_SETUP.md"
  - `unconfigured` → "Configure VITE_SUPABASE_URL/KEY no .env"
  - Lista vazia → EmptyState "Seja o primeiro a pontuar!"

### Acesso pelo menu
- Botão "Leaderboard Global" 👑 no `MenuPage`, em linha própria abaixo de
  Conquistas/Ranking QI.

---

## 2. Heatmap de Ofensiva 365 dias

**Arquivo:** `src/components/StreakHeatmap.jsx` (novo), `src/pages/StatsPage.jsx`.

### Mecânica
- Grade 53 colunas × 7 linhas (domingo → sábado)
- Última coluna termina na semana atual
- Cor por intensidade de partidas no dia:
  ```
  0 jogos:  bg-gray-100
  1:        bg-emerald-200
  2-3:      bg-emerald-400
  4-7:      bg-emerald-600
  8+:       bg-emerald-800
  ```
- `title` (tooltip) em cada célula: `2026-06-05: 3 partidas`

### Eixos
- Coluna: cabeçalho com nome do mês no domingo de cada mês novo
- Linha: labels D/T/Q/S (alternados, para legibilidade)

### Métricas no header
- "X dias jogados · Y partidas"

### Posicionamento
Inserido na `StatsPage` logo após os "Summary cards" e antes do botão
"Catálogo de Precisão". É a primeira visualização gráfica grande da página.

---

## 3. Compartilhar Resultado (share card)

**Arquivo:** `src/lib/shareCard.js` (novo), `src/pages/ResultsPage.jsx`.

### Geração via Canvas API
Sem dependência nova. `generateShareCard(props)` produz PNG 1080×1080:
- Fundo: gradiente diagonal do modo (paleta espelha a UI)
- Card branco central com SCORE gigante (220px) e label "PONTOS"
- Badge "🏆 NOVO RECORDE!" amarelo quando aplicável
- 3 colunas: Precisão · Acertos · Sequência
- Rodapé: emoji do personagem QI + nome

### `MODE_THEMES` cobre os 10 modos
rush · survival · speed · daily · zen · review · hard · personal · weekly · inverse.

### API pública
- `generateShareCard(props)` → data URL PNG
- `downloadShareCard(props)` → dispara download direto
- `shareCard(props)` → **tenta Web Share API** com arquivo; fallback automático para download

### Botão na `ResultsPage`
- "Compartilhar resultado" (variant secondary, full width) acima dos
  botões Home / Jogar Novamente.
- Click chama `shareCard()` com props da partida + QI atual + flag `isNewRecord`.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/services/leaderboard.js` | **novo** — upsert/fetch daily e weekly com graceful degradation |
| `src/pages/LeaderboardPage.jsx` | **novo** — UI top 20 com tabs, badges, estados de erro |
| `src/components/StreakHeatmap.jsx` | **novo** — heatmap 53×7 com tooltips e legenda |
| `src/lib/shareCard.js` | **novo** — geração de PNG 1080² via Canvas + Web Share API |
| `src/App.jsx` | rota `leaderboard` + upsert no handleGameEnd |
| `src/pages/MenuPage.jsx` | botão "Leaderboard Global" 👑 |
| `src/pages/StatsPage.jsx` | inclui StreakHeatmap |
| `src/pages/ResultsPage.jsx` | botão "Compartilhar resultado" |
| `SUPABASE_SETUP.md` | SQL das tabelas `leaderboard_daily` e `leaderboard_weekly` + políticas RLS + índices |
| `CHANGELOG.md` | entrada [3.7.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-030.md` | este arquivo |

---

## Decisões técnicas

1. **Graceful degradation em 3 níveis** — Supabase indisponível, tabelas não
   criadas, e erro genérico. Cada um tem mensagem própria. Nunca quebra a UI.
2. **`displayName` é parte do email** — privacidade ok (não expõe domínio),
   familiaridade ok (o jogador se reconhece).
3. **Sem trigger anti-spoofing** — o cliente envia o display_name. Se for
   problema no futuro, basta um trigger SQL `before insert/update` que
   sobrescreve com `auth.email()`. Documentado no setup.
4. **Heatmap baseado em `data.sessions`** — funciona offline, sem dependência
   de servidor. Sessões já estão limitadas a 100 entradas no storage —
   suficiente para mostrar atividade recente; para 365 dias completos
   bastaria aumentar o cap.
5. **Share card 1080×1080 (quadrado)** — formato universal para Instagram
   feed, Stories (com padding) e WhatsApp.
6. **Canvas API direto, não html2canvas** — zero peso de dependência,
   build leve, controle total do output.
7. **Web Share API com fallback** — em mobile com PWA instalado, abre
   o share nativo (Instagram, WhatsApp, etc.). Em desktop, faz download
   da imagem.
8. **Leaderboard só para daily/weekly** — modos que faz sentido comparar
   globalmente (todos jogam as mesmas questões). Score do Rush/Speed/Survival
   varia muito por habilidade individual.

---

## Próximos passos (Fase 6 — Expansão de Conteúdo)

1. **Tabuada do 11 e 12** — pool separado, ativável nas configurações.
   Marca como "além do currículo básico" para não confundir iniciantes.
2. **Modo Combinado** — `MODES.combined`. "3 × 7 + 4 = ?" — cálculo
   mental com duas operações. Para jogadores avançados com certificados
   de domínio conquistados.

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 58s, 0 erros)
- **Tamanhos:** index.js 1.122 kB / gzip 313 kB (+5kB pelo share card e leaderboard)
- **Dev server:** sem erros de console
- **SQL pendente do lado do operador:** rodar a migração de leaderboards no Supabase para ativar. Sem isso, a página mostra "Leaderboard ainda não foi ativado" amigavelmente.
- **Backward-compat:** todos campos novos opcionais, sem migração.
