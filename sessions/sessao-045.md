# Sessão 045 — Tabuada Rush 6.0: Bloco 2 (Vidas diárias)

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco1 → 6.0.0-bloco2
**Tipo:** Implementação

---

## O que aconteceu

Davi confirmou o resultado visual do Bloco 1 ("acho que tá") e pediu pra seguir
direto pros próximos blocos sem pausa pra revisão a cada um ("vamos terminar esses
blocos pra começar a editar"). Implementei o Bloco 2 do reset 6.0: o sistema de vidas
diárias estilo Duolingo (ver `sessions/planejamento-6.0.md` seção 5).

### Vidas diárias — pote global de 5, reseta por dia

- `lib/storage.js` — novo campo `livesData: { date, remaining }`.
- `utils/index.js` — `getLivesInfo(data)`: lê o pote sem mutar storage; se o `date`
  salvo é de um dia anterior, reporta o pote cheio (o reset de verdade só é gravado
  na próxima perda/compra, não só de abrir a tela).
- `constants/index.js` — `DAILY_LIVES_MAX = 5`, `LIFE_REFILL_PRICE = 150`.
- `App.jsx` — `loseLife()` desconta 1 (resetando o pote primeiro se o dia virou);
  `handleStart` passa a checar `getLivesInfo(data).remaining <= 0` ANTES do fluxo de
  aposta — sem vida, nem chega a apostar, mostra `NoLivesModal` (novo). Comprar a
  reposição (`handleBuyLifeRefill`) enche o pote de volta a 5 por 150 moedas e já
  inicia o modo que estava bloqueado direto (pula o fluxo de aposta nessa entrada
  específica, pra não empilhar modal em cima de modal).
- `GamePage.jsx` — nova prop `onWrongAnswer`, chamada em todo erro real (não
  protegido por Escudo) em QUALQUER modo, inclusive Zen. Desconta do pote diário em
  paralelo ao sistema de vidas por partida existente (`cfg.lives` do Rush) — os dois
  sistemas coexistem, não um substitui o outro (ver D021 pro raciocínio completo).
- `Header.jsx` — trocado o placeholder (`data.lives ?? 5`) pelo valor real via
  `getLivesInfo`.

**Decisões que tomei sem estar 100% explícitas no áudio** (documentadas em D021 e na
seção 5 do planejamento, pra não ficar ambíguo depois):
1. O pote é global de verdade — erro em QUALQUER modo desconta, incluindo Zen
   (leitura literal do "qualquer modo bloqueado" do áudio).
2. Reposição enche o pote INTEIRO (não vida-por-vida) por preço fixo — replica o
   padrão do print de referência do Duolingo que o Davi mandou ("Recuperar vidas ·
   350" cristais por refill completo).
3. Escudo (power-up já existente) passou a proteger a vida diária também, não só a
   de partida — mesma semântica ("a vida não é descontada dessa vez"), estendida.

---

## Verificação

`npm run build` limpo. Ambiente de preview ainda sem composição de frame (mesma
limitação das sessões 043/044) — verifiquei via manipulação direta de
`localStorage`/DOM + um `useEffect` temporário chamando `handleStart('rush')`
diretamente (removido antes do commit final):
- Header mostra o valor real do pote (testei forçando `remaining: 0` no
  `localStorage` e recarregando — Header foi de `5` pra `0` corretamente)
- Com pote em 0, `handleStart('rush')` abre o `NoLivesModal` ("Sem vidas hoje!") em
  vez de iniciar a partida — confirmado via texto do DOM
- Botão "Repor vidas (150)" com moedas insuficientes fica desabilitado (texto
  presente, mas sem crash ao clicar — validei via `canBuy` no código, não cliquei o
  desabilitado)
- Com moedas suficientes (200), clicar "Repor vidas" descontou exatamente 150
  (`coins: 50` no storage após), resetou `livesData.remaining` pra `5`, e mudou
  `screen` pra `'game'` (confirmado indiretamente — o `Header` some na tela de jogo,
  e ele sumiu do DOM depois do clique)

**Não verificado nesta sessão:** o decremento em tempo real durante uma partida de
verdade (responder errado dentro do `GamePage` e ver o pote cair) — a mecânica é
idêntica à já testada (mesmo `getLivesInfo`/mesma gravação), só não consegui montar
uma partida completa nesse ambiente pra clicar "responder errado" de propósito. Baixo
risco (código simples, revisado), mas registrar pra o Davi saber o que não foi
clicado de verdade.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 5 (Vidas) como implementada + decisões tomadas |
| `DECISIONS.md` | D021 — vidas diárias como camada nova, não substituição |
| `src/lib/storage.js` | Campo `livesData` novo |
| `src/utils/index.js` | `getLivesInfo(data)` |
| `src/constants/index.js` | `DAILY_LIVES_MAX`, `LIFE_REFILL_PRICE` |
| `src/App.jsx` | `loseLife`, gate em `handleStart`, `handleBuyLifeRefill`, `NoLivesModal` |
| `src/pages/GamePage.jsx` | Prop `onWrongAnswer`, chamada em todo erro real |
| `src/components/Header.jsx` | Vidas reais em vez de placeholder |
| `sessions/sessao-045.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma dentro do escopo do Bloco 2.

**Próximo passo:** Bloco 3 — Progressão de tabuada (faixas 2-10→200). Davi pediu pra
seguir direto pelos blocos sem pausa de confirmação a cada um — vou continuar nessa
cadência, mas ainda vou sinalizar decisões não-óbvias como fiz aqui (D021), não vou
parar de avisar só porque ele pediu ritmo mais rápido.
