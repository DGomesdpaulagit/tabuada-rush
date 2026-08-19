# Sessão 057 — Ligas em 2 colunas, lista rolando sozinha + resposta sobre folha de ícones

**Data:** 2026-08-17
**Versão:** 6.0.6 → 6.0.7
**Tipo:** Layout + investigação de ferramenta (recorte de ícones)

---

## O que aconteceu

Davi trouxe três coisas antes de baixar os ícones:

1. **Pergunta prática:** dá pra mandar UMA folha com todos os ícones e eu
   recorto, ou ele precisa exportar um arquivo por ícone?
2. **Correção de comportamento:** na tela de Ligas, quem tem que rolar são
   os personagens — o bloco "Divisão Bronze / Os N primeiros avançam / N
   dias" tem que ficar SEMPRE visível, não subir junto.
3. **Correção de estética:** está "muito centralizado, com cara de IA".
   Quer preencher o espaço vazio à direita como no Duolingo, mas ainda não
   sabe com o quê — mencionou "o personagem que está em cima de mim",
   info da liga, ou as outras ligas. Deixou explícito que é pra pensar
   junto.

---

## 1. Folha única de ícones: SERVE (testado)

Não respondi de cabeça — testei. Pillow 12.3.0 disponível (Python 3.14.3).
Escrevi um auto-split que acha as "ilhas" de pixels não-transparentes por
flood fill e recorta cada uma com bounding box. Prova numa folha sintética
de 6 ícones: detectou os 6, recortou todos certo.

**A condição que importa não é a quantidade, é ser ARQUIVO EM DISCO.** Eu
não consigo extrair o binário de uma imagem colada na conversa — só
enxergá-la. Uma folha salva na pasta do projeto eu recorto sozinho; dez
imagens coladas no chat continuam inúteis.

Ideal: fundo transparente e um respiro entre os ícones (encostados viram
uma ilha só e saem grudados). Sem transparência, dá pra recortar por grade
fixa — aí só preciso saber quantas linhas × colunas.

---

## 2. Layout: 2 colunas, e é a LISTA que rola

- `App.jsx`: container vai a `max-w-5xl` **só** quando
  `screen === 'ranking'` (demais telas seguem `max-w-lg` — mudança contida).
- Coluna esquerda: escudos + bloco da divisão **fixos**; classificação em
  caixa própria com `overflow-y-auto`.
- Coluna direita (`lg:w-80`): painel de contexto, preenchendo o vazio.

**Armadilha que peguei medindo (e que teria passado batido):** travar a
altura em `calc(100dvh-70px-3rem)` é o que faz a lista rolar em vez da
página. Só que no celular, com as colunas empilhadas, o conteúdo passa de
1500px — a altura fixa + `overflow-hidden` **cortava metade dos personagens
sem nenhuma forma de alcançá-los** (`clientHeight` 694 vs `scrollHeight`
1504). Resolvido prefixando tudo com `lg:`: desktop trava e a lista rola,
celular flui e a página rola.

**Brinde:** o scroll horizontal de 4px sumiu junto. A causa era encadeada —
página rolava → barra de rolagem de 4px → largura útil caía 4px → o layout
de 1280px sobrava 4px. Sem scroll vertical, sem barra, sem sobra.

---

## 3. Painel lateral — é PROPOSTA, não decisão

Como ele não fechou o que quer, implementei na linha que ele mesmo citou
primeiro, pra ter algo concreto pra reagir:

- **"Sua corrida"** — quem está logo acima e o XP que falta pra passar;
  quem está logo abaixo e a vantagem atual. Transforma "estou em 8º" em
  "faltam 20 XP", que é acionável e liga direto a jogar mais.
- **"Zona de promoção"** — se está dentro, ou quantas posições/XP faltam.
- Ao ver uma liga que não é a sua: mostra o líder dela.

Evitei de propósito qualquer coisa social — o Duolingo preenche esse espaço
com amigos/status, mas o jogo não tem sistema social e inventar um seria
mecânica desconectada do aprendizado.

**Davi respondeu ainda nesta sessão: quer os DOIS** — "Sua corrida" e a
ficha do personagem. Implementado junto: clicar numa linha da
classificação abre a ficha no topo do painel (emoji grande, nome, posição,
XP e a descrição que cada um dos 114 personagens já tinha em
`constants/leagues.js` e nunca era mostrada em lugar nenhum), com "Sua
corrida" seguindo logo abaixo.

Detalhes que resolvi sem perguntar: a linha do próprio jogador não é
clicável (não existe ficha dele); trocar de divisão fecha a ficha sozinha
(o personagem aberto é de outra liga); e quando nenhuma ficha está aberta,
uma linha discreta avisa que dá pra tocar nos personagens — senão a
interação ficaria escondida.

---

## Verificação

Tudo **medido**, não revisado:

- **Desktop 1280×720:** página não rola vertical, 0 de sobra horizontal,
  lista rola sozinha (300px+), título fora da caixa que rola, colunas lado
  a lado (lista 272–920, painel 944–1264). 23 linhas reais com 0 colisões
  nome×XP, 0 quase-colando (<6px), 0 nomes truncados.
- **Mobile 375×812:** 0 sobra horizontal, escudos rolam contidos no
  próprio container, 23 personagens todos alcançáveis.
- **Contas do painel** conferidas na mão: jogador com 640 XP em 8º →
  "faltam 20 XP" (Minions 660 − 640) e "17 XP de vantagem" (640 − Homer
  623). Zona de promoção (top 8) → "Você está dentro! Em 8º".
- `npm run build` limpo.

**Nota de método:** meu primeiro detector de colisão deu 1 falso positivo —
pegou o card inteiro como se fosse uma linha e comparou o título "Sua
corrida" com o XP de outra linha. Refinei pra exigir que nome e XP sejam
filhos DIRETOS da mesma linha; aí deu 0. Lição: asserção de geometria mal
escrita mente igual "revisei o código".

**O que continua sem resposta minha:** se ficou bonito. Geometria eu meço,
gosto não.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `DECISIONS.md` | D035 — 2 colunas, lista rolando, folha de ícones viável |
| `CHANGELOG.md` | entrada 6.0.7 |
| `src/pages/RankingPage.jsx` | 2 colunas, altura travada só no desktop, painel lateral |
| `src/App.jsx` | `max-w-5xl` só na tela de Ligas |
| `sessions/sessao-057.md` | este arquivo |

---

## Status para retomar

**Aguardando o Davi:**
1. **Ícones** — pode ser folha única, desde que salva como arquivo no
   projeto (ver seção 1). Ele vai mandar de tudo: arena, ligas, loja,
   ofensiva, moedas, vidas, e os escudos de cada divisão (inclusive
   bloqueadas).

**Resolvido nesta sessão:** o conteúdo do painel lateral — ele escolheu
"Sua corrida" + ficha do personagem, os dois já implementados.

**Pendente de olhada dele:** estética do layout novo (2 colunas) e o Header
no canto (sessão 055).
