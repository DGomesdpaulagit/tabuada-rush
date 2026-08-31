# ✨ ARQUITETURA_XP.md — Pontos, XP, Domínio e progressão

> **v5 (sessão 099).** **Estrutura fechada. Parâmetros abertos.**
> (Correção de linguagem que o ChatGPT pediu, e ele tem razão: "arquitetura
> fechada" dava a entender que os números também estavam.)
>
> Histórico: **v1** tirava o XP das faixas · **v2** `XP + Domínio` pra
> sustentar os 8–10 meses · **v3** derrubou a condição de XP quando o Davi
> cancelou a meta de tempo · **v4** nota composta + fluência relativa + 2 furos
> achados no código · **v5** fecha os últimos pontos em aberto (base da
> fluência, interleaving, Teste de Faixa, papel da Revisão) e consolida a
> Tabela-Mãe.
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
**por ter melhorado**, o que é absurdo. Esquecimento é trabalho da recência,
que é o mecanismo honesto pra isso.

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

## 4. ⚠️ Onde eu discordo do ChatGPT: como validar

Ele propôs, antes de codar, uma especificação matemática completa com
*"exemplos de partidas e cenários de usuário, pra testar se o sistema se
comporta como imaginamos"*.

**Não dá pra validar isso no papel.** O comportamento do domínio depende da
distribuição real de tempos de resposta e de erro de gente de verdade. Uma
simulação de papel usa números inventados e devolve **confiança inventada** —
o pior resultado possível, porque parece validação.

E não precisamos: **o `factStats` já existe e já está cheio.** Acertos, erros,
tempo total, contagem e `lastPracticed` por fato, gravados há meses no save.

### O caminho que eu faria

**Fase 0 — coletar (invisível, risco zero).** Só ligar o `firstKeyMs`. Nenhuma
mudança de regra, nenhuma mudança de tela. É o único dado que não temos, e ele
só existe depois de existir — então o relógio precisa começar a correr agora,
não depois de fechar a planilha.

**Fase 1 — medir no que já existe.** `utils/dominio.js` como **função pura**,
rodada em cima do save real do Davi (meses de partidas). Sem UI, sem gate. A
pergunta que isso responde na hora:

- quantos dos 54 fatos da faixa 1 dariam 🟢 hoje?
- a catraca de 95% é alcançável ou utópica?
- os pesos 40/25/20/15 produzem uma distribuição sensata ou tudo cai no meio?

Fluência fica de fora nessa rodada (não tem histórico de `firstKeyMs`), mas os
outros 80% da nota se validam **com dados reais, hoje**.

**Fase 2 — calibrar com o que a Fase 1 mostrar,** e só então ligar o gate.

É mais rápido que escrever a planilha e infinitamente mais confiável.

---

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
| Fluência | **latch** (só sobe) |
| Fonte do tempo | **`firstKeyMs`**, nunca o tempo total |

### Sorteio
| | |
|---|---|
| 🔴 / 🟡 / 🟢 | peso **4 / 2 / 1** |
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
| Ciclo | 6 dias (já existe) |

---

## 6. O que muda no código

**`getLevelIdx(xp)` → `getFaixaIdx(data)`** em 11 lugares (`App.jsx` ×3,
`Header.jsx`, `CatalogPage.jsx`, `ModesPage.jsx`, `PerfilPage.jsx`,
`SettingsPage.jsx`, `utils/index.js` ×3) — em todos, a pergunta real já é "em
que faixa o jogador está".

**Migração de uma linha:** `faixaIdx = getLevelIdx(xp)` na primeira abertura.
Ninguém sai do lugar onde está; dali em diante a progressão é por domínio.

**Novo:** `firstKeyMs` no registro da questão · `utils/dominio.js` (nota,
base, estado da faixa) · peso no sorteio · `utils/xp.js` (fonte única — hoje o
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

### ✅ Estrutura fechada
Pontos = desempenho · XP = progressão (liga, missões, eventos, status) ·
Domínio = aprendizado · **Faixa = domínio** · velocidade sai do XP e vira
critério de domínio · combo fica no XP · base de XP por acerto com teto de
bônus · domínio como nota composta com catraca de precisão · fluência relativa
com base p25, estabilização e latch · sorteio ponderado · interleaving pelo
peso, sem porcentagem fixa · Revisão vira só 🔴/🟡 · Teste de Faixa adiado ·
personagens com ritmo + constância · QI define ritmo · pontos ficam.

### 🔧 A construir
`firstKeyMs` · sorteio ponderado · `utils/dominio.js` · `utils/xp.js` ·
`getFaixaIdx`

### ⚠️ A calibrar (com dados reais, não no papel)
Todos os números da Tabela-Mãe.

### ❓ Só o Davi decide
1. **Fase 0 já?** Ligar o `firstKeyMs` agora, sem mudar mais nada, pra começar
   a juntar o único dado que falta. É a menor mudança possível e destrava a
   calibração inteira.
2. **Header** — XP vira número, barra vira domínio. Confirma?
3. **Teste de placement** — se ele encontrar isso no Duolingo (lá existe teste
   de nivelamento e checkpoint pra pular conteúdo), vale decidir se um jogador
   que já sabe a 2×10 pode **provar isso numa prova curta** em vez de esperar o
   domínio se acumular naturalmente (~1 semana). É a mesma mecânica do Teste de
   Faixa, aplicada na entrada.
