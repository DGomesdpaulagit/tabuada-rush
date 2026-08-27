# Sessão 088 — Barra de missão estilo Duolingo + primeira rodada de balanceamento

**Data:** 2026-08-27
**Versão:** 6.0.36 → 6.0.37
**Tipo:** Visual + economia

---

## 1. Barra da missão no estilo da referência

O Davi mandou um print do Duolingo: a barra **passa por baixo do baú**, o
baú fica encavalado na ponta, e o número do progresso vai **dentro** da
barra. Refeito assim (`MissionProgress`, usado na aba Missões e na página
3 do resumo):

- barra grossa (h-5) com o número dentro (`10 / 15`)
- baú com margem negativa, sobreposto ao fim da barra
- preenchimento **sempre na cor da moeda** — a barra "enche de moeda" até
  o baú. Antes era verde quando incompleta e amarela quando completa, o
  que invertia a leitura (verde já parece "pronto")
- o número fica escuro quando o preenchimento passou da metade e claro
  quando ainda está sobre o trilho — legível nos dois casos
- baú fechado deixou de ficar apagado: o estado já é dado por
  fechado/aberto

A linha de texto que ficava embaixo ("0/15 acertos seguidos") saiu — a
unidade já está na descrição da missão, logo acima.

## 2. Poções nas recompensas de missão — descartado por ele

O Davi levantou a ideia de dar poções além de moedas nas missões e
**desistiu na mesma mensagem**: "vai dar mal rolo, vai ter que colocar
ícone de sei lá o quê. Deixa só com as moedinhas mesmo." Registrado aqui
pra não ressuscitar a ideia por engano.

## 3. Economia: o que eu mudei e o que descobri

### O que ele pediu
Ficou fácil demais ganhar moeda: **0 → 896 moedas em 2 partidas**. E:
"quero tirar essa regra de até 15 moedas por partida, cria o seu sistema".

### Achado 1 — o texto da Loja estava mentindo
A Loja dizia *"Até 15 moedas por partida (0.3 × acertos)"*. O código já
fazia **0.15 × acertos, teto 8** desde a v5.0. O texto ficou desatualizado
por duas versões — era essa a "regra de 15 moedas" que ele queria tirar.
Corrigido, e deixei um aviso no código pra atualizar os dois juntos.

### Achado 2 — a partida em si NÃO é a fonte da inflação
Simulando as fontes com os números atuais:

| Fonte | Moedas por partida |
|---|---|
| Partida em si | **2 a 7** |
| **Baús de loot** | **~96** (partida curta) a **~257** (partida longa) |

O baú médio vale **321 moedas** — porque 27% das vezes que um baú cai ele
é de Ouro (650) ou Místico (1000). As 896 moedas dele em 2 partidas vieram
daí, não do ganho por partida.

### O que mudei agora (o que ele autorizou explicitamente)

- **Moeda por partida:** taxa 0.15 → **0.12** (1 moeda a cada ~8 acertos),
  teto 8 → **6**. Com ofensiva, máximo 7/partida. O piso de 1 moeda
  continua, pra quem acertou pouco não sair de mãos vazias.
- **Missões diárias com alvos maiores** (recompensas iguais):

| Missão | Antes | Agora |
|---|---:|---:|
| Partidas | 1 e 3 | **2 e 5** |
| Acertos numa partida | 20 | **35** |
| Acertos no dia | 50 | **120** |
| Sequência | 10 e 15 | **15 e 25** |
| Pontuação | 100 e 200 | **250 e 500** |
| Precisão | 80% e 90% | **iguais** |

As de precisão não mudaram — são de qualidade, não de quantidade, e 90%
já é difícil. Os **desafios mensais ficaram como estavam**, ele disse que
estão bons.

### O que NÃO mexi — e precisa da decisão dele

Os **baús de loot** são ~93% da renda, e os números deles (probabilidade e
faixa de moedas) foram especificados por ele na Fase 6. Mexer sem
confirmar seria contrariar especificação dele. Levei o diagnóstico com as
opções pra ele escolher — está em `PENDENCIAS.md`.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/MissionsPage.jsx` | `MissionProgress` (barra nova) + `progressCompact` |
| `src/pages/PostGameSummary.jsx` | mesma barra na página 3 |
| `src/constants/missions.js` | pool diário recalibrado |
| `src/App.jsx` | fórmula de moedas por partida |
| `src/pages/ShopPage.jsx` | texto corrigido |
| `PENDENCIAS.md` | decisão dos baús |

---

## Status para retomar

1. **Decisão do Davi sobre os baús** (as 3 opções em `PENDENCIAS.md`) — é
   o que de fato controla a inflação de moedas.
2. **FASE 8 — reformulação do painel da Arena**, que ele já disse que vem
   na sequência.
