# ✨ ARQUITETURA_XP.md — Pontos, XP, Domínio e progressão

> **v4 (sessão 099).** Arquitetura **fechada**. O que sobrou é especificação de
> domínio e calibração.
>
> Histórico: **v1** tirava o XP das faixas · **v2** adotou `XP + Domínio`
> (via ChatGPT) pra sustentar os 8–10 meses · **v3** derrubou a condição de XP
> quando o Davi cancelou a meta de tempo · **v4** refina a definição de
> domínio com as correções do ChatGPT + dois furos achados no código.
>
> Nada aqui está implementado.

---

## 1. A arquitetura

| Camada | Pergunta | Manda em |
|---|---|---|
| ⭐ **Pontos** | Como eu joguei? | recorde, estatística, aposta, feedback |
| ✨ **XP** | Quanto eu progredi? | **liga**, missões, eventos, status |
| 🧠 **Domínio** | Eu aprendi? | **faixa de tabuada** |

```
PRÓXIMA FAIXA = Domínio suficiente
```

> **Conteúdo se abre com aprendizado. Competição se ganha com esforço.**

### ⚠️ Uma discordância que não existe

O ChatGPT apresentou como divergência uma "terceira opção": *faixa = domínio,
com XP como eixo de progressão geral (liga, missões, eventos, recompensas,
status)*.

**Isso é literalmente a proposta.** Não há decisão em aberto aqui — os dois
lados descreveram a mesma arquitetura com palavras diferentes. "Tirar o XP das
faixas" nunca significou diminuir o XP; significou que **o XP para de ser
pedágio de conteúdo** e fica com tudo o que sempre teve, mais o peso
competitivo inteiro.

A trava de esforço também não sumiu: ela **já estava dentro do domínio**. Os 54
fatos da faixa 1 só consolidam com centenas de acertos espalhados por dias
diferentes. A condição de XP só somava tempo em cima de uma barreira que já
existia.

---

## 2. Domínio: a especificação

Com a faixa apoiada só nisto, é aqui que está o jogo inteiro.

### 2.1 O que estamos tentando enxergar

Um fato **decorado** é recuperado da memória. Um fato **calculado** é montado
na hora (contar de 7 em 7, decompor). **Os dois terminam em acerto** — por isso
contar acertos não enxerga aprendizado.

O sinal que separa os dois é o **tempo de resposta**. Mas...

### 2.2 ✅ O ChatGPT está certo: nada de limite absoluto

Ele freou dois pontos meus, e nos dois ele tem razão:

- ❌ *"menos de 1,5 s = decorou"* — não serve como definição
- ❌ *"tempo mediano ≤ 2,0 s"* igual pra todo mundo e pra toda conta

Tempo depende de idade, leitura, aparelho, ansiedade, tamanho do número. Um
limite universal reprova criança lenta que sabe e aprova quem conta rápido nos
dedos.

**A saída não é abandonar a velocidade — é medi-la relativa ao próprio
jogador.**

> ### 🎯 Fluência relativa
>
> Um fato está fluente quando o jogador responde ele **tão rápido quanto os
> fatos que ele já sabe de cor** — não quando bate um número que veio de fora.
>
> ```
> base do jogador = mediana do tempo dos fatos que ele já tem em 🟢
>                   (no começo: os 5 fatos mais rápidos dele)
>
> fluente = tempo mediano do fato ≤ base × 1,4
> ```

Isso resolve **de uma vez** a lista inteira de objeções — idade, aparelho,
ansiedade, leitura, treino — porque todos esses fatores deslocam a base do
jogador igualmente. A criança lenta tem base lenta: o que se cobra dela é que
7×8 seja tão rápido quanto 2×3 **pra ela**. É exatamente o que fluência de
recuperação significa.

E resolve também o problema da dificuldade que o ChatGPT levantou (127×9 não é
3×2): a base sobe junto com a faixa, porque ela é recalculada com os fatos
verdes daquela faixa.

### 2.3 🐛 Furo nº 1: hoje o tempo medido inclui a digitação

`GamePage.jsx` grava `dt = Date.now() − questionShownAt` **no envio**. Ou seja,
o número que temos hoje é:

```
ler a pergunta + lembrar + DIGITAR + apertar Enter
```

O jogo não é múltipla escolha — a resposta é digitada. E as respostas têm de
**1 a 4 dígitos** (6 na faixa 1; 1143 numa faixa alta). **Qualquer critério de
velocidade em cima desse número pune resposta grande por ser grande**, não por
ser mal sabida.

**Correção:** gravar também o **tempo até a primeira tecla** (`firstKeyMs`).
Essa é a janela de decisão — lembrar ou calcular — sem o motor da digitação
dentro. É o número que o domínio deve usar; o `ms` atual continua servindo pra
estatística e pro recorde de velocidade.

É um campo novo no registro da questão e um `onKeyDown` no input. Barato, e
sem ele a fluência relativa mede metade digitação.

### 2.4 ✅ E o ChatGPT está certo de novo: nota composta, não 5 catracas

Minha v3 pedia cinco critérios simultâneos (AND). Ele apontou o furo: quem sabe
7×8 perfeitamente mas responde um pouco devagar nunca fica verde, por mais que
acerte.

**Domínio vira nota de 0 a 100:**

| Componente | Peso | O que mede |
|---|---|---|
| **Precisão** recente | 40% | acerta? |
| **Consistência** (dias distintos, sem recaída) | 25% | acerta sempre, não só hoje |
| **Fluência** (seção 2.2, relativa) | 20% | lembra ou calcula? |
| **Recência** (`predictRecallProbability`, já existe) | 15% | ainda lembra? |

- 🟢 **Dominado** — nota ≥ 80
- 🟡 **Em desenvolvimento** — 50 a 79
- 🔴 **Precisa praticar** — < 50

**Com uma catraca só, e ela é inegociável:** precisão recente **< 70% trava em
🔴**, não importa a nota composta. Sem esse piso, alguém rápido e constante
compensa erro com velocidade — que é exatamente o oposto do que o jogo ensina.

Assim a criança lenta que sabe fecha os 40+25+15 = 80 sem depender da fluência.
E quem conta nos dedos perde os 20 da fluência e boa parte da consistência —
fica em amarelo até virar memória, sem nunca ser chamado de errado.

### 2.5 🐛 Furo nº 2: o sorteio das perguntas virou parte da progressão

Este é o mais importante, e nenhum dos documentos tocou nele.

Hoje `getRandomQuestion` sorteia `a` **uniformemente** na faixa e `b`
uniformemente de 1 a 10. Fazia sentido quando a faixa era XP: o sorteio não
influía em nada.

**Agora o sorteio decide quando o jogador passa de faixa.** Com sorteio
uniforme:

- o jogador passa a maior parte do tempo revendo o que já sabe;
- os 2 ou 3 fatos teimosos aparecem na mesma frequência dos outros, então **a
  cauda difícil se arrasta sem fim** — e a cauda é justamente o que segura a
  faixa;
- só a Revisão ataca ponto fraco, e ela é um modo separado que o jogador pode
  simplesmente não abrir.

**Correção: sorteio ponderado pelo estado do fato** no modo principal — algo
como 🔴 peso 4, 🟡 peso 2, 🟢 peso 1. Continua caindo fato verde (é revisão
espaçada, não pode sumir), mas o jogo passa a levar o jogador ao que falta.

Efeito colateral bom: a "cauda difícil" deixa de ser o gargalo, porque ela
recebe 4× mais exposição justamente quando é o que resta.

**Sem isso, a faixa por domínio não funciona na prática** — o jogador ficaria
travado esperando o sorteio ter piedade dele.

### 2.6 Quando a faixa abre

**95% dos fatos em 🟢 e nenhum em 🔴.**

A folga de 5% impede travar em dois fatos teimosos; o "nenhum vermelho" impede
a folga virar buraco.

**Exigência por faixa, como o ChatGPT propôs** — e é a forma certa de o Davi
conseguir o que queria sem cronômetro:

| Faixa | Corte |
|---|---|
| **2×10** (infraestrutura de todas as outras) | mais alto — ex.: 95% verde, nota ≥ 85 |
| Intermediárias | 90% verde |
| Avançadas | adaptado ao tipo de conhecimento (lá a meta é fluência de estratégia, não memorização de 110 fatos) |

*"A primeira faixa exige consolidação excepcional"* — não *"a primeira faixa
dura 10 meses"*. É a mesma intenção sem o imposto de tempo.

### 2.7 Válvula de escape: Teste de Faixa

Chegando perto (≥85%), o jogo oferece uma rodada curta **montada só com os
fatos fracos**. Passar certifica os pendentes. Vira momento de conquista em vez
de parede — e é evidência honesta, são exatamente as contas que faltavam.

### 2.8 O que faz ficar

Sem cronômetro, permanência vem de **revisitar**, não de prender:

1. **Interleaving** — passou pra 10×20, uma fatia das perguntas continua vindo
   da 2×10. Não é castigo: 23×7 se resolve com 3×7.
2. **Fato verde pode voltar pra amarelo** (é a recência). Mas **faixa
   conquistada não se perde** — tirar faixa é punição que não ensina. O que
   apodrece reaparece no sorteio ponderado e na Revisão.

---

## 3. O que a arquitetura eliminou

1. **A migração de save perigosa** (era o único risco real do plano: rebaixar
   XP guardado faria gente pular faixa). Vira uma linha — seção 6.
   *O ChatGPT pediu pra não fechar esse assunto. Ele está fechado **enquanto** a
   faixa for domínio — que é o que ele mesmo propõe. Não é fragilidade, é
   dependência: se um dia a faixa voltar a depender de XP, o risco volta junto.*
2. **A calibração de XP por faixa** — `FIRST_TIER_XP`/`TIER_XP_DECAY` saem de
   cena.
3. **A fase de simular jogadores pra achar quanto tempo cada um leva.** Ela
   existia pra calibrar tempo, e tempo deixou de ser meta.

Sobra calibrar o XP da liga — e ali errar é barato: a liga roda em
`xp − leagueXpBase`, um delta que se corrige sozinho em um ciclo de 6 dias.

---

## 4. XP: a fórmula

```
XP DA PARTIDA = round( (BASE + BÔNUS) × fator do modo × fator do dia ) × poção
```

- **BASE = acertos × 1 XP**, piso de 5 por partida terminada. Base fixa por
  partida convida ao farm (10 partidas de 15 s abandonadas valeriam mais que
  uma partida séria de 4 minutos).
- **BÔNUS ≤ 50% da base** — teto duro dividido entre todas as fontes. Nenhuma
  partida passa de 1,5× o que vale pelos acertos, quantos bônus se invente.
- **Fator do modo** — 0 a 1,25. Rush = 1,0 (é a régua), Revisão = 0,8, Zen = 0.
- **Fator do dia** — ✅ *aceito o freio do ChatGPT*: entra como **knob
  desligado por padrão** (todas as partidas a 100%), com decaimento suave
  disponível (100 ×5, depois 90, 85, 80, 75...) se a liga der sinal de
  maratona. Vira dado, não dogma.
- **Poção multiplica no fim.**

| Bônus | Entra? | Por quê |
|---|---|---|
| **Combo** | ✅ | consistência dentro da partida; marco paga 1× por partida |
| **Velocidade** | ❌ | já paga pelo `bonusTime` do Rush. E o lugar dela é o domínio |
| **Recorde** | ⚠️ só percentual, com teto | regressivo. **Evento raro, não renda** (ChatGPT) |
| **Evento** | ✅ | modificador temporário — é aqui que uma "Semana da Velocidade" liga o bônus de velocidade sem virar estrutura |

---

## 5. Por que não dá pra farmar nenhum dos dois

```
jogar → acertar → mais XP (liga)
                → mais domínio (faixa)
```

Os dois comem acerto, mas cobram moedas diferentes: **XP aceita volume; domínio
exige constância, espaçamento e fluência.**

Quem joga muito e mal sobe na liga e **não** sai da faixa. Quem joga pouco e
bem sai da faixa e **não** sobe na liga.

---

## 6. O que muda no código

**`getLevelIdx(xp)` → `getFaixaIdx(data)`** em 11 lugares (`App.jsx` ×3,
`Header.jsx`, `CatalogPage.jsx`, `ModesPage.jsx`, `PerfilPage.jsx`,
`SettingsPage.jsx`, `utils/index.js` ×3). Em todos, a pergunta real já é "em
que faixa o jogador está".

**Migração de uma linha:** na primeira abertura, `faixaIdx = getLevelIdx(xp)`.
Todo mundo fica exatamente na faixa em que está hoje; dali em diante a
progressão é por domínio. Ninguém perde nada.

**Novo:**
- `firstKeyMs` no registro da questão (seção 2.3) — sem isso a fluência mede
  digitação
- `utils/dominio.js` — nota composta por fato, base do jogador, estado da faixa
- peso no sorteio de `getRandomQuestion` (seção 2.5)
- `utils/xp.js` — fonte única do XP (seção 9.1)

---

## 7. Interface

**Regra:** barra é pra coisa que **destrava** algo. XP não destrava mais nada
→ vira número. Domínio destrava a faixa → vira barra.

Concordo com o meio-termo do ChatGPT: o **XP continua no Header** como número
(ao lado de moedas e vidas, é identidade do jogo e é o placar da liga), e a
**barra** passa a ser o domínio da faixa atual.

```
📚 Tabuada 2×10
Domínio     ███████████████░░░░░   84%

Estas ainda pedem prática:
🔴 7 × 8      🟡 6 × 7      🟡 8 × 9
```

Sem percentual exigido na tela, sem "acerte 7×8 mais 4 vezes" — mas o jogador
**sempre sabe o que está segurando**. Quem não avança nunca fica sem saber por
quê.

---

## 8. Ligas: personagens com personalidade

**Metade já está construída** (`utils/leagues.js`): cada personagem já tem
atividade própria (0,4–0,9), já varia ±30% a cada 12h, e a liga já tem
multiplicador (0,7 Bronze → 2,2 Diamante).

Faltam **duas correções**, não um sistema novo:

1. **Ritmo por identidade** — hoje vem de um *hash do nome*, então o Einstein
   pode calhar de ser mais preguiçoso que o Patrick Estrela. Vira dois números
   escritos à mão nos 114 (`ritmo`, `constancia`).
2. **Variância por personagem** — hoje é ±30% pra todo mundo. Einstein: ritmo
   alto, constância alta. Peter Parker: ritmo médio, constância baixa.
   **É a constância baixa dos OUTROS que produz o "caraca, o Einstein está em
   terceiro"** — não a variação do Einstein.

**Não simular o que não aparece:** a liga consome uma saída, um número de XP.
Dar precisão/velocidade/combo a cada personagem é trabalho invisível e
superfície pra bug. Dois números entregam 100% do efeito.

**QI define o ritmo** (é a ficção do jogo inteiro), **nunca a constância**. São
eixos independentes — é o que permite o gênio distraído perder pro esforçado
num dia ruim.

---

## 9. O que TODO modo novo precisa responder

1. Duração típica de uma partida (dá pra ficar parado? então XP não vem do
   tempo)
2. Quantas perguntas cabem numa partida típica
3. Tem pressão? (timer, vidas, penalidade)
4. **`xpFactor`** — 0 a 1,25, e o porquê
5. **`scoreScale`** — os pontos são comparáveis aos do Rush?
6. ⚠️ **Conta pro domínio?** — a mais importante das sete, porque decide se o
   modo abre conteúdo. Modo com pergunta fácil demais ou tempo folgado demais
   inflaria o domínio. **Zen deveria contar** (é treino de verdade, mesmo sem
   XP e sem moeda). E **se conta pro domínio, precisa medir `firstKeyMs`.**
7. Dá pra farmar? — agora em duas moedas: XP (liga) e domínio (faixa)

### 9.1 Dívida que morre antes do primeiro modo novo

O multiplicador de XP existe em **dois lugares** (`MODES[x].xpMultiplier` e
`const MODE_XP_MULT` dentro de `handleGameEnd`), e já houve uma **terceira**
cópia que divergiu de verdade e fez a tela mostrar XP diferente do creditado.
→ `utils/xp.js`, fonte única.

---

## 10. Pontos: ficam

Linguagem natural de um jogo de velocidade — "742 pontos" diz o que "+43 XP"
não diz. Mudam de cargo: desempenho (recorde, estatística, feedback, aposta,
missões de habilidade), não matéria-prima do XP. Nada quebra, porque hoje nada
além do XP consome pontos.

---

## 11. Decisões

### ✅ Fechado

Pontos = desempenho · XP = progressão (liga, missões, eventos, status) ·
Domínio = aprendizado · **Faixa = domínio** · velocidade sai do XP e vira
critério de domínio · combo continua no XP · base de XP por acerto com teto de
bônus · **domínio como nota composta com piso duro de precisão** · **fluência
relativa ao jogador, sem limite universal** · personagens com ritmo +
constância · QI define ritmo, não constância · pontos ficam.

### 🔧 Precisa ser construído (não é calibração — é peça faltando)

1. **`firstKeyMs`** — sem isso a fluência mede digitação (seção 2.3)
2. **Sorteio ponderado por estado do fato** — sem isso a faixa por domínio
   trava na cauda (seção 2.5)
3. **`utils/dominio.js`** e **`utils/xp.js`**

### ⚠️ A calibrar (risco baixo — nada disso trava conteúdo)

Os 4 pesos da nota · o multiplicador da fluência (1,4) · o piso de precisão
(70%) · os cortes por faixa · o gatilho do Teste de Faixa · a fatia de
interleaving · XP por modo, combo, recorde · ritmo e constância dos 114
personagens.

### ❓ Pro Davi

1. **Teste de Faixa** (2.7) — mecânica nova. Faz agora ou fica pra depois?
2. **Interleaving** (2.8) — que fatia das perguntas vem das faixas antigas?
3. **Header** (7) — XP vira número e a barra vira domínio. Confirma?
