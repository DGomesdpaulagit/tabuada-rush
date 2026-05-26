# 📋 Sessão 007 — Deploy automático (Vercel↔GitHub) + Rebalanceamento de XP

**Data:** 2026-05-26
**Duração:** Sessão curta (infra + ajuste de balanceamento)
**Resultado:** ✅ Deploy automático configurado; rotina de fim de bloco definida; curva de XP mais realista/difícil

---

## 🎯 OBJETIVO

1. Automatizar deploy/push/registros ao fim de cada bloco (pedido do Davi).
2. Tornar o XP "mais real" para que subir de nível seja mais difícil.

---

## ✅ O QUE FOI FEITO

### 1. Rotina de fim de bloco/sessão (CLAUDE.md)
Definida e documentada em `CLAUDE.md` (+ resumo em `MEMORY_CORE.md`). Ao concluir cada bloco:
1. Registros completos nos `.md` (a pasta É o vault do Obsidian → cobre "atualizar o Obsidian").
2. Commit + `git push origin main`.
3. Deploy no Vercel — **automático via integração Git** (push dispara).
4. Resumo final ao usuário: o que foi feito + próximos passos/sessões/etapas.

### 2. Deploy automático Vercel↔GitHub
- Blocos 1–3 commitados e enviados (`89ed15d`, depois ajustes de doc).
- Token do Vercel CLI estava expirado → optou-se por **integração Git** (usuário conectou o repo `DGomesdpaulagit/tabuada-rush` ao projeto Vercel `tabuada-rush`).
- Push de teste (`19d3b0a`) disparou o deploy. **Confirmado no ar:** https://tabuada-rush-rho.vercel.app exibindo perfil novo, ofensiva/meta e Ranking de QI.
- A partir daqui: `git push` → deploy de produção automático (sem CLI/token).

### 3. Rebalanceamento de XP (v2.5) — "modelo mais real"
Problema: subia de nível rápido demais (nível 8 com ~3-4 partidas), pois XP = score bruto e a curva era suave.

- **Curva de níveis íngreme (RPG-like)** em `constants/index.js`: deltas crescentes (~×1.235/nível). Topo passou de 90.000 → **227.900 XP**. Nomes/títulos/emojis mantidos.
- **Ganho de XP modesto por partida** em `App.jsx` (`handleGameEnd`):
  `xp += round(score * 0.5) + dailyBonus(20) + streakBonus(min(streak,30))`
  (antes: score cheio + 30 + min(streak,20)×2).
- **Resultado simulado** (rush ~323 XP/partida): 3 partidas→Calculador(3), 10→Hábil(7), 20→Estrategista(10), 40→Especialista(13). Bem mais gradual.
- Retrocompatível: `getLevelIdx` é baseado em XP. Usuário existente (XP ~2691) reposiciona de nível 8→7 (pequeno ajuste; progressão futura fica mais lenta, como desejado).
- QI não afetado negativamente (usa `getLevelIdx` com a nova curva normalmente).

---

## 📦 ARQUIVOS

| Arquivo | Mudança |
|---------|---------|
| `CLAUDE.md` | **NOVO** — instruções + rotina de fim de bloco (4 passos) |
| `MEMORY_CORE.md` | rotina + estado v2.5 |
| `src/constants/index.js` | LEVELS: curva de XP íngreme (topo 227.900) |
| `src/App.jsx` | `handleGameEnd`: ganho de XP modesto (fração do score) |

---

## 🔧 DECISÕES TÉCNICAS

- **D027 — Deploy via integração Git (não CLI):** token CLI expirado + login é ação de conta do usuário. Integração Git torna o deploy 100% automático no push, sem segredos no código. `.env` segue no `.gitignore`.
- **D028 — XP real = curva íngreme + ganho fracionário:** dois fatores combinados. Curva geométrica (×~1.235) dá sensação RPG; XP por partida = 50% do score evita inflar rápido. Subir de nível fica progressivamente mais difícil sem travar o início.
- **D029 — Rotina como workflow (não hook):** executada por mim ao fim de cada bloco enquanto a sessão está ativa; hook de Stop deployaria cego a cada parada (arriscado).

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — mudanças foram só de dados/balanceamento (números de XP) e infra. Nenhuma alteração de layout/cores.

---

## ➕ CONTINUAÇÃO — Polish escolhido (animação + auto-scroll)

Usuário escolheu 2 dos 3 itens de polish (leaderboard adiado):

- **Auto-scroll no Ranking** (`RankingPage.jsx`): `useRef` na linha do personagem atual +
  `scrollIntoView({behavior:'smooth', block:'center'})` em `useEffect` (delay 450ms p/ a transição).
- **Animação ao subir de classificação** (`App.jsx` `handleGameEnd`): além do toast de level-up
  já existente, novo toast "Nova Classificação!" quando `getQiInfo(newData).idx > getQiInfo(data).idx`
  (reaproveita o `AchievementToast` animado e a fila de toasts). Ícone = emoji do novo personagem.
- Sem erros de build; identidade visual mantida.
- **D030 — Reusar a fila de toasts:** classificação-up usa o mesmo sistema de toast das conquistas/level-up (zero UI nova, consistente).

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. **Polish restante:** leaderboard global via Supabase (bloco maior — adiado).
2. **Blocos futuros do roadmap:** loja, moedas, recompensas avançadas, temporadas, sistema social, dashboard, análise inteligente, gráficos avançados, catálogo completo, marketplace, missões.
3. Validar o novo balanceamento de XP em uso real e ajustar fator (0.5) / curva se necessário.
