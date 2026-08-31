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

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `ARQUITETURA_XP.md` | **novo** — análise + regra de escala pros modos; **v2** com XP + Domínio e a calibração |
| `src/utils/index.js` | `momentoDaPerda`, `mesAtual`, `deveAvisarOfensivaPerdida`; `em` agora é a meia-noite real |
| `src/App.jsx` | estado local do aviso, marca do mês, recuperação limitada ao dia |
| `src/constants/leaguePhrases.js` | `COR_POSICAO` |
| `src/pages/MenuPage.jsx` | posição pintada pela situação |

---

## 📋 Para a PRÓXIMA CONVERSA

1. **Decidir os 5 itens da seção 8 do `ARQUITETURA_XP.md`** — nada de XP muda
   antes disso, e nenhum modo novo entra antes disso.
2. **Ícones das conquistas** — ele vai gerar.
3. **Tipos de pontuação por faixa** (100/200/500/1000) — destravado agora que
   a pergunta sobre os pontos foi respondida (eles ficam).
4. **Dívida:** modal "Defina sua meta" abre por cima do conteúdo na primeira
   visita.
5. Conferir na prática o balanceamento da zona de rebaixamento.
