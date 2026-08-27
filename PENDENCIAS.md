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

**Ainda falta:**
- [ ] **Fundo do Seguro de Ofensiva** → `fundo-seguro-de-ofensiva.png`.
      É o único dos 13 recursos sem fundo próprio — a leva de fundos veio
      com 4 baús + 8 recursos, e o Seguro ficou de fora. Enquanto não
      chega, a página dele cai no fundo escuro padrão (não quebra nada).
- [ ] *(opcional)* **Combo do Seguro de Ofensiva em resolução maior** →
      `combo-seguro-ofensiva.png`. Funciona hoje, mas foi recortado de
      dentro de uma folha, então tem resolução menor que os outros combos.
      Só refazer se ficar visivelmente mole na tela.

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
