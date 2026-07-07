# Sessão 041 — Remoção do Leaderboard Global

**Data:** 2026-07-06
**Versão:** 3.16.0 → **3.16.1**
**Tipo:** Pequena iteração (fora de roadmap — pedido direto do Davi, sem "Fase")

---

## O que foi feito

Davi pediu a remoção completa do Leaderboard Global do jogo (botão visível
no Menu, print anexado no pedido). Removido por inteiro, sem deixar código
morto:

- `src/pages/LeaderboardPage.jsx` — deletado
- `src/services/leaderboard.js` — deletado (upsert/fetch de scores)
- `src/App.jsx` — import da página, rota (`screen === 'leaderboard'`), e o
  bloco que fazia upsert de score no Supabase ao final de partidas Diário/Semanal
- `src/pages/MenuPage.jsx` — botão "Leaderboard Global" removido (e o `Crown`
  do import, que só era usado ali)
- `src/constants/index.js` — descrição do Desafio Semanal não menciona mais
  "leaderboard global" (agora: "Mesmas 10 questões pra todo mundo, toda semana")
- `SUPABASE_SETUP.md` — seção 3.1 atualizada pra registrar a remoção (SQL de
  `DROP TABLE` deixado como referência, **não executado** — ação destrutiva
  em banco fica pra decisão separada do Davi)

## O que NÃO foi tocado

- **Desafio Diário e Desafio Semanal continuam existindo como modos** — só
  perderam a comparação global entre jogadores. Ambos continuam funcionais
  (mesmas perguntas pra todo mundo no dia/semana, pontuação, XP).
- **Tabelas `leaderboard_daily`/`leaderboard_weekly` no Supabase** — não
  apagadas. Ficaram órfãs (sem app lendo/escrevendo), mas dropá-las é uma
  ação destrutiva de banco que não tomo sem confirmação explícita.

## Verificação

- `npm run build`: ✅ 0 erros, 2778 módulos (2 a menos que antes — os 2
  arquivos deletados)
- `grep -r "leaderboard"` em `src/`: nenhum resultado — sem referências soltas
- Testado no navegador: Menu carrega sem o botão, sem erros de console

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/LeaderboardPage.jsx` | deletado |
| `src/services/leaderboard.js` | deletado |
| `src/App.jsx` | import/rota/upsert removidos |
| `src/pages/MenuPage.jsx` | botão + import `Crown` removidos |
| `src/constants/index.js` | descrição do Desafio Semanal atualizada |
| `SUPABASE_SETUP.md` | seção 3.1 atualizada (registra remoção) |
| `CHANGELOG.md` | entrada [3.16.1] |
| `MEMORY_CORE.md` | nota da remoção |
| `MEMORY.md` | referência ao Leaderboard removida da arquitetura |
| `sessions/sessao-041.md` | este arquivo |
