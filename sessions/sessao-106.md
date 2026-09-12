# Sessão 106 — Os sons de baú vão ser gerados no ElevenLabs

**Data:** 2026-09-12
**Versão:** 6.0.59 → 6.0.60
**Tipo:** Decisão + prompts (6.2, etapa 7) — nenhum código de jogo mudou

---

## O pedido

> *"quero fazer no elevenlabs os efeitos sonoros dos baús, 1 efeito do baú
> abrindo (para o de madeira, ferro, ouro), 1 efeito para o baú místico
> abrindo. Efeito sonoro do combo recompensa mais baú, do baú abrindo mais
> som respectivo atmosférico, sla. preciso dos prompts para cada"*

O "sla" no fim é o sinal que o próprio Davi definiu na sessão 103: quando a
ideia não está concreta, **discutir a estrutura antes de escrever prompt**.
Então a primeira coisa foi decidir *quais* sons existem e *em que ordem
tocam* — e só depois os prompts.

## A estrutura, tirada da tela real

Conferi o `PostGameSummary`: a página 6 mostra **um item por vez** — o baú
abre e o recurso (ou as Multis) aparece; e existe a página "Nada desta vez"
com o baú vazio. Isso resolve duas dúvidas dele de uma vez:

**1. O "combo recompensa + baú" não é um arquivo — é uma sequência de
dois**, tocada em código com ~250 ms de intervalo: baú abre → recurso
aparece (ou moedas caem). Gerar um arquivo por combinação seriam 4 baús ×
13 recursos; separando, são **5 arquivos** e a sequência monta qualquer
combinação — e o timing pode seguir a animação da 6.6 em vez de ficar
travado dentro do áudio.

**2. A "camada atmosférica" não precisa existir como arquivo separado.**
Duas camadas de áudio trazem balanço de volume, emenda de loop e a
restrição de autoplay do celular — pra ganhar um efeito que a **cauda de
2 s do baú místico já entrega** se o prompt pedir. A atmosfera mora dentro
do som, não ao lado.

## Os 5 sons

| # | Arquivo | Duração |
|---|---|---|
| 1 | `som_bau_comum.mp3` (madeira/ferro/ouro) | 1,3 s |
| 2 | `som_bau_mistico.mp3` | 2,0 s |
| 3 | `som_recurso.mp3` (power-up/poção aparece) | 0,9 s |
| 4 | `som_multis.mp3` (moedas caem) | 1,2 s |
| 5 | `som_bau_vazio.mp3` (rangido + moscas + slide whistle) | 1,5 s |

Mais duas variações opcionais (ferro e ouro), se ele quiser os três baús
comuns diferentes. Prompts completos, em inglês, em
`referencias/sons/CATALOGO.md`.

## O que precisou de aviso

- **Licença do ElevenLabs:** o plano gratuito é não-comercial e exige
  atribuição; uso comercial só a partir do Starter. Como o jogo vai ser
  distribuído, conferir o plano **antes** de gerar o conjunto final.
- **Duração tem que ser definida no controle**, não deixada automática — é
  o que garante que o som cabe na animação.
- **Gerar 4 variações e escolher** — uma só quase nunca é a boa.
- O MP3 do ElevenLabs já sai no formato certo — sem o problema do `.ogg`
  do Kenney (sessão 105).

O clique continua vindo do Kenney (lista curta de 4 da sessão 105).

## Próximos passos

1. **Davi gera os 5 no ElevenLabs** com os prompts do catálogo e confere o
   plano da conta.
2. **Escolhe 1 dos 4 cliques** do Kenney.
3. **Eu integro os 6** em `src/assets/sons/`, ligo no `audioManager` com a
   sequência de 250 ms, e registro a licença por arquivo.
4. **Ainda pendente da 6.2:** poses do Tatuba, artes limpas (PNG, sem marca
   d'água, letreiro transparente, Tatuba sem a caixa), decisão dos tons.
5. 🔴 **E o principal:** jogar em mais 2-3 dias diferentes pra fechar a
   Fase 1.
