# 📌 PENDENCIAS.md — Ideias soltas, sem desviar da fase em andamento

> Criado na sessão 064 a pedido do Davi. Quando uma ideia boa aparece no
> meio de uma fase do `PLANO_ACAO.md` mas não é dela, vem pra cá em vez de
> desviar o trabalho em andamento. Vira tarefa de verdade (com fase própria
> no `PLANO_ACAO.md`) só quando o Davi confirmar que quer fazer.

---

## 🎨 Arte — fila do Davi

Nomes de arquivo definidos por mim (regra da sessão 078: eu nomeio, ele
salva assim no Downloads). Conforme chegam, eu processo, registro em
`GameIcon.jsx`, guardo o original em `referencias/icones/` e atualizo o
`ICONES.md`.

**✅ Entregue na sessão 083 (2026-08-27):** ícone de erro, troféu, 4 baús
FECHADOS de verdade, combo Poção ×3 sem brilho, baú vazio com moscas
(página "Nada desta vez") e **12 fundos** de página de recompensa.

**✅ Entregue na sessão 085:** fundo do Seguro de Ofensiva (fecha os 13
recursos), baú místico aberto sem brilho e ícone de XP novo.

**Fila de arte obrigatória: vazia.** Sobrou só isto, opcional:
- [ ] *(opcional)* **Combo do Seguro de Ofensiva em resolução maior** →
      `combo-seguro-ofensiva.png`. Funciona hoje, mas foi recortado de
      dentro de uma folha, então tem resolução menor que os outros combos.
      Só refazer se ficar visivelmente mole na tela.

---

## 🧹 Dívidas de layout vistas na revisão de telas (sessão 086)

Achadas capturando as telas uma a uma. Nenhuma é regressão — já estavam
lá. Não mexi porque a reformulação da Arena/menu que o Davi adiantou
provavelmente cobre parte disso.

- **Menu:** o modal "Defina sua meta de ofensiva" abre na primeira visita
  por cima do card da liga, sem escurecer o fundo o suficiente — é a
  primeira impressão do app.
- **Menu:** o título "Tabuada Rush" encosta nos botões de configurações e
  login no canto superior direito.
- **Loja:** as dicas de "Como ganhar moedas?" ainda usam emoji (🔥, 🎁) em
  linhas que já têm ícone de arte.

---

## 📌 PRÓXIMA CONVERSA — combinado na sessão 097

O Davi encerrou a conversa por limite de contexto e pediu pra documentar:

1. ✅ **RESPONDIDO na sessão 099: "o que mudaria se tirássemos os PONTOS
   do jogo?"** — resposta: **não tirar**. Os pontos ficam, mudando de
   cargo (desempenho, e não matéria-prima do XP). Análise completa em
   **`ARQUITETURA_XP.md`**, junto com a proposta de XP que o Davi
   escreveu. Isso **destrava** os tipos de pontuação por faixa (abaixo).
   **O que fica pendente com ele:** as 5 decisões da seção 8 do
   `ARQUITETURA_XP.md` — nada de XP muda, e nenhum modo novo entra, antes
   dessas respostas.
2. **Ícones das conquistas** — ele vai gerar.
3. **Dívida de layout:** o modal "Defina sua meta de ofensiva" ainda abre
   por cima do conteúdo na primeira visita.
4. **Conferir o balanceamento da zona de rebaixamento na prática** — é a
   primeira mecânica punitiva do jogo; vale medir se não desanima.

---

## 🔴 RELIGAR AS VIDAS DIÁRIAS (sessão 099) — dívida com data pra vencer

`DAILY_LIVES_ENABLED = false` em `src/constants/index.js`, a pedido do Davi:
pra Fase 1 do sistema de domínio ele precisa jogar muitas partidas seguidas e
o pote de 5 vidas por dia trava isso já no 5º erro.

**Enquanto estiver `false`:** nenhum erro consome vida do pote, nenhum modo
fica bloqueado, e o Header mostra ❤️ ∞. As 3 vidas DENTRO da partida (Rush)
continuam normais — é assim que a partida acaba por erro, e o fim de partida é
o que grava a coleta.

**➡️ Trocar pra `true` quando a Fase 1 acabar.** É o único lugar. Sem isso o
jogo fica sem limite diário — o que também desmonta a Loja (a vida a 300
moedas é o maior sorvedouro de moeda do jogo).

---

## 📦 ABSORVIDO em `planos/` (sessão 100)

O documento de inovações que o Davi mandou na sessão 100 foi organizado em
[`planos/`](planos/00-INDICE.md), um arquivo por versão. Duas pendências
antigas **daqui** foram absorvidas por lá e não precisam mais ser
rastreadas neste arquivo:

- **Tipos de pontuação por faixa numérica** (abaixo) → resolvido pelo
  documento dele: são **10 ícones, de 100 em 100, até 1000**. Vai pro
  [6.2](planos/6.2-identidade-visual.md). *(Falta só a regra do alvo
  intermediário — proposta: repetir o D065 e arredondar pra baixo.)*
- **Animações das telas de fim de partida** (abaixo) → viraram o
  [6.6](planos/6.6-animacoes.md), com catálogo em 3 níveis de prioridade.

As dívidas de layout da sessão 086 continuam válidas aqui **e** aparecem no
[6.1](planos/6.1-acabamento.md) e no [6.5](planos/6.5-reset-layout.md) —
saem daqui quando forem feitas.

---

## 🔢 Tipos de pontuação por faixa numérica (pedido da sessão 082)

Hoje existe **um único** ícone de pontuação (`missao-tipo-pontuacao`, o
"100"), usado em **toda** missão de `type: 'score'`. Ou seja: uma missão
de "pontue 200" mostra um ícone escrito 100 — errado.

**O que o Davi quer:** um ícone por faixa de pontuação — **100, 200, 500,
até 1000** — cada um com sua cor, e a missão escolhendo o ícone pelo
NÚMERO do alvo dela.

Envolve os dois lados:
- **Arte:** ele vai gerar/refazer os ícones (numeral + cor por faixa).
- **Código:** separar em `constants/missions.js` — o `type: 'score'` hoje
  não carrega faixa nenhuma; o mapa `TYPE_ICON` (`MissionsPage.jsx`)
  precisa passar a escolher pelo `target` da missão, não só pelo `type`.
  Mesma lógica vale na página 3 do resumo pós-partida, que reaproveita o
  `MissionIcon`.

Ainda **não** é uma fase — entra no `PLANO_ACAO.md` quando ele confirmar
o escopo (quais faixas exatamente, e o que acontece com um alvo que cai
entre duas faixas, ex.: pontue 350).

---

## Animações

- **Telas finais de partida (Fase 7 do `PLANO_ACAO.md`)** — o Davi pediu
  pra ir anotando aqui qualquer ideia de deixar as páginas de resumo mais
  animadas (transições entre as páginas, celebração ao bater meta/subir de
  faixa, etc.) conforme forem surgindo durante a implementação da Fase 7,
  em vez de parar o fluxo principal pra decidir cada detalhe de animação
  na hora.

---

## Como usar este arquivo

- Uma linha por ideia, com data e de onde veio (qual sessão/conversa).
- Sem compromisso de implementação — é só pra não perder a ideia.
- Quando uma vira decisão de fazer, ela migra pra uma fase do
  `PLANO_ACAO.md` e some daqui.
