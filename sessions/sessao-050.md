# Sessão 050 — Tabuada Rush 6.0: Bloco 7 (Estatísticas) — RESET 6.0 COMPLETO

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco6 → 6.0.0
**Tipo:** Implementação — fecha o reset 6.0 inteiro

---

## O que aconteceu

Último bloco da maratona de 7 blocos que começou na sessão 044 ("bora bloco 7").
Reorganização (não reset) da tela de Estatísticas, conforme
`planejamento-6.0.md` seção 10.

### StatsPage — remoções pedidas + guia lateral novo

- **Removido de vez** (não só escondido): seção "Por Modo" (partidas por
  modo), "Estoque de Power-ups", banner "Modo Favorito". `bestMode`/
  `modeCount` (cálculos que só alimentavam essas seções) removidos junto.
- **Guia lateral tipo Notion** (`TableOfContents`, componente novo dentro de
  `StatsPage.jsx`): fixo na margem direita, só em telas largas (`lg+`),
  pontinhos com rótulo no hover, `scrollIntoView` suave ao clicar. **Davi
  nunca mandou o print de referência que tinha prometido** (ao longo de 7
  sessões) — implementei uma interpretação própria em vez de bloquear o
  último bloco do reset esperando. Registrado como decisão consciente em
  D026, ajustável se a referência real aparecer depois.
- **Corrigido de brinde:** o gráfico "Evolução" filtrava sessões por
  `mode === 'daily'` (Desafio Diário) — modo removido desde a fusão da 5.0,
  então o gráfico nunca tinha dado nenhum resultado. Trocado pra
  `mode === 'rush'` (o modo principal agora) — mesma classe de bug já vista
  nos Blocos 5/6 (referências a modos mortos).

### Acertos/Erros migram pro Catálogo de Precisão

Por pedido explícito do Davi: Acertos e Erros deixam de ser destinos soltos
na tela principal de Estatísticas e viram sub-seções do Catálogo de Precisão.
- `AccuracyCatalogPage.jsx` ganhou um `view` state próprio (`'main'|'hits'|
  'errors'`), renderizando `HitsPage`/`ErrorsPage` como sub-view — mesmo
  padrão de outras páginas neste reset (StatsPage, PerfilPage). Botões
  "Acertos"/"Erros" (idênticos aos que existiam antes na StatsPage)
  adicionados no topo do Catálogo.
- `StatsPage.jsx` perde o import de `HitsPage`/`ErrorsPage` e o grid de 2
  botões que levava a elas.
- De brinde, `MODES_META` (dentro do Catálogo de Precisão — controla os
  breakdowns "por modo" de precisão/velocidade/erros) tinha `survival`/
  `speed`/`daily` — modos mortos desde a 5.0, sempre filtrados com 0 jogos.
  Trocado pra `rush`/`zen`/`review` (os 3 modos reais).

### Débito conhecido, não tocado

`HitsPage.jsx`/`ErrorsPage.jsx` (461/554 linhas cada) ainda têm filtros de
"Modo" internos listando Sobrevivência/Velocidade/Diário — mesma classe de
dead-mode reference, mas são arquivos grandes que não foram reescritos nesta
sessão (fora do escopo que o Davi pediu — ele foi claro que Estatísticas é
reorganização, não reescrita). Registrado aqui pra não virar surpresa depois.

---

## Verificação

`npm run build` limpo. Testado neste ambiente (troca temporária do `screen`
inicial, removida antes do commit) via inspeção de DOM/console:
- StatsPage: TOC visível com os 7 rótulos ("Resumo/Catálogo de Precisão/
  Análise/Mês/Evolução/Erros da semana/Exportar"); "Por Modo"/"Power-ups"/
  "Modo Favorito" confirmados ausentes do texto renderizado; "Evolução —
  Rush" no lugar de "Desafio Diário"
- Catálogo de Precisão: botões "Acertos"/"Erros" no topo, clicar em
  "Acertos" navegou pro `HitsPage` corretamente (dashboard renderizado, sem
  erro de console)
- Sem erros de console em nenhuma das duas telas (só o `ERR_CONNECTION_REFUSED`
  residual já documentado em sessões anteriores como artefato do ambiente)

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 10 (Estatísticas) como implementada — reset 6.0 completo |
| `DECISIONS.md` | D026 — guia lateral sem referência visual; marco de fechamento do reset |
| `src/pages/StatsPage.jsx` | TOC novo; remove Por Modo/Power-ups/Modo Favorito/Acertos-Erros; corrige gráfico Evolução |
| `src/pages/AccuracyCatalogPage.jsx` | Absorve Acertos/Erros como sub-view; `MODES_META` corrigido |
| `sessions/sessao-050.md` | este arquivo |

---

## 🏁 RESET 6.0 — COMPLETO

Todos os 7 blocos do `planejamento-6.0.md` foram entregues ao longo das
sessões 044-050 (2026-08-16 a 2026-08-17):

1. **Base visual** — tema escuro padrão, tokens semânticos, sidebar/header novos, Perfil (stub)
2. **Vidas diárias** — pote global de 5, estilo Duolingo
3. **Progressão de tabuada** — 20 faixas (2×10 → 190×200), fator até 200 de verdade
4. **Ligas** — substitui Ranking de QI, 10 ligas × 100 personagens, competição de verdade
5. **Missões** — semanais removidas, mensais viram desafio com risco (saldo pode ficar negativo)
6. **Perfil completo** — absorve Conquistas/Recordes/Catálogo, sistema antigo de QI removido por completo
7. **Estatísticas** — reorganização, guia lateral, Acertos/Erros migram pro Catálogo de Precisão

**Débitos conhecidos, registrados ao longo do caminho (não esquecimentos):**
- Calibração de XP (Bloco 3) e de personagens/promoção de liga (Bloco 4) são
  estimativas sem telemetria real — D022/D023.
- Guia lateral de Estatísticas implementado sem a referência visual do Davi — D026.
- "Pódios conquistados nas ligas" (mencionado no áudio do Perfil) não
  implementado — sem histórico de pódio ainda.
- `HitsPage`/`ErrorsPage` ainda têm filtros de modo mortos (Sobrevivência/
  Velocidade/Diário) — não tocados, fora do escopo de reorganização.
- Rebaixamento de liga por inatividade (sem jogar) não existe — só
  reavaliado em fim de partida, pra evitar o bug de ping-pong do Bloco 4 (D023).

**Próximo passo:** não há mais bloco planejado — fica a critério do Davi
revisar o resultado e decidir os próximos passos do projeto.
