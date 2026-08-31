# ✨ ARQUITETURA_XP.md — Pontos, XP, Domínio e progressão

> **v7 (sessão 099). CONSENSO FECHADO.** Arquitetura conceitual aprovada dos
> dois lados. Esta versão fecha o **último item aberto** — o formato e a
> retenção do histórico, desenhados a partir das consultas — e traz a
> **simulação de 5.000 ciclos** que verifica a variância dos personagens em
> vez de confiar na fórmula.
>
> Histórico: **v1** tirava o XP das faixas · **v2** `XP + Domínio` pra
> sustentar os 8–10 meses · **v3** derrubou a condição de XP quando o Davi
> cancelou a meta de tempo · **v4** nota composta + fluência relativa + 2 furos
> achados no código · **v5** fecha os últimos pontos em aberto (base da
> fluência, interleaving, Teste de Faixa, papel da Revisão) e consolida a
> Tabela-Mãe · **v6** resolve os cinco últimos · **v7** fecha o histórico e
> verifica a liga por simulação.
>
> Nada aqui está implementado.

---

## 1. A estrutura

| Camada | Pergunta | Manda em |
|---|---|---|
| ⭐ **Pontos** | Como eu joguei? | recorde, estatística, aposta, feedback |
| ✨ **XP** | Quanto eu progredi? | **liga**, missões, eventos, status |
| 🧠 **Domínio** | Eu aprendi? | **faixa de tabuada** |

```
PRÓXIMA FAIXA = Domínio suficiente
```

> **Conteúdo se abre com aprendizado. Competição se ganha com esforço.**

O conflito que a discussão inteira estava tentando resolver, resolvido:
**o XP continua importante sem ser responsável por provar que o jogador
aprendeu.** Ele não perde nada — perde só o cargo de pedágio de conteúdo.

### 🥇 Regra de ouro

> **O sistema nunca cria uma barreira sem oferecer um caminho claro pra
> superá-la.**

Não domina → o jogo **mostra mais** o fato (sorteio ponderado, 2.5).
Continua não dominando → o jogo **muda de estratégia** (Plano de Resgate, 2.7).
Segue travado → os dados apontam o problema (Fase 1, seção 4).

É essa regra que impede o domínio de virar parede invisível. Toda decisão
daqui pra frente é medida contra ela.

---

## 2. Domínio: a especificação

### 2.1 A nota

| Componente | Peso | O que mede |
|---|---|---|
| **Precisão** recente (últimas 10) | 40% | acerta? |
| **Consistência** (dias distintos, sem recaída) | 25% | acerta sempre, não só hoje? |
| **Fluência** (2.2) | 20% | lembra ou calcula? |
| **Recência** (`predictRecallProbability`, já existe) | 15% | ainda lembra? |

🟢 **Dominado** ≥ 80 · 🟡 **Em desenvolvimento** 50–79 · 🔴 **Precisa
praticar** < 50

**Catraca única e inegociável:** precisão recente **< 70% trava em 🔴**,
qualquer que seja a nota. Sem ela, velocidade compensaria erro — o oposto do
que o jogo ensina.

### 2.2 Fluência é relativa ao próprio jogador

Nada de limite universal ("≤2,0 s"): ele reprova criança lenta que sabe e
aprova quem conta rápido nos dedos.

> **Um fato está fluente quando o jogador responde ele tão rápido quanto os
> fatos que ele já sabe de cor.**

Idade, aparelho, ansiedade, leitura e dificuldade do número deslocam **a base
junto com o fato**, então saem da conta sozinhos.

#### ✅ A objeção das estratégias rápidas — resolvida pela própria base

*Objeção:* uma criança pode desenvolver estratégia mental rápida (9×n = 10n−n,
7×8 = 7×4+7×4) sem ter "decorado" o fato isolado. O tempo, sozinho, não prova
memorização.

**Correto — e a base relativa já resolve, sem precisar afrouxar nada.** Ela não
pergunta *qual processo* o jogador usa; pergunta se **este fato** sai tão rápido
quanto **os fatos mais rápidos dele**. Duas consequências:

- Criança que usa estratégia pra tudo tem base de estratégia. Se ela é
  consistentemente rápida em tudo, ela **é** fluente — e o sistema aprova, o
  que está certo.
- Estratégia que só funciona pra alguns casos (o truque do 9) deixa 7×8
  visivelmente mais lento **que a base dela mesma** — e o sistema segura
  exatamente o fato que não consolidou. Também está certo.

O critério é **agnóstico ao processo mental por construção**. O jogo nunca
afirma saber o que se passa na cabeça de ninguém: ele mede comportamento.

#### Terminologia

Adotado: o nome interno é **fluência**, não "decorado" — é o que de fato se
mede. Objetivo pedagógico = **fluência factual**, não memorização mecânica.
Pro jogador continua a linguagem simples ("Você está dominando esta tabuada").

### 2.3 ✅ O problema da base — resolvido

O ChatGPT levantou e deixou em aberto: *"se os primeiros fatos verdes forem
acidentalmente rápidos, a base fica apertada; se forem lentos, fica
permissiva"*. E tem um problema anterior a esse: **no primeiro dia não existe
nenhum fato verde** — a definição se morde (precisa de verde pra medir
fluência, precisa de fluência pra ficar verde).

Três regras resolvem os três casos:

**1. A base não vem dos verdes, vem do quartil rápido.**

```
base = percentil 25 dos tempos medianos dos fatos com ≥5 respostas
```

O quarto mais rápido do jogador é, quase por definição, o que ele já tem de
cor. Funciona desde o primeiro dia, não depende de ninguém já estar verde e é
robusto a um travamento isolado (é percentil, não média).

```
fluente = tempo mediano do fato ≤ base × 1,4
```

**2. Período de estabilização** — enquanto o jogador tiver **menos de 15 fatos
com ≥5 respostas**, a amostra é pequena demais pra confiar na base. Nesse
período a fluência **não pontua**, e os 20 pontos vão pra precisão:

| | Precisão | Consistência | Fluência | Recência |
|---|---|---|---|---|
| Estabilizando (<15 fatos) | **60%** | 25% | — | 15% |
| Normal | 40% | 25% | 20% | 15% |

**3. Fluência é latch (trava pra cima).** Uma vez que o fato passou no teste,
passou. Motivo: a base **desce** conforme o jogador melhora — sem o latch, um
jogador que ficou mais rápido veria fatos já dominados voltarem pra amarelo
**por ter melhorado**, o que é absurdo.

> ⚠️ **O latch é do COMPONENTE, nunca da nota.** Só os 20 pontos de fluência
> ficam travados. Precisão, consistência e recência continuam vivas e podem
> derrubar o fato de 🟢 pra 🟡 a qualquer momento — esquecer é trabalho da
> recência, e é o mecanismo honesto pra isso. **Fluência conquistada não é
> invalidada porque a referência mudou; conhecimento pode enfraquecer com o
> tempo.** As duas coisas convivem.

### 2.4 🐛 O tempo medido hoje inclui a digitação

`GamePage.jsx` grava `dt = agora − questionShownAt` **no envio**, e o jogo é de
resposta digitada, com respostas de **1 a 4 dígitos**. O número atual é
*ler + lembrar + digitar + Enter* — qualquer critério de velocidade em cima
dele pune resposta grande por ser grande.

**`firstKeyMs`** (tempo até a primeira tecla) isola a janela de decisão. Divisão
de trabalho:

- `firstKeyMs` → **domínio / fluência**
- tempo total (`ms`, o de hoje) → **estatística / recorde de velocidade**

### 2.5 🐛 O sorteio virou parte da progressão

Hoje `getRandomQuestion` sorteia uniformemente. Fazia sentido quando a faixa
era XP; **agora o sorteio decide quando o jogador passa**. Uniforme, os 2–3
fatos teimosos aparecem tanto quanto os outros e a cauda difícil se arrasta —
e a cauda é justamente o que segura a faixa.

**Peso por estado:** 🔴 4 · 🟡 2 · 🟢 1

Verde continua caindo (peso 1) — revisão espaçada não pode sumir. O loop se
fecha sozinho: fato difícil aparece mais → jogador pratica → domínio sobe →
peso cai → outro fato assume a prioridade.

### 2.6 ✅ Interleaving — sem porcentagem fixa

O ChatGPT tem razão que "20% sempre vem do passado" é burro. Mas a solução não
precisa de sistema novo: **basta o pool incluir as faixas anteriores e deixar o
peso da 2.5 trabalhar.**

Um fato antigo dominado tem peso 1 (aparece pouco). Se apodrecer, cai pra 🟡 e
**pula pra peso 2 sozinho** — volta a aparecer exatamente quando precisa. É o
comportamento "situacional" que ele pediu, com zero parâmetro novo.

Só falta impedir que o passado engula o presente (na faixa 5 o pool antigo é
maior que o atual). Um sorteio em dois passos resolve:

```
p(faixa anterior) = 10% + 20% × (fração de fatos verdes na faixa atual)
                    (piso de 25% se existir qualquer fato antigo em 🔴)
```

- Começo de faixa nova → **10%** do passado: o foco é o conteúdo novo.
- Faixa quase dominada → **30%**: consolida o antigo antes de seguir.
- Coisa antiga apodrecendo → **≥25%** já, sem esperar.

### 2.7 Quando a faixa abre

**95% dos fatos em 🟢 e nenhum em 🔴.** A folga impede travar em dois fatos
teimosos; o "nenhum vermelho" impede a folga virar buraco.

| Faixa | Corte |
|---|---|
| **2×10** — infraestrutura de todas as outras | mais alto (ex.: 95% verde, nota ≥85) |
| Intermediárias | 90% verde |
| Avançadas | adaptado — lá a meta é fluência de estratégia, não decorar 110 fatos |

*"A primeira faixa exige consolidação excepcional"* — não *"dura 10 meses"*.
Mesma intenção, sem imposto de tempo.

#### ✅ O jogador travado numa conta só — resolvido sem afrouxar o portão

*Problema:* "nenhum 🔴" é gate sobre **um fato**. Alguém pode ficar preso meses
por causa de 7×8 — e o Teste de Faixa, que resolveria isso, foi adiado.

**A resposta não é afrouxar o portão, é dar um caminho.** Se o fato continua
vermelho depois de muita exposição, o problema não é falta de repetição — é
que **testar não está ensinando**. Então o jogo muda de estratégia:

> **Plano de Resgate** — dispara quando um fato está 🔴 **e** acumulou ≥15
> tentativas desde que ficou vermelho:
>
> 1. **Peso de sorteio sobe de 4 pra 8** — prioridade máxima.
> 2. **Entra no Flashcard** (a `FlashcardPage` já existe) — vira **estudo**,
>    não prova. É a única peça do jogo que ensina em vez de cobrar.
> 3. **Dica de decomposição no erro:** "7 × 8 = 7 × 4 + 7 × 4 = 28 + 28 = 56".
>    Ensinar a estratégia é legítimo — a fluência da 2.2 é agnóstica ao
>    processo, então uma criança que chega no 56 por decomposição rápida está
>    dominando de verdade.
> 4. **Fica visível** no painel de domínio como "conta travada", com o caminho
>    apontado. Ninguém fica bloqueado sem saber o que fazer.
>
> Isso é a *"rota específica de recuperação"* — e ela usa página que já existe.

**E é por isso que adiar o Teste de Faixa é seguro:** ninguém fica sem saída
enquanto ele não existe. Se a Fase 1 mostrar gente empacada mesmo com o Plano
de Resgate, aí sim ele vira necessário — decisão com dado, não com palpite.

### 2.8 ✅ Teste de Faixa — adiado (concordo)

A ideia (chegar a ~85% → rodada curta só com os fatos fracos → certificação)
fica pra **segunda camada de UX**, não entra na primeira versão. O ChatGPT tem
razão: com o sorteio ponderado da 2.5, a cauda já colapsa sozinha — pode ser
que a prova não seja necessária. **Fazer o domínio funcionar primeiro e medir
se ainda existe sensação de parede.**

### 2.9 O papel da Revisão muda

Consequência que ninguém tinha notado: **se o modo principal já puxa pros fatos
fracos, a Revisão perde o diferencial dela.**

Redivisão proposta:

- **Rush** — pool inteiro, ponderado (🔴 4 / 🟡 2 / 🟢 1). Continua sendo jogo.
- **Revisão** — **só 🔴 e 🟡**, sem verde nenhum. Vira o remédio concentrado,
  pra quando o jogador quer atacar o que falta de propósito.

---

## 3. XP: a fórmula

```
XP DA PARTIDA = round( (BASE + BÔNUS) × fator do modo × fator do dia ) × poção
```

- **BASE = acertos × 1 XP**, piso de 5 por partida terminada. Base fixa por
  partida convida ao farm (10 partidas de 15 s valeriam mais que uma partida
  séria de 4 min).
- **BÔNUS ≤ 50% da base** — teto duro dividido entre todas as fontes.
- **Fator do modo** — 0 a 1,25. Rush 1,0 (régua), Revisão 0,8, Zen 0.
- **Fator do dia** — knob **desligado por padrão**; decaimento suave (100 ×5,
  depois 90, 85, 80…) disponível se a liga der sinal de maratona.
- **Poção multiplica no fim.**

| Bônus | Entra? | Por quê |
|---|---|---|
| Combo | ✅ | consistência na partida; marco paga 1× por partida |
| Velocidade | ❌ | já paga pelo `bonusTime` do Rush — e o lugar dela é o domínio |
| Recorde | ⚠️ só percentual, com teto | regressivo; evento raro, não renda |
| Evento | ✅ | é aqui que uma "Semana da Velocidade" cabe sem virar estrutura |

**Por que não dá pra farmar nenhum dos dois:** XP aceita volume; domínio exige
constância, espaçamento e fluência. Quem joga muito e mal sobe na liga e **não**
sai da faixa. Quem joga pouco e bem sai da faixa e **não** sobe na liga.

---

## 4. Fase 0 e Fase 1: a especificação

Validar isso em planilha não é possível — o comportamento do domínio depende da
distribuição real de tempos e erros, e simulação com número inventado devolve
confiança inventada. E não precisa: o `factStats` já está cheio há meses.

### 🚨 4.1 A descoberta que muda o plano da Fase 0

Fui conferir se os dados guardados hoje aguentam a validação que a gente quer
fazer. **Não aguentam** — e isso não aparece até você tentar.

`factStats` guarda por fato: `{ correct, wrong, totalMs, count, lastPracticed }`.
É **agregado**. E `sessions` guarda por partida `{ mode, score, correct, wrong,
avgMs, date, xp }` — nenhum registro por pergunta.

Consequências, e a segunda é grave:

| Pergunta da Fase 1 | Dá pra responder com o que existe? |
|---|---|
| Quantos fatos ficariam 🟢 hoje? | ✅ sim (parcial: sem fluência) |
| Quais contas ficam 🔴? | ✅ sim |
| A **precisão recente (últimas 10)** de um fato | ❌ **não** — só existe o total da vida inteira |
| **Consistência** (acertou em quantos dias distintos?) | ❌ **não** — só existe o `lastPracticed` |
| **Falso positivo** (a regra aprovou e a pessoa continuou errando depois?) | ❌ **não** — impossível sem histórico |
| **Falso negativo** (a regra reprovou quem já sabia?) | ❌ **não** |

> **Duas das quatro componentes da nota (precisão recente e consistência) NÃO
> são calculáveis com o que o jogo grava hoje** — e a validação de falso
> positivo/negativo, que é a mais importante de todas, é impossível por
> construção. Um agregado não tem passado.
>
> Se a Fase 0 gravar só o `firstKeyMs`, a gente descobre isso daqui a três
> meses, com três meses de dado errado guardado.

### 4.2 Fase 0 — o que gravar (invisível, risco zero)

O ChatGPT fechou o consenso com uma ressalva certa: *"não fecharia um array
global de 3.000 linhas sem especificar como esse histórico será consumido"*.
Concordo — a retenção tem que sair das consultas. Sai assim:

#### Uma estrutura por consulta, e duas vidas diferentes

| Consulta do domínio | Onde mora | Vida |
|---|---|---|
| **Precisão recente** (últimas 10 do fato) | `ult` — buffer circular de 20 no fato | permanente |
| **Fluência** (mediana dos tempos do fato) | `ult` (mesmo buffer) | permanente |
| **Consistência** (dias distintos) | `dias` — últimos 10 dias distintos | permanente |
| **Recência** | `lastPracticed` (já existe) | permanente |
| **Base p25** | derivada das medianas por fato | calculada na hora |
| **Falso positivo / negativo** | `calibra` — log cronológico global | **temporária, descartável** |

> **Por que `dias` não sai do `ult`:** um jogador pesado faz 20 tentativas do
> mesmo fato em dois dias. O buffer não enxerga espaçamento — e espaçamento é
> justamente o que a consistência mede. São duas perguntas diferentes, então
> são duas estruturas.

#### (a) Por fato — permanente, dentro do `factStats` que já existe

```js
factStats.mult['7x8'] = {
  correct, wrong, totalMs, count, lastPracticed,   // tudo que já existe, intacto
  ult:  [{ ok: 1, d: 940, t: 1756512345678 }, …],  // últimas 20 tentativas
  dias: [20693, 20694, 20697, …],                  // últimos 10 dias distintos
  fluOk: true                                       // latch da fluência (2.3)
}
```

`d` = `firstKeyMs` · `t` = timestamp · `dias` são inteiros (dias desde a época),
não strings.

**Custo:** ~460 bytes por fato praticado. 500 fatos ≈ **230 KB**. Fato sem
prática há 90 dias volta a ser só agregado (`ult`/`dias` podados) — o histórico
recente dele já não vale nada pro cálculo mesmo.

#### (b) Global — temporária, só pra calibrar

```js
calibra: [{ fk: '7x8', ok: 1, d: 940, tot: 1620, t: … }, …]   // teto 5.000
```

Existe **só durante a Fase 0 e a Fase 1** e é **apagada na Fase 2**. Serve a
uma única pergunta, que é a mais importante de todas e a única que precisa de
ordem cronológica global: *a regra prevê acerto futuro?* Em produção ela não
existe — o jogo não precisa dela pra rodar.

Custo: ~200 KB enquanto durar. (`localStorage` tem 5 MB.)

#### Como capturar o `firstKeyMs`

`GamePage.jsx` já guarda `questionShownAt.current`. Entra um
`firstKeyAt.current`, zerado a cada pergunta nova e preenchido **na primeira
tecla** (`onKeyDown` do input; no modo Inverso, a primeira tecla de qualquer um
dos dois campos).

**Regras de descarte** — a tentativa continua contando pra precisão, mas **sai
da fluência** quando:

| Situação | Por quê |
|---|---|
| `document.hidden` em algum momento da pergunta | trocou de aba; o relógio não mede pensamento |
| power-up usado durante a pergunta | modal na frente infla o tempo |
| tempo total > 30 s | distração, não recuperação |
| **primeira pergunta da partida** | ⚠️ *suspeita a verificar na Fase 1* — pode conter tempo de se situar. Medir antes de decidir: se Q1 for sistematicamente mais lenta que as demais, passa a ser descartada; se não for, fica |

**Nada mais muda.** Nenhuma regra, nenhuma tela, nenhum XP, nenhuma faixa. Só
passa a guardar o que já acontece.

### 4.3 Fase 1 — o que medir (função pura, sem UI, sem gate)

`utils/dominio.js` rodado em cima do save real. O que sai:

**Do `factStats` de hoje** (dá pra rodar imediatamente, com nota parcial):
- distribuição 🔴/🟡/🟢 dos 54 fatos da faixa 1
- quais contas ficam vermelhas (bate com 7×8, 6×7, 8×9?)
- o corte de 95% é alcançável ou utópico?
- os pesos jogam tudo pro meio da faixa 50–79?

**Do log de tentativas** (depois de ~2 semanas de Fase 0):
- **distribuição por jogador** — quantos estão em 20% / 50% / 80% / 95% de
  domínio (pedido do ChatGPT, e é o número que diz se o portão é justo)
- **tempo real até dominar** um fato, do zero ao verde
- **falso positivo** — hold-out no tempo: calcula a nota usando só o que
  aconteceu até a data T, depois olha a taxa de erro **depois de T**. Se a
  regra aprova e a pessoa segue errando, o corte de 80 está baixo demais
- **falso negativo** — o inverso: quem tem 100% de acerto depois de T mas a
  regra segurava. Se aparecer muito, o corte está alto ou a fluência pesa
  demais
- **a base p25 é estável?** — ela oscila muito de semana em semana? O
  multiplicador de 1,4 aprova quantos por cento dos fatos?

**Só o falso positivo/negativo justifica o log de tentativas** — e é a única
medida que responde a pergunta que importa: *a regra prevê acerto futuro?*

### 4.4 Fase 2 — calibrar e ligar

Com os números da 4.3 na mão, ajusta a Tabela-Mãe e só então liga o gate de
faixa, o sorteio ponderado e a UI de domínio.

## 5. Tabela-Mãe

Pedido do ChatGPT, e boa ideia — tudo em um lugar só. **Todo valor numérico
aqui é ponto de partida, não estrutura.**

### Domínio
| | |
|---|---|
| Precisão recente (10 últimas) | **40%** |
| Consistência (dias distintos) | **25%** |
| Fluência (relativa) | **20%** |
| Recência (`predictRecallProbability`) | **15%** |
| 🟢 Dominado | nota **≥ 80** |
| 🟡 Em desenvolvimento | **50–79** |
| 🔴 Precisa praticar | **< 50** |
| **Catraca** | precisão < **70%** → 🔴 sempre |
| Base da fluência | **p25** dos tempos medianos (fatos com ≥5 respostas) |
| Limiar de fluência | tempo ≤ base × **1,4** |
| Estabilização | <15 fatos com ≥5 respostas → fluência não pontua (60/25/–/15) |
| **Catraca de dias** | **< 3 dias distintos → nunca 🟢** *(medido na Fase 1: sem isso, um fato de um dia só somava 81 e passava)* |
| 1ª pergunta da partida | **fora da fluência** *(medido: 2966 ms vs 1860 ms, +60%)* |
| Fluência | **latch** — do componente, nunca da nota |
| Fonte do tempo | **`firstKeyMs`**, nunca o tempo total |
| Plano de Resgate | 🔴 + **≥15 tentativas** desde que ficou vermelho |

### Sorteio
| | |
|---|---|
| 🔴 / 🟡 / 🟢 | peso **4 / 2 / 1** |
| ⚠️ Granularidade | **por FATO, nunca por tabuada** — o `weakBias` de hoje enviesa por tabuada e deixa conta com 0 exposições ao lado de conta com 20+ |
| 🔴 em Plano de Resgate | peso **8** |
| Faixas anteriores | `10% + 20% × (fração verde da faixa atual)`; piso **25%** se houver 🔴 antigo |
| Rush | pool inteiro, ponderado |
| Revisão | **só 🔴 e 🟡** |

### Faixa
| | |
|---|---|
| Abre com | **95% 🟢 e nenhum 🔴** |
| Faixa 2×10 | corte mais alto (nota ≥85) |
| Intermediárias | 90% 🟢 |
| Faixa conquistada | **nunca se perde** (fato verde pode voltar a 🟡; faixa não volta) |

### XP
| | |
|---|---|
| Base | **acertos × 1**, piso 5 |
| Bônus | **≤ 50%** da base, teto dividido entre todas as fontes |
| Combo / Velocidade / Recorde | ✅ / ❌ / ⚠️ só percentual com teto |
| Fator do modo | Rush **1,0** · Revisão **0,8** · Zen **0** |
| Fator do dia | **desligado por padrão** |
| Poção | multiplica no fim |

### Liga
| | |
|---|---|
| Métrica | XP acumulado **na divisão** (`xp − leagueXpBase`) |
| Personagem | **ritmo** + **constância** (2 números, escritos à mão nos 114) |
| QI | define o **ritmo**, nunca a constância |
| Constância → σ diário | alta **±10%** · média **±25%** · baixa **±45%** |
| Constância → fator do ritmo | alta **×1,00** · média **×0,97** · baixa **×0,94** |
| Janela | **soma de sorteios diários** (não uma oscilação sobre o total) |
| Ciclo | 6 dias (já existe) |

---

## 6. O que muda no código

**`getLevelIdx(xp)` → `getFaixaIdx(data)`** em 11 lugares (`App.jsx` ×3,
`Header.jsx`, `CatalogPage.jsx`, `ModesPage.jsx`, `PerfilPage.jsx`,
`SettingsPage.jsx`, `utils/index.js` ×3) — em todos, a pergunta real já é "em
que faixa o jogador está".

**Migração de uma linha:** `faixaIdx = getLevelIdx(xp)` na primeira abertura.
Ninguém sai do lugar onde está; dali em diante a progressão é por domínio.

**Novo:** `firstKeyMs` no registro da questão · **log rolante de tentativas**
(3.000 linhas, ~120 KB — sem ele metade da nota não é calculável em cima do
histórico, ver 4.1) · `utils/dominio.js` (nota, base, estado da faixa) · peso
no sorteio · Plano de Resgate · `utils/xp.js` (fonte única — hoje o
multiplicador de XP vive em dois lugares e já viveu em três, com uma cópia que
divergiu de verdade e fez a tela mostrar XP diferente do creditado).

**Sai de cena:** `FIRST_TIER_XP` / `TIER_XP_DECAY` (a curva de XP por faixa).
`LEVELS` continua — é ele que dá nome, troféu e intervalo de cada faixa.

---

## 7. Interface

**Regra:** barra é pra coisa que **destrava** algo. XP não destrava mais nada →
número. Domínio destrava a faixa → barra.

O **XP fica no Header** como número (ao lado de moedas e vidas — é identidade
do jogo e placar da liga). A **barra** vira o domínio da faixa atual.

```
📚 Tabuada 2×10
Domínio     ███████████████░░░░░   84%

Estas ainda pedem prática:
🔴 7 × 8      🟡 6 × 7      🟡 8 × 9
```

Sem percentual exigido na tela, sem "acerte 7×8 mais 4 vezes" — mas o jogador
**sempre sabe o que está segurando**.

---

## 8. Ligas: personagens com personalidade

**Metade já está construída:** cada personagem já tem atividade própria
(0,4–0,9), já varia ±30% a cada 12h, e a liga já tem multiplicador (0,7 Bronze
→ 2,2 Diamante). Faltam **duas correções**:

1. **Ritmo por identidade** — hoje vem de um *hash do nome*, então o Einstein
   pode calhar de ser mais preguiçoso que o Patrick Estrela.
2. **Variância por personagem** — hoje é ±30% pra todo mundo. **É a constância
   baixa dos OUTROS que produz o "caraca, o Einstein está em terceiro"**, não a
   variação do Einstein.

**Não simular o que não aparece:** a liga consome uma saída, um número de XP.
Dois números por personagem entregam 100% do efeito visível.

### ✅ "Surpresa, mas não caos" — resolvido com a matemática

*Exigência:* se Einstein faz 130/dia e Patrick 70/dia, Patrick **não pode** ter
chance real de ganhar. A variação tem que existir **dentro de uma identidade**.

Duas regras entregam isso, e a segunda resolve sozinha:

**1. A constância vira o desvio (σ) do personagem:**

| Constância | σ diário |
|---|---|
| Alta | ±10% |
| Média | ±25% |
| Baixa | ±45% |

**2. Sortear o dia e SOMAR a janela** — em vez do que o código faz hoje (uma
oscilação de ±30% aplicada de uma vez sobre o total de 14 dias). Somando 14
sorteios diários, o desvio da janela encolhe por **√14 ≈ 3,74** sozinho. É a
matemática que garante o "sem caos", sem precisar de nenhuma trava artificial:

#### Verificado por simulação, não por fórmula

O ChatGPT pediu (com razão) pra não tratar a conta como garantida: *"quando
isso roda por 100 ciclos, como fica a distribuição dos pódios?"*. Rodei —
**5.000 ciclos, liga de 20 (tamanho do Bronze), ritmo de 60 a 140,
constância alternada**:

| Ritmo | Constância | 1º lugar | Top 3 | |
|---|---|---|---|---|
| 140 | alta | **41,1%** | **96,1%** | Einstein |
| 136 | média | 23,5% | 74,0% | Batman |
| 132 | baixa | 24,6% | 54,6% | |
| 127 | média | 4,4% | 35,7% | |
| … | | | | |
| 60 | baixa | **0%** | **0%** | Patrick |

- **Pior colocação do Einstein em 5.000 ciclos: 6º.** Acontece — e é
  exatamente o "caraca, o Einstein está em sexto" que o Davi quer.
- **Melhor colocação do Patrick em 5.000 ciclos: 14º de 20.** Nunca chegou
  perto do pódio.

**Vizinho passa vizinho; o fundo nunca passa o topo.** "Surpresa, mas não
caos", confirmado com número, sem nenhuma regra especial — só porque a soma de
sorteios diários se comporta assim.

#### ✅ A correção do Davi, calibrada por simulação

Decisão dele: *"não quero que ser inconsistente seja matematicamente
vantajoso. Surpresa vem da variância; força vem do ritmo médio."* Então
constância baixa **também reduz o ritmo médio esperado**.

Achei o fator rodando o teste limpo — três personagens de **mesmo ritmo (120)**
e constâncias diferentes, 20.000 ciclos cada, medindo o pódio de cada um:

| Fator aplicado ao ritmo | Pódio (alta) | Pódio (média) | Pódio (baixa) |
|---|---|---|---|
| nenhum (1,00) | 6,1% | 18,2% | **30,1%** ← o privilégio |
| baixa ×0,96 | 13,1% | 18,1% | 23,1% |
| **baixa ×0,94 · média ×0,97** | **18,6%** | **17,8%** | **20,1%** ← neutro |
| baixa ×0,92 | 26,5% | 17,2% | 16,9% ← passou do ponto |

**Fatores adotados: alta ×1,00 · média ×0,97 · baixa ×0,94.** Com o mesmo
ritmo, a constância deixa de mudar a chance de pódio.

Confirmado na liga cheia de 20: o pódio passa a **cair junto com o ritmo, sem
inversão**, e a surpresa sobrevive — pior colocação do Einstein em 8.000
ciclos: **5º**; melhor do Patrick: **14º de 20**.

**Nota de autoria:** com esses fatores, um personagem que tenha ritmo máximo
**e** constância alta vence 66% dos ciclos. Se isso parecer monótono, o
controle não é a fórmula, é a ficha: o mesmo ritmo 140 com constância **média**
cai pra 47% e com **baixa** pra 39%. Dominância se ajusta na hora de escrever
os 114 personagens, não no código.

#### ⚠️ Como o problema apareceu (registro)

Comparando dois personagens da simulação:

| | Ritmo | Constância | Top 3 |
|---|---|---|---|
| A | **123** | alta | **7,8%** |
| B | 119 | baixa | **20,6%** |

**B é pior e aparece no pódio quase 3× mais.** Não é bug: pódio é evento de
cauda, e quem varia mais ganha mais caudas. **Constância baixa é vantagem pra
pódio.**

Não é bug: pódio é evento de cauda, e quem varia mais ganha mais caudas. Foi
isso que a correção acima resolveu.

---

## 9. O que TODO modo novo precisa responder

1. Duração típica de uma partida (dá pra ficar parado? então XP não vem do
   tempo)
2. Quantas perguntas cabem numa partida típica
3. Tem pressão? (timer, vidas, penalidade)
4. **`xpFactor`** — 0 a 1,25, e o porquê
5. **`scoreScale`** — os pontos são comparáveis aos do Rush?
6. ⚠️ **Conta pro domínio?** — a mais importante, porque decide se o modo abre
   conteúdo. Modo fácil demais inflaria o domínio. **Zen deveria contar** (é
   treino de verdade, mesmo sem XP e sem moeda). **Se conta, precisa medir
   `firstKeyMs`.**
7. Dá pra farmar? — agora em duas moedas: XP (liga) e domínio (faixa)

---

## 10. Estado das decisões

### ✅ CONSENSO — arquitetura conceitual fechada dos dois lados
Pontos = desempenho · XP = progressão (liga, missões, eventos, status) ·
Domínio = aprendizado · **Faixa = domínio** · velocidade sai do XP e vira
critério de domínio · combo fica no XP · base de XP por acerto com teto de
bônus · domínio como nota composta com catraca de precisão · fluência relativa
(base p25, estabilização, latch **do componente**) · o critério é **agnóstico
ao processo mental** e o nome interno é **fluência**, não "decorado" · sorteio
ponderado · **Plano de Resgate** pra conta travada · interleaving pelo peso,
sem porcentagem fixa · Revisão vira só 🔴/🟡 · Teste de Faixa adiado (seguro,
porque o Plano de Resgate cobre o buraco) · personagens com ritmo + constância,
**σ por constância e janela somada dia a dia** · QI define ritmo · pontos ficam.

### 🔧 A construir — nesta ordem

| Fase | O que | Toca no jogo? |
|---|---|---|
| **0** | `firstKeyMs` + `ult`/`dias` por fato + `calibra` global (4.2) | **não** — só grava |
| **1** | `utils/dominio.js` como função pura + `scripts/analisar-dominio.mjs` rodando no save real (4.3) | **não** — só mede |
| **2** | calibrar a Tabela-Mãe com o que a Fase 1 mostrar; apagar o `calibra` | não |
| **3** | ligar: `getFaixaIdx`, gate de faixa, sorteio ponderado, Plano de Resgate, UI de domínio, `utils/xp.js` | **sim** |

**As fases 0, 1 e 2 não mudam uma regra sequer do jogo.** Só a 3 muda.

### ⚠️ A calibrar (com dado real, não no papel)
Todos os números da Tabela-Mãe.

### 🟢 FASE 0 — IMPLEMENTADA (sessão 099)

Aprovada pelo Davi e no ar. O que entrou:

| Arquivo | O que |
|---|---|
| `GamePage.jsx` | `firstKeyAt` (1ª tecla, no `onChange` dos 3 inputs), marcadores de descarte (`abaEscondida` via `visibilitychange`, `powerupNaQuestao`, `questaoIdx`) e os campos `dec`/`flu`/`q1` no registro da questão |
| `utils/index.js` | `diaNum()`, `ULT_MAX` (20), `DIAS_MAX` (10), `CALIBRA_MAX` (5000) |
| `App.jsx` | grava `ult` e `dias` por fato dentro do `factStats` e acumula o `calibra` |
| `lib/storage.js` | `calibra: []` no default |

**Nenhuma regra do jogo mudou.** Nenhum XP, nenhuma faixa, nenhuma tela.

### ✅ Já decididos no consenso
**Teste de Faixa** → depois (o Plano de Resgate cobre o buraco).
**Interleaving** → sim, adaptativo, sem porcentagem fixa.
**Header** → ✨ XP como número · 🧠 barra = domínio da faixa atual.

### ✅ Decidido pelo Davi na sessão 099

**Fase 0** → aprovada e implementada.

**Teste de placement na entrada** → **aprovado** como decisão de produto,
implementação depois da coleta/calibração. Exigência dele: *"que o teste seja
realmente uma certificação — dificuldade suficiente e evidência suficiente pra
não liberar alguém que apenas teve uma partida excepcional."* Ou seja: a prova
tem que exigir **cobertura** (os 54 fatos, não uma amostra) e **espaçamento**
mínimo, senão vira sorte. Especificação junto com o Teste de Faixa.

**Constância baixa dando vantagem de pódio** → **corrigir**. Regra de ouro da
liga que ele definiu:

> **Surpresa vem da variância; força vem do ritmo médio.**

Constância baixa aumenta a variância **e reduz um pouco o ritmo médio
esperado**. Fatores calibrados por simulação na seção 8.

---

## 11. Anexo: o que a pesquisa do Duolingo confirma

A pesquisa do Davi bate com a arquitetura em três pontos, e isso é validação
externa — não inspiração:

1. **Lá o XP também não é certificado de conhecimento.** É moeda de
   participação, somada entre matérias, alimentando ranking e missões. "Duas
   pessoas com o mesmo XP podem ter conhecimentos muito diferentes." É
   exatamente o cargo que o XP tem aqui.
2. **Lá o domínio também é inferido de comportamento**, não de acúmulo:
   desempenho contínuo, dificuldade crescente, variação de contexto e
   recuperação depois de um tempo. São, com outros nomes, precisão,
   consistência e recência.
3. **Não existe fórmula pública de XP → domínio.** Porque não existe conversão
   possível — que é o motivo de a v3 ter derrubado a condição de XP na faixa.

**Onde o Tabuada Rush precisa ser mais específico:** lá a evidência de
aprendizado é *"resolve problemas variados"*. Aqui é *"quando vejo 7×8, o 56
sai sozinho"*. Fluência factual é um alvo mais estreito e mais medível — por
isso a nota tem um componente (fluência relativa) que não faria sentido no
curso deles.

**Princípios que valem a pena copiar** (e que a arquitetura já tem): repetição
espaçada, recuperação ativa, progressão de dificuldade, reapresentação de
conteúdo antigo (o interleaving da 2.6) e revisão dirigida ao erro (o sorteio
ponderado da 2.5).
