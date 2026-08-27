# Sessão 086 — Moldura do app some na partida, recortes sem rebarba e revisão de telas

**Data:** 2026-08-27
**Versão:** 6.0.34 → 6.0.35
**Tipo:** Layout + qualidade de arte + revisão visual

---

## 1. Barra superior e lateral somem na partida (e no resumo)

Pedido do Davi: dentro da partida o foco é a partida — nada de "quantas
moedas você tem" na tela. E **o resumo conta como partida**, porque fala
do que acabou de acontecer nela.

`App.jsx` ganhou `emPartida = screen === 'game' || screen === 'results'`.
Com isso somem **os dois**: `<Sidebar>` e `<Header>`. Voltam no "hall"
(menu, loja, missões, perfil...).

**Consequência que ele já tinha previsto:** sem a barra lateral, o conteúdo
do resumo deixa de ficar deslocado pra direita — fica centralizado de
verdade na tela.

## 2. Composição do resumo refeita

Com a barra fora, sobrou um buraco embaixo do botão (a casca tinha
`min-h-[70vh]`, o resto da tela ficava vazio). Agora:

- casca com `min-h-[calc(100dvh-3rem)]` — ocupa a tela toda
- conteúdo com `justify-center` — centralizado no vão
- botão encostado no rodapé

## 3. Rebarba dos recortes — causa e solução

**A causa:** a arte chega com fundo sólido. Na borda do desenho, o gerador
mistura a cor do objeto com a do fundo (anti-aliasing). Apagar só os
pixels "parecidos com o fundo" deixa justamente essa faixa misturada —
que aparece como **contorno branco** em volta do ícone.

**A solução** (`scripts/recortar-icone.py`, novo): além do flood fill a
partir das bordas, o script agora faz **alfa suave** (proporcional à
distância até a cor do fundo) e **descontaminação de cor** — sabendo que
`C = α·F + (1−α)·B`, recupera a cor real do objeto com
`F = (C − (1−α)·B)/α`. É essa última parte que mata a rebarba.

**Medido no baú de ouro aberto:** pixels de borda quase-brancos caíram de
**50,3% → 18,0%** (e o que sobra é reflexo legítimo do dourado). Madeira:
61,4% → 21,1%. Ferro: 40,5% → 3,6%. Os três foram reprocessados a partir
do original em `referencias/`.

**Varredura:** medi a rebarba de todos os 63 ícones. Os demais casos altos
são cor legítima da arte (o escudo é branco, o alvo tem contorno escuro),
não contaminação — por isso não foram mexidos.

## 4. Baú sempre ABERTO na recompensa + `bau-moedas` excluído

Confirmado que a página de recompensa já usa `${id}-aberto` pra qualquer
tier — madeira, ferro, ouro ou místico, sempre o aberto, mostrando as
moedas. O `bau-moedas` (reserva sem uso, que podia confundir com os
abertos) foi **apagado** do projeto, como ele pediu. Os baús FECHADOS
continuam existindo — são a metade "missão incompleta" do bloco 2.

## 5. Revisão das telas (o que eu vi entrando no jogo)

Capturei e olhei: menu, modos, ligas, missões, loja, mochila, perfil,
estatísticas e as 13 do resumo. O resumo está certo. **O que eu achei de
errado nas outras telas** (nada disso é regressão desta sessão — é dívida
que já estava lá):

- **Menu:** o modal "Defina sua meta de ofensiva" abre por cima de tudo na
  primeira visita e fica **sobreposto ao card da liga**, sem escurecer o
  fundo o suficiente. Some quando a meta é definida, mas é a primeira
  impressão do app.
- **Menu:** o título "Tabuada Rush" **encosta nos botões** de configurações
  e login no canto superior direito.
- **Loja:** as dicas de "Como ganhar moedas?" ainda usam emoji (🔥, 🎁)
  no meio de linhas que já têm ícone de arte — mistura visível.

Anotei em `PENDENCIAS.md`; não mexi porque a reformulação da Arena/menu é
justamente o que ele adiantou que vem por aí.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/App.jsx` | `emPartida` esconde Sidebar + Header |
| `src/pages/PostGameSummary.jsx` | casca ocupa a tela toda, conteúdo centralizado |
| `scripts/recortar-icone.py` | **novo** — recorte com descontaminação |
| `src/assets/icons/bau-*-aberto.png` | 3 reprocessados sem rebarba |
| `src/assets/icons/bau-moedas.png` | **removido** |
| `src/components/GameIcon.jsx` | `bau-moedas` desregistrado |
| `scripts/tirar-telas.mjs` | espera genérica (nem toda tela tem `h1`) |

---

## Status para retomar

1. **Bloco 2 da FASE 7.1 — baú por missão.** Próximo passo de código.
2. Dívidas de layout do menu/loja listadas acima (`PENDENCIAS.md`).
3. Tipos de pontuação por faixa.
4. FASE 8 — reformulação da Arena, que ele já adiantou que vem.
