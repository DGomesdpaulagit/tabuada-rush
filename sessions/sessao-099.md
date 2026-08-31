# Sessão 099 — Aviso de ofensiva raro + posição colorida + análise da arquitetura de XP

**Data:** 2026-08-30
**Versão:** 6.0.47 → 6.0.48
**Tipo:** Regra de jogo + acabamento + documento de análise

---

## 1. O aviso de ofensiva perdida virou raro

Regra nova do Davi: *"esse painel só aparece se o usuário abrir o jogo poucas
horas depois de perder, no máximo de duas horas, normalmente 2 da manhã (...)
e só pode aparecer uma vez no mês"*. A ideia é que **restaurar a ofensiva seja
valorizado** — quem volta correndo de madrugada ganha a chance; quem aparece
de tarde perdeu mesmo.

Duas condições, as duas obrigatórias:

| Condição | Como funciona |
|---|---|
| **Janela de 2h** | A ofensiva morre à meia-noite; o aviso vale até as 02:00 |
| **1× por mês** | `ofensivaAvisoMes` é marcado no instante em que o aviso aparece |

**O bug que isso exigiu consertar:** `ofensivaPerdida.em` guardava a hora em
que o **app foi aberto**, não a hora da queda. Quem abrisse o jogo às 15h teria
"0 minutos desde a perda" e veria o aviso sempre — a janela não filtraria nada.
Agora `momentoDaPerda(ultimoDia)` calcula a meia-noite real do dia seguinte ao
último dia jogado.

**Detalhe de implementação que não era óbvio:** a decisão é tomada **uma vez,
na abertura**, e guardada em estado local (`avisoOfensiva`) — não derivada do
`data` a cada render. Se fosse derivada, gravar "já vi neste mês" tornaria a
condição falsa no mesmo instante e o modal sumiria sozinho na cara do jogador.

**E a recuperação agora expira no mesmo dia.** Quem aperta "Trazer ofensiva de
volta" às 1h e some por três dias não devolve mais a ofensiva antiga — só vale
terminar a partida no mesmo dia da queda (`handleGameEnd`). Antes a marca
`recuperando` ficava pendente pra sempre.

## 2. A posição na caixa de divisão ganhou cor

Mesma sinalização das 30 frases: **vermelho** na zona de rebaixamento,
**verde** no pódio. No meio ela fica na cor normal do texto (`text-fg`) e não
na cor apagada da frase — é o número mais importante da caixa.

Mapa novo `COR_POSICAO` em `constants/leaguePhrases.js`, separado do
`COR_DIVISAO` justamente por causa dessa diferença no estado "meio".

**Conferido em captura:** 21º de 21 saiu vermelho, 1º de 21 saiu verde.

## 3. `ARQUITETURA_XP.md` — a análise que ele pediu

Ele escreveu um documento longo propondo separar Pontos de XP (XP base por
partida + bônus de desempenho, em vez de XP = pontos × multiplicador) e pediu
prós, contras e consequências — mais a regra de escala pros modos futuros,
**antes** de qualquer modo novo ser criado.

Resposta completa em `ARQUITETURA_XP.md` (raiz). Os três achados que importam:

1. **A deflação é de ~6×** (250 XP/partida hoje → ~40 na proposta). Isso
   **conserta a liga** (calibrada pra 100 XP/dia, e hoje uma única partida vale
   2,5 dias de "jogador moderado") e **quebra as faixas** (27.000 XP na
   primeira faixa vira 675 partidas).
2. **Recomendação principal:** tirar as faixas do XP e passar pra domínio real
   (`factStats` já mede). Resolve a conta impossível, resolve o farm de
   conteúdo que ele mesmo teme, e dispensa migração de save — porque a liga usa
   um delta (`xp − leagueXpBase`) que se auto-corrige em um ciclo.
3. **Cortaria dois bônus:** velocidade (contradiz a própria hierarquia dele e
   já é pago duas vezes pelo `bonusTime` do Rush) e recorde (regressivo e
   farmável por baixo). Combo fica.

Mais a fórmula proposta (base por acerto, bônus com teto de 50%, fator do modo,
fator anti-farm do dia) e o **checklist de 7 respostas que todo modo novo tem
que dar antes de existir**.

## 4. `ARQUITETURA_XP.md` v2 — depois do ChatGPT

O Davi levou a análise da v1 pro ChatGPT, gostou da resposta e me trouxe de
volta. A proposta de lá: em vez de **tirar** o XP das faixas (minha v1),
exigir **XP + Domínio juntos**. Ele tem razão — a trava de domínio resolve o
farm sem precisar tirar o XP de lugar nenhum, que era o que o Davi queria
preservar ("o XP tem que ser o marco do jogo"). Documento reescrito em cima
disso.

**O que eu acrescentei que faltava nos dois lados — os números:**

- **As "600 partidas" que assustaram o Davi SÃO os "8 a 10 meses" que ele
  pediu.** 27.000 XP ÷ ~45 XP por partida = 600 partidas; a 2 partidas/dia =
  ~10 meses. É o mesmo número dito de dois jeitos.
- **Logo, a curva das faixas não precisa mudar.** Os 27.000 já estão certos
  pro mundo novo — o que estava errado era só a taxa (250 XP numa partida).
- **As duas travas não dividem o ritmo.** XP ≈ 10 meses, domínio dos 54 fatos
  da faixa 1 ≈ 2 meses. O XP manda sozinho com folga de 4–5×, e subir a
  exigência de domínio não muda isso (quem joga mais sobe os dois juntos).
  Então: **XP marca o tempo, domínio marca o piso** — a trava de domínio é
  peneira pra quem joga muito e continua errando 7×8, não cronômetro.
- **A "contradição" que ele sentiu tem saída:** a faixa 1 tem 54 fatos e as de
  cima ~110, mas a 1 é infraestrutura (quem faz 23×7 usa 3×7) e a meta muda de
  natureza (memorizar → fluência). Justifica exigir MAIS domínio na 1 com
  MENOS conteúdo.
- **Ligas:** metade do que ele quer já existe (atividade por personagem +
  variação de 12h). Faltam duas correções — o ritmo vem de um *hash do nome*
  em vez da identidade, e a variância é igual pra todo mundo. Discordo do
  ChatGPT em simular 8 atributos por personagem: a liga consome **uma** saída
  (XP); 2 números por personagem entregam todo o efeito visível.

**Mudei de posição em um ponto:** com a trava de domínio no lugar, o bônus de
recorde me incomoda menos (farm de XP não compra mais conteúdo). O bônus de
velocidade eu continuo cortando — é pago duas vezes pelo `bonusTime` do Rush.

## 5. `ARQUITETURA_XP.md` v3 — o Davi cancelou a meta de tempo

Decisão dele, depois de mais uma rodada com o ChatGPT: *"cada usuário tem seu
tempo (...) se ele aprendeu, ele aprendeu, já era. Outros vão chegar já
sabendo essa primeira faixa. Vamos parar de perder tempo com isso."*

**Consequência que fecha a arquitetura: a condição de XP na faixa cai.** Ela
existia só pra sustentar os 8–10 meses; sem a meta de tempo, qualquer XP
exigido vira imposto cobrado de quem já provou que aprendeu — exatamente o
caso do jogador que chega sabendo a 2×10.

```
PRÓXIMA FAIXA = Domínio suficiente
```

**Por que isso não deixa o XP vago:** ele fica com a liga inteira (114
personagens, 8 divisões, zona de rebaixamento, pódio) e as missões de
progressão. A divisão vira uma frase: *conteúdo se abre com aprendizado,
competição se ganha com esforço*.

**E a trava de esforço não some** — ela já estava dentro do domínio: os 54
fatos da faixa 1 só ficam verdes com ~430 acertos espalhados por vários dias.
A condição de XP só somava tempo em cima disso.

**O que passou a ser o trabalho de verdade:** a definição de "decorou". O
critério central é o **tempo de resposta** — fato recuperado da memória volta
em menos de 1,5 s; fato calculado (contar de 7 em 7) leva 3 a 6 s. Os dois
terminam em acerto, e é por isso que contar acertos não enxerga aprendizado.

Fecha um arco: tirei a velocidade do XP e ela reaparece como critério central
do domínio. **Velocidade não deve comprar progresso — ela deve provar
aprendizado.**

**Três coisas morreram junto com a condição de XP:** a migração de save
perigosa (era o único risco real do plano), a calibração dos 27.000 XP por
faixa, e a fase inteira de simular jogadores pra achar quanto tempo cada um
leva — ela existia pra calibrar tempo.

**Alcance no código:** `getLevelIdx(xp)` aparece em 11 lugares e em todos a
pergunta real é "em que faixa o jogador está". Troca mecânica por
`getFaixaIdx(data)`, e a migração é uma linha (`faixaIdx = getLevelIdx(xp)` na
primeira abertura) — ninguém perde faixa.

## 6. `ARQUITETURA_XP.md` v4 — refino do domínio + dois furos no código

Mais uma rodada com o ChatGPT. Três correções dele que eu aceitei, uma
discordância que não existia, e dois furos que só apareceram lendo o código.

**Aceito (ele tem razão):**
- **Nada de limite de tempo absoluto.** "≤2,0 s = dominado" reprova criança
  lenta que sabe e aprova quem conta rápido nos dedos. Substituído por
  **fluência relativa**: o fato está fluente quando o jogador responde ele tão
  rápido quanto os fatos que ele já sabe de cor (`base × 1,4`, base = mediana
  dos fatos verdes dele). Resolve idade, aparelho, ansiedade e dificuldade de
  uma vez, porque todos deslocam a base junto.
- **Nota composta, não 5 catracas AND.** Precisão 40 + consistência 25 +
  fluência 20 + recência 15; verde ≥80. Com **um** piso duro: precisão recente
  <70% trava em vermelho, senão velocidade compensaria erro.
- **Teto diário de XP vira knob desligado por padrão.** Cortar 100%→50% na 6ª
  partida pune o engajado de forma grosseira.

**Discordância que não existe:** ele apresentou como alternativa uma "terceira
opção" — *faixa = domínio, XP como eixo de progressão geral (liga, missões,
eventos, status)*. É literalmente a proposta. "Tirar o XP das faixas" nunca
significou diminuir o XP.

**Furo nº 1 — o tempo medido hoje inclui a digitação.** `GamePage.jsx` grava
`dt = agora − questionShownAt` **no envio**, e o jogo é de resposta digitada
(1 a 4 dígitos). Qualquer critério de velocidade em cima disso pune resposta
grande por ser grande. Precisa gravar o **tempo até a primeira tecla**
(`firstKeyMs`) — é a janela de decisão, sem o motor da digitação.

**Furo nº 2 — o sorteio das perguntas virou parte da progressão.** Hoje
`getRandomQuestion` sorteia uniformemente. Fazia sentido quando a faixa era
XP; agora o sorteio decide quando o jogador passa. Uniforme, ele passa o tempo
revendo o que já sabe e os 2–3 fatos teimosos aparecem na mesma frequência dos
outros — a cauda difícil se arrasta sem fim, e a cauda é o que segura a faixa.
Precisa de **sorteio ponderado pelo estado do fato** (🔴 4, 🟡 2, 🟢 1). Sem
isso, faixa por domínio não funciona na prática.

## 7. `ARQUITETURA_XP.md` v5 — fecha os pontos em aberto

O ChatGPT aprovou a v4 e deixou quatro coisas em aberto. Fechadas:

**1. A base da fluência (problema matemático real que ele levantou e não
resolveu).** Ele notou que a base pode sair apertada ou permissiva demais
dependendo dos primeiros fatos verdes. E tem um problema anterior: **no
primeiro dia não existe fato verde nenhum** — a definição se morde. Três
regras resolvem: a base vem do **percentil 25 dos tempos medianos** (o quarto
mais rápido do jogador é o que ele já sabe de cor, e isso funciona desde o dia
1); **período de estabilização** (<15 fatos com ≥5 respostas → fluência não
pontua, os 20 pontos vão pra precisão); e **fluência é latch** — porque a base
DESCE conforme o jogador melhora, e sem o latch ele veria fatos dominados
voltarem pra amarelo por ter ficado mais rápido.

**2. Interleaving sem porcentagem fixa** — ele tinha razão que "20% sempre do
passado" é burro, mas não precisa de sistema novo: basta o pool incluir as
faixas anteriores e deixar o peso trabalhar. Fato antigo dominado tem peso 1;
se apodrece vira 🟡 e **pula pra peso 2 sozinho**. Só falta impedir que o
passado engula o presente: `p(anterior) = 10% + 20% × (fração verde da faixa
atual)`, piso de 25% se houver 🔴 antigo.

**3. Teste de Faixa adiado** — concordo com ele. Com o sorteio ponderado a
cauda já colapsa sozinha; fazer o domínio funcionar primeiro e medir se ainda
existe sensação de parede.

**4. "Arquitetura fechada" → "estrutura fechada, parâmetros abertos".** Ele
tem razão na linguagem.

**Consequência que ninguém tinha notado:** se o modo principal já puxa pros
fatos fracos, **a Revisão perde o diferencial**. Redivisão: Rush = pool
inteiro ponderado; Revisão = **só 🔴 e 🟡**, o remédio concentrado.

**Onde eu discordo dele — como validar.** Ele quer uma especificação
matemática com cenários simulados antes de codar. Não dá pra validar isso no
papel: o comportamento do domínio depende da distribuição real de tempos e
erros, e simulação com número inventado devolve **confiança inventada**. E não
precisamos — o `factStats` já está cheio há meses. O caminho proposto:
**Fase 0** liga só o `firstKeyMs` (invisível, risco zero, é o único dado que
não temos e ele só existe depois de existir); **Fase 1** roda `utils/dominio.js`
como função pura em cima do save real e responde na hora quantos dos 54 fatos
dariam verde e se a catraca de 95% é alcançável; **Fase 2** calibra e liga o
gate.

Documento agora tem a **Tabela-Mãe** (pedido dele) com todos os parâmetros
num lugar só.

## 8. `ARQUITETURA_XP.md` v6 — os cinco últimos pontos, resolvidos

O Davi pediu explicitamente pra parar de comentar a resposta do outro e
**resolver**, pra ele levar as soluções pro ChatGPT aprovar. Cinco pontos
estavam soltos:

**1. O latch era ambíguo.** Explicitado: o latch é do **componente**, nunca da
nota. Só os 20 pontos de fluência travam; precisão, consistência e recência
continuam vivas e podem derrubar o fato de verde pra amarelo. Fluência
conquistada não é invalidada porque a referência mudou; conhecimento pode
enfraquecer com o tempo.

**2. Estratégias rápidas ≠ memorização (objeção pedagógica real).** A base
relativa já resolve, sem afrouxar nada: ela não pergunta QUAL processo, e sim
se este fato sai tão rápido quanto os fatos mais rápidos do próprio jogador.
Quem usa estratégia pra tudo tem base de estratégia e é fluente de verdade;
quem tem truque só pro 9 vê o 7×8 ficar lento **em relação a si mesmo**, e o
sistema segura exatamente o fato que não consolidou. O critério é agnóstico ao
processo mental por construção. Terminologia adotada: **fluência**, não
"decorado".

**3. O jogador travado numa conta só.** Adiar o Teste de Faixa deixava um
buraco: "nenhum vermelho" é gate sobre UM fato. Resolvido sem afrouxar o
portão — **Plano de Resgate**: fato 🔴 com ≥15 tentativas desde que ficou
vermelho sobe pra peso 8, entra no **Flashcard** (página que já existe, e é a
única peça do jogo que ENSINA em vez de cobrar), ganha dica de decomposição no
erro e fica visível como "conta travada". Testar não está ensinando, então o
jogo muda de estratégia. É isso que torna o adiamento do Teste de Faixa seguro.

**4. 🚨 A descoberta que muda a Fase 0.** Fui conferir se o dado guardado hoje
aguenta a validação, e **não aguenta**. `factStats` é **agregado**
(`correct/wrong/totalMs/count/lastPracticed`) e `sessions` não guarda nada por
pergunta. Logo: **precisão recente (últimas 10) e consistência (dias distintos)
NÃO são calculáveis** com o histórico atual — duas das quatro componentes da
nota — e falso positivo/negativo é impossível por construção, porque agregado
não tem passado. Se a Fase 0 gravasse só o `firstKeyMs`, a gente descobriria
isso daqui a três meses com três meses de dado errado. **Fase 0 passa a ter
duas peças:** `firstKeyMs` **e** um log rolante de tentativas
(`{fk, ok, dec, tot, t}`, teto de 3.000 linhas ≈ 120 KB).

**5. "Surpresa, mas não caos" nos personagens.** Resolvido com matemática, sem
regra especial: constância vira σ diário (alta ±10%, média ±25%, baixa ±45%) e
a janela passa a ser a **soma de sorteios diários** em vez de uma oscilação de
±30% sobre o total. Somar 14 dias encolhe o desvio por √14 sozinho. Resultado:
Einstein × Batman fica a 1,1σ (**upset em ~14% dos ciclos** — a surpresa que o
Davi quer), Einstein × Patrick fica a 6,6σ (**nunca**). Vizinho passa vizinho;
o fundo nunca passa o topo.

Documento ganhou também o **anexo com a pesquisa do Duolingo**, que valida a
arquitetura de fora: lá o XP também não é certificado de conhecimento, o
domínio também é inferido de comportamento, e não existe fórmula pública de
XP → domínio — que é exatamente o motivo de a v3 ter derrubado a condição de
XP na faixa.

## 9. `ARQUITETURA_XP.md` v7 — CONSENSO FECHADO

O ChatGPT aprovou as cinco soluções da v6 e deixou **um** item aberto: o
formato e a retenção do histórico, que segundo ele *"não deveria ser um array
global de 3.000 linhas sem especificar como será consumido"*. Ele tem razão —
a retenção tem que sair das consultas.

**A solução: uma estrutura por consulta, e duas vidas diferentes.**

| Consulta | Onde mora | Vida |
|---|---|---|
| Precisão recente / fluência | `ult` — buffer circular de 20 no fato | permanente |
| Consistência (dias distintos) | `dias` — 10 dias distintos, como inteiros | permanente |
| Recência | `lastPracticed` (já existe) | permanente |
| Falso positivo/negativo | `calibra` — log cronológico global | **temporária, apagada na Fase 2** |

**Por que `dias` não sai do `ult`:** um jogador pesado faz 20 tentativas do
mesmo fato em dois dias. O buffer não enxerga espaçamento, e espaçamento é
justamente o que a consistência mede. Duas perguntas ⇒ duas estruturas.

Custo: ~460 B por fato praticado (≈230 KB pra 500 fatos, podando fato sem
prática há 90 dias) + ~200 KB temporários do `calibra`. Limite do
`localStorage`: 5 MB.

Especificadas também a captura do `firstKeyMs` (`onKeyDown`, primeira tecla de
qualquer campo no modo Inverso) e as **regras de descarte** — aba escondida,
power-up no meio, tempo > 30 s saem da fluência mas continuam contando pra
precisão. A primeira pergunta da partida ficou como **suspeita a verificar na
Fase 1**, não como descarte decidido: medir antes.

### Simulação da liga — 5.000 ciclos

O ChatGPT pediu pra não tratar o cálculo de upset como garantido. Rodei a
simulação (liga de 20, ritmo 60–140, constância alternada):

- **Einstein (140, alta): 41% de 1º lugar, 96% de pódio. Pior colocação em
  5.000 ciclos: 6º.** É o "caraca, o Einstein está em sexto" que o Davi quer.
- **Patrick (60, baixa): 0% de pódio. Melhor colocação: 14º de 20.**

Vizinho passa vizinho; o fundo nunca passa o topo. Confirmado com número.

**Efeito colateral que a simulação revelou:** um personagem de ritmo 119 e
constância baixa vai a pódio **20,6%** das vezes, contra **7,8%** de um de
ritmo 123 e constância alta. O pior aparece quase 3× mais. Não é bug — pódio é
evento de cauda e quem varia mais ganha mais caudas. **Constância baixa é
vantagem pra pódio.** Fica como decisão do Davi: sabor (o gênio irregular tem
picos) ou corrige dando ritmo médio um pouco menor a quem tem constância baixa.

Adotada também a **regra de ouro** proposta pelo ChatGPT: *o sistema nunca cria
uma barreira sem oferecer um caminho claro pra superá-la.*

## 10. FASE 0 implementada (as 3 decisões do Davi)

Ele aprovou as três: Fase 0 pode ligar, teste de placement aprovado como
decisão de produto (implementação depois da calibração) e **corrigir** a
vantagem de pódio da constância baixa. Regra de ouro que ele definiu pra liga:
*"surpresa vem da variância; força vem do ritmo médio."*

### Fator da constância, calibrado por simulação

Rodei o teste limpo — três personagens de **mesmo ritmo (120)** e constâncias
diferentes, 20.000 ciclos, medindo o pódio de cada um:

| Fator no ritmo | alta | média | baixa |
|---|---|---|---|
| nenhum | 6,1% | 18,2% | **30,1%** ← o privilégio |
| **baixa ×0,94 · média ×0,97** | **18,6%** | **17,8%** | **20,1%** ← neutro |
| baixa ×0,92 | 26,5% | 17,2% | 16,9% ← passou do ponto |

**Adotado: alta ×1,00 · média ×0,97 · baixa ×0,94.** Na liga cheia o pódio
passa a cair junto com o ritmo sem inversão, e a surpresa sobrevive (pior
colocação do Einstein em 8.000 ciclos: 5º).

**Nota de autoria:** com esses fatores, ritmo máximo + constância alta vence
66% dos ciclos; o mesmo ritmo com constância média cai pra 47% e com baixa
pra 39%. Dominância se ajusta escrevendo os 114 personagens, não no código.

### O que entrou no código

| Arquivo | O que |
|---|---|
| `GamePage.jsx` | `firstKeyAt` (1ª tecla, no `onChange` dos 3 inputs), marcadores de descarte (`abaEscondida` via `visibilitychange`, `powerupNaQuestao`, `questaoIdx`) e os campos `dec`/`flu`/`q1` no registro da questão |
| `utils/index.js` | `diaNum()`, `ULT_MAX` (20), `DIAS_MAX` (10), `CALIBRA_MAX` (5000) |
| `App.jsx` | grava `ult` e `dias` por fato no `factStats` e acumula o `calibra` |
| `lib/storage.js` | `calibra: []` no default |

Nenhuma regra do jogo mudou: nenhum XP, nenhuma faixa, nenhuma tela.

### 🚨 O bug que estava por trás de tudo

O Davi abriu o console do próprio navegador e mandou o print:

```
Uncaught ReferenceError: prev is not defined
    at App.jsx:521:67
    at callEnd (GamePage.jsx:262:29)
```

`multiplicadorLoot(prev)` estava **fora** do `update()`. O `prev` só existe
dentro do callback — ali fora é variável inexistente. Resultado: **toda
partida quebrava ao terminar**, desde a 6.0.46. Nada era salvo (XP, moedas,
ofensiva, missões, recorde, loot) e a tela ficava presa no jogo.

Corrigido pra `multiplicadorLoot(data)` — o estado do componente, que é o de
ANTES desta partida, mesmo padrão do `potionMultiplier` logo abaixo.

**Como escapou:** entrou na sessão 097 junto com a penalidade de loot da zona,
e ninguém jogou uma partida de verdade depois. `npm run build` não pega: é
erro de runtime, dentro de um callback que só roda ao terminar a partida.

**E foi ele que travou a verificação da Fase 0 a tarde inteira.** As partidas
do navegador automatizado nunca terminavam e eu fui culpando o harness —
throttling de `setInterval`, ordem de leitura da pergunta, escape de regex.
Tudo isso existia, mas o motivo real era o jogo quebrando no fim da partida.
**Lição:** quando a mesma verificação falha por três motivos diferentes,
desconfiar do alvo, não só do instrumento.

### ✅ Verificação da Fase 0 — feita, depois do fix

Partida de verdade no navegador, terminada de verdade ("Tarefa concluída!"):

```
=== factStats: 3 fatos tocados ===
 6x9: count=1 correct=0 wrong=1
      ult  = [{"ok":0,"d":3414,"t":1788194437244}]
      dias = [20696]

=== calibra ===
 { "fk":"4x10", "ok":0, "d":3368, "tot":3450, "flu":1, "q1":1 }
 { "fk":"3x6",  "ok":0, "d":245,  "tot":341,  "flu":1, "q1":0 }
```

`ult`, `dias`, `calibra`, `d` (tempo de decisão), `flu` e `q1` — tudo
gravando.

**E o dado já confirmou a hipótese que motivou o `firstKeyMs`:** a digitação
foi **~28% do tempo total** nessa amostra. Medir fluência pelo tempo até o
envio estaria misturando quase um terço de motor com pensamento.

**Confirmado também no navegador do Davi** (partida real, 15 acertos / 3
erros): `calibra.slice(-5)` devolveu as 5 tentativas e `factStats.mult` os
fatos com histórico.

### Resumo da coleta no console (só em DEV)

Conferir isso pelo console na mão é chato: o DevTools bloqueia colar comando e
a frase de desbloqueio muda de idioma (em português é *"permitir colar"*, e o
aviso some depois de um tempo, o que fez a frase ser avaliada como código e dar
`SyntaxError`).

Então cada fim de partida passa a imprimir sozinho, **só em DEV**, quantas
tentativas foram gravadas, quantas têm tempo de decisão, a mediana de decisão
vs. total (com o % que é digitação) e uma `console.table` das últimas 8.
`import.meta.env.DEV` é false no build de produção — o Vite remove o bloco
inteiro do bundle.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `ARQUITETURA_XP.md` | **novo** — v1 → … → **v7**: consenso fechado, Tabela-Mãe, Plano de Resgate, histórico desenhado por consulta e a liga verificada por simulação |
| `src/utils/index.js` | `momentoDaPerda`, `mesAtual`, `deveAvisarOfensivaPerdida`; `em` agora é a meia-noite real |
| `src/App.jsx` | estado local do aviso, marca do mês, recuperação limitada ao dia |
| `src/constants/leaguePhrases.js` | `COR_POSICAO` |
| `src/pages/MenuPage.jsx` | posição pintada pela situação |
| `src/pages/GamePage.jsx` | **Fase 0** — `firstKeyMs`, descartes, `dec`/`flu`/`q1` |
| `src/utils/index.js` | **Fase 0** — `diaNum`, `ULT_MAX`, `DIAS_MAX`, `CALIBRA_MAX` |
| `src/App.jsx` | **Fase 0** — `ult`/`dias` por fato + `calibra` |
| `src/lib/storage.js` | **Fase 0** — `calibra: []` |

---

## 📋 Para a PRÓXIMA CONVERSA

1. **Seção 10 do `ARQUITETURA_XP.md`** — três coisas dependem do Davi: ligar
   a **Fase 0** (`firstKeyMs` + log de tentativas; invisível, risco zero),
   confirmar o **Header** (XP vira número, barra vira domínio) e decidir sobre
   **teste de placement** na entrada.
2. **Ícones das conquistas** — ele vai gerar.
3. **Tipos de pontuação por faixa** (100/200/500/1000) — destravado agora que
   a pergunta sobre os pontos foi respondida (eles ficam).
4. **Dívida:** modal "Defina sua meta" abre por cima do conteúdo na primeira
   visita.
5. Conferir na prática o balanceamento da zona de rebaixamento.
