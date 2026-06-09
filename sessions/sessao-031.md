# Sessão 031 — Tabuada Rush 3.0 · FASE 6 (Expansão de Conteúdo · FINAL)

**Data:** 2026-06-08
**Versão:** 3.7.0 → **3.8.0** · **FECHAMENTO DO ROADMAP 3.0**
**Tipo:** Implementação (Fase 6 — última fase do roadmap)
**Próxima sessão:** (a definir — roadmap 3.0 completo)

---

## 🎉 Roadmap 3.0 100% entregue

Esta sessão fecha o roadmap completo da Tabuada Rush 3.0, planejado na
sessão 025. **Seis fases**, **trinta itens**, **trinta sessões de
implementação**.

A filosofia do 3.0 — transformar o jogo de "ferramenta de prática" em
"sistema de memorização real" — está agora realizada.

---

## Resumo executivo da Fase 6

1. **Tabuada do 11 e 12** — toggle opcional nas Configurações. Quando
   ativo, fatores 11 e 12 entram no pool dos modos com geração randômica
   (Rush/Survival/Speed/Review/Personal), a partir do nível 3 dentro da
   partida. Daily/Weekly/Hard/Inverse/Combined NÃO são afetados.
2. **Modo Combinado** — "3 × 7 + 4 = ?" / "5 × 8 − 6 = ?". Cálculo mental
   com duas operações. Desbloqueado por ≥3 certificados de domínio.

---

## 1. Tabuada do 11 e 12

**Arquivos:** `src/utils/index.js`, `src/pages/SettingsPage.jsx`, `src/pages/GamePage.jsx`.

### Toggle persistido
- Persistido em `data.includeExtraTables` (sincroniza pela nuvem)
- Section "Conteúdo Avançado" no SettingsPage com ícone GraduationCap
- Subtítulo informativo:
  > Ativa apenas a partir do Nível 3 dentro da partida — para iniciantes
  > não atrapalhar. Daily/Weekly não são afetados (mantêm pool padrão para
  > comparação justa).

### Pool ajustado em `getRandomQuestion(diffLevel, includeExtra)`
```js
let pool = pools[diffLevel] || pools[1];
if (includeExtra && diffLevel >= 3) {
  pool = [...pool, 11, 12];
}
```
- Só entra no pool quando o jogador já está no nível 3 dentro da partida
- `b` continua 1..10 (a tabuada do 11 vai de 11×1 a 11×10)

### Injeção no GamePage
- `init()` agora recebe `includeExtraTables` da `data`
- Estado guarda `includeExtraTables` para usar no `NEXT`
- `getRandomQuestion(getDiffLevel(state.answered), state.includeExtraTables)`

### Modos NÃO afetados
- **Daily** e **Weekly**: usam seed determinístico, manter idênticos para
  todos é essencial para o leaderboard justo.
- **Hard** (pool 7/8/9), **Inverse**, **Personal**, **Combined**,
  **Flashcard**, **Zen** (sem questões padrão): geração própria ou
  seleção via factStats.

---

## 2. Modo Combinado

**Arquivos:** `src/constants/index.js`, `src/utils/index.js`, `src/pages/GamePage.jsx`, `src/pages/ModesPage.jsx`.

### Configuração
```js
combined: {
  questions: 15, xpMultiplier: 0.25, minCertificates: 3,
  gradient: 'from-violet-600 to-fuchsia-600',
  combined: true,
  group: 'advanced',
}
```

### Geração: `getCombinedQuestion()`
```js
a ∈ [2..9], b ∈ [2..10]
op = '+' ou '-' (50/50)
c ∈ [1..9]
op '-': c ≤ a*b (garante ans > 0)
ans = a*b + c | a*b - c
```

### UI no `GamePage`
- Card de pergunta: "3 × 7 + 4" / "5 × 8 − 6" (fonte 60px, menor que padrão
  para caber)
- Subtítulo: "Qual o resultado? (multiplicação primeiro)"
- Input padrão (uma resposta)
- Validação: `valA === state.question.ans`

### Desbloqueio: certificados
`MODES.combined.minCertificates = 3`. O `ModesPage` usa
`computeCertificates(data.factStats).filter(c => c.unlocked).length` para
medir e libera o card quando o jogador tem 3 ou mais certificados de
domínio (das tabuadas 2-9).

- Bloqueado: badge "🔒 3 certificados"
- Desbloqueado: card normal

### XP
`xpMultiplier: 0.25` — alto, justifica a dificuldade dos cálculos compostos.

---

## ModesPage atualizada

A função `getAdvancedModes(levelIdx, certsUnlocked)` agora devolve 4 modos
reais:
1. **Hard** — bloqueado se levelIdx + 1 < 8
2. **Recorde Pessoal** — sempre desbloqueado
3. **Desafio Semanal** — sempre desbloqueado
4. **Combinado** — bloqueado se certificados < 3

Difficulty labels novas: `combined: 'Cálculo mental'`, `weekly: 'Competitivo'`.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | + `MODES.combined` |
| `src/utils/index.js` | `getRandomQuestion(diff, includeExtra)` · novo `getCombinedQuestion()` |
| `src/pages/GamePage.jsx` | suporte ao modo Combinado (display + lista fixa) · injeção de `includeExtraTables` |
| `src/pages/SettingsPage.jsx` | seção "Conteúdo Avançado" com toggle 11/12 |
| `src/pages/ModesPage.jsx` | adiciona Combinado em `getAdvancedModes` · ícone `Plus` · labels novos |
| `CHANGELOG.md` | entrada [3.8.0] · marca **roadmap 3.0 100% entregue** |
| `MEMORY_CORE.md` | status atualizado · marca conclusão |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-031.md` | este arquivo |

---

## Decisões técnicas

1. **Toggle persistido em `data`, não em `prefs`** — `prefs` é local do
   dispositivo (tema, som). `data.includeExtraTables` é da identidade do
   jogador e deve viajar com a nuvem.
2. **Pool extra só no nível 3+ da partida** — iniciantes (nível 1: 2/3/4/5)
   não devem ser surpreendidos com 11×12 na primeira pergunta. O `diffLevel`
   sobe quando o jogador acumula acertos.
3. **Daily/Weekly imunes ao toggle** — leaderboard justo é prioridade.
4. **Combined com `-` também** — "3×7+4" sempre soma seria fácil demais.
   Misturar `+` e `-` (50/50) e garantir ans>0 mantém o desafio sem
   permitir negativos.
5. **Desbloqueio por certificados, não por nível** — alinhado à filosofia
   do 3.0: "domínio real" > "tempo jogado". Quem tem 3 certificados
   provou que domina (rápido + preciso) 30 dos 80 fatos fundamentais.
6. **Display de 60px no Combined** — `3 × 7 + 4` tem mais glifos que `7 × 8`.
   Reduzir mantém legibilidade sem quebrar layout.

---

## 📋 Resumo final do roadmap 3.0

| Fase | Versão | Sessão | Entrega |
|------|--------|--------|---------|
| 1 — Base Pedagógica + Correções | 3.3.0 | 026 | Página de Modos, Banner Diário, Mapa de Domínio, fix missões impossíveis |
| 2 — Repetição Espaçada | 3.4.0 | 027 | Flashcard SRS, Certificados de Domínio, Modo Inverso |
| 3 — Economia e Loja | 3.5.0 | 028 | Power-ups Spot, Seguro de Ofensiva, Congelar Missão, Apostas, Oferta da Semana, Temas de GamePage |
| 4 — Novos Modos | 3.6.0 | 029 | Modo Difícil, Recorde Pessoal, Desafio Semanal |
| 5 — Social e Retenção | 3.7.0 | 030 | Leaderboards Diário/Semanal, Heatmap 365 dias, Share Card |
| 6 — Expansão de Conteúdo | 3.8.0 | 031 (esta) | Tabuada 11/12 opcional, Modo Combinado |

**Total:** 6 fases · 30+ itens · de v3.2.1 a v3.8.0 em 6 sessões consecutivas.

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 22s, 0 erros)
- **Console dev server:** sem erros
- **Tamanhos:** index.js 1.124 kB / gzip 314 kB
- **Backward-compat:** `includeExtraTables`, `MODES.combined` opcionais,
  começam como undefined/inacessível — sem migração necessária.
- **Roadmap 3.0:** ✅ **100% ENTREGUE**

---

## Pós-3.0 — ideias para uma futura 4.0

Se houver uma 4.0 no futuro (não planejada agora), candidatos naturais:

1. **Divisão e subtração** — expandir além de multiplicação (4 operações)
2. **Modo multijogador em tempo real** — corrida 1v1 via WebSockets
3. **Personalização real de avatares** — em vez de só molduras e frames
4. **Gamificação por escola/turma** — dashboards para professores
5. **Tabuadas de outras bases** (binário, hex) — para programadores em
   formação

Tudo isso é especulação — o 3.0 é um produto fechado e completo. 🎉
