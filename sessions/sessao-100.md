# Sessão 100 — Organização do documento de inovações em `planos/`

**Data:** 2026-09-01
**Versão:** 6.0.49 → 6.0.53
**Tipo:** Bloco 1 — planejamento e organização (zero código de jogo) · Bloco 2 — versão 6.2 iniciada (moeda virou Multis + auditoria de ícones) · Bloco 3 — versão 6.1: bug das missões na zona de rebaixamento

---

## O pedido

O Davi mandou um documento único com ~25 inovações de uma vez: arte e
identidade visual (logo, mascote, nome da moeda, ícones), interface,
mecânicas novas (painel de domínio, missões de tempo, Semana de Chama,
Modo Geral, sistema de apostas) e uma "dinâmica completa de animações"
estilo Duolingo.

Duas exigências explícitas:

1. **Organizar antes de aplicar** — separar em planos e versões, pra
   conversar e implementar uma de cada vez, aqui dentro.
2. **Não pode afetar a Fase 0/1 do Domínio.** Se afetar, fica pra depois.

## O que foi feito

Criado o diretório **`planos/`** com 10 arquivos: um índice mestre e nove
versões (6.1 a 6.9). Cada plano tem escopo, dependências, conflito com o
Domínio, checklist e perguntas abertas.

`PLANO_ACAO.md` ganhou a seção "FASE 9+" apontando pra lá (continua sendo a
fonte de verdade do que está em execução), e `PENDENCIAS.md` registrou as
duas pendências antigas que o documento dele absorveu.

## A análise que estruturou tudo: duas zonas de exclusão, não uma

A pergunta "isso afeta a Fase 0/1?" tem uma resposta óbvia e uma que quase
passou batido.

**Zona 1 — colisão de código.** Os arquivos que a coleta ocupa:
`GamePage.jsx` (`firstKeyAt`, marcadores de descarte), `App.jsx`
(`handleGameEnd` gravando `ult`/`dias`/`calibra`), `utils/index.js`,
`lib/storage.js`, `constants/index.js`. Essa é a fácil.

**Zona 2 — colisão de AMOSTRA, invisível no diff.** A Fase 1 mede
comportamento real de jogo. Qualquer coisa que mude **o que o jogador joga
ou por que ele joga** contamina a medida sem encostar em um arquivo da Zona
1:

- **Modo Geral** injeta fatos de faixas antigas (mais fáceis, mais rápidos)
  → **puxa a base p25 da fluência pra baixo** e aperta o critério de todos
  os fatos ao mesmo tempo. É o caso mais grave e o mais silencioso.
- **Semana de Chama** e **apostas** mudam quanto e por que ele joga.
- **Missões de tempo** consomem a mesma medida que a Fase 1 calibra.
- **Sons e animações dentro da partida** mudam o tempo de resposta.

➕ **Agravante de economia:** `DAILY_LIVES_ENABLED = false` desligou o
maior sorvedouro de moeda do jogo (refil a 300). Calibrar apostas ou
recompensas ocultas agora é calibrar numa economia quebrada de propósito.

**Conclusão que ordenou o backlog:** só duas trilhas são seguras hoje —
**6.1 (acabamento)** e **6.2 (identidade visual)**. E elas são justamente
as melhores pra rodar agora, porque a Fase 1 é uma fase de *espera por
dado* (~2 semanas de partidas) e a arte é o que trava metade das outras
versões.

## Achados enquanto eu levantava o material

Coisas que só apareceram lendo o código, e que mudam o tamanho do trabalho:

1. **Três itens do documento já estão prontos.** O ícone de baú vazio
   (`bau-vazio.png`, sessão 083, com moscas, na página "Nada desta vez"), a
   troca dos emojis da faixa de tabuada por ícone (os 20 troféus
   `faixa-01…faixa-20`, Fase 8.1) e os ícones dos 7 tipos de missão
   (`TYPE_ICON`) — o que falta na arena é *usar* o que existe, não gerar.

2. **O "embaçado" da zona de rebaixamento tem causa provável.**
   `zona-buraco.png` é 300×300 e é desenhado a `size={190}`; em tela 2× isso
   pede 380 px reais → **ampliação de 27%**. Os ícones que ninguém reclamou
   são desenhados com folga de 2,4× (54 px a partir de arte de 260). Vira
   regra candidata do design system: nenhum ícone desenhado acima de metade
   da largura nativa. *(A confirmar em captura antes de pedir arte nova.)*

3. **O PWA não tem manifest ligado.** `index.html` não tem
   `<link rel="manifest">`, e o arquivo da raiz se chama **`manifet.json`**
   (sem o `s`) e está fora de `public/` — nunca é servido. Na prática o jogo
   **não é instalável como app hoje**. Foi pro 6.2 porque é lá que a logo
   preenche o ícone do app.

4. **A maior parte das animações não precisa de arte nova.** Os baús
   fechados e abertos, os 12 fundos por recurso, a ofensiva acesa e a
   congelada já são artes separadas — falta interpolar. A fila de arte do
   6.6 inteiro tem **2 itens** (ofensiva apagada e, opcionalmente, frames do
   gelo). Isso responde direto o receio dele de "perder muito tempo".

5. **O documento define o Modo Geral de duas formas contraditórias** — no
   começo "mistura todas as faixas conquistadas", no fim "o usuário escolhe
   a faixa". São mecânicas opostas. Proposta: são **duas features**
   (Modo Geral + Seletor de faixa) e o seletor vira o painel de pré-partida.
   Procurei a conversa que ele lembrou sobre "o Rush incluir todas as
   faixas" em `CHANGELOG`, `DECISIONS`, `MEMORY` e todas as `sessions/`:
   **não existe registro.** Tratado como em aberto, não como combinado.

6. **O Modo Geral pode já existir com outro nome.** A seção 2.6 da
   `ARQUITETURA_XP.md` (interleaving adaptativo) faz a mesma função de
   retenção dentro do próprio Rush. Não mata o modo — muda o que ele é: a
   versão *escolhida* daquilo que o jogo passará a fazer sozinho.

## As duas análises de mecânica que valem por si

### Semana de Chama: o evento pode apagar 180 dias de ofensiva

Como está escrito ("a ofensiva só acende se cumprir o objetivo"), um
jogador com ofensiva longa pode jogar normalmente e **perder o histórico
inteiro** por não ter percebido o requisito da semana. Um evento de
empolgação que faz o jogador *torcer pra semana acabar* é o oposto do que
ele quer.

**Proposta (opção B):** a ofensiva normal continua funcionando; a **Chama**
vira um segundo marcador que só acende com o objetivo. Mantém 100% do que
ele descreveu — requisito, visual, mais XP, mais drop, comunicação no
header — e só inverte a consequência de falhar: em vez de perder o que
tinha, deixa de ganhar o extra.

### Apostas: o multiplicador crescente cria estratégia dominante

`Lucro esperado = aposta × (P × mult − 1)` → vale a pena quando `P > 1/mult`.
Com a tabela dele, apostar 10 exige **83%** de chance de bater o recorde pra
compensar; apostar 1000 exige **45%**. Mas `P` é o mesmo nos dois casos — é
a mesma tarefa. Logo **apostar tudo é sempre matematicamente melhor**, e a
tabela pune quem dosa o risco.

**Correção proposta:** o multiplicador vem do **risco escolhido** (margem
sobre o recorde: +1% → ×1,2 · +5% → ×1,5 · +10% → ×1,9 · +20% → ×2,6), não
do valor arriscado. Isso (a) elimina a estratégia dominante, (b) **resolve
sozinho o abuso do recorde baixo** que ele identificou — o recorde se
atualiza na partida seguinte —, e (c) transforma a mecânica exatamente na
fantasia que ele descreveu: *"consigo superar meu melhor desempenho por uma
margem?"*.

Mais: base = **melhor das últimas 10 partidas** (rebaixar de propósito custa
10 partidas jogadas fora — o custo já é a defesa), **chão de carteira** no
preço do refil de vidas, **nenhum cenário 100% sorte**, e **Seguro de
Desafio** como item próprio em vez de sobrecarregar o Escudo.

**Nomenclatura:** concordo com a preocupação dele. Os questionários de
classificação da Google Play e da App Store perguntam sobre "jogo de azar
simulado", e responder sim costuma levar de Livre pra 12+/Teen — o que um
jogo de tabuada não pode pagar. Recomendado adotar a alternativa dele por
inteiro: **Desafio de Partida** / **Desafio Surpresa**, sem roleta girando.

## Arquivos criados

```
planos/00-INDICE.md              índice, zonas de exclusão, mapa de versões
planos/6.1-acabamento.md         bug de missões, zona de rebaixamento, tempo, nomes
planos/6.2-identidade-visual.md  moeda, logo, mascote, ícones, sons
planos/6.3-painel-dominio.md     UI de domínio (já especificada na ARQUITETURA_XP)
planos/6.4-missoes-v2.md         missões de tempo + recompensa oculta
planos/6.5-reset-layout.md       reset visual / simplicidade Duolingo
planos/6.6-animacoes.md          catálogo de animações em 3 níveis
planos/6.7-semana-de-chama.md    evento semanal
planos/6.8-modo-geral.md         modo novo (com a contradição em aberto)
planos/6.9-desafio-de-partida.md o sistema de apostas
```

Alterados: `PLANO_ACAO.md` (seção FASE 9+), `PENDENCIAS.md` (pendências
absorvidas).

---

# Bloco 2 — Versão 6.2 iniciada: a moeda virou **Multis**

O Davi decidiu não esperar a coleta acabar e abrir a 6.2 em paralelo — o
que é seguro, porque a 6.2 é decisão e arte, não regra de jogo.

## A decisão nº 1 saiu: **Multis**

Escolhido entre Multis, Fichas e Raios. Liga direto na multiplicação, nada
no jogo usava a palavra, e o plural é natural. *(Fichas puxaria o jogo pro
arcade; Raios brigaria com o ⚡ do Rush.)*

**Aplicado em 15 textos visíveis**, em duas levas. As chaves de ícone
(`name="moedas"`, `art: 'moedas'`) e o campo do save (`coins`) **não foram
tocados** — são identificadores, não texto.

**A segunda leva só existiu por causa da captura de tela.** O grep da
primeira leva procurava `moeda` dentro de aspas ou depois de `>`, e perdeu
três casos de JSX quebrado em várias linhas:

- Header → *"Use suas moedas na loja pra comprar power-ups e repor vidas."*
- Missões → *"🎁 Resgatar +N moedas"*
- Modal de aposta → *"Aposte moedas no Rush"*

O primeiro apareceu num screenshot do painel de moedas do Header. **É
exatamente o que o D062 previu**: asserção de código não pega o que o olho
pega. Sem a captura, três textos teriam ido pra produção pela metade.

Conferido no fim: `document.body.innerText` da Loja não contém mais a
palavra "moeda", e o build passa.

## Auditoria de resolução dos ícones — a pergunta "quais estão mal desenhados"

Em vez de pedir a lista pro Davi, medi. Script que compara o tamanho nativo
de cada um dos 93 PNGs com o tamanho em que o `GameIcon` desenha.

**Como o `GameIcon` usa caixa quadrada com `object-contain`, a razão certa
é `maior lado ÷ size`** — não o menor lado (errei isso na primeira versão
do script e corrigi antes de concluir; com o menor lado, o `zona-selo`
400×132 aparecia como "ampliado" quando na verdade está reduzindo).

**Resultado: os ícones não estão mal desenhados — estão pequenos demais.**
São 36 arquivos, e todos têm a mesma coisa em comum: são os que o jogo
desenha GRANDES.

| Grupo | Nativo | Desenhado a | Folga |
|---|---|---|---|
| `bau-*-aberto` (4) | 240 | 168 | 1,43 |
| `combo-*` (9) | 240 | 168 | 1,43 |
| `zona-buraco` | 300 | 190 | 1,58 |
| `zona-selo` | 400 | 230 | 1,74 |
| `faixa-01…20` (20) | 200 | 112 | 1,79 |
| `bau-vazio` | 240 | 132 | 1,82 |

Folga abaixo de 2 = o navegador amplia o PNG em tela 2× (todo celular). Os
outros 57 ícones têm folga de 2,5 a 14× e estão ok.

**Vira regra de design system:** nenhum ícone pode ser desenhado acima de
metade do seu maior lado nativo. Alvo pra arte nova: **512 px**.

Isso responde de uma vez três perguntas abertas do plano 6.2: "quais ícones
estão ruins", "por que os da zona de rebaixamento estão embaçados" e
"refazer o download dos troféus" (são os 20 de faixa, e o problema é
resolução, não perda de arquivo).

Gerada uma página visual com os 36 ícones **no tamanho real de uso**, pra
ele ver o problema em vez de ler sobre ele — junto com a pergunta de estilo
(chapado × 3D) ilustrada, que ele não tinha entendido em texto.

## 🚨 Descoberta: o sistema de apostas já existe e está no ar

Apareceu por acaso na varredura de texto do nome da moeda. `App.jsx` tem um `BetModal`
completo e **ligado**: aposta de 10/25/50 antes de toda partida de Rush,
pagamento **3× fixo** por bater o recorde do modo, `data.activeBet`
persistido e resolvido no `handleGameEnd`.

Isso **não é buraco de registro**: a feature entrou na **[3.5.0]**
(2026-06-08), está no `CHANGELOG.md` e no `MEMORY.md` (*"Único modo com
aposta"*), e sobreviveu ao reset da 6.0. O que aconteceu é que o documento
de inovações dele especifica como novidade uma coisa que já roda.

Ou seja: a "Modalidade Determinação" que ele especificou como nova **já
existe**, em versão simplificada — e **com o abuso que ele mesmo previu**.
Com 3× fixo, o ponto de equilíbrio é 33% de chance de bater o próprio
recorde; no começo do jogo isso é lucro fácil. Nenhuma das quatro travas
que ele listou existe.

E encosta na Fase 1: o modal aparece antes de toda partida de **Rush**, que
é onde a coleta de fluência acontece. A amostra já está sendo colhida sob
pressão de aposta. Não é contaminação nova (é a linha de base de sempre),
mas é mais um motivo pra não mexer no sistema durante a coleta.

Registrado no topo de `planos/6.9-desafio-de-partida.md`. A 6.9 deixou de
ser "construir do zero" e virou "evoluir o que existe".

---

# Bloco 3 — Versão 6.1: o bug das missões era grave

O Davi perguntou se valia abrir a 6.2 sem a Fase 1 fechar. Vale: a 6.2 é
decisão e arquivo de arte, não muda comportamento — que é o que a Fase 1
mede. As duas únicas exceções ficaram registradas: **som de dentro da
partida** e **mascote reagindo durante a partida** esperam a coleta.

Aí ele escolheu a 6.1. Em vez de pedir o print, fui procurar.

## Eram dois bugs, e a causa raiz é a mesma

A penalidade da zona de rebaixamento (`penalizarMissao`, sessão 097) é
aplicada **na leitura**: alvo ×1,5 e recompensa ×2, com o save guardando o
valor real. O `getActiveMissions` documenta isso desde sempre:

> *"Aplico na LEITURA, não no save: o progresso guardado continua sendo o real"*

**O resto do código não cumpria essa promessa.** Os dois bugs são o mesmo
erro por dois caminhos.

### Bug 1 — as 7 missões ficavam impossíveis

`updateOne` gravava `Math.min(p, mission.target)` com o alvo **normal**,
enquanto a tela comparava com o alvo **penalizado**. O progresso batia no
teto do alvo normal e nunca alcançava o mostrado. O
`if (mission.completed) return mission` fechava a porta de vez.

Escrevi um repro com o código real (via `esbuild --bundle`, porque o Node
não resolve import sem extensão como o Vite faz). **8 partidas de 60
acertos, sequência 40, 900 pontos: 7 de 7 travadas.** "5 / 8 partidas" com
8 partidas jogadas.

Três correções, que precisam andar juntas:
1. **Sem teto no save** — `progress` guarda o real; quem exibe é que corta
2. **Sem parada ao completar** — congelava no alvo normal por outro caminho
3. **`accuracy`/`score` gravam a medida, não o alvo** — faziam
   `p = mission.target` (tudo ou nada), então nunca chegavam ao penalizado

A terceira melhorou a barra pra todo mundo, não só na zona: quem faz 88%
numa missão de 90% vê "88 / 90" em vez de "0 / 90".

### Bug 2 — o card se contradizia em três lugares

**Este só apareceu na captura de tela**, depois do primeiro fix: título
"120 Acertos", descrição "Acerte 120 contas no total hoje", barra
"0 / 180". `penalizarMissao` mudava `target` e `reward` e esquecia o texto.

Segunda vez nesta sessão que a captura pega o que a leitura de código não
pegou. Corrigido com dois cuidados que o caso exigiu:

- **Separador de milhar:** `/\d+/g` via "1.500" como os tokens "1" e "500",
  nenhum igual a 1500 — o título ficava eternamente errado. Regex passou a
  casar `\d{1,3}(?:\.\d{3})+|\d+`.
- **Nada de lookbehind** (`(?<!\d)`), que quebraria o app inteiro no Safari
  antigo. Uso `replace` com função, comparando token por token.
- **A dica de ritmo sai** — "(~50/dia)" foi calibrada pro alvo base; com o
  alvo 50% maior ela vira mais um número errado.

Conferido nas 16 missões do pool: **zero cards com número desencontrado**.
E confirmado em captura: "Precisão de 98%" / "Termine uma partida com 98%
de precisão" / "0 / 98%".

## O que sobrou, e não é bug

Três coisas que a correção expôs e que são decisão de produto:

1. **4 títulos por extenso** não carregam dígito, então não dá pra
   penalizar: *Duas Partidas*, *Cinco Partidas*, *Duzentos e Cinquenta*,
   *Quinhentos Pontos*. Na zona, "Duas Partidas" fica com a barra em 0/3.
2. **As duas missões de precisão viram a mesma na zona** — 80% e 90% batem
   as duas no teto de 98%.
3. **98% de precisão é 1 erro em 60 contas.** O comentário do próprio código
   diz que 100% seria "cruel demais"; 98% está quase lá.

E um resíduo do mesmo desenho, ainda em aberto: **desafio mensal na zona
paga a recompensa normal.** `resolveChallenges` resolve contra a leitura
não-penalizada, então a tela promete 700 e paga 350. Não é explorável (o
alvo cobrado também é o normal, o que favorece o jogador), mas é mais um
número que não bate.

---

# Bloco 4 — As 3 decisões que sobraram (e uma lição de comunicação)

O Davi respondeu as perguntas em aberto do bloco 3 assim:

> *"TENDI NADA"* · *"QUE ZONA CARA?"* · *"MANO, TO ENTENDENDO NADA, MAS SE
> VC ACHA IMPOSSIVEL NAS CONTAS PODE REDUZIR"* · *"NÃO ENTENDI NADA KKKKK"*

**Culpa da pergunta, não da resposta.** Eu perguntei em vocabulário de
código ("o teto de 98% achata as duas missões de accuracy") pra alguém que
queria saber se o jogo estava justo. **Regra pra mim daqui pra frente:
pergunta de decisão vai em português do jogo — o que o jogador vê, não o
que a função faz.** A única que ele respondeu de primeira foi justamente a
que estava concreta ("Duas Partidas" virar "2 Partidas").

Ele aprovou a 1, mandou reduzir na 3 e deixou as outras comigo.

## O que foi aplicado

**1. Os 4 títulos por extenso viraram número.** *Duas Partidas* →
**2 Partidas**, *Cinco Partidas* → **5 Partidas**, *Duzentos e Cinquenta* →
**250 Pontos**, *Quinhentos Pontos* → **500 Pontos**. Sem dígito no título,
a penalidade da zona não tinha o que atualizar e o card ficava com "Duas
Partidas" em cima de uma barra de 0/3.

**2. A precisão passou a subir em PONTOS PERCENTUAIS (+5, teto 95).** Antes
era ×1,5 com teto 98. Uma troca resolveu os dois problemas de uma vez:

- deixa de ser quase impossível — 98% é errar 1 conta em 60
- as duas missões voltam a ser diferentes (80 → 85%, 90 → 95%); com o teto
  antigo as duas batiam em 98% e viravam cards idênticos

Isso é o tipo de correção que só aparece quando se olha a regra e a tela
juntas: o teto foi criado pra evitar "Precisão de 135%", e resolvia isso —
mas criava dois problemas novos que ninguém tinha medido.

**3. O desafio mensal deixou de ser penalizado na zona.** É a única das
quatro em que eu decidi sozinho, então vale registrar o raciocínio: desafio
mensal é **contrato** — o jogador aceita um alvo e uma recompensa e leva
multa se não cumprir. Penalizar na leitura fazia a tela prometer 700 e o
`resolveChallenges` pagar 350 (ele resolve pelos valores guardados, que são
os de base), e era injusto nos dois sentidos: cair na zona no último dia do
mês subiria o alvo de um contrato assinado semanas antes.

A intenção do Davi na sessão 097 era *"que o usuário tenha MEDO da zona"* —
e ela continua doendo sem isso: metade do XP, 25% do loot e as diárias 50%
mais duras. **Reversível em uma linha**, mas aí o `resolveChallenges` tem
que julgar e pagar pelos mesmos valores penalizados; as duas coisas juntas,
senão o número volta a não bater.

## Conferido

Nas 10 diárias: zero cards com número desencontrado. Precisão saindo 85% e
95%. Mensal na zona mostrando exatamente o que vai pagar. E em captura:
"Precisão de 95%" / "Termine uma partida com 95% de precisão" / "0 / 95%",
com os títulos novos ("375 Pontos", "750 Pontos") penalizando certo.

**Item 6.1.1 fechado.**

## Próximos passos

1. **Continuar a coleta da Fase 1 do Domínio** — jogar partidas de verdade.
   É o item que não pode parar, e é o que libera 6.3, 6.7 e 6.8.
2. **Escolher a primeira versão pra conversar.** Recomendo **6.1**
   (acabamento) — tem o único bug real do documento e não depende de
   decisão nenhuma. E, em paralelo, começar a responder as 3 decisões
   travantes do **6.2** (nome da moeda → logo → mascote).
3. **Responder as 12 perguntas abertas** do `planos/00-INDICE.md`, na ordem
   em que cada versão for entrando.
4. **Religar `DAILY_LIVES_ENABLED = true`** quando a Fase 1 acabar — dívida
   com data pra vencer, e ela destrava a calibração de economia do 6.4 e do
   6.9.

**Nada de `planos/` começa sem o Davi confirmar o escopo daquela versão.**
