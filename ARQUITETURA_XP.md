# ✨ ARQUITETURA_XP.md — Pontos, XP, Domínio e progressão

> **v3 (sessão 099).** O Davi tirou a meta de "8 a 10 meses na faixa 1":
> *"cada usuário tem seu tempo (...) se ele aprendeu, ele aprendeu, já era.
> Outros vão chegar já sabendo essa primeira faixa."*
>
> Isso não é um ajuste — é a decisão que fecha a arquitetura. Documento
> reescrito. Histórico: **v1** tirava o XP das faixas; **v2** adotou
> `XP + Domínio` (contraproposta via ChatGPT) pra segurar os 8–10 meses;
> **v3** derruba a condição de XP, porque a meta que ela existia pra sustentar
> deixou de existir.
>
> Nada aqui está implementado.

---

## 1. A arquitetura fechada

| Camada | Pergunta que responde | Serve pra |
|---|---|---|
| ⭐ **Pontos** | Como eu fui nesta partida? | recorde, estatística, aposta, feedback |
| ✨ **XP** | Quanto eu me esforcei? | **liga** + missões de progressão |
| 🧠 **Domínio** | Eu realmente aprendi? | **faixa de tabuada** |
| 🏆 **Liga** | Como estou em relação aos outros? | competição |

```
PRÓXIMA FAIXA = Domínio suficiente
```

**A condição de XP na faixa caiu.** Não por gosto: ela era o cronômetro dos
8–10 meses, e o cronômetro foi cancelado. Sem meta de tempo, qualquer número
de XP exigido vira **imposto de tempo cobrado de quem já provou que aprendeu**
— e o Davi foi explícito que existe gente chegando já sabendo a 2×10.

### Isso não deixa o XP vago

Ele fica com a **liga inteira** — 114 personagens, 8 divisões, promoção,
rebaixamento, zona de rebaixamento com penalidades, pódio — mais as missões de
progressão. É o maior sistema do jogo.

A divisão de trabalho vira uma frase:

> **Conteúdo se abre com aprendizado. Competição se ganha com esforço.**
>
> Domínio mede aprendizado. XP mede esforço. Cada um tem o seu reino, e
> nenhum dos dois compra o do outro.

### E o XP já estava embutido no domínio

Essa é a razão técnica de a condição de XP ser dispensável, e não só
inconveniente: **domínio já exige volume de jogo.** Pela regra da seção 2, os
54 fatos da faixa 1 só ficam verdes com **~430 acertos no mínimo, espalhados
por vários dias diferentes**. Ninguém chega lá farmando uma tarde. A trava de
esforço já está dentro da trava de aprendizado — a de XP só somava tempo.

---

## 2. O coração do sistema: o que conta como "decorou"

Com a faixa apoiada só no domínio, **toda a arquitetura passa a depender desta
definição**. É aqui que o trabalho vai.

### 2.1 O critério que separa decorar de calcular

Um fato **decorado** é recuperado da memória. Um fato **calculado** é montado
na hora (contar de 7 em 7, somar, decompor). Os dois terminam em acerto — e é
por isso que contar acertos não enxerga aprendizado.

O que separa os dois é observável e o jogo já mede: **o tempo de resposta.**

| | Recuperação (decorou) | Cálculo (ainda não) |
|---|---|---|
| Tempo típico | **< 1,5 s** | 3 a 6 s |
| Varia com o tamanho do número? | não | sim (7×9 demora mais que 2×3) |

> **A ironia que fecha o desenho:** eu tirei a velocidade do XP (seção 5) e ela
> reaparece aqui como critério central. É coerente — **velocidade não deve
> comprar progresso, ela deve provar aprendizado.** No XP ela era paga duas
> vezes; no domínio ela é a única evidência confiável de que o fato virou
> memória.

### 2.2 A regra proposta

Um fato fica 🟢 **dominado** quando, ao mesmo tempo:

| Critério | Valor inicial | Por que |
|---|---|---|
| Acertos | **≥ 8** | amostra mínima |
| Precisão recente (últimas 10) | **≥ 90%** | tolera um escorregão, não tolera hábito |
| Tempo mediano | **≤ 2,0 s** | separa recuperação de cálculo (mediana, não média — um travamento não estraga) |
| Dias distintos | **≥ 4** | 10 acertos numa tarde não é memória, é sessão |
| Recência | recall previsto **≥ 80%** | usa `predictRecallProbability`, que já existe |

Estados intermediários, alimentando o Mapa de Domínio que já está na tela:

- 🔴 **Precisa praticar** — precisão recente < 70%, ou nunca visto
- 🟡 **Em desenvolvimento** — acerta, mas devagar ou sem constância
- 🟢 **Dominado** — os cinco critérios acima

**Um fato verde pode voltar pra amarelo** se apodrecer (é o critério de
recência). Mas **faixa conquistada não se perde** — tirar faixa de alguém é
punição que não ensina. O que acontece com o apodrecimento é a seção 2.4.

### 2.3 Quando a faixa abre

**95% dos fatos em 🟢 e nenhum em 🔴.**

Os 5% de folga existem por um motivo prático: um gate de "100% verde" trava o
jogador em dois fatos teimosos por tempo indeterminado, e aí o sistema deixa
de ensinar e passa a irritar. A cláusula "nenhum vermelho" é o que impede a
folga de virar buraco — dá pra ter 2 ou 3 fatos amarelos pendentes, nunca um
que você erra sempre.

**Válvula de escape — Teste de Faixa.** Quando o jogador chega perto (≥85%
verde), o jogo oferece uma rodada curta **montada só com os fatos fracos
dele**. Passar certifica os pendentes de uma vez. Vira um momento ("consegui!")
em vez de uma parede, e é evidência honesta: são exatamente as contas que
faltavam.

### 2.4 O que faz o aprendizado ficar

Sem cronômetro de faixa, a permanência não vem de prender o jogador — vem de
**revisitar**. Duas coisas resolvem:

1. **Interleaving.** Passou pra faixa 10×20? Uma fatia das perguntas continua
   vindo da 2×10. Não é castigo: 23×7 se resolve com 3×7, então a faixa antiga
   é insumo da nova, não passado.
2. **A Revisão já faz isso.** `getRevisionQuestions` monta partida com o que o
   jogador mais erra, e `countFactsAtRiskAllOps` já sabe listar o que está
   apodrecendo. Só falta ligar no aviso.

Assim o Davi consegue o que queria de verdade — *"preciso que ele decore o 2 ao
10"* — sem confinar ninguém: **quem aprendeu segue em frente e continua
revisando; quem não aprendeu não passa.**

### 2.5 Quanto tempo isso dá na prática

Não é mais meta, é consequência — mas serve pra saber se a regra é sensata:

| Jogador | Tempo estimado na faixa 2×10 |
|---|---|
| **Já sabe a tabuada** (chega pronto) | **~1 semana** — o piso é cobrir os 54 fatos e o mínimo de 4 dias distintos |
| **Aprendendo, joga 2×/dia** | ~1,5 a 3 meses |
| **Aprendendo, com dificuldade real** | 4 a 8 meses, e a cauda difícil manda no ritmo |

**O piso de ~1 semana é a prova de que a regra respeita a decisão dele.** No
modelo v2 esse mesmo jogador levaria 10 meses pra provar algo que ele já sabia
no primeiro dia.

---

## 3. O que isso mata (a boa notícia)

Três problemas grandes deixam de existir junto com a condição de XP:

1. **A migração de save perigosa.** Era o item 9 da v2 e o único risco real do
   plano: se a taxa de XP cai 6×, quem já tem XP velho pula faixas com a régua
   nova. **Sem faixa por XP, não existe pulo de faixa.** A migração vira uma
   linha (seção 6).
2. **A calibração dos 27.000 XP.** Não precisa mais existir número de XP por
   faixa. A curva `FIRST_TIER_XP`/`TIER_XP_DECAY` sai de cena.
3. **A fase de "colocar números" inteira** que o ChatGPT propôs como próximo
   passo (simular jogador casual/normal/engajado pra achar quanto tempo cada
   um leva). Ela existia pra calibrar tempo, e tempo deixou de ser meta.

**O que sobra pra calibrar é só o XP da liga** — e ali errar é barato: a liga
usa `xp − leagueXpBase`, um **delta desde que entrou na divisão**, que se
corrige sozinho em um ciclo de 6 dias. Dá pra ajustar em produção sem quebrar
nada de ninguém.

---

## 4. XP: a fórmula (agora só pra liga e missões)

```
XP DA PARTIDA = round( (BASE + BÔNUS) × fator do modo × fator do dia ) × poção
```

- **BASE = acertos × 1 XP**, piso de 5 pra partida terminada. Base fixa por
  partida (os "20" da proposta original) é convite a farm: 10 partidas de 15
  segundos valeriam mais que uma partida séria de 4 minutos.
- **BÔNUS ≤ 50% da base** — teto duro dividido entre todas as fontes. Nenhuma
  partida passa de 1,5× o que vale pelos acertos, não importa quantos bônus
  sejam criados depois.
- **Fator do modo** — 0 a 1,25 (seção 7). Rush = 1,0, Revisão = 0,8, Zen = 0.
- **Fator do dia** — anti-maratona. **Concordo com a ressalva do ChatGPT:**
  cair de 100% pra 50% na 6ª partida pune o jogador engajado de forma visível
  e grosseira. Melhor **decaimento suave** (100, 100, 100, 100, 100, 90, 85,
  80, 75...) — mesma proteção, sem a sensação de tapa na mão.
- **Poção multiplica no fim.**

### Bônus: o que entra

| Bônus | Entra? | Por quê |
|---|---|---|
| **Combo** | ✅ sim | mede consistência dentro da partida; com marco pagando uma vez por partida, não farma |
| **Velocidade** | ❌ não | já é paga pelo `bonusTime` do Rush (rápido → mais tempo → mais perguntas → mais XP). E o lugar dela agora é o domínio (seção 2.1) |
| **Recorde** | ⚠️ só por percentual e com teto | regressivo (paga o iniciante, some no platô). E **concordo com o ChatGPT**: tem que ser evento raro, não renda |
| **Evento** | ✅ sim | modificador temporário. É aqui que uma "Semana da Velocidade" pode ligar o bônus de velocidade sem ele virar regra estrutural — boa ideia do ChatGPT |

---

## 5. Domínio e XP não são independentes (e tudo bem)

Vale registrar pra ninguém achar que são dois mundos separados:

```
jogar → acertar → mais XP  (liga)
                → mais domínio  (faixa)
```

Acertar alimenta os dois. A diferença é **o que cada um aceita como pagamento**:
o XP aceita volume; o domínio exige velocidade, constância e espaçamento.

Por isso não dá pra farmar conteúdo: quem joga muito e mal sobe na liga e
**não** sai da faixa. Quem joga pouco e bem sai da faixa e **não** sobe na
liga. Cada sistema cobra a moeda dele.

---

## 6. O que muda no código

`getLevelIdx(xp)` é usado em **11 lugares**, e em todos eles a pergunta real é
"em que faixa o jogador está" — nunca "quanto XP ele tem":

`App.jsx` (×3) · `Header.jsx` · `CatalogPage.jsx` · `ModesPage.jsx` ·
`PerfilPage.jsx` · `SettingsPage.jsx` · `utils/index.js` (`getTierRange`,
`detectProgressEvents`, conquistas)

**A troca é mecânica:** nasce `getFaixaIdx(data)` lendo um campo novo
`data.faixaIdx`, e os 11 pontos passam a chamar ela.

**A migração é uma linha e não perde nada:** na primeira abertura,
`faixaIdx = getLevelIdx(xp)`. Todo mundo continua exatamente na faixa em que
está hoje; a partir dali a progressão passa a ser por domínio. Sem rebase de
XP, sem ninguém perdendo faixa — o oposto do risco que a v2 carregava.

**Some:** a barra de XP do Header como medidor de faixa (vira barra de
**domínio da faixa atual**, que é mais útil e empurra o jogador pras
estatísticas, que era o desejo dele). O XP continua visível como número da
liga.

---

## 7. Interface: esconder a fórmula, nunca esconder o motivo

Com uma trava só, isso fica mais simples que na v2 — mas o princípio continua:

```
📚 Tabuada 2×10

Domínio     ███████████████░░░░░   84%

Estas ainda pedem prática:
🔴 7 × 8      🟡 6 × 7      🟡 8 × 9
```

Sem percentual exigido na tela, sem "acerte 7×8 mais 4 vezes". Mas o jogador
**sempre sabe o que está segurando** — e a lista de fatos vira o caminho, não
a parede. Um jogador que não avança nunca fica sem saber por quê.

---

## 8. Ligas: personagens com personalidade

O Davi quer que a liga pare de parecer planilha. **Metade já está construída**
(`utils/leagues.js`):

| Já existe | Falta |
|---|---|
| Atividade própria por personagem (0,4–0,9) | Ela vem de um **hash do nome**, não da identidade — o Einstein pode calhar de ser mais preguiçoso que o Patrick Estrela |
| Variação de ±30% a cada 12h | A variação é **igual pra todo mundo** — ninguém é regular, ninguém é imprevisível |
| Multiplicador por liga (0,7 Bronze → 2,2 Diamante) | — |

Não é sistema novo, são **duas correções**:

1. **Ritmo por identidade** — dois números escritos à mão nos 114 personagens
   (`ritmo`, `constancia`), substituindo o hash.
2. **Variância por personagem** — Einstein: ritmo alto, constância alta (quase
   sempre no pódio). Peter Parker: ritmo médio, constância baixa (uma vez por
   mês tem um dia absurdo e passa por cima). **É a constância baixa dos OUTROS
   que produz o "caraca, o Einstein está em terceiro"** — não a variação do
   próprio Einstein.

**Não simular o que não aparece.** A liga consome exatamente uma saída: um
número de XP. Dar precisão, velocidade e combo a cada personagem é trabalho que
ninguém vê na tela e superfície a mais pra bug. Dois números entregam 100% do
efeito visível; se um dia existir ficha de personagem, aí os atributos passam a
aparecer e valem a pena.

**QI:** usar como eixo do **ritmo** (a média) — é a ficção do jogo inteiro e é
o que faz o pódio da Diamante fazer sentido. Nunca como eixo da **constância**.
São independentes: é isso que permite o gênio distraído perder pro esforçado
num dia ruim.

---

## 9. O que TODO modo novo precisa responder

**Modo novo sem estas 7 respostas não entra:**

1. **Duração típica de uma partida.** (Dá pra ficar parado nela? Então XP não
   vem do tempo — vem dos acertos.)
2. **Quantas perguntas cabem numa partida típica?**
3. **Tem pressão?** (timer, vidas, penalidade por erro) — é o que justifica
   fator acima de 1.
4. **`xpFactor`** — 0 a 1,25, e o porquê. Rush = 1,0 (é a régua).
5. **`scoreScale`** — os pontos são comparáveis aos do Rush? O recorde por modo
   aguenta (é separado), mas o `bestScore` global mistura modos.
6. **Conta pro domínio?** ⚠️ **Pergunta nova e agora a mais importante das
   sete** — é ela que decide se o modo abre conteúdo. Um modo com pergunta
   fácil demais ou tempo folgado demais inflaria o domínio e destravaria faixa
   sem aprendizado. **Zen deveria contar** (é treino de verdade, mesmo sem XP e
   sem moeda).
7. **Dá pra farmar?** Descrever o caminho mais burro de abusar do modo e o que
   impede — agora em duas moedas: farmar XP (liga) e farmar domínio (faixa).

### 9.1 Dívida técnica que morre antes do primeiro modo novo

O multiplicador de XP existe **em dois lugares**: `MODES[x].xpMultiplier`
(`constants/index.js`) e `const MODE_XP_MULT` dentro de `handleGameEnd`
(`App.jsx`). Já houve uma **terceira** cópia (`ResultsPage.jsx`) que divergiu
de verdade e fez a tela mostrar um XP diferente do creditado.

**Antes de qualquer modo novo:** `utils/xp.js → calcularXpDaPartida(result,
data)`, fonte única pro save, pra tela e pra simulação.

---

## 10. Pontos: ficam

Pontos são a linguagem natural de um jogo de velocidade — "742 pontos" diz uma
coisa que "+43 XP" não diz. Mudam só de cargo: deixam de ser matéria-prima do
XP e ficam sendo desempenho (recorde, estatística, feedback, aposta, missões de
habilidade). Nada quebra, porque hoje nada além do XP consome pontos.

---

## 11. Decisões

### ✅ Fechado

| | |
|---|---|
| Pontos = desempenho, XP = esforço, Domínio = aprendizado | |
| **Faixa = domínio** (sem condição de XP) | v3 |
| XP = liga + missões de progressão | |
| Velocidade sai do XP e vira critério de domínio | |
| Combo continua como bônus de XP | |
| Base de XP por acerto, bônus com teto de 50% | |
| Personagens com ritmo + constância; QI define ritmo, não constância | |
| Poções multiplicam no fim; eventos podem modificar tudo | |

### ⚠️ A calibrar (risco baixo — nada disso trava conteúdo)

- Os cinco limiares de domínio da seção 2.2 (**o único que exige cuidado de
  verdade é o tempo de 2,0 s** — muito apertado trava criança lenta que
  aprendeu; muito frouxo deixa passar quem conta nos dedos)
- Corte de abertura da faixa (95% verde / nenhum vermelho) e o gatilho do Teste
  de Faixa
- Curva do decaimento diário de XP
- XP por modo, tabela de combo, teto de bônus, recorde
- Ritmo e constância dos 114 personagens

### ❓ Em aberto pro Davi

1. **Teste de Faixa** (seção 2.3) — mecânica nova. Faz? Fica pra depois?
2. **Interleaving** (seção 2.4) — que fatia das perguntas vem das faixas
   antigas?
3. **A barra do Header** vira domínio da faixa atual — confirma?
