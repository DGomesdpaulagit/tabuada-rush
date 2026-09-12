# Sessão 107 — Mesa de som + roteiros som/animação

**Data:** 2026-09-12
**Versão:** 6.0.60 → 6.0.61
**Tipo:** Ferramenta de escolha + roteiro (6.2, etapa 7) — nenhum código de jogo mudou

---

## O que o Davi trouxe

Os sons gerados no ElevenLabs com os prompts da sessão 106 **não agradaram**:
*"foi muito rápido, todos os sons"*. E ele nomeou a causa antes de mim:
*"tudo tem que bater, a animação com o som (…) transformar isso meio como
um vídeo, mas eu ter os sons prontos pra fazer o vídeo"*.

**Ele está certo, e o erro foi meu:** na 106 eu dei durações de som
(1,3 s, 0,9 s…) sem existir uma animação pra elas caberem. Som de baú de
1,3 s só é "rápido demais" se a tampa leva 2 s pra abrir — e ninguém tinha
decidido quanto a tampa leva.

Ele também achou sons do Duolingo no myinstants (acerto, erro, lição
perfeita, lição concluída, ofensiva) e quer usar — *"como é quase uma cópia
do Duolingo"*. E pediu: **um artefato onde dê pra tocar cada candidato por
catálogo e escolher o melhor**, com todos os catálogos presentes mesmo
vazios.

## O que foi feito

### 1. A mesa de som (artefato)
**https://claude.ai/code/artifact/0083d89f-d1f9-43e7-8a10-bda8fd4d36c7**

- **13 catálogos** — os 9 de fora da partida e os 4 de dentro (marcados
  como "esperam a Fase 1"). Todos presentes; os vazios dizem o que falta.
- **40 áudios embutidos** (base64, 1,3 MB) — os candidatos do Kenney e do
  Pixabay tocam **dentro da página**, com duração medida ao carregar.
- **Escolha por catálogo** (rádio), salva no navegador, com resumo no topo
  e botão **"Copiar resumo pra mandar"** — ele marca, copia, cola aqui.
- **Os 5 do Duolingo entram como link** pra ouvir no myinstants, com selo
  "não vai pro jogo" — ver abaixo.

### 2. Os roteiros — som e animação no mesmo relógio
Na própria página, três linhas do tempo com **tempo · animação · som** por
momento: baú com Multis (4,0 s), baú com recurso (3,5 s), baú vazio (2,5 s).
É a ideia dele de "fazer como um vídeo", escrita.

O que os roteiros mudam nos prompts: a **abertura passa a ter ~1,4 s**
(0,4 → 1,8), o **místico ~2,0 s**, e as **Multis ~1,6 s** *sobrepostas* à
abertura — dois arquivos tocando juntos é o que dá a sensação de contínuo.
E o pedido dele de "moedas se mexendo como num saco" vira prompt de *coins
shaking in a pouch*, não *coins dropping*.

### 3. O que ele pediu pra eu não deixar esquecer
Anotado em `PENDENCIAS.md`: baixar o som do **combo** (fonte paga, "Limbo"),
gerar **Multis** e **místico** com as durações do roteiro, olhar o **baú
vazio**, e **confirmar o plano do ElevenLabs**.

## ⚠️ Os sons do Duolingo — dito uma vez, com clareza

Ele quer usá-los porque o jogo *"é quase uma cópia do Duolingo"*. Copiar o
**estilo** visual é o que a gente faz desde a sessão 063 (D041) — é
legítimo. Usar o **arquivo de áudio deles** num app distribuído é outra
categoria: é propriedade da Duolingo, é violação de direito autoral, e loja
de app derruba por isso.

**O caminho que deixei na página:** cada um serve como **modelo de
caráter** — ele ouve, marca qual agrada, e eu escrevo o prompt do
ElevenLabs descrevendo aquele caráter pra gerar o equivalente. Mesmo
resultado na prática, sem o risco.

Por isso na mesa de som eles são **link**, não arquivo embutido: eu não
copio o áudio da Duolingo pra dentro de uma página hospedada, nem em
referência privada.

## Próximos passos

1. **Davi ouve a mesa e marca as escolhas** — pelo menos o **clique** e
   qual **Duolingo** ele quer como modelo de acerto/erro/celebração.
2. **Aprova (ou ajusta) os tempos dos roteiros.**
3. **Eu reescrevo os 5 prompts** com as durações do roteiro e o caráter das
   referências marcadas.
4. **Ele gera de novo** no ElevenLabs — e confere o plano.
5. **Ele baixa o combo** da fonte paga (está no PENDENCIAS).
6. **Eu integro** os sons com a sequência dos roteiros — o que já é metade
   do trabalho do 6.6 (animações), porque o roteiro serve pros dois.
7. 🔴 **E o principal:** jogar em mais 2-3 dias diferentes pra fechar a
   Fase 1.
