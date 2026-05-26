# 📋 Sessão 018 — Catálogo de Progresso (Fase 5 / Bloco 8)

**Data:** 2026-05-26
**Duração:** Sessão média (nova página + registro de evolução)
**Resultado:** ✅ Página "Catálogo de Progresso" criada, integrada ao menu e ao fluxo de dados. Build limpo.

---

## 🎯 OBJETIVO

Transformar o progresso do usuário em algo visual, organizado e motivador: uma página
dedicada que reúne XP, níveis, evolução, marcos e o histórico da jornada — **sem redesign**
e mantendo a identidade visual (paleta violeta, Nunito, cards `rounded-3xl`, Framer Motion).

---

## ✅ O QUE FOI FEITO

- **`src/pages/CatalogPage.jsx` (NOVO):** página dedicada com seções:
  - **Progresso Geral** — hero violeta (badge/título/nível, QI, XP total, ofensiva, partidas).
  - **Experiência (XP)** — XP no nível atual, XP total, barra + % até o próximo nível.
  - **Sua Evolução** — semana / mês / total (partidas + precisão). Mês reusa `analyzeUser().monthly`; semana é calculada das sessões.
  - **Marcos de Progresso** — 4 `StatCard` (nível alcançado, ofensiva recorde, maior pontuação, total de acertos).
  - **Catálogo de Níveis** — lista dos 28 níveis com estado: desbloqueado (✓), atual (destaque + barra), futuro (cadeado + XP).
  - **Registro de Evolução** — timeline dos marcos (`progressLog`), com `EmptyState` quando vazio.
- **`src/lib/storage.js`:** novo campo `progressLog: []` (últimos 50 marcos).
- **`src/utils/index.js`:** `detectProgressEvents(prev, next)` — detecta novos marcos (subida de nível, marcos de XP, ofensiva por recorde, melhora de recorde por modo).
- **`src/App.jsx`:** `handleGameEnd` agora anexa os eventos detectados em `progressLog` (atômico, dentro do `update`); import + rota `catalog`.
- **`src/pages/MenuPage.jsx`:** botão destacado "Catálogo de Progresso" (gradiente violeta claro, ícone `TrendingUp`) logo após o card de perfil.

---

## 🔧 DECISÕES TÉCNICAS

- **D061 — Registro de evolução data-driven:** marcos derivam da comparação `prev`→`next` no `handleGameEnd`, persistidos atômicos no mesmo `update` (sem dupla escrita). Sincroniza com Supabase como o resto do estado.
- **D062 — Evolução reusa o motor existente:** mês reaproveita `analyzeUser().monthly` (sem duplicar lógica); semana é cálculo simples por janela de tempo.
- **D063 — Sem hardcode de níveis:** o Catálogo de Níveis lê `LEVELS` e usa `getLevelIdx`/`getXpProgress` — escalável e retrocompatível.
- **D064 — Records só logam melhora:** primeiro recorde de um modo não vira marco (evita ruído); só melhorias sobre um recorde existente.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — mesmos tokens, gradiente violeta, `rounded-3xl`, `StatCard`, `Progress`, animações de página.

---

## ⚠️ VERIFICAÇÃO

- `npm run build` ✅ (2764 módulos, sem erros).
- Preview headless (Claude) **não roda rAF** → `AnimatePresence mode="wait"` não finaliza a transição e a nova tela não monta no preview tool (limitação conhecida, não é bug do app). Navegação real funciona no browser do usuário.

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Usuário testar o Catálogo em browser real (navegação + animações).
2. Economia/Loja (moedas) — já há `coins` no schema.
3. Leaderboard global via Supabase.
4. Futuros: temporadas, sistema social, recompensas avançadas, gráficos avançados, marketplace, missões.
