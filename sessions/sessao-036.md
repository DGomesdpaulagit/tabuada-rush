# Sessão 036 — Tabuada Rush 4.0 · FASE 2 (Soma e Subtração)

**Data:** 2026-07-06
**Versão:** 3.11.0 → **3.12.0**
**Tipo:** Implementação (Fase 2 do roadmap 4.0 — primeiro conteúdo novo além de multiplicação)
**Próxima sessão:** Fase 3 — Divisão

---

## Resumo

Primeira fase da 4.0 com conteúdo visível ao jogador. Usa a fundação da Fase 1
(`OPERATIONS`, `getFactKey`, `getFactSpace`, `generateQuestion`, schema
namespaced) para adicionar **Soma** e **Subtração** como operações reais,
selecionáveis pelo jogador, com Mapa de Domínio e Certificados próprios.

---

## O que foi feito

### 1. Soma e Subtração no registro `OPERATIONS` (`src/utils/index.js`)
- `add`: comutativa, operandos 0-10 dos dois lados (soma 0-20)
- `sub`: **não-comutativa**, minuendo e subtraendo 0-10, com `isValid: (a,b) =>
  a >= b` — resultado nunca negativo. Isso cria uma grade **triangular** (nem
  toda combinação (a,b) existe) em vez do retângulo cheio da multiplicação
- Novo mecanismo genérico `isValid` — necessário porque subtração (e, na Fase
  3, divisão) têm combinações impossíveis que multiplicação/soma não têm

### 2. `isValid` propagado por toda a Fase 1
`getFactSpace`, `computeCertificates` e o `MasteryMap` foram atualizados para
filtrar combinações inválidas:
- `getFactSpace('sub')` = 66 fatos únicos (não 121) — só pares com `a >= b`
- `computeCertificates(..., 'sub')`: cada linha tem um **total variável**
  (linha `0−`: 1 fato só; linha `10−`: 11 fatos) — sem isso, certificados de
  subtração nunca fechariam (contariam combinações que nunca podem existir)
- `MasteryMap`: células inválidas viram um placeholder cinza-claro (`·`),
  fora da contagem — o resultado visual é uma grade triangular bonita

### 3. Gerador de questões (`getGridQuestion` + `generateQuestion`)
- Nova função interna `getGridQuestion(operation, diffLevel)` para operações
  "de grade" (add/sub) — mesma lógica de dificuldade progressiva por
  `diffLevel` que a multiplicação já tinha (teto de operando 5→8→10)
- `generateQuestion` ganhou os casos `'add'`/`'sub'`

### 4. Seletor de Operação (`ModesPage.jsx` + novo `OperationTabs`)
- Novo componente `OperationTabs` (`components/ui/index.jsx`) — segmented
  control reaproveitado em 3 lugares (seletor de modos, Mapa de Domínio,
  Certificados)
- `data.selectedOperation` (novo campo persistido, default `'mult'`) — afeta
  **Rush, Sobrevivência, Velocidade, Zen e Revisão**
- Desafio Diário/Semanal e os modos Avançados (Difícil, Recorde Pessoal,
  Combinado, Inverso) continuam **sempre** multiplicação — são conceitos ou
  benchmarks específicos de multiplicação, ou exigem conteúdo idêntico entre
  jogadores (leaderboard justo)

### 5. `GamePage.jsx` — thread da operação ponta a ponta
- Nova prop `operation`; `MULT_ONLY_MODES` normaliza para `'mult'` os modos
  que devem ignorar o seletor (evita que Daily/Hard/etc. herdem "add"/"sub"
  s incorretamente)
- Símbolo exibido (`×`/`+`/`−`) agora vem de `OPERATIONS[state.operation]`
  em vez de hardcoded
- Cada questão registrada (`questionLog`) agora carrega `operation` — campo
  renomeado de `op` (Fase 1) para `operation` para não colidir com
  `state.question.op` (o operador +/− interno do Modo Combinado)

### 6. Agregação e telas (renomeação `op` → `operation`)
- `App.jsx::handleGameEnd` lê `q.operation || 'mult'` (era `q.op`)
- `AccuracyCatalogPage.jsx`: abas de operação acima do Mapa de Domínio
- `AchievementsPage.jsx`: abas de operação acima dos Certificados — rótulo
  mult continua "Tab. N" (não mexi em texto já estabelecido); add/sub usam
  símbolo (`+7`, `−7`)

---

## Verificação (ponta a ponta, no navegador)

Testado ao vivo no preview (não só lógica isolada):
1. `generateQuestion`/`getFactSpace`/`computeCertificates`/`parseFactKey`
   testados via `import()` dinâmico contra o bundle real — todos corretos
   (66 fatos add, 66 fatos sub, totais variáveis por linha na subtração)
2. **Fluxo completo no app**: Menu → Escolher Modo → trocar para "Adição" →
   Rush gerou "1 + 3" corretamente
3. Trocado para "Subtração" → Rush gerou "3 − 0", depois "5 − 4" (NEXT do
   reducer também respeita a operação)
4. **Sobrevivência em Subtração até perder** (3 erros de propósito) →
   `handleGameEnd` disparou → `localStorage` confirmado:
   `tableStats.sub["5"]` e `factStats.sub["sub:5-3"]`/`["sub:5-4"]`
   gravados corretamente, **`tableStats.mult` intacto** (sem contaminação)
5. Certificados → aba Subtração → `−0: 0/1` até `−10: 0/11` (bate exatamente
   com a fórmula `a+1` esperada para `isValid`)
6. Mapa de Domínio → aba Subtração → grade triangular correta, com `5−3` e
   `5−4` classificados como "Praticado" (erramos de propósito, então 0% de
   acerto — mas registrou dados, então não é "sem dados")

**Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~15-25s)

---

## Decisões técnicas

1. **`isValid` em vez de forçar retângulo cheio** — cogitei restringir o
   domínio da subtração para nunca ter combinação inválida (ex.: minuendo
   sempre ≥ 10), mas isso excluiria "7−3" (subtração pequena, muito comum).
   `isValid` é mais fiel pedagogicamente, ao custo de precisar propagar o
   filtro em 3 lugares (`getFactSpace`, `computeCertificates`, `MasteryMap`).
2. **Soma e subtração compartilham o range 0-10** — soma vai de 0 a 20;
   subtração nunca é negativa. Escopo deliberadamente simples (mirror do "2-9
   /1-10" da multiplicação) — pode expandir depois (mesmo padrão do "Tabuada
   do 11/12" opcional da v3.8).
3. **Renomeei `op` → `operation`** no campo que marca a operação de uma
   questão registrada — `op` já tinha um significado (o operador +/− do
   Modo Combinado) e a colisão de nomes ia confundir leitura futura.
4. **Records/conquistas/moedas continuam POR MODO, não por operação** —
   jogar Rush em soma ou em multiplicação afeta o mesmo `records.rush`. Não
   segmentei por operação (escopo explodiria: economia, missões, QI, etc.
   teriam que virar cientes de operação). Trade-off aceito para a Fase 2.
5. **Flashcard/SRS continuam mult-only** — não estava na lista "reaproveitar
   modos" do planejamento (sessao-034). Fica para uma fase futura se
   desejado.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | `OPERATIONS.add`/`.sub`, `isValid` em `getFactSpace`/`computeCertificates`, `getGridQuestion`, `generateQuestion` com add/sub, `getRevisionQuestions` generalizado |
| `src/lib/storage.js` | `DEFAULTS.selectedOperation = 'mult'` |
| `src/components/ui/index.jsx` | novo `OperationTabs` |
| `src/pages/ModesPage.jsx` | seletor de operação (afeta Rush/Sobrevivência/Velocidade/Zen/Revisão) |
| `src/pages/GamePage.jsx` | prop `operation`, `MULT_ONLY_MODES`, símbolo dinâmico, `questionLog` com `operation` |
| `src/App.jsx` | `handleGameEnd` lê `q.operation`; `startGame` passa operação pro Modo Revisão; `GamePage` recebe `operation` |
| `src/pages/AccuracyCatalogPage.jsx` | abas de operação no Mapa de Domínio; células inválidas tratadas |
| `src/pages/AchievementsPage.jsx` | abas de operação nos Certificados |
| `CHANGELOG.md` | entrada [3.12.0] |
| `MEMORY_CORE.md` | Fase 2 marcada ✅, próxima sessão = Fase 3 |
| `MEMORY.md` | schema/versão atualizados |
| `sessions/sessao-036.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Fase 2 da 4.0:** ✅ completa — Soma e Subtração jogáveis, com Mapa de
  Domínio e Certificados próprios
- **Próxima sessão:** Fase 3 — Divisão. Ideia já registrada em sessao-034:
  bootstrap do domínio de divisão a partir dos dados de multiplicação
  existentes (`a×b=c` → `c÷a=b`), avaliar se reaproveita o Modo Inverso.
  Divisão também vai precisar de `isValid` (só divisões exatas).
