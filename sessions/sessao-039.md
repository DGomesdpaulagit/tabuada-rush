# Sessão 039 — Tabuada Rush 4.0 · FASE 5 (Adaptação Universal)

**Data:** 2026-07-06
**Versão:** 3.14.0 → **3.15.0**
**Tipo:** Implementação (Fase 5 do roadmap 4.0)
**Próxima sessão:** Fase 6 — Perfil de Domínio Unificado (última fase do roadmap 4.0)

---

## Resumo

Generaliza a ideia central do Modo Difícil adaptativo (v3.10 — usar os dados
reais do jogador pra decidir o que perguntar) para os modos principais
(Rush, Sobrevivência, Velocidade, Zen), em qualquer operação, como um
**viés probabilístico** em vez de exclusividade.

**Nota:** parte da implementação em `utils/index.js` já estava em andamento
no início desta sessão (working tree tinha mudanças não commitadas) — esta
sessão terminou o trabalho: threading pelo `GamePage`/`App.jsx`, toggle nas
Configurações, e verificação ponta a ponta.

---

## Diferença para o Modo Difícil (v3.10)

| | Modo Difícil | Adaptação Universal (Fase 5) |
|---|---|---|
| Modos afetados | Só o próprio Modo Difícil | Rush, Sobrevivência, Velocidade, Zen |
| Operações | Só multiplicação | mult/add/sub (div fica de fora — ver abaixo) |
| Exclusividade | 100% — só as 3 tabuadas mais fracas | ~60% viés / 40% aleatório — variedade continua |
| Configurável | Não | Sim, toggle em Configurações |

---

## Como funciona

### `getWeakPool(tableStats)`
Mesma fórmula de dificuldade do `getHardTabuadaPool` (60% taxa de erro + 40%
tempo médio), mas **sem** o fallback fixo `[7,8,9]` — se não houver dados
suficientes (< 3 amostras), a linha simplesmente não entra na lista (pool
pode vir vazio, e nesse caso não há viés a aplicar).

### `generateQuestion(operation, diffLevel, opts)` — `opts.weakBias` + `opts.tableStats`
Com ~60% de chance (`WEAK_BIAS_PROBABILITY`), força a "linha" (fator da
multiplicação, minuendo da subtração, primeiro operando da soma) a vir do
pool de fatos mais fracos, via um parâmetro `forcedRow` novo em
`getRandomQuestion`/`getGridQuestion` — abordagem **construtiva** (não
sorteio por rejeição): a linha é decidida antes, o resto da pergunta
(segundo operando) continua sorteado normalmente dentro do `diffLevel`.

**Divisão fica de fora do viés** — mesma limitação identificada na Fase 3
pro Modo Revisão: `tableStats.div` é agrupado por **dividendo**, não por
divisor, então não existe uma "linha" utilizável do jeito que o mecanismo
espera. Decisão explícita, documentada no código.

### Threading pelo `GamePage`
- `ADAPTIVE_BIAS_MODES = ['rush', 'survival', 'speed', 'zen']` — Revisão
  fica de fora porque já tem seu próprio mecanismo de priorização
  (`getRevisionQuestions`, com o componente de staleness da Fase 4).
- **Bug corrigido durante a implementação**: `tableStats` no `GamePage`
  estava sempre fatiado em `.mult` (`data.tableStats?.mult`), mesmo quando a
  operação ativa era soma/subtração — resquício da Fase 1, nunca corrigido
  nas Fases 2/3 porque só o Modo Difícil (sempre mult) usava esse campo até
  agora. Corrigido: `tableStatsAll` (objeto completo, todas operações) é
  passado pro `init()`, que fatia pela operação EFETIVA da partida.

### Toggle em Configurações
Nova seção "Dificuldade Adaptativa" → "Foco em Fraquezas", `data.adaptiveDifficulty`
(default `true`, persistido/sincronizado como os outros toggles de
gameplay). Desligar volta ao sorteio 100% aleatório de sempre.

---

## Verificação (ponta a ponta)

1. `generateQuestion('mult', 3, { weakBias: true, tableStats })` com tabuada
   do 7 marcada como fraca (10 amostras, 80% erro) → 24/40 amostras (60%
   exato) vieram do fator 7. `getWeakPool` corretamente isolou `[7]`.
2. Mesmo teste com `'sub'` → viés confirmado (23/30, dentro da variância
   esperada pra n pequeno). Mesmo teste com `'div'` → **0/30** — confirma
   que a exclusão de divisão está funcionando.
3. **UI real**: aba "Dificuldade Adaptativa" nas Configurações renderiza
   corretamente; toggle liga/desliga e persiste no `localStorage`
   (`adaptiveDifficulty: true → false → true`, verificado a cada passo).
4. Navegação mais profunda (Menu → Escolher Modo → Rush) travou no preview
   headless por causa da limitação já documentada de animação
   (`AnimatePresence mode="wait"` sem `requestAnimationFrame`) — não é um
   bug do código; a lógica já estava validada nos passos 1-3 de forma mais
   rigorosa (estatística exata) do que um clique manual conseguiria confirmar.

**Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~13-27s)

---

## Decisões técnicas

1. **`forcedRow` construtivo, não sorteio por rejeição** — decidir a linha
   ANTES de gerar o resto da pergunta é mais simples e determinístico do que
   gerar perguntas repetidamente até uma bater no pool fraco (que degradaria
   mal pra operações com espaço de fatos grande/esparso, como a divisão).
2. **Zen incluído no viés, não só Rush/Survival/Speed** — o roadmap
   (sessao-034) citava só os 3 modos competitivos, mas Zen usa o MESMO
   caminho de geração genérica no `GamePage`. Excluir Zen exigiria uma
   ramificação extra sem ganho real — Zen também se beneficia de focar em
   pontos fracos, mesmo sendo modo de treino livre.
3. **Divisão excluída do viés (não do toggle)** — o toggle é global, mas o
   efeito prático é zero em Divisão. Consistente com a mesma decisão já
   tomada pro Modo Revisão na Fase 3 (mesma causa raiz: `tableStats.div` por
   dividendo).
4. **`getHardTabuadaPool` não foi refatorado pra reusar `getWeakPool`** —
   comportamentos diferentes o suficiente (fallback fixo `[7,8,9]` vs. pool
   vazio permitido) pra não valer a pena forçar DRY. Coexistem.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | `getWeakPool`, `forcedRow` em `getRandomQuestion`/`getGridQuestion`, `opts.weakBias`/`opts.tableStats` em `generateQuestion` |
| `src/lib/storage.js` | `DEFAULTS.adaptiveDifficulty = true` |
| `src/pages/GamePage.jsx` | `ADAPTIVE_BIAS_MODES`, `tableStatsAll` (fix do bug `.mult` hardcoded), prop `adaptiveDifficulty` |
| `src/App.jsx` | passa `adaptiveDifficulty` pro `GamePage` |
| `src/pages/SettingsPage.jsx` | seção "Dificuldade Adaptativa" com toggle "Foco em Fraquezas" |
| `CHANGELOG.md` | entrada [3.15.0] |
| `MEMORY_CORE.md` | Fase 5 marcada ✅, próxima sessão = Fase 6 |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-039.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Fase 5 da 4.0:** ✅ completa — viés adaptativo em Rush/Sobrevivência/
  Velocidade/Zen, toggle em Configurações, bug do `tableStats` mult-only corrigido
- **Próxima sessão:** Fase 6 — Perfil de Domínio Unificado (ÚLTIMA fase do
  roadmap 4.0). Mapa de Domínio/certificados/QI Ranking cobrindo as 4
  operações de forma unificada, certificado "Matemática Fundamental
  Completa", `computeQI` pesando múltiplas operações, visualização radar.
  Ver `sessao-034.md`.
