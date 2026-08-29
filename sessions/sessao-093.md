# Sessão 093 — Painel da Arena novo (blocos 8.3, 8.4 e 8.5)

**Data:** 2026-08-29
**Versão:** 6.0.41 → 6.0.42
**Tipo:** Implementação (FASE 8)

---

## A página inicial foi reescrita

O Davi liberou tirar o botão "Recompensas" ("para o mobile tenho algumas
edições mais pra frente"), então os três blocos do painel saíram juntos —
são a mesma tela.

### 8.5 — Os 3 modos como assunto principal

- **Caixa grande** com o modo MAIS JOGADO: nome, descrição e botão
  **"Jogar agora"**
- **Duas caixas menores** com o 2º e o 3º
- **Sem rótulo** dizendo que são os mais jogados, como ele pediu
- Quem nunca jogou vê a ordem padrão: Rush → Zen → Revisão
- Modo ainda bloqueado (Revisão) leva pra tela de Modos em vez de tentar
  iniciar

**De onde vem a contagem:** `data.sessions` guarda o `mode` de cada
partida — dá pra contar de lá. O campo `modesPlayed` que já existia só
diz QUAIS modos foram jogados, sem quantidade, então não servia.

### 8.3 — Caixa de divisão

Posição atual, escudo da divisão, **"Ver divisão"** no canto superior
direito e a **legenda da situação**, que é calculada de verdade a partir
de `promotionCount`/`relegationCount` da liga: "Você está na zona de
promoção!", "X posições acima da zona de rebaixamento!", "Cuidado: você
está na zona de rebaixamento!".

### 8.4 — Caixa de missões do dia

Só as diárias, com a mesma barra + baú da aba Missões (o `MissionProgress`
foi reaproveitado, sem duplicar código), e **"Ver todas"** no canto
superior direito.

### O que saiu da página

- **Card de perfil** (liga + ofensiva + meta): ofensiva e meta moram no
  painel do Header; a liga virou a caixa própria do 8.3
- **"X fatos prestes a serem esquecidos"** — pedido dele
- **Botão Recompensas** e o hub `RewardsPage` inteiro (arquivo apagado)
- **Insight da Análise Inteligente** — decisão minha: era mais um card de
  texto competindo com o que importa na tela, que é começar a partida.
  A análise continua inteira dentro de Estatísticas

### Layout

Duas colunas no desktop (modos à esquerda, divisão + missões à direita) e
uma coluna só no celular, com os modos primeiro. É o "canto direito" que
ele pediu, que no telefone não existe.

---

## Duas dívidas antigas resolvidas de passagem

1. **O título "Tabuada Rush" encostava nos botões** de configuração/login
   (anotado na revisão da sessão 086). Os botões eram `absolute` por cima
   do bloco do título; viraram uma linha própria.
2. **`bg-white` não serve neste projeto.** O botão "Jogar agora" saiu
   ilegível na primeira captura: no tema escuro o projeto **redefine o
   branco** (`bg-white` vira `#25252d`), então o botão ficava cinza escuro
   com texto escuro. Trocado por `bg-coin`, o mesmo amarelo do "Continuar"
   do resumo. **Fica o aviso pra quem for estilizar outra tela.**

Só peguei as duas porque capturei a tela — no DOM as duas passariam.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/MenuPage.jsx` | reescrita (8.3 + 8.4 + 8.5) |
| `src/pages/RewardsPage.jsx` | **apagado** |
| `src/App.jsx` | rota e import do hub fora; `onEditGoal` não é mais passado |

---

## Status para retomar

**Travados esperando arte do Davi:**
- **8.1** — folha dos troféus de faixa com fundo branco/transparente
  (`trofeus_faixas_fundo_branco.png`). Ele pediu pra ver a folha que
  chegou antes: está em
  `referencias/icones/faixas-tabuada/trofeus-faixas-folha.png`
- **8.2** — ícone de ofensiva apagada. Mandei duas versões dessaturadas
  pra ele escolher (cinza puro / cinza com respiro de cor); se não gostar,
  ele gera.

Com 8.1 e 8.2 a FASE 8 fecha.
