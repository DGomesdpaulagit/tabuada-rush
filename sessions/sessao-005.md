# 📋 Sessão 005 — Fase 2 / Bloco 2: Sistema de Perfil e Identidade do Usuário

**Data:** 2026-05-25
**Duração:** Sessão média (sistema de progressão + perfil)
**Resultado:** ✅ Níveis expandidos, XP integrado, ofensiva diária, meta, títulos e card de perfil completo — visual original preservado

---

## 🎯 OBJETIVO

Criar o sistema principal de identidade, evolução, progressão e perfil do usuário, transmitindo progresso/constância/experiência — **sem alterar a identidade visual** (mesmo gradiente violeta, mesmo estilo).

---

## ✅ O QUE FOI FEITO

### 1. Sistema de Níveis (expansão)
- `src/constants/index.js`: `LEVELS` passou de **7 → 28 níveis**.
- Cada nível agora tem: `name`, **`title`** (título/identidade), `badge` (emoji, também usado como avatar) e `xp`.
- Curva de XP gradual no início (100, 250, 450…) e progressivamente mais íngreme até o topo (90.000 XP — "Transcendente / Calculadora Humana").
- Retrocompatível: `getLevelIdx()` é puramente baseado em XP, então saves existentes mantêm o nível correto.

### 2. Sistema de XP (integrado ao perfil)
- `src/App.jsx` (`handleGameEnd`): XP agora = `score da partida + bônus de desafio diário (+30) + bônus de ofensiva (min(streak,20)×2)`.
- Fonte de XP: partidas, acertos/desempenho (já embutidos no score com combos), desafios e ofensiva diária mantida.
- Barra de XP + "X XP para <próximo nível>" exibidos no card de perfil (já existia, mantido e reposicionado).

### 3. Sistema de Ofensiva Diária
- `currentStreak` (já existente) = ofensiva atual; conta dias consecutivos jogando qualquer prática válida ou o Desafio Diário.
- **Novo** `bestDayStreak` = recorde de ofensiva (maior sequência já atingida), calculado em `handleGameEnd`.
- Exibidos no card: ofensiva atual (🔥) + recorde (🏆).

### 4. Meta de Ofensiva
- **Novo** `streakGoal` (default 7). Constante `STREAK_GOALS = [7, 15, 30, 100]`.
- No card de perfil: pills selecionáveis (7d/15d/30d/100d) + barra de progresso da meta + texto `atual/meta dias`.
- Seleção salva via `update()` (persiste local + cloud). **Testado:** clicar 15d → `streakGoal: 15` no localStorage. ✅
- Sem sistema de recompensas (conforme pedido) — apenas meta + progresso + acompanhamento.

### 5. Quadro/Card de Perfil (expandido)
- `src/pages/MenuPage.jsx`: o level card violeta foi expandido mantendo o **mesmo gradiente e estilo**:
  - Avatar (emoji do nível em círculo `bg-white/15`)
  - Título + Nome do nível
  - XP Total + barra de XP + próximo nível
  - Divisor
  - Ofensiva atual + Recorde
  - Meta de ofensiva (pills + progresso)

### 6. Título do Usuário
- Cada nível tem um `title` que muda conforme a evolução (ex.: "Aprendiz Curioso", "Estrategista Numérico", "Calculadora Humana").
- Visível no card de perfil (MenuPage) e também na ResultsPage (linha violeta abaixo do nome do nível).

### 7. Sistema de Progresso / Persistência
- Novos campos em `DEFAULTS` (`src/lib/storage.js`): `bestDayStreak`, `streakGoal`.
- Tudo salva via `storage` (localStorage) + cloud sync automático (AppContext já cobre isso).
- `storage.get()` faz spread de DEFAULTS → saves antigos recebem os campos novos sem quebrar.

### 8. Desafio Diário desbloqueado
- `MenuPage.jsx`: removido o bloqueio (`isDailyDone` desabilitava o botão + overlay "Feito hoje!").
- Agora o Desafio Diário é sempre acessível (clicável). Mantido apenas um badge discreto não-bloqueante "✓ hoje" no canto quando já feito no dia.
- Participação continua contando para ofensiva, XP e progresso.

---

## 📦 ARQUIVOS MODIFICADOS

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | `LEVELS` 7→28 (com `title`); novo `STREAK_GOALS` |
| `src/lib/storage.js` | DEFAULTS: `+bestDayStreak`, `+streakGoal` |
| `src/App.jsx` | `handleGameEnd`: XP com bônus (diário + ofensiva); `bestDayStreak` |
| `src/pages/MenuPage.jsx` | Card de perfil expandido; meta de ofensiva; diário desbloqueado |
| `src/pages/ResultsPage.jsx` | Exibe `title` do nível abaixo do nome |

---

## 🔧 DECISÕES TÉCNICAS

- **D016 — 28 níveis com `title`:** título embutido em cada nível (em vez de sistema separado) — muda automaticamente com a evolução, zero estado extra. Curva de XP retrocompatível por ser baseada só em XP.
- **D017 — Ofensiva reaproveita `currentStreak`:** já existia e contava qualquer prática diária; só foi preciso adicionar o recorde `bestDayStreak`. Evita duplicar lógica.
- **D018 — XP com bônus moderado:** score (base) + diário (+30) + ofensiva (min(streak,20)×2). Recompensa constância sem inflar demais a progressão.
- **D019 — Diário sem bloqueio:** removido o disable; mantido badge "✓ hoje" informativo (não-bloqueante). Atende req #8.
- **D020 — Meta no próprio card:** pills inline + barra, sem página nova. Mantém tudo no card de perfil, fiel ao escopo "apenas meta/progresso/acompanhamento".

---

## 🎨 IDENTIDADE VISUAL

✅ **Preservada.** Mesmo gradiente violeta do card, mesmos tokens (rounded-3xl, font-black, violet-200/white), mesma grade de modos. As adições usam os componentes/estilos existentes (`Progress`, cores do tema). Sem redesign. Verificado no preview (snapshot DOM) — sem erros de console/servidor.

---

## 🐛 PROBLEMAS ENCONTRADOS

- Screenshot do preview headless sai em branco (rAF/Framer Motion não roda no preview tool — já documentado em BUGS/MEMORY_CORE). Verificação feita via snapshot de acessibilidade (DOM real) + teste funcional via eval.

---

## 📋 PRÓXIMOS PASSOS

1. Página "Ranking de QI Matemático" (substituir placeholder "Ranking em breve")
2. Blocos futuros (NÃO implementados nesta fase): dashboard, gráficos, ranking de QI, personagens, análise inteligente, recompensas avançadas, loja, moedas, temporadas, catálogo, estatísticas avançadas
3. Possível: animação/destaque ao subir de nível com novo título
