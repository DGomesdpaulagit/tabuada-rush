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

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `ARQUITETURA_XP.md` | **novo** — v1 análise → v2 XP + Domínio → v3 faixa = domínio → **v4** nota composta, fluência relativa e as 2 peças faltando no código |
| `src/utils/index.js` | `momentoDaPerda`, `mesAtual`, `deveAvisarOfensivaPerdida`; `em` agora é a meia-noite real |
| `src/App.jsx` | estado local do aviso, marca do mês, recuperação limitada ao dia |
| `src/constants/leaguePhrases.js` | `COR_POSICAO` |
| `src/pages/MenuPage.jsx` | posição pintada pela situação |

---

## 📋 Para a PRÓXIMA CONVERSA

1. **Três perguntas em aberto na seção 11 do `ARQUITETURA_XP.md`**: Teste de
   Faixa (mecânica nova), fatia de interleaving das faixas antigas, e a barra
   do Header virando domínio. A arquitetura está fechada; antes de codar
   faltam 2 peças (`firstKeyMs` e sorteio ponderado) — sem elas o domínio não
   funciona.
2. **Ícones das conquistas** — ele vai gerar.
3. **Tipos de pontuação por faixa** (100/200/500/1000) — destravado agora que
   a pergunta sobre os pontos foi respondida (eles ficam).
4. **Dívida:** modal "Defina sua meta" abre por cima do conteúdo na primeira
   visita.
5. Conferir na prática o balanceamento da zona de rebaixamento.
