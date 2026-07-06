# Sessão 035 — Tabuada Rush 4.0 · FASE 1 (Fundação Multi-Operação)

**Data:** 2026-07-06
**Versão:** 3.10.0 → **3.11.0**
**Tipo:** Implementação (Fase 1 do roadmap 4.0 — arquitetura, sem feature visível)
**Próxima sessão:** Fase 2 — Soma e Subtração

---

## Resumo

Primeira sessão de implementação da Tabuada Rush 4.0 (planejada em
`sessao-034.md`). Fase 1 é pura fundação: nenhuma feature nova visível ao
jogador, mas sem ela soma/subtração/divisão (Fases 2/3) virariam gambiarras
coladas em cima de um código 100% hardcoded para multiplicação.

**Comportamento observável: idêntico ao pré-4.0.** Validado por build limpo,
teste de migração com dado legado real e execução ao vivo das novas funções
no navegador.

---

## O que mudou

### 1. Schema multi-operação (`src/lib/storage.js`)
- `tableStats` / `factStats` / `srsData` agora são namespaced por operação:
  `{ mult: {...} }` em vez de um mapa "achatado" (só multiplicação, implícito).
- **Migração automática e retrocompatível**: `migrateOperationKeyedField()`
  detecta dado salvo por versões anteriores (sem nenhuma chave de operação
  conhecida no topo) e envolve o conteúdo inteiro em `{ mult: <dado antigo> }`.
  Idempotente — roda toda vez que `storage.get()` é chamado, mas só reembrulha
  se ainda não estiver no formato novo.
- `DEFAULTS` ganhou `factStats: { mult: {} }` e `srsData: { mult: {} }`
  (antes, cada call site fazia `data.factStats || {}` sem default central).

### 2. Registro de operações (`src/utils/index.js`)
- Novo `OPERATIONS` — registro central com metadados por operação. Hoje só
  `mult` tem conteúdo (`domainRows`/`domainCols`/`answer`/`symbol`/
  `commutative`); `add`/`sub`/`div` ficam reservados para as Fases 2/3.
- Novo `getFactKey(operation, a, b)` — chave canônica de um fato. Para
  operações comutativas (só `mult` por enquanto), normaliza min×max (3×7 e
  7×3 caem na mesma chave), exatamente como antes.
- `getAllFactKeys()` virou um alias retrocompatível de `getFactSpace('mult')`
  (nova função genérica, dirigida pelo registro `OPERATIONS` em vez de
  `for (a=2;a<=9...)` hardcoded). Continua devolvendo os mesmos **52** fatos
  únicos de sempre (dedup de pares comutativos — não são 80, ver nota abaixo).
- `parseFactKey(fk, operation = 'mult')` e `computeCertificates(factStats,
  operation = 'mult')` ganharam parâmetro opcional de operação, com default
  que preserva 100% o comportamento anterior.
- Novo `generateQuestion(operation, diffLevel, opts)` — ponto de entrada
  único para gerar uma questão de qualquer operação. Hoje só implementa
  `case 'mult'` (delega para `getRandomQuestion`, mesmo resultado de sempre).
  Fases 2/3 só precisam adicionar `case 'add'`/`'sub'`/`'div'` aqui.

### 3. Gerador unificado plugado no jogo (`src/pages/GamePage.jsx`)
- As 3 chamadas diretas a `getRandomQuestion(...)` (Inverso, primeira questão
  da partida, `NEXT` no reducer) agora passam por `generateQuestion('mult',
  ...)`. Comportamento idêntico — só prova a abstração de ponta a ponta antes
  de precisar dela de verdade na Fase 2.

### 4. Mapa de Domínio genérico (`src/pages/AccuracyCatalogPage.jsx`)
- `MasteryMap` ganhou prop `operation` (default `'mult'`) e agora lê
  `rows`/`cols`/símbolo/função de resposta do registro `OPERATIONS` em vez de
  arrays e `a * b` hardcoded na JSX. Texto do cabeçalho ("X fatos
  fundamentais...") também virou dinâmico.

### 5. Agregação por partida operação-aware (`src/App.jsx`)
- `handleGameEnd` agora lê `q.op || 'mult'` de cada questão registrada e
  agrega em `tableStats[op]`/`factStats[op]`, usando `getFactKey(op, a, b)`
  em vez de montar a chave na mão. Nenhum modo gera outra operação ainda —
  isso é só para a Fase 2 não precisar tocar nesta função de novo.

### Correção — total de certificados ainda hardcoded (`AchievementsPage.jsx`)
Davi pegou: a contagem de certificados desbloqueados (`{certsUnlocked}/8`)
ficou com o "8" hardcoded, quebrando a mesma generalização feita no
`MasteryMap`. Corrigido para `{certsUnlocked}/{certificates.length}` —
`certificates.length` já deriva de `OPERATIONS.mult.domainRows.length` via
`computeCertificates`. Sem mudança visível hoje (mult tem 8 tabuadas, mesmo
resultado de sempre), mas evita um número preso quando a Fase 2/3 reaproveitar
esta página para outras operações.

### Call sites atualizados para ler o slice `.mult`
`FlashcardPage.jsx`, `MenuPage.jsx`, `AchievementsPage.jsx`,
`ErrorsPage.jsx`, `AccuracyCatalogPage.jsx`, `GamePage.jsx` (init/reducer) e
`App.jsx` (Modo Revisão / Recorde Pessoal) — todos os pontos que liam
`data.tableStats`/`data.factStats`/`data.srsData` diretamente agora leem
`data.X?.mult || {}`.

---

## Nota: "52 fatos", não "80"

Comentários antigos no código diziam "80 fatos fundamentais (2×1 até 9×10)".
Na prática, a dedução via `Set` (3×7 e 7×3 = mesmo fato) sempre produziu
**52** chaves únicas — comportamento pré-existente, confirmado nesta sessão
via execução ao vivo no navegador, **não uma regressão desta Fase 1**. O
Mapa de Domínio continua desenhando a grade visual completa 8×10 (80
células), já que a mesma stat aparece em duas células (comutativas) — só o
espaço de fatos ÚNICOS para fins de SRS/certificados é 52. Não foi alterado
nesta sessão (fora de escopo — Fase 1 é "zero mudança de comportamento").

---

## Verificação

- **Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~17-22s)
- **Migração:** testada ao vivo no preview — seed de dado legado (formato
  achatado pré-4.0: `tableStats: {'7': {...}}`) → reload → confirmado
  reembrulhado em `{ mult: {...} }` automaticamente, sem erros no console
- **Funções novas:** testadas via `import()` dinâmico no console do navegador
  contra o bundle real — `getFactKey('mult',3,7) === getFactKey('mult',7,3)`,
  `getFactSpace('mult').length === 52`, `parseFactKey`, `generateQuestion`,
  `computeCertificates` todos corretos
- **Navegação visual (screenshot) além do Menu:** bloqueada pela limitação
  conhecida do preview headless (sem rAF — Framer Motion com
  `AnimatePresence mode="wait"` nunca completa a transição de saída, então a
  tela nova nunca monta). Já documentado em `MEMORY_CORE.md` como limitação
  da ferramenta, não bug do app. Compensado com teste de lógica via
  `import()` direto no bundle e revisão manual de cada call site (grep
  sistemático confirmando consistência).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/lib/storage.js` | DEFAULTS com factStats/srsData namespaced + migração automática |
| `src/utils/index.js` | `OPERATIONS`, `getFactKey`, `getFactSpace`, `generateQuestion`; `getAllFactKeys`/`parseFactKey`/`computeCertificates` generalizados (retrocompatíveis) |
| `src/App.jsx` | `handleGameEnd` operação-aware; call sites de Revisão/Recorde Pessoal lendo `.mult` |
| `src/pages/GamePage.jsx` | usa `generateQuestion('mult', ...)`; tableStats lido via `.mult` |
| `src/pages/AccuracyCatalogPage.jsx` | `MasteryMap` genérico (prop `operation`); tableStats/factStats via `.mult` |
| `src/pages/FlashcardPage.jsx` | srsData lido/escrito via `.mult` |
| `src/pages/MenuPage.jsx` | srsData lido via `.mult` |
| `src/pages/AchievementsPage.jsx` | factStats lido via `.mult` |
| `src/pages/ErrorsPage.jsx` | tableStats lido via `.mult` |
| `CHANGELOG.md` | entrada [3.11.0] |
| `MEMORY_CORE.md` | status + próxima sessão atualizados |
| `MEMORY.md` | schema de dados atualizado |
| `sessions/sessao-035.md` | este arquivo |

---

## Decisões técnicas

1. **Migração por detecção de forma, não por versão salva** — mais simples e
   robusto que guardar um número de versão de schema: se o campo já tem
   alguma chave de operação conhecida (`mult`/`add`/`sub`/`div`), está
   migrado; senão, o conteúdo inteiro É multiplicação.
2. **`mult` sem prefixo na chave do fato** (`"6x7"`, não `"mult:6x7"`) —
   operações comutativas usam o formato simples de sempre; só operações
   NÃO-comutativas (Fase 2/3: subtração, divisão) usam o formato
   `"op:a-b"` reservado, porque aí a ordem importa.
3. **`generateQuestion` já plugado no GamePage, mesmo com 1 operação só** —
   provar a abstração de ponta a ponta agora (zero mudança de comportamento)
   é mais barato do que descobrir na Fase 2 que ela não encaixa no reducer.
4. **Não mexi na discrepância "52 vs 80"** — é comportamento antigo, mudar
   agora seria alterar visível (contadores, certificados) sem pedido do
   Davi. Registrado aqui para não ser redescoberto como "bug" no futuro.

---

## Status para retomar

- **Build:** ✅ limpo
- **Fase 1 da 4.0:** ✅ completa — fundação multi-operação pronta
- **Próxima sessão:** Fase 2 — Soma e Subtração (conteúdo novo em cima desta
  fundação: pools de perguntas, Mapa de Domínio com abas, certificados
  adaptados). Ver `sessao-034.md` para o detalhamento completo da Fase 2.
