# Sessão 042 — Reversão da 4.0: de volta ao foco (só multiplicação)

**Data:** 2026-07-06
**Versão:** 3.16.1 → **3.17.0**
**Tipo:** Decisão estratégica + reversão de escopo (ver `DECISIONS.md` D014)

---

## O que aconteceu

Davi trouxe uma reflexão importante depois de fechar o roadmap 4.0: o jogo
estava perdendo o propósito original. O Tabuada Rush nasceu de um problema
pessoal dele — decorar a tabuada sem ter que escrever "2×1, 2×2, 2×3..."
toda vez à mão. Com o tempo o jogo cresceu bastante (XP, níveis, QI,
loja, missões, temporadas...) e a 4.0 foi mais um passo: multiplicação
virou "as 4 operações fundamentais". Só que aí o objetivo deixou de ser
específico ("decorar a tabuada") e virou vago ("ser bom em matemática") —
e ele nem tinha decorado a tabuada ainda.

Discutimos 3 caminhos (registrados no chat): manter só multiplicação,
virar um jogo de matemática completo dentro do Tabuada Rush, ou manter só
multiplicação agora e — se um dia fizer sentido — criar o "jogo de
matemática completo" como projeto SEPARADO depois. Davi escolheu a
terceira, com uma condição importante: **reverter só a amplitude de
operações, não a inteligência adaptativa** (curva de esquecimento, viés
adaptativo, gamificação) — essa parte da 4.0 ele quer manter.

Ver `DECISIONS.md` D014 para o registro formal completo.

---

## O que foi removido

- `OPERATIONS.add`/`.sub`/`.div` do registro central (`utils/index.js`) —
  só `mult` continua existindo
- `getGridQuestion`, `getDivQuestion`, `cellFact`, `isValid`,
  `resolveCellFact` — mecanismos que só existiam pra sustentar add/sub/div
- Seletor de Operação no `ModesPage` (× Multiplicação / + Adição /
  − Subtração / ÷ Divisão)
- Abas de operação no Mapa de Domínio (`AccuracyCatalogPage`) e nos
  Certificados (`AchievementsPage`)
- Radar "Domínio por Operação" (só fazia sentido comparando 4 operações)
- Certificado "Matemática Fundamental Completa" (idem)
- Bônus de amplitude no `computeQI` (média de domínio nas 4 operações)
- Componente `OperationTabs` (sem mais nenhum uso)
- `data.selectedOperation`, `activeOperation` (App.jsx), `operation` prop
  do `GamePage`, `MULT_ONLY_MODES`

## O que foi MANTIDO (a pedido explícito do Davi)

- **Curva de esquecimento** (`predictRecallProbability`/`getFactsAtRisk`,
  Fase 4) — continua rodando sobre `factStats.mult`
- **Motor preditivo no Modo Revisão** — o componente de "staleness" na
  fórmula de dificuldade (40% erro / 25% velocidade / 15% volume / 20%
  tempo desde a última prática)
- **Banner "Fatos a Vencer"** + lembrete local no Menu
- **Viés adaptativo por fatos fracos** (`getWeakPool` + `forcedRow`) em
  Rush/Sobrevivência/Velocidade/Zen + toggle "Foco em Fraquezas" nas
  Configurações

## O que NÃO foi tocado

- **Dados órfãos**: se o Davi jogou soma/subtração/divisão durante a
  janela em que a 4.0 esteve ativa (sessões 036-040), esses dados
  (`factStats.add`/`.sub`/`.div`) continuam no `localStorage`/Supabase —
  só não são mais lidos por nada. Removê-los seria uma limpeza de dados
  arriscada e desnecessária; ficam órfãos e inofensivos.
- **`getFactKey`/`getFactSpace`/`computeCertificates`** continuam com um
  parâmetro `operation` genérico (default `'mult'`) — simplificados de
  volta pra forma da Fase 1 (sem `isValid`/`cellFact`), mas mantendo a
  assinatura. Não valia a pena o esforço de remover esse parâmetro
  vestigial (baixo risco, zero impacto no produto).

---

## Verificação

- `npm run build`: ✅ 0 erros, 2778 módulos, bundle ~12KB menor que antes
  da reversão
- `grep -r` no `src/` por `OPERATION_ORDER`, `OperationTabs`,
  `computeOperationMastery`, `selectedOperation`, `cellFact`,
  `MULT_ONLY_MODES`: **zero resultados** — sem código morto
- Testado no navegador:
  - Modos de Jogo sem seletor de operação, lista de modos igual à pré-4.0
  - Zen gerou "6 × 3" corretamente (símbolo `×` hardcoded de volta)
  - Configurações mantém o toggle "Foco em Fraquezas" (Fase 5 intacta)
  - Conquistas: Certificados "Tab. 2" a "Tab. 9" sem abas, sem card
    supremo — dados reais de domínio total (de testes anteriores)
    corretamente exibidos (8/8, 10/10 cada)
  - Catálogo de Precisão: Mapa de Domínio voltou ao texto/formato
    original ("80 fatos fundamentais (2×1 até 9×10)"), sem radar acima

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | Removidos add/sub/div, `cellFact`, `isValid`, `computeOperationMastery`, `hasFullMasteryCertificate`, bônus de amplitude do QI; simplificados `getFactSpace`/`computeCertificates`/`generateQuestion` |
| `src/lib/storage.js` | Removido `selectedOperation` dos DEFAULTS |
| `src/pages/GamePage.jsx` | Removida prop `operation`, `MULT_ONLY_MODES`, `opSymbol` (volta a `×` hardcoded) |
| `src/App.jsx` | Removido estado `activeOperation`, lógica de operação em `startGame` |
| `src/pages/ModesPage.jsx` | Removido seletor de operação |
| `src/pages/AccuracyCatalogPage.jsx` | Removido radar e abas; `MasteryMap` simplificado pra mult-only |
| `src/pages/AchievementsPage.jsx` | Removido certificado supremo e abas |
| `src/components/ui/index.jsx` | Removido `OperationTabs` (sem uso) |
| `DECISIONS.md` | + D014 (registro formal da decisão) |
| `CHANGELOG.md` | entrada [3.17.0] |
| `MEMORY_CORE.md` | Roadmap 4.0 reanotado — só o pilar "Inteligência Adaptativa" sobrevive |
| `MEMORY.md` | Arquitetura/schema atualizados |
| `sessions/sessao-042.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Filosofia do projeto, reafirmada:** Tabuada Rush = decorar a tabuada
  de multiplicação. Ponto. A inteligência adaptativa (curva de
  esquecimento, viés por fraqueza) continua servindo esse objetivo único.
- **Sem roadmap formal em aberto.** Próxima sessão: uso real — Davi
  jogando pra de fato decorar a tabuada, e me contando o que sentir no
  caminho (isso vira "pequenas iterações" ou "polimento" concreto, ao
  contrário das categorias abstratas do resumo anterior).
