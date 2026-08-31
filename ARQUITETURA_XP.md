# ✨ ARQUITETURA_XP.md — Pontos, XP e progressão

> Resposta à proposta que o Davi escreveu (documento "Tabuada Rush —
> Arquitetura de Pontos, XP e Progressão", sessão 099). Isto aqui é a
> **análise crítica** dela + o que precisa ser decidido **antes** de qualquer
> modo novo entrar no jogo. Não é implementação: nada disso foi codado ainda.

---

## 1. Veredicto curto

**A separação está certa e eu faria.** Pontos ficam como desempenho, XP passa
a ser recompensa da atividade. Mas a proposta, do jeito que está escrita, tem
**um acerto grande, um estrago grande e dois bônus que eu cortaria.**

| | |
|---|---|
| ✅ **Acerta** | Conserta a liga, que hoje é trivial |
| ❌ **Quebra** | As faixas de tabuada ficam matematicamente inalcançáveis |
| ✂️ **Cortaria** | Bônus de velocidade e bônus de recorde (do jeito proposto) |

O resto do documento é a conta que sustenta isso.

---

## 2. O número que ninguém olhou: a deflação é de ~6×

Hoje (`App.jsx`, `handleGameEnd`):

```
XP = pontos × multiplicador do modo     (Rush = 0,20)
```

Uma partida boa de Rush faz ~1.250 pontos → **250 XP**.

Na proposta: 20 de base + combo + velocidade + recorde ≈ **38 a 43 XP**.

**Uma partida passa a valer ~1/6 do que vale hoje.** Isso não é detalhe de
balanceamento — é o eixo de tudo que está calibrado em XP. E há exatamente
dois consumidores de XP no jogo: a **liga** e as **faixas**. A deflação faz
coisas opostas nos dois.

### 2.1 Na liga, a deflação CONSERTA o jogo

Os personagens da liga são simulados assim (`utils/leagues.js`):

```
XP do personagem = 100/dia × janela de 14 dias × atividade(0,4–0,9) × multiplicador da liga
                   ↑ XP_DAILY_BASE
```

- Bronze (×0,7): **~390 a 880 XP** na janela
- Diamante (×2,2): **~1.230 a 2.770 XP** na janela

Ou seja: a liga foi calibrada assumindo que **um jogador moderado faz ~100 XP
por dia**. Hoje ele faz 250 XP **em uma única partida** — 2,5 dias de "jogador
moderado" por partida. Por isso ganhar a Bronze hoje custa 4 partidas: a
competição está quebrada a favor do jogador.

Com o modelo novo (~40 XP/partida, 2 partidas/dia = 80 XP/dia), o jogador
volta pra escala pra qual a liga foi desenhada. **Esse é o maior argumento a
favor da proposta, e ele não estava no documento.**

### 2.2 Nas faixas, a deflação DESTRÓI o jogo

A primeira faixa custa **27.000 XP** (`FIRST_TIER_XP`, decaindo 0,68 por faixa
até o piso de 300).

| Modelo | XP por partida | Partidas pra sair da Tabuada 2×10 |
|---|---|---|
| Hoje | ~250 | ~108 |
| Proposta | ~40 | **~675** |

675 partidas pra sair da primeira faixa é o jogo inteiro travado. Então:
**adotar a proposta obriga a mexer na curva das faixas.** Não é opcional.

---

## 3. A recomendação principal: tirar as faixas do XP

O próprio documento levanta isso na pergunta 24 — *"evitar que um usuário
consiga simplesmente farmar XP e desbloquear conteúdo sem realmente dominar as
tabuadas anteriores"*. A resposta honesta é: **enquanto a faixa for comprada
com XP, ela é farmável por definição.** Dá pra passar da Tabuada 2×10 sem
nunca ter acertado 7×8, contanto que se jogue bastante.

Proposta: **faixa deixa de ser XP e passa a ser domínio.**

O jogo **já mede** o que precisa pra isso — `factStats` guarda acertos, erros
e tempo médio por fato normalizado (7×8 e 8×7 são o mesmo fato), e o Mapa de
Domínio já mostra isso na tela. A regra vira algo como *"passa de faixa quem
tem ≥85% de acerto e tempo médio abaixo de X em ≥90% dos fatos da faixa"*.

Três problemas morrem de uma vez:

1. A conta impossível dos 27.000 XP (a faixa deixa de depender de XP).
2. O farm de conteúdo (a pergunta 24 dele).
3. **A migração dos saves.** Se as faixas saem do XP, o XP acumulado vira
   número só de liga — e a liga usa `xp − leagueXpBase`, ou seja, um **delta
   desde que entrou na divisão**. Isso se auto-corrige em um ciclo de 6 dias
   sozinho. Sem migração, sem rebase, sem ninguém perdendo faixa.

Com isso, o XP passa a ter **um consumidor só** (liga + missões) e pode ser
recalibrado livremente, agora e no futuro, sem quebrar progressão de conteúdo.

---

## 4. O que eu cortaria da proposta

### ✂️ Bônus de velocidade (seção 9 do documento dele)

Contradiz a seção 10 do próprio documento ("precisão deve ser mais importante
que velocidade") **e paga duas vezes pela mesma coisa**: no Rush cada acerto
devolve 3 segundos ao relógio (`bonusTime`), então responder rápido já rende
mais perguntas por partida — e mais perguntas já é mais XP. Somar um bônus
explícito por rapidez é pagar o mesmo comportamento duas vezes, e empurra o
jogador a chutar rápido em vez de pensar.

**Velocidade continua onde ela já funciona:** nos pontos, no recorde de tempo
médio (`fastestAvgMs`) e nas estatísticas.

### ✂️ Bônus de recorde (seções 11 e 12)

Dois problemas:

1. **É regressivo.** Iniciante bate recorde quase toda partida; veterano quase
   nunca. Paga mais quem menos precisa de progressão — e some justamente
   quando o jogador chega no platô, que é onde o incentivo faria falta.
2. **É farmável por baixo.** Bastaria jogar mal de propósito uma vez pra
   derrubar a referência e depois "bater o recorde" várias vezes seguidas.
   (Hoje não dá porque `bestScore` nunca desce — mas aí volta o problema 1.)

Se ele quiser manter o reconhecimento do recorde, que seja **missão**
("supere seu recorde" já está na lista dele de missões de habilidade) — aí a
recompensa é moeda, não XP, e não contamina a liga.

### ✅ Bônus de combo: esse eu mantenho

Combo é a única das três que mede **consistência dentro da partida**, que é o
comportamento que o jogo quer criar. Com a regra que ele mesmo escreveu (cada
marco paga uma vez por partida) não tem farm. Mantido.

---

## 5. A fórmula que eu proponho

```
XP DA PARTIDA = round( (BASE + BÔNUS) × fator do modo × fator do dia ) × poção
```

**BASE = acertos × 1 XP**, com piso de 5 pra qualquer partida terminada.

Por que por acerto e não fixo em 20: um valor fixo por partida é o convite
mais direto que existe pra farm — 10 partidas de 15 segundos abandonadas
valeriam mais que uma partida séria de 4 minutos. Base por acerto escala com o
tamanho real da partida sozinha, funciona igual em qualquer modo futuro e não
dá pra ganhar sem responder certo, que é a razão de existir do jogo.

**BÔNUS ≤ 50% da base** — teto duro, dividido entre todas as fontes (combo
hoje, o que vier amanhã). Assim, não importa quantos bônus sejam inventados no
futuro, **uma partida nunca passa de 1,5× o que ela vale pelos acertos**. É
esse teto que impede a inflação que ele teme na seção 31.

**Fator do modo** — declarado pelo modo, de 0 a 1,25 (seção 6 abaixo).

**Fator do dia (anti-farm)** — as primeiras 5 partidas do dia valem 100%; da
6ª em diante, 50%. Não é castigo: é o que impede alguém de subir de divisão
maratonando 40 partidas num sábado. O Duolingo faz isso na liga há anos.

**Poção multiplica no fim**, como ele escreveu — está certo, e é o que
incentiva usar a poção numa partida boa em vez de numa partida qualquer.

### Como fica na prática

| Partida | Hoje | Proposta |
|---|---|---|
| Rush fraco (12 acertos) | ~60 XP | 12 + combo ≈ **15 XP** |
| Rush bom (48 acertos, com combos) | ~250 XP | 48 + 24 ≈ **72 XP** |
| Rush bom com poção ×2 | ~500 XP | **~144 XP** |
| Revisão (15 questões) | ~40 XP | 15 × 0,8 ≈ **12 XP** |

Dois ou três Rush por dia = 100 a 200 XP/dia. É a escala da liga.

---

## 6. O que TODO modo novo precisa responder (antes de existir)

Ele pediu isso explicitamente: resolver a escala de XP e pontos **antes** de
criar modo novo. Então fica assim — **modo novo sem estas 7 respostas não
entra**:

1. **Duração típica de uma partida.** (Se der pra ficar parado nela, o XP não
   pode vir do tempo — vem dos acertos, como na fórmula acima.)
2. **Quantas perguntas cabem numa partida típica?** É o que define o XP real
   do modo, já que a base é por acerto.
3. **Tem pressão?** (timer, vidas, penalidade por erro) — é o que justifica
   fator acima de 1.
4. **`xpFactor`** — 0 a 1,25, e o porquê. Referência: Rush = 1,0 (é a régua),
   Revisão = 0,8, Zen = 0.
5. **`scoreScale`** — os pontos do modo são comparáveis aos do Rush? Se não, o
   recorde por modo aguenta (é separado), mas o `bestScore` global mistura
   modos e vira mentira. Decidir na hora, não depois.
6. **Entra na ofensiva? Gera moeda? Gera loot?** (Zen não gera nada de
   propósito — ver D049.)
7. **Dá pra farmar?** Descrever o caminho mais burro de abusar do modo e dizer
   o que impede.

### 6.1 Dívida técnica que precisa morrer antes disso

O multiplicador de XP do modo existe **em dois lugares hoje**:

- `src/constants/index.js` → `MODES[x].xpMultiplier`
- `src/App.jsx`, dentro de `handleGameEnd` → `const MODE_XP_MULT = { rush: 0.20, ... }`

E já houve uma **terceira** cópia (em `ResultsPage.jsx`), que divergiu de
verdade e fez a tela mostrar um XP diferente do XP creditado — está anotado no
próprio comentário do `App.jsx`.

Com 3 modos isso é feio. Com 8 modos é bug garantido. **Antes do primeiro modo
novo:** uma função só, `utils/xp.js → calcularXpDaPartida(result, data)`, que
lê o fator do próprio `MODES` e é a única fonte de verdade — pro save, pra
tela de resumo e pra qualquer simulação.

---

## 7. E os pontos? Ficam.

Respondendo a pergunta que ficou pendente desde a sessão 097 ("o que teríamos
que mudar se tirássemos os pontos"): **não tirar.** O documento dele chegou
sozinho na mesma conclusão, e ela está certa — pontos são a linguagem natural
de um jogo de velocidade, e são o que dá textura à partida ("742 pontos" diz
uma coisa que "+43 XP" não diz).

O que muda é só o **cargo** deles: pontos deixam de ser a matéria-prima do XP
e ficam sendo desempenho — recorde, estatística, feedback da partida, aposta e
missões de habilidade. Nada quebra, porque hoje nada além do XP consome pontos.

**Única mudança obrigatória:** as missões de `type: 'score'` ("faça 250
pontos") continuam podendo existir, mas viram **missões de habilidade**, não
de progressão — e as missões de progressão passam a ser de XP, como ele
propôs.

---

## 8. Decisões que dependem só dele

1. **Faixa sai do XP e passa a ser domínio?** (recomendo: sim — seção 3)
2. **Corta velocidade e recorde do XP?** (recomendo: sim — seção 4)
3. **Base por acerto em vez de base fixa de 20?** (recomendo: sim — seção 5)
4. **Teto diário: 5 partidas a 100% e o resto a 50%?** (número a calibrar)
5. **XP acumulado dos saves atuais:** se a faixa sair do XP, não precisa mexer.
   Se ele quiser manter faixa por XP, aí precisa dividir a curva por ~6 **e**
   rebaixar o XP guardado — decisão com risco, que eu evitaria.
