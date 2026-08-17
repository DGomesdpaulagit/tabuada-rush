# Sessão 046 — Tabuada Rush 6.0: Bloco 3 (Progressão de tabuada)

**Data:** 2026-08-17
**Versão:** 6.0.0-bloco2 → 6.0.0-bloco3
**Tipo:** Implementação

---

## O que aconteceu

Continuação direta da sessão 045 (Davi pediu ritmo contínuo pelos blocos). Antes de
implementar, levantei um ponto que merecia confirmação explícita: o áudio original
pedia faixas de tabuada até fator 200, mas isso colide com um princípio que o próprio
Davi fixou antes (reverteu a 4.0 por diluir o propósito do jogo — "decorar A
tabuada, ponto"). Perguntei diretamente se o fator da pergunta deveria mesmo ir até
200 (virando prática de cálculo mental além da tabuada tradicional) ou se "faixa"
deveria significar outra coisa (maestria dentro de 2-12). Davi confirmou, ciente do
trade-off, que quer o fator até 200 de verdade. Ver DECISIONS.md D022 pro registro
completo — diferente da 4.0, aqui o aviso veio ANTES de eu escrever qualquer código.

### Faixas de tabuada (substitui os 28 níveis abstratos)

- `constants/index.js` — `LEVELS` deixou de ser uma lista hardcoded de 28 nomes
  (Iniciante/Aprendiz/.../Transcendente) e virou 20 faixas geradas
  (`buildTabuadaTiers()`): 2×10, depois de 10 em 10 até 190×200. Cada faixa ganhou
  `rangeMin`/`rangeMax` (novo) além dos campos que já existiam (`name`/`title`/
  `xp`/`badge` — mantidos de propósito pra não precisar tocar em
  `getLevelIdx`/`getXpProgress`/etc, que já sabem ler esse formato).
- **Calibração da 1ª faixa:** 24.000 XP, estimado pra ~8 meses de prática diária
  (~100 XP/dia assumido — 2-3 partidas de Rush), dentro da janela de 6-10 meses que
  o Davi pediu. **É estimativa, não medição real** — não existe telemetria de
  jogadores ainda pra calibrar de verdade; documentei isso explicitamente no código
  e no D022 pra não passar a impressão de número definitivo.
- Faixas seguintes ficam progressivamente mais rápidas (delta de XP cai 18% por
  faixa, chão de 1.500 XP) — reflete "quanto mais tabuada eu já sei, mais fácil
  fica aprender a próxima", como o Davi descreveu.
- Nome de exibição: só o intervalo ("Tabuada 2×10"), sem nome fantasia — Davi
  escolheu essa opção quando perguntei.

### Motor de perguntas passa a respeitar a faixa

- `utils/index.js` — `getRandomQuestion`/`generateQuestion` ganharam parâmetro
  `tierRange` — quando presente, o fator `a` é sorteado dentro da faixa atual do
  jogador (ex. faixa 190×200 → `a` entre 190 e 200) em vez do pool fixo 2-10/12 que
  existia antes. Pool fixo virou só fallback (nenhuma chamada real usa mais isso,
  mas mantido por segurança/testes). Fator `b` continua 1-10 sempre — preserva a
  estrutura de "tabuada" (cada faixa ainda é tipo uma tabela de multiplicação, só
  que o multiplicando sobe).
- `getTierRange(data)` (novo, `utils/index.js`) — deriva `[rangeMin, rangeMax]` da
  faixa atual via `getLevelIdx`, ponto único de entrada pro `GamePage`.
- `GamePage.jsx` — `init()` e o case `NEXT` do reducer passam `tierRange` pro
  `generateQuestion`. Guardado em `state.tierRange` (calculado 1x no início da
  partida via `getTierRange(data)`, não recalculado a cada pergunta — se o jogador
  subir de faixa NO MEIO de uma partida, ela termina na faixa em que começou; só a
  próxima partida usa a faixa nova. Comportamento razoável, não documentei como
  decisão formal por ser detalhe pequeno, mas registro aqui caso o Davi ache
  estranho depois).
- `Header.jsx` — selo esquerdo mostra a faixa real (`rangeMin×rangeMax`, ex.
  "2×10") em vez do número de nível abstrato que tinha antes.

---

## Verificação

`npm run build` limpo. Mesma limitação de ambiente das sessões anteriores (sem
composição de frame) — verifiquei via manipulação de `localStorage` + inspeção de
DOM:
- `xp: 0` → Header mostra `🌱 2×10` (primeira faixa, badge correto)
- `xp: 300000` (bem acima do total das 20 faixas) → Header mostra `🦉 190×200`
  (última faixa, badge correto — `getLevelIdx` não estourou o array, ficou preso
  corretamente na última faixa em vez de quebrar ou apontar pra faixa errada)

**Não verificado nesta sessão:** o motor de perguntas gerando de verdade um fator
alto (tipo "190 × 6") dentro de uma partida jogada — a lógica é simples e revisada
(`getRandomQuestion` com `tierRange` é só um loop que monta o pool `[min..max]`,
baixo risco), mas não consegui montar uma partida completa neste ambiente pra ver o
número aparecer na tela de verdade. Mesma ressalva das sessões 044/045.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `sessions/planejamento-6.0.md` | Marca a seção 6 (Progressão) como implementada + decisões |
| `DECISIONS.md` | D022 — faixas até fator 200, confirmado com o Davi antes de implementar |
| `src/constants/index.js` | `LEVELS` reescrito — 20 faixas de tabuada geradas, com `rangeMin`/`rangeMax` |
| `src/utils/index.js` | `getRandomQuestion`/`generateQuestion` aceitam `tierRange`; `getTierRange(data)` novo |
| `src/pages/GamePage.jsx` | `tierRange` computado e propagado pro motor de perguntas |
| `src/components/Header.jsx` | Selo de faixa real em vez de número de nível |
| `sessions/sessao-046.md` | este arquivo |

---

## Status para retomar

**Pendências desta sessão:** nenhuma dentro do escopo do Bloco 3.

**Próximo passo:** Bloco 4 — Ligas (substitui Ranking de QI). Mesmo ritmo contínuo
pedido pelo Davi, mas essa é a faixa de blocos com MAIS pontos "não sei ainda"
listados no planejamento (nº de personagens por liga, tamanho das zonas de
promoção/rebaixamento) — vou propor números concretos com a lógica por trás em vez
de travar esperando resposta, mas vou sinalizar claramente que são chute
educado, não medição, do mesmo jeito que fiz com a calibração de XP deste bloco.
