# 📋 Sessão 020 — Dashboards de Acertos e Erros (Bloco 10)

**Data:** 2026-05-27
**Duração:** Sessão média (2 novos componentes + modificação da StatsPage)
**Resultado:** ✅ Dashboards de Acertos e Erros criados como sub-páginas internas da StatsPage. Build limpo.

---

## 🎯 OBJETIVO

Expandir a página de Estatísticas com dois dashboards internos (sub-páginas):
- **Acertos** — análise positiva: precisão, evolução, crescimento, por modo
- **Erros** — análise construtiva: dificuldades, tabuadas problemáticas, por modo

Com filtros por período/mês/modo, textos inteligentes automáticos e gráficos.
SEM remover nada existente. SEM redesign. SEM criar rota nova no App.jsx.

---

## ✅ O QUE FOI FEITO

### `src/pages/HitsPage.jsx` (NOVO)
- **Header** com botão voltar → `onBack`
- **Smart insight** (hero emerald): texto automático gerado a partir dos dados filtrados
  - Lógica: compara precisão recente vs anterior, detecta evolução, faixas 92%/80%/65%
- **Filtros reativos:**
  - Período: Todos / Hoje / Mês / Ano
  - Seletor de mês: pills Jan–Dez (desabilitadas se sem dados naquele mês)
  - Modo: Todos / Rush / Sobrevivência / Velocidade / Diário
- **KPI cards:** Precisão, Total de Acertos, Melhor Sessão (%), Partidas
- **Barra visual de taxa de acerto** com cor adaptativa (emerald ≥80% / amber ≥60% / rose <60%)
- **LineChart** (Recharts): % de acertos por partida, últimas 20 (emerald `#10B981`)
- **Barras por modo:** precisão % + acertos + partidas, gradiente por modo
- **Card de sequência** (maior sequência pessoal, `data.bestStreak`)

### `src/pages/ErrorsPage.jsx` (NOVO)
- **Header** com botão voltar → `onBack`
- **Smart insight** (hero rose): texto construtivo — orienta, não critica
  - Lógica: detecta tabuada mais difícil (de `tableStats`), modo com mais erros, faixas 0%/8%/20%
- **Filtros reativos** (idênticos ao HitsPage)
- **KPI cards:** Taxa de Erro, Total de Erros, Partidas, Tabuada Difícil (ou Pior Sessão)
- **Barra visual de taxa de erro** com cor adaptativa
- **LineChart** (Recharts): % de erros por partida, últimas 20 (rose `#F43F5E`)
- **Barras por modo:** taxa de erro %, coloridas por severidade (≥25% rose / ≥12% amber / <12% emerald)
- **Barras por tabuada** (de `tableStats` global): ordenadas por maior taxa de erro, coloridas por severidade
- **Card "Maior Desafio"**: destaca a tabuada com mais erros (amber)

### `src/pages/StatsPage.jsx` (MODIFICADO)
- Importa `useState`, `HitsPage`, `ErrorsPage`, `CheckCircle`, `XCircle`
- `view` state local: `'main' | 'hits' | 'errors'`
- Renderização condicional no topo: se `view !== 'main'` retorna o sub-componente
- 2 novos botões (grid 2 colunas) após o botão "Catálogo de Precisão":
  - **Acertos** — `bg-gradient-to-br from-emerald-500 to-teal-600`
  - **Erros** — `bg-gradient-to-br from-rose-500 to-pink-600`
- Todo conteúdo original preservado

---

## 🔧 DECISÕES TÉCNICAS

- **D069 — Navegação interna por state:** sub-páginas controladas por `view` state local na StatsPage, sem tocar App.jsx. Mais limpo, menos acoplamento.
- **D070 — `tableStats` sempre global:** dados de erro por tabuada derivam do `tableStats` que é acumulativo histórico; filtros de tempo/modo se aplicam só às `sessions`. Transparência: label "Histórico completo".
- **D071 — Insight construtivo nos erros:** texto nunca critica — orienta ("pratique mais", "foque nele") e comemora conquistas ("apenas X% de erros!").
- **D072 — Meses disponíveis desabilitados:** pills de mês calculadas dinamicamente; meses sem partidas ficam disabled para evitar telas vazias surpresa.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — paleta violeta no header/filtros, gradientes naturais do design system (emerald para acertos, rose para erros), `rounded-3xl`, `StatCard`, `Progress`, `LineChart` no padrão existente.

---

## ⚠️ VERIFICAÇÃO

- `npm run build` ✅ (sem erros, apenas aviso de chunk size — pré-existente)
- Navegação interna: sem AnimatePresence extra — cada sub-página tem seu próprio `motion.div` com `pageVariants`
- Preview headless: mesma limitação conhecida (rAF) — testar em browser real

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Testar dashboards Acertos/Erros em browser real (jogar 1-2 partidas)
2. Economia/Loja (moedas — campo `coins` já existe no storage)
3. Leaderboard global via Supabase
4. Futuros: temporadas, sistema social, recompensas avançadas, missões, marketplace
