# ✨ ARQUITETURA_XP.md — Pontos, XP, Domínio e progressão

> **v2 (sessão 099).** A v1 recomendava *tirar* o XP das faixas. O Davi levou
> a análise pro ChatGPT, que propôs em vez disso **XP + Domínio juntos** —
> e ele tem razão. Este documento foi reescrito em cima disso, com os números
> que faltavam nos dois lados.
>
> Nada aqui está implementado. É o documento de decisão que precisa ser
> fechado **antes** de mexer em XP e **antes** de qualquer modo novo.

---

## 1. Onde a discussão chegou

| Camada | Pergunta que responde |
|---|---|
| ⭐ **Pontos** | Como eu fui nesta partida? |
| ✨ **XP** | Quanto eu progredi? |
| 🧠 **Domínio** | Eu realmente aprendi? |
| 🏆 **Liga** | Como estou em relação aos outros? |

E a regra de faixa vira:

```
PRÓXIMA FAIXA = XP suficiente  E  Domínio suficiente
```

**Eu concordo, e retiro a recomendação da v1.** Meu argumento era que faixa
comprada com XP é farmável; a trava de domínio resolve isso sem precisar tirar
o XP de lugar nenhum. O Davi queria manter a "aura" do XP e estava certo — o
XP continua sendo o eixo, ele só deixa de ser a **única** condição.

O que ninguém verificou é **qual das duas condições manda de verdade**. É o
resto deste documento.

---

## 2. A conta que faltava: quem segura a faixa 1?

### 2.1 O lado do XP

Com a fórmula da seção 5 (base = acertos, bônus com teto), uma partida de Rush
vale:

| Partida | XP |
|---|---|
| Fraca (12 acertos) | ~15 |
| Média (35 acertos) | ~45 |
| Ótima (48 acertos + combos) | ~72 |

**Média de trabalho: 45 XP por partida.**

A primeira faixa custa **27.000 XP** hoje (`FIRST_TIER_XP`):

| Ritmo | Partidas | Tempo até sair da 2×10 |
|---|---|---|
| 2 partidas/dia, todo dia | 600 | **~10 meses** |
| 3 partidas/dia, todo dia | 600 | **~6,5 meses** |
| 2 partidas/dia, 5 dias/semana | 600 | **~14 meses** |

> ### 🎯 O achado principal
>
> **As "600 partidas" que assustaram o Davi são exatamente os "8 a 10 meses"
> que ele pediu.** É o mesmo número dito de dois jeitos.
>
> E mais: **os 27.000 XP da curva atual já estão certos** pro mundo novo. O
> que está errado hoje não é a curva das faixas — é a *taxa* (250 XP numa
> partida só). Corrigida a taxa, a curva atual cai dentro do alvo pedagógico
> dele sem precisar de recalibração nenhuma.

### 2.2 O lado do domínio

A faixa 2×10 tem **54 fatos únicos** (`a` de 2 a 10, `b` de 1 a 10,
normalizado — 3×7 e 7×3 são o mesmo fato).

A 40 acertos por partida e 2 partidas por dia, são ~80 questões/dia
distribuídas em 54 fatos: **~1,5 exposições por fato por dia**. Com uma regra
de domínio razoável (tipo *"≥8 acertos, ≥90% de precisão recente, em ≥4 dias
diferentes"*), os fatos fáceis fecham em 1–2 semanas e a cauda difícil
(7×8, 6×7, 8×9) em 6–10 semanas.

**Domínio dos 54 fatos: 1 a 2,5 meses.**

### 2.3 A conclusão que muda o desenho

```
XP      ████████████████████████████████████  ~10 meses
DOMÍNIO ██████████                            ~2 meses
```

**As duas travas não dividem o ritmo — o XP manda sozinho, com folga de 4 a
5×.** E aumentar a exigência de domínio não muda isso: quem joga mais ganha
XP *e* domina mais rápido, os dois sobem juntos.

Isso **não** torna a trava de domínio inútil. Ela só faz um trabalho
diferente do que os dois documentos supunham:

- **O XP dá o ritmo** → é ele que entrega os 8–10 meses.
- **O domínio dá o piso** → ele não segura ninguém que joga direito; ele
  segura **quem joga muito e continua errando 7×8**. É uma peneira de
  qualidade, não um cronômetro.

**Consequência prática:** não adianta calibrar o domínio esperando ganhar
meses. Se um dia ele quiser que o domínio seja quem segura de verdade, o
caminho é *baixar* o XP exigido pra uns 3.000–4.000 — o que contradiz os 8–10
meses. **Ele tem que escolher qual dos dois marca o tempo.** Minha
recomendação: **XP marca o tempo, domínio marca o piso.** É o que ele descreveu
querendo, e é o que essas contas sustentam.

---

## 3. A contradição que ele mesmo apontou — e a saída

Ele escreveu: *"você demora mais pra passar da primeira faixa do que da quarta,
mas você precisa decorar mais [na quarta]... a gente meio que acaba se
contradizendo"*.

A intuição está certa e os números confirmam:

| Faixa | Fatos únicos |
|---|---|
| 2×10 | **54** |
| 20×30 | **~110** |
| 100×110 | **~110** |

A faixa 1 tem **metade** do conteúdo das outras e deve durar **o dobro**. Só
parece contradição se a régua for volume. Não é:

1. **A faixa 2×10 é carregada por todas as outras.** Quem resolve 23×7 na
   cabeça está usando 3×7. Errar 7×8 na faixa 1 vira erro em todas as 19
   faixas seguintes. É infraestrutura, não conteúdo.
2. **A meta muda de natureza.** Na faixa 1 o objetivo é **memorizar** (fato
   recuperado sem contar). Da faixa 3 em diante, com fator até 200, ninguém
   memoriza 110 fatos por faixa — o objetivo vira **fluência de estratégia**
   (decompor, usar o que já sabe). Duas metas diferentes, dois tempos
   diferentes. Sem contradição.

**Isso justifica a exigência de domínio da faixa 1 ser a mais alta de todas**
(ex.: 95% dos fatos em verde), enquanto as de cima ficam mais frouxas (ex.:
80%) — que era exatamente a ideia da seção 25 do documento do ChatGPT.

---

## 4. O que eu manteria, o que eu cortaria

### ✅ Combo — mantido
Mede consistência dentro da partida. Com a regra de "cada marco paga uma vez
por partida", não tem farm.

### 🔁 Recorde — eu abrandei minha posição
Na v1 eu cortava. Com a trava de domínio no lugar, o farm de XP deixou de
comprar conteúdo — então o risco caiu muito e não me importo mais tanto.

**Mas o problema de incentivo continua:** o iniciante bate recorde quase toda
partida e o veterano quase nunca, então o bônus paga mais quem menos precisa e
some justamente no platô. Se ficar, que seja **por percentual de superação e
com teto** (superar em 20% paga o mesmo que superar em 300%), nunca por valor
absoluto.

### ✂️ Velocidade — eu continuo cortando
Dois motivos que o documento do ChatGPT não respondeu:

1. **Contradiz a hierarquia do próprio Davi** ("precisão deve ser mais
   importante que velocidade").
2. **Já é pago duas vezes.** No Rush, cada acerto devolve 3 segundos ao
   relógio (`bonusTime`). Responder rápido já rende mais perguntas por partida,
   e mais perguntas já é mais XP. Um bônus explícito por rapidez paga o mesmo
   comportamento de novo — e empurra o jogador a chutar rápido.

Velocidade continua onde ela funciona: nos pontos, no recorde de tempo médio
(`fastestAvgMs`), nas estatísticas e **no cálculo de domínio** (seção 6).

---

## 5. A fórmula

```
XP DA PARTIDA = round( (BASE + BÔNUS) × fator do modo × fator do dia ) × poção
```

- **BASE = acertos × 1 XP**, piso de 5 pra qualquer partida terminada.
  Base fixa (os "20 por partida" da proposta original) é convite a farm: 10
  partidas de 15 segundos abandonadas valeriam mais que uma partida séria de 4
  minutos. Por acerto, escala sozinha com o tamanho real da partida e funciona
  igual em qualquer modo futuro.
- **BÔNUS ≤ 50% da base** — teto duro, dividido entre todas as fontes.
  Nenhuma partida passa de 1,5× o que ela vale pelos acertos, não importa
  quantos bônus sejam inventados depois. É esse teto que impede a inflação.
- **Fator do modo** — 0 a 1,25, declarado pelo modo (seção 7).
- **Fator do dia** — as 5 primeiras partidas do dia a 100%, da 6ª em diante a
  50%. Impede subir de divisão maratonando num sábado.
- **Poção multiplica no fim** — como ele escreveu; é o que faz valer a pena
  usar poção numa partida boa.

### ⚠️ Cuidado com "cada faixa tem economia própria"
A ideia (seção 15 do ChatGPT) só vale se a **razão** mudar. Se o XP por
partida sobe 50% na faixa 3 e o XP exigido pela faixa 3 também sobe 50%, nada
mudou — são os mesmos meses com números maiores. Escalar os dois lados junto é
trabalho que não produz efeito nenhum. Só mexer nisso com uma intenção
explícita de mudar o ritmo.

---

## 6. Domínio: como medir

O jogo **já guarda tudo que precisa** — `factStats` tem acertos, erros, tempo
total e `lastPracticed` por fato normalizado, e `predictRecallProbability`
(curva de esquecimento) já existe em `utils/index.js`.

Três estados por fato, alimentando o Mapa de Domínio que já está na tela:

| | Estado | Critério (a calibrar) |
|---|---|---|
| 🔴 | Precisa praticar | precisão recente < 70% ou nunca visto |
| 🟡 | Em desenvolvimento | melhorando, mas sem consistência ainda |
| 🟢 | Dominado | ≥8 acertos, ≥90% de precisão recente, em ≥4 dias diferentes, tempo abaixo do limite |

Quatro componentes, como o ChatGPT propôs — **precisão + consistência +
velocidade + recência** — e a recência é o que impede "acertei 10 vezes numa
tarde e virou verde pra sempre". Um fato verde **volta pra amarelo** se apodrecer;
isso o `predictRecallProbability` já sabe calcular.

### O ponto pedagógico que isso resolve
Ele descreveu exatamente o comportamento certo: *"antes ele errava seis vezes o
7×8 numa partida só; hoje erra duas; hoje não erra mais"*. Um contador de
acertos não enxerga isso. **Taxa de erro caindo ao longo do tempo** enxerga. É
por isso que domínio precisa ser tendência, não total acumulado.

---

## 7. Interface: esconder a fórmula, nunca esconder o motivo

Ele pediu pra não deixar o gate explícito, e concordo — número de XP exigido na
tela transforma aprendizado em checklist. Mas tem um limite que o documento do
ChatGPT não marcou:

> **Um jogador que bateu o XP e não passa PRECISA saber que o que falta é
> acerto, não tempo de jogo.** Senão o jogo diz "quase lá" por meses e vira
> quebra de confiança — exatamente o desânimo que ele temeu.

A saída: **esconder os números, mostrar as duas barras.**

```
📚 Tabuada 2×10

Progresso   ████████████████░░░░
Domínio     ███████████░░░░░░░░░

Estas ainda pedem prática:
🔴 7 × 8      🟡 6 × 7      🟡 8 × 9
```

Sem "faltam 3.400 XP", sem "acerte 7×8 mais 6 vezes". Mas sempre dá pra ver
**qual das duas barras está segurando** — e a lista de fatos vermelhos vira o
caminho, não a parede. É o que empurra ele pras estatísticas, que era o desejo
do Davi.

---

## 8. Ligas: personagens com personalidade

Ele quer que cada personagem tenha ritmo próprio e varie dia a dia, pra a liga
não ficar monótona. **Metade disso já está construído** (`utils/leagues.js`):

| Já existe | Falta |
|---|---|
| Cada personagem tem uma atividade própria (0,4–0,9) | Ela vem de um **hash do nome**, não da identidade — o Einstein pode calhar de ser mais preguiçoso que o Patrick Estrela |
| Variação de ±30% a cada 12h | A variação é **igual pra todo mundo** — ninguém é regular, ninguém é imprevisível |
| Multiplicador por liga (0,7 Bronze → 2,2 Diamante) | — |

Ou seja: não é sistema novo, são **duas correções**.

1. **Ritmo por identidade.** Dois números por personagem, escritos à mão nos
   114 (`ritmo` e `constancia`), substituindo o hash. É o que faz o Einstein
   parecer o Einstein.
2. **Variância por personagem.** Einstein: ritmo alto, constância alta → quase
   sempre no pódio. Um personagem errático: ritmo menor, constância baixa →
   uma vez por mês ele passa o Einstein. **É a constância baixa dos OUTROS que
   produz o "caraca, o Einstein está em terceiro"**, não a variação do próprio
   Einstein. Se todo mundo variar igual, ninguém tem personalidade.

### ⚠️ Onde eu discordo do ChatGPT: não simular o que não aparece
Ele propõe dar a cada personagem precisão, velocidade, tendência de combo,
frequência de erro, 8 atributos. **A liga consome exatamente uma saída: um
número de XP.** Simular a precisão do Batman pra depois converter em XP é
inventar trabalho que ninguém vê na tela — e mais superfície pra bug.

Dois números por personagem entregam 100% do efeito visível. Se um dia existir
uma ficha do personagem na tela ("Batman: precisão 94%"), aí os atributos
passam a aparecer e valem a pena. Antes disso, não.

### E sobre usar o QI
O ChatGPT recomendou não usar QI como fórmula. **Eu usaria** — a ficção do jogo
inteiro é um ranking de QI com 114 personagens, e é isso que faz o pódio da
Diamante fazer sentido. O cuidado real é outro: o QI define o **ritmo**
(a média), nunca a **constância** (a variância). São eixos independentes — é o
gênio distraído que perde pro esforçado num dia ruim.

---

## 9. O que TODO modo novo precisa responder (antes de existir)

**Modo novo sem estas 7 respostas não entra:**

1. **Duração típica de uma partida.** (Dá pra ficar parado nela? Se sim, XP não
   pode vir do tempo — vem dos acertos.)
2. **Quantas perguntas cabem numa partida típica?** É o que define o XP real do
   modo, já que a base é por acerto.
3. **Tem pressão?** (timer, vidas, penalidade por erro) — é o que justifica
   fator acima de 1.
4. **`xpFactor`** — 0 a 1,25, e o porquê. Rush = 1,0 (é a régua), Revisão =
   0,8, Zen = 0.
5. **`scoreScale`** — os pontos são comparáveis aos do Rush? O recorde por modo
   aguenta (é separado), mas o `bestScore` global mistura modos e vira mentira.
6. **Entra na ofensiva? Gera moeda? Gera loot? Conta pro domínio?** (Zen não
   gera nada de propósito — D049. Mas Zen **deveria** contar pro domínio: é
   treino de verdade.)
7. **Dá pra farmar?** Descrever o caminho mais burro de abusar do modo e o que
   impede.

### 9.1 A dívida técnica que precisa morrer primeiro

O multiplicador de XP do modo existe **em dois lugares hoje**:

- `src/constants/index.js` → `MODES[x].xpMultiplier`
- `src/App.jsx`, em `handleGameEnd` → `const MODE_XP_MULT = { rush: 0.20, ... }`

E já houve uma **terceira** cópia (`ResultsPage.jsx`) que divergiu de verdade e
fez a tela mostrar um XP diferente do creditado — está anotado no comentário do
próprio `App.jsx`. Com 3 modos é feio; com 8, é bug garantido.

**Antes do primeiro modo novo:** `utils/xp.js → calcularXpDaPartida(result,
data)`, única fonte de verdade pro save, pra tela e pra qualquer simulação.

---

## 10. E os pontos? Ficam.

Respondendo o que ficou pendente da sessão 097: **não tirar.** Pontos são a
linguagem natural de um jogo de velocidade — "742 pontos" diz uma coisa que
"+43 XP" não diz. Eles só mudam de cargo: deixam de ser matéria-prima do XP e
ficam sendo desempenho (recorde, estatística, feedback, aposta, missões de
habilidade). Nada quebra, porque hoje nada além do XP consome pontos.

Missões de `type: 'score'` continuam existindo, mas viram **missões de
habilidade**; as de progressão passam a ser de XP.

---

## 11. Decisões que dependem só dele

| # | Decisão | Minha recomendação |
|---|---|---|
| 1 | Faixa = XP **E** domínio? | **Sim** (posição do ChatGPT, adotada) |
| 2 | Quem marca o ritmo dos 8–10 meses? | **O XP.** Domínio é piso, não cronômetro (seção 2.3) |
| 3 | Mexer na curva das faixas? | **Não.** Os 27.000 já entregam 8–10 meses com a taxa nova |
| 4 | Bônus de velocidade no XP? | **Não** (seção 4) |
| 5 | Bônus de recorde? | **Só por percentual e com teto** |
| 6 | Base por acerto em vez de fixa? | **Sim** |
| 7 | Teto diário (5 partidas a 100%, resto a 50%)? | **Sim**, número a calibrar |
| 8 | Perfil dos personagens | **2 números por personagem**, não 8 atributos |
| 9 | XP acumulado dos saves atuais | **Rebaixar junto com a taxa** — senão quem já tem XP velho pula faixas com a régua nova. É a única migração obrigatória de todo o plano |

> **Item 9 é o único risco real do plano.** Todo o resto é calibração; esse
> mexe em save de jogador. Fica pra decidir junto com a implementação, não
> agora.
