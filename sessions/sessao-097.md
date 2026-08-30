# Sessão 097 — Zona de rebaixamento com penalidades + aviso de ofensiva perdida

**Data:** 2026-08-30
**Versão:** 6.0.45 → 6.0.46
**Tipo:** Mecânica nova (FASE 9)

---

## 1. Aviso de ofensiva perdida

Aparece ao abrir o jogo depois de perder a ofensiva, no formato da
referência: arte da chama caindo, a contagem do que se perdeu, botão forte
e link discreto.

Pra saber **quantos dias** foram perdidos, `applyStreakDecay` passou a
gravar `ofensivaPerdida: { dias, em }` no momento em que zera — antes esse
número sumia junto com a ofensiva.

**⚠️ Diferença consciente da referência:** lá o botão promete um "desafio
especial". Esse desafio **não existe** no Tabuada Rush. O que existe é o
**Seguro de Ofensiva**. Então o botão usa o Seguro quando o jogador tem um,
e leva pra Loja quando não tem. Prometer um desafio inexistente seria
mentir na tela — se o Davi quiser o desafio de verdade, vira feature.

## 2. As 30 frases da caixa de divisão

`constants/leaguePhrases.js`, 10 por situação, com a cor que ele pediu:
**vermelho** na zona de rebaixamento, **normal** no meio, **verde** no
pódio. Sorteio preso ao dia (senão a frase pularia a cada re-render).

## 3. Zona de rebaixamento: as penalidades

Tudo num arquivo só (`utils/relegation.js`) pra as regras não se
contradizerem. Números tirados da arte que o próprio Davi fez:

| Penalidade | Efeito |
|---|---|
| **XP** | metade (`-50%`) |
| **Recursos e baús** | 25% da chance normal |
| **Missões** | alvo +50%, recompensa ×2 |

**Como o XP foi feito:** entra como **mais um fator** da mesma conta que
já tinha poção e bônus da Diamante, em vez de um caso à parte. Quem está
na zona com poção ×2 fica em ×1 — perde a vantagem, não perde a poção. E
tem piso de 1 XP pra quem pontuou não sair zerado por arredondamento.

**Como o loot foi feito:** o multiplicador entra na **chance**, não no
valor. Quem achar um baú de ouro na zona leva as moedas do baú de ouro —
só acha muito menos vezes.

**Missões:** a penalidade é aplicada na **leitura**, não no save. O
progresso guardado continua real e sair da zona devolve tudo ao normal sem
migração. **E o baú de cada missão sobe de tier junto**, porque o tier vem
da recompensa (`chestForCoins`) — era o pedido explícito dele.

**Bug que a captura pegou:** "Precisão de 90%" virou **135%** — alvo em
porcentagem não pode ser multiplicado. Missão de precisão agora tem teto
de 98%.

## 4. O painel

Aparece **uma vez por dia** enquanto o jogador estiver na zona, com o selo
e a arte do buraco. Três saídas: **Ver mais** (a página das consequências,
com as artes de XP -50% e recursos a 25%, mais 3 dicas de como sair),
**Entendi** (fecha por hoje) e **Não mostrar novamente** (desliga o aviso —
mas **não** as penalidades).

## 5. Ligas

A zona de rebaixamento agora fica **vermelha** na lista, e a linha do
jogador fica vermelha e destacada quando ele está nela.

**Bronze:** ele foi explícito que a Bronze também sofre tudo, mesmo sem
divisão abaixo. Como lá `relegationCount` é 0, a zona é definida como as
últimas 5 posições — a página de consequências diz a verdade nesse caso
("você já está na divisão mais baixa, mas as penalidades valem igual").

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/relegation.js` | **novo** — todas as regras da zona |
| `src/constants/leaguePhrases.js` | **novo** — as 30 frases |
| `src/components/RelegationPanel.jsx` | **novo** — aviso + consequências |
| `src/components/LostStreakModal.jsx` | **novo** |
| `src/utils/index.js` | grava `ofensivaPerdida` |
| `src/utils/loot.js`, `missions.js`, `App.jsx` | penalidades aplicadas |
| `src/pages/MenuPage.jsx`, `MissionsPage.jsx`, `PostGameSummary.jsx`, `RankingPage.jsx` | leitura penalizada + zona vermelha |
| 4 ícones novos | `zona-selo`, `zona-buraco`, `zona-xp-50`, `zona-recursos-25`, `ofensiva-perdida` |

---

## 📋 Para a PRÓXIMA CONVERSA (pedido dele)

1. **Ícones das conquistas** — ele vai gerar.
2. **Dívida:** modal "Defina sua meta" abre por cima do conteúdo na
   primeira visita.
3. **Tipos de pontuação por faixa** — ele perguntou uma coisa antes de
   decidir: **"quero saber o que teríamos que mudar se tirássemos os
   PONTOS do jogo"**. Isso precisa de uma análise: hoje a pontuação
   alimenta o XP (`score × multiplicador do modo`), as missões de `score`,
   o recorde `bestScore`, o card de pontuação do resumo e o ranking de
   liga. **Responder isso é o primeiro item da próxima conversa.**
4. Conferir na prática o balanceamento da zona (é a primeira mecânica
   punitiva do jogo — vale medir se não ficou desanimador demais).
