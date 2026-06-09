# Sessão 032 — Correções de bugs + Sistema de Desbloqueio Progressivo

**Data:** 2026-06-08
**Versão:** 3.8.0 → **3.9.0**
**Tipo:** Correções e refinamento (pós-3.0)

---

## Resumo

Pós-3.0, no teste end-to-end do Davi, surgiram:
- **1 bug** (Flashcard sem aceitar digitação)
- **1 problema de UX** do Leaderboard (mensagem de erro errada)
- **1 mudança de design** importante: jornada de desbloqueio progressivo dos modos
- **1 ajuste sutil**: Modo Zen passa a dar XP discretamente para o usuário descobrir

---

## 1. Bug: input do Flashcard travado

**Arquivo:** `src/pages/FlashcardPage.jsx`

### Causa
```js
const fact = currentFk ? parseFactKey(currentFk) : null;
useEffect(() => {
  if (fact && !revealed) { setInputVal(''); ... }
}, [fact, revealed]);  // ❌ `fact` é objeto novo a cada render
```
`parseFactKey()` retorna `{ a, b, ans }` — **objeto novo a cada render**. React
compara por `Object.is`, então o effect disparava em todo render. Resultado:
`setInputVal('')` a cada keystroke → input parecia "não aceitar" digitação.

### Correção
```js
useEffect(() => {
  if (currentFk && !revealed) { setInputVal(''); ... }
}, [currentFk, revealed]);  // ✅ string estável
```

---

## 2. UX: Leaderboard mostrava "tente em alguns segundos"

**Arquivo:** `src/services/leaderboard.js`

Quando as tabelas `leaderboard_daily` / `leaderboard_weekly` **não existem
no Supabase** (caso atual do operador — SQL ainda não foi rodado), o erro
retornado pelo PostgREST não estava sendo identificado como "tabela
inexistente". Caía no caminho `reason: 'error'` → UI mostrava "Não foi
possível carregar. Tente novamente em alguns segundos.".

### Correção
`parseError()` agora reconhece também:
- `error.code === 'PGRST205'` (PostgREST: "Could not find the table in schema cache")
- `error.code === 'PGRST202'`
- Padrões de mensagem: `could not find the table`, `schema cache`, `table .* (not found|does not exist)`

Agora a página mostra corretamente:
> "Leaderboard ainda não foi ativado · O administrador precisa rodar a
> migração SQL do leaderboard. Veja SUPABASE_SETUP.md."

---

## 3. Sistema de Desbloqueio Progressivo (UNLOCK_RULES)

**Arquivos:** `src/utils/index.js`, `src/pages/ModesPage.jsx`, `src/App.jsx`

### Filosofia
Antes da 3.9, **todos os modos estavam disponíveis** para qualquer usuário
desde a primeira partida (com poucas exceções: Hard exigia Nível 8, Combined
exigia 3 certificados).

Agora **todos os modos — exceto Zen — têm uma condição de desbloqueio**.
Cria-se uma jornada natural: o usuário começa só com Zen, descobre que
ele dá XP, sobe de nível, e os outros modos vão se abrindo.

### Tabela `UNLOCK_RULES`

| Modo | Condição |
|------|----------|
| **Zen** | sempre disponível |
| **Rush** | Nível 2 (Aprendiz) |
| **Sobrevivência** | Nível 3 (Estudante) |
| **Velocidade** | 10 partidas no total |
| **Desafio Diário** | 100 acertos no total |
| **Revisão** | 20 erros (precisa do que revisar) |
| **Flashcard** | Nível 4 (Calculador) |
| **Inverso** | Nível 5 (Praticante) |
| **Modo Difícil** | Nível 8 (Hábil) — antes era `minLevel: 8` |
| **Recorde Pessoal** | Nível 9 (Competente) — **NOVO** |
| **Desafio Semanal** | 10 dias de ofensiva (recorde) — **NOVO** |
| **Combinado** | 3 certificados de domínio — antes era `minCertificates: 3` |

### Implementação
- Nova função `getModeUnlock(modeId, data)` em `utils/index.js`:
  ```js
  returns { unlocked: bool, reason: 'Nível 5: Praticante', current: 3, target: 5 }
  ```
- Tipos suportados: `level`, `totalGames`, `totalCorrect`, `totalWrong`,
  `bestDayStreak`, `certificates`.
- `ModesPage.jsx` agora chama `applyUnlock(mode, data)` em **todos** os modos.
- `App.jsx::handleStart` faz **bloqueio defensivo** (não confia só na UI):
  ```js
  const unlock = getModeUnlock(mode, data);
  if (!unlock.unlocked) return;
  ```

### Compatibilidade com usuários existentes
Como as regras consultam dados que **já existem** em `data` (xp, totalGames,
totalCorrect, totalWrong, bestDayStreak, factStats), usuários existentes que
já progrediram terão todos os modos desbloqueados automaticamente. **Sem
migração necessária.**

Usuários novos (instalação fresca, totalGames=0, xp=0) começam só com Zen.

---

## 4. Zen quietamente dá XP

**Arquivos:** `src/constants/index.js`, `src/App.jsx`, `src/pages/ResultsPage.jsx`, `src/pages/ModesPage.jsx`

### Mudanças
- `MODES.zen.xpMultiplier`: `0` → **`0.10`** (baixo mas existe)
- `MODE_XP_MULT` (mapa em `App.jsx` e `ResultsPage.jsx`): atualizado para
  refletir o multiplier de cada modo, incluindo Zen.
- Badge no `ModesPage`: **"Sem XP" → "Pratique 🌿"** (não revela XP)

### Filosofia
> "Pratique" no card · O card de pergunta no jogo diz "Sem pressão 🌿" ·
> A descrição é "Treino livre, sem pressão". Em nenhum lugar aparece
> escrito "XP" no Zen.

Quando o jogador termina uma sessão Zen e vê a ResultsPage, **descobre o XP**
através da stat "XP Ganho" — momento de surpresa positiva. Essa é a única
revelação. Antes disso, o jogador praticou Zen sem ser instruído sobre XP.

### Mecânica para um usuário novo
1. Instala o app → **só Zen está disponível** (todos os outros bloqueados)
2. Joga Zen, vê acertos, descobre XP nos resultados
3. Acumula ~360 XP → sobe pro **Nível 2** → **Rush desbloqueia**
4. Joga Rush + Zen → Nível 3 → **Sobrevivência**
5. Continua jogando → 10 partidas → **Velocidade**
6. Continua → 100 acertos → **Desafio Diário**
7. Erra ≥20 vezes → **Revisão**
8. Nível 4 → **Flashcard**, Nível 5 → **Inverso**
9. Nível 8 → **Modo Difícil**, Nível 9 → **Recorde Pessoal**
10. 10 dias de ofensiva → **Desafio Semanal**
11. 3 certificados de domínio → **Modo Combinado**

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/pages/FlashcardPage.jsx` | useEffect deps `[fact]` → `[currentFk]` |
| `src/services/leaderboard.js` | parseError detecta PGRST205/202 e mais padrões |
| `src/utils/index.js` | + `UNLOCK_RULES` · + `getModeUnlock()` |
| `src/constants/index.js` | `MODES.zen.xpMultiplier` 0 → 0.10 |
| `src/pages/ModesPage.jsx` | aplica `applyUnlock` em todos os modos · badge Zen "Pratique 🌿" · Flashcard com lock |
| `src/App.jsx` | bloqueio defensivo em handleStart · MODE_XP_MULT atualizado |
| `src/pages/ResultsPage.jsx` | MODE_XP_MULT atualizado |
| `CHANGELOG.md` | entrada [3.9.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-032.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 19s, 0 erros)
- **Console dev server:** sem erros
- **Bugs reportados pelo Davi (5, 16):** ✅ corrigidos
- **Mudanças solicitadas (jornada de desbloqueio, Zen com XP discreto):** ✅ implementadas

### Pergunta em aberto para próxima sessão
- **Modo Difícil:** atualmente pool fixo de 7/8/9. Davi perguntou se é
  fixo ou adaptativo (baseado nas tabuadas que ELE mais erra).
  Se ele preferir adaptativo, basta trocar `getHardQuestion()` por uma
  versão que use `data.tableStats` para selecionar os 3 piores fatores.
