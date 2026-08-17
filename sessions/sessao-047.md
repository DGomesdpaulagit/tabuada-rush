# Sessão 047 — Tabuada Rush 6.0: Bloco 4 (Ligas)

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco3 → 6.0.0-bloco4
**Tipo:** Implementação

---

## O que aconteceu

Continuação direta das sessões 045/046 (Davi pediu ritmo contínuo: "bora pra
próxima"). Implementei o Bloco 4 — Ligas, substituindo o Ranking de QI.

### Sistema de Ligas (novo, paralelo ao Ranking de QI antigo)

- `constants/leagues.js` (novo) — `LEAGUES` (10 ligas: Bronze→Diamante, com
  `promotionCount`/`relegationCount` por liga) + `LEAGUE_CHARACTERS` (100
  personagens, 10 por liga — reaproveitei os 52 que já existiam e criei 48
  novos pra fechar o número, mantendo o eixo "menos → mais inteligente").
- `utils/leagues.js` (novo) — motor da competição:
  - `getCharacterXp(character, today)`: XP simulado do personagem numa
    janela ROLANTE de 14 dias (não vitalício — evita que personagem de liga
    alta fique matematicamente imbatível só por "existir há mais tempo"),
    com chacoalho diário determinístico (mesmo personagem+dia sempre dá o
    mesmo número, mas dias diferentes dão números diferentes — é isso que
    faz o ranking oscilar, como o Davi descreveu no áudio).
  - `getLeagueStandings(data)`: classificação completa da liga atual (10
    NPCs + "Você", ordenados por XP).
  - `applyLeaguePromotion(data)`: promove/rebaixa com base na posição atual.
- `lib/storage.js` — `leagueId` (default `'bronze'`) + `leagueXpBase` (XP do
  jogador no momento em que entrou na liga atual — mesmo princípio do
  `streakGoalBase` que já existia pra meta de ofensiva).
- `App.jsx handleGameEnd` — depois de cada partida, chama
  `applyLeaguePromotion` e mostra toast de promoção/rebaixamento (substitui
  o antigo toast "subiu de classificação no Ranking de QI").
- `pages/RankingPage.jsx` — reescrita inteira: mostra a liga atual, posição,
  zona de promoção/rebaixamento, e a lista dos 11 competidores (10 NPCs +
  jogador) ordenados por XP.

### Bug encontrado e corrigido DURANTE a implementação: ping-pong de liga

Primeira versão checava promoção/rebaixamento tanto no fim de partida quanto
na ABERTURA do app (mesmo padrão do `applyStreakDecay`, que já existia pra
ofensiva). Testando manualmente (`localStorage` com XP alto, recarregando a
página), descobri um bug real: jogador é promovido, entra na liga nova com 0
XP (correto — não chega com XP "emprestado" da liga anterior), fecha o app,
abre de novo SEM TER JOGADO NADA — 0 XP ainda é o último lugar da liga nova,
e ele já cai rebaixado de volta na mesma sessão, sem nunca ter tido chance de
jogar ali. Vi isso acontecer ao vivo: 1ª recarga → promoveu Bronze→Prata; 2ª
recarga (sem jogar nada no meio) → rebaixou de volta pra Bronze.

**Correção:** removida a checagem no load (`AppContext.jsx`) — agora só roda
em `handleGameEnd`, depois de uma partida de verdade. Efeito colateral aceito
conscientemente: "não praticar" não derruba de liga sozinho só por passar o
tempo (diferente da leitura mais literal do áudio) — só na próxima partida
jogada, se a posição ainda estiver ruim. Documentado em DECISIONS.md D023
como troca deliberada (mecânica mais simples e sem bug > réplica literal com
bug de ping-pong).

### Escopo: sistema antigo (Ranking de QI) NÃO foi deletado

`getQiInfo`/`computeQI`/`CHARACTERS`/`TIERS` (o sistema antigo, baseado em
"QI" numérico + lista fixa de 52 personagens) continuam existindo e
alimentando 5 telas que ainda não passaram pelo reset 6.0: MenuPage (card
QI-first do Menu), PerfilPage, SettingsPage, ResultsPage, CatalogPage. Só
`RankingPage.jsx` (a página "Ligas" em si) e o toast de promoção em App.jsx
foram trocados pro sistema novo. Decisão de escopo, não esquecimento — essas
5 telas são justamente as que os Blocos 6 (Perfil) e 7 (Estatísticas) vão
reorganizar; trocar a fonte de dados duas vezes seria retrabalho. Registrado
em D023 com o trade-off explícito (o app mostra dois sistemas de
"personagem" diferentes por um tempo — Menu ainda diz "QI 143 · Harry
Potter", Ligas diz "Liga Safira, posição 3/11").

---

## Verificação

`npm run build` limpo (3× ao longo do bloco). Testado end-to-end via
manipulação de `localStorage` + troca temporária do `screen` inicial pra
`'ranking'` (removida antes do commit):
- Com `xp: 300000` (bem acima de qualquer liga), 1ª carga: promoveu
  Bronze→Prata corretamente, "Você" apareceu com 0 XP (delta zerado ao
  entrar na liga nova), rank 11º de 11, zonas de promoção/rebaixamento
  exibidas certas (top 4 / últimos 2, batendo com `LEAGUES.prata`)
- 2ª carga (antes da correção do bug): rebaixou de volta pra Bronze sem ter
  jogado nada — foi assim que o bug foi encontrado
- Depois da correção: 2ª e 3ª cargas mantiveram a liga estável (Bronze),
  sem ping-pong
- Classificação ordenada corretamente por XP (personagens simulados
  variando ~200-750 XP conforme a liga, jogador entrando em 0 e subindo
  conforme joga)

**Não verificado nesta sessão:** o toast de promoção/rebaixamento aparecendo
de verdade na tela depois de uma partida jogada até o fim (não consegui
montar uma partida completa nesse ambiente, mesma ressalva de sempre) — a
lógica em si (`applyLeaguePromotion` chamado dentro de `handleGameEnd`) foi
revisada e seria a MESMA função já testada isoladamente acima, baixo risco.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 4 (Ligas) como implementada |
| `DECISIONS.md` | D023 — escopo do sistema paralelo + bug de ping-pong corrigido |
| `src/constants/leagues.js` | **novo** — 10 ligas + 100 personagens |
| `src/utils/leagues.js` | **novo** — motor da competição (XP simulado, standings, promoção) |
| `src/lib/storage.js` | `leagueId`/`leagueXpBase` novos |
| `src/contexts/AppContext.jsx` | (chegou a ter checagem no load, revertida — ver bug acima) |
| `src/App.jsx` | Toast de promoção/rebaixamento substitui o de "subiu no Ranking de QI" |
| `src/pages/RankingPage.jsx` | Reescrita — mostra liga atual, posição, classificação |
| `sessions/sessao-047.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma dentro do escopo do Bloco 4.

**Próximo passo:** Bloco 5 — Missões (diárias fixas + mensais com aceite/
desconto de saldo/congelamento — mecânica já confirmada com o Davi, ver
planejamento-6.0.md seção 7). Mesmo ritmo contínuo.
