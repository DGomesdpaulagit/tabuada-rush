# Sessão 048 — Tabuada Rush 6.0: Bloco 5 (Missões)

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco4 → 6.0.0-bloco5
**Tipo:** Implementação

---

## O que aconteceu

Continuação direta das sessões 045-047 ("bora pra próxima"). Implementei o Bloco 5
— Missões: diárias sem risco (mantidas) + desafios mensais com aceite e
penalidade (novo).

### Semanais removidas

`WEEKLY_MISSION_POOL` (constants), `initWeekly`/toda lógica de semanal (utils) e a
aba "Semanais" (MissionsPage) — deletados, não só escondidos. `missionsData` perde
o campo `weekly`.

### Desafios mensais — de "missão longa automática" pra "aposta com prazo"

- `constants/missions.js` — `MONTHLY_MISSION_POOL` virou `MONTHLY_CHALLENGE_POOL`:
  cada item ganhou `penalty` (≈20% do `reward`, mesma proporção do exemplo do Davi
  no áudio) e as METAS foram revisadas pra baixo — o pool antigo (sem risco) tinha
  metas tipo "250 partidas/mês", que com penalidade vinculada garantiria falha pra
  quase todo mundo. Ver DECISIONS.md D024 pro raciocínio completo.
- `utils/missions.js`:
  - `getActiveMissions` — `monthly` agora tem `{ month, pool, accepted }`. `pool`
    (2 opções sorteadas) renova toda virada de mês; `accepted` (o que o jogador
    aceitou) NÃO reseta — um desafio aceito continua valendo até seu PRÓPRIO
    prazo passar, mesmo atravessando a virada do mês (relevante pra desafios
    congelados).
  - `acceptChallenge(missionsData, id)` — aceita um desafio do pool, prazo = fim
    do mês corrente.
  - `freezeChallenge(missionsData, id)` — +10 dias no prazo (repurposing do
    power-up "Congelar Missão" que já existia — antes pausava uma diária por
    24h; diárias não têm mais risco nenhum, então não fazia mais sentido nelas).
  - `resolveChallenges(missionsData)` — resolve challenges cujo prazo passou:
    `completed` → soma `reward`; não completou → subtrai `penalty` (saldo PODE
    ficar negativo, sem piso em 0 — testado e confirmado, ver Verificação).
- `App.jsx handleGameEnd` — chama `resolveChallenges` depois de atualizar o
  progresso das missões, aplica o delta de moeda no mesmo `update()`, mostra toast
  de "cumprido"/"não cumprido" por desafio resolvido.
- `contexts/AppContext.jsx` — chama `resolveChallenges` também no LOAD do app
  (diferente da liga — aqui é seguro, resolução é terminal/`resolved:true`, nunca
  reverte, sem risco do bug de ping-pong do Bloco 4).
- `pages/MissionsPage.jsx` — reescrita: 2 abas (Diárias/Mensais). Mensais mostra
  "Aceitos" (progresso, prazo em dias, aviso de penalidade, botão congelar) e
  "Disponíveis pra aceitar" (com reward/penalty visíveis antes de aceitar).
- `constants/shop.js` — descrição do power-up "Congelar Missão" atualizada pro
  novo comportamento (estende desafio mensal, não pausa diária).

### Limpeza de bônus: tipo de missão morto removido

`dm_daily`/`mm_daily_22` ("Complete o Desafio Diário") checavam
`result.mode === 'daily'` — esse modo não existe mais desde a fusão de modos da
5.0 (virou parte do Rush). Essas missões eram matematicamente impossíveis de
completar, mesma classe de bug já registrada pras conquistas `survival_30`/
`speed_20`. Removidas do pool já que eu estava reescrevendo o arquivo mesmo.

---

## Verificação

`npm run build` limpo. Ambiente de preview teve um problema NOVO desta vez: depois
de reiniciar o servidor + limpar `node_modules/.vite`, o console continuou
reportando o MESMO erro (`applyLeaguePromotion is not defined`, mesmo timestamp)
em toda checagem — inclusive depois de desregistrar o service worker. Conferi o
arquivo fonte (`AppContext.jsx`) e não havia nenhuma referência real a
`applyLeaguePromotion` (só um comentário mencionando o nome). Como o conteúdo
renderizado (`document.body.innerText`) sempre veio completo e correto — o que
não aconteceria se o `AppProvider` estivesse realmente quebrando, já que ele
envolve a árvore inteira — concluí que é log de console retido/represado pelo
ambiente de preview, não um erro ao vivo, e seguí a verificação via DOM (que já
vinha sendo confiável nas sessões anteriores). Registro aqui caso apareça de novo
numa sessão futura — não é um bug do app.

Testado o ciclo completo de um desafio mensal via manipulação de `localStorage` +
clique direto nos botões:
1. Aba Mensais mostrou os 2 desafios sorteados do pool ("80 Partidas" ganha
   700/perde 140, "1.500 Acertos" ganha 400/perde 80)
2. Aceitar "80 Partidas" → moveu pra "Aceitos", prazo calculado certo
   (15 dias restantes, fim de agosto)
3. Congelar → prazo estendido de 2026-08-31 pra 2026-09-10 (+10 dias,
   atravessando a virada do mês corretamente), consumiu 50 moedas (sem
   estoque de power-up)
4. Forcei o prazo pro passado via `localStorage` e recarreguei → resolveu
   sozinho no LOAD (confirma o gancho no `AppContext`): `resolved: true`,
   `won: false`, **`coins: -140`** (saldo negativo confirmado — exatamente
   como especificado)

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 7 (Missões) como implementada |
| `DECISIONS.md` | D024 — metas revisadas pra baixo + limpeza do tipo `'daily'` morto |
| `src/constants/missions.js` | Semanais removidas; mensais viram `MONTHLY_CHALLENGE_POOL` com `penalty` |
| `src/utils/missions.js` | `acceptChallenge`/`freezeChallenge`/`resolveChallenges` novos; semanal removida |
| `src/constants/shop.js` | Descrição de "Congelar Missão" atualizada |
| `src/App.jsx` | Resolve desafios em fim de partida, toast de cumprido/não cumprido |
| `src/contexts/AppContext.jsx` | Resolve desafios também no load (seguro, ao contrário da liga) |
| `src/pages/MissionsPage.jsx` | Reescrita — 2 abas, aceitar/congelar desafio mensal |
| `sessions/sessao-048.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma dentro do escopo do Bloco 5.

**Próximo passo:** Bloco 6 — Perfil completo (absorve Conquistas/Recordes/
Catálogo pro `PerfilPage.jsx` do Bloco 1) — e é a hora de finalmente remover o
sistema antigo de QI (`getQiInfo`) das 5 telas que ainda o usam, ver D023.

---

## Hotfix pós-deploy (mesma sessão) — B010: app travava pra usuário com dado antigo

Depois do push do Bloco 5, o Davi reportou (print do console do navegador) que o
app não abria mais — `TypeError: Cannot read properties of undefined (reading
'map')`. Causa: `getActiveMissions` só reinicializava `missionsData.monthly`
quando o MÊS mudava — quem já tinha `monthly` salvo no formato antigo (pré-Bloco
5: `{month, missions}`, sem `pool`/`accepted`) e estava no mesmo mês corrente
mantinha o formato velho. `resolveChallenges`, chamado no LOAD do app
(`AppContext.jsx`), fazia `active.monthly.accepted.map(...)` — `accepted` vinha
`undefined`, quebrando o `AppProvider` inteiro (trava o app pra qualquer tela,
não só Missões, porque o provider envolve a árvore toda).

**Correção:** `getActiveMissions` agora também checa `Array.isArray(md.monthly.accepted)`
— se o formato salvo for o antigo, migra pro novo automaticamente mesmo com o mês
batendo (progresso de missão mensal antiga é descartado — aceitável, é migração
de schema, não perda de dado importante). Testado forçando o formato antigo no
`localStorage` e recarregando — app abre normal agora. Ver `BUGS.md` B010.

**Lição pra próxima vez:** ao mudar o FORMATO de um campo persistido
(`missionsData.monthly` de `{month, missions}` pra `{month, pool, accepted}`),
checar a FORMA dos dados salvos, não só a "chave de invalidação" (mês/data) que
já existia pro caso de uso anterior — a chave de invalidação antiga não sabia
que o formato por baixo tinha mudado.
