# Sessão 029 — Tabuada Rush 3.0 · FASE 4 (Novos Modos)

**Data:** 2026-06-08
**Versão:** 3.5.0 → **3.6.0**
**Tipo:** Implementação (Fase 4 — Novos Modos)
**Próxima sessão:** Fase 5 — Social e Retenção (leaderboard, heatmap, share card)

---

## Resumo executivo

Fase 4 adiciona três modos avançados que expandem a experiência competitiva
e o caminho para o domínio real:

1. **Modo Difícil** — pool exclusivo de 7, 8 e 9 · timer 90s · desbloqueia no Nível 8+
2. **Modo Recorde Pessoal** — bate seus próprios tempos por fato (usa `factStats`)
3. **Desafio Semanal Competitivo** — 10 questões iguais para todos por semana ISO

Os 3 modos substituem os placeholders bloqueados da Fase 1 na `ModesPage`.

---

## 1. Modo Difícil

**Arquivos:** `src/constants/index.js`, `src/utils/index.js`, `src/pages/GamePage.jsx`

### Configuração
```js
hard: {
  timer: 90, xpMultiplier: 0.22, minLevel: 8,
  gradient: 'from-orange-500 to-red-600',
  group: 'advanced',
}
```

### Pool exclusivo
Nova função `getHardQuestion()` em `utils/index.js`:
```js
const pool = [7, 8, 9];        // só os fatores mais difíceis
const a = pool[random];
const b = 1..10;
```

### Geração on-the-fly
O Modo Difícil **não usa lista fixa** de perguntas (como o Daily). Em vez
disso, o `init()` do GamePage detecta `mode === 'hard'` e a cada `NEXT`
chama `getHardQuestion()`. Vantagem: cada partida é única; combina bem com
o timer de 90s (questões intermináveis dentro da janela).

### Desbloqueio
`MODES.hard.minLevel = 8`. O `ModesPage` calcula `locked` a partir do
`levelIdx` do jogador via `getAdvancedModes(levelIdx)`. Cartão exibe
"Nível 8" como `unlockText` quando bloqueado.

---

## 2. Modo Recorde Pessoal

**Arquivos:** `src/constants/index.js`, `src/utils/index.js`, `src/pages/GamePage.jsx`, `src/App.jsx`

### Configuração
```js
personal: {
  questions: 15, xpMultiplier: 0.18, personal: true,
  gradient: 'from-yellow-500 to-amber-600',
  group: 'advanced',
}
```

### Benchmark por fato
`getPersonalRecordQuestions(factStats, count=15)` gera 15 perguntas, cada
uma com `personalBenchmarkMs` anexado: tempo médio do jogador para aquele
fato específico (via `factStats[fk].totalMs / count`). Sem dados → fallback
2500ms.

### Lógica de "bateu o tempo"
No `handleSubmit` do GamePage:
```js
const beatPersonal =
  isPersonalMode && isCorrect && dt > 0 && benchmark > 0 && dt < benchmark;
```

### Pontuação
Reducer `CORRECT` recebe `isPersonal` e `beatPersonal`:
- Acertou + bateu tempo → pontos normais (combos contam)
- Acertou mas devagar → **+1 ponto simbólico**
- Errado → 0

Score reflete diretamente o % de fatos batidos no tempo pessoal.

### Visual
- Pergunta exibe badge `🎯 Seu tempo: 2.1s` abaixo dos fatores
- Feedback de acerto:
  - Bateu → amarelo `⚡ Bateu seu tempo! +N`
  - Devagar → emerald `✓ Correto, mas devagar...`
- `state.beats` rastreia total de fatos batidos
- `state.lastPts` e `state.lastBeatPersonal` para feedback animado

---

## 3. Desafio Semanal Competitivo

**Arquivos:** `src/constants/index.js`, `src/utils/index.js`, `src/App.jsx`, `src/pages/ModesPage.jsx`

### Configuração
```js
weekly: {
  questions: 10, xpMultiplier: 0.30,
  gradient: 'from-pink-500 to-rose-600',
  group: 'advanced',
}
```

### Seed por semana ISO
`getWeeklyChallengeQuestions(date, count=10)`:
```js
const seed = year * 100 + isoWeekNumber;
const rand = seededRng(seed);
return Array.from({ length: 10 }, () => ({ a, b, ans }));
```

Todos os jogadores recebem **as mesmas 10 questões** numa semana — a base
para comparação justa via leaderboard global (Fase 5 trará UI + Supabase).

### Persistência
`data.weeklyChallenge = { week: '2026-W23', score, completedAt }` —
guarda o melhor score da semana ISO atual. Reseta automaticamente quando
a semana ISO muda.

### Helper público
`getCurrentWeekKey(date)` exporta a string `YYYY-Www` para uso em ModesPage
(detectar "já feito esta semana") e na futura UI de leaderboard.

### XP elevado (0.30)
Justificativa: só sai 1× por semana — recompensar a participação consistente.
É o segundo maior multiplicador depois do Daily (0.28).

---

## 4. ModesPage atualizada

**Arquivo:** `src/pages/ModesPage.jsx`

A seção "Modos Avançados" foi reescrita: removidos os 4 placeholders
bloqueados (Flashcard, Inverso, Difícil, Recorde Pessoal); agora usa
`getAdvancedModes(levelIdx)` que retorna **modos reais** baseados em
`MODES.hard / personal / weekly`.

- Difícil: bloqueado se `levelIdx + 1 < 8`, com `unlockText: "Nível 8"`
- Recorde Pessoal: sempre disponível
- Desafio Semanal: sempre disponível, badge dinâmico:
  - Pendente: `NOVO 🏆`
  - Feito esta semana: `✓ {score} pts`

Subtítulo da seção mudou: "Mais desafiadores — pensados para domínio real"
(antes: "chegam nas próximas fases").

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | + MODES.hard · personal · weekly |
| `src/utils/index.js` | + `getHardQuestion` · `getPersonalRecordQuestions` · `getWeeklyChallengeQuestions` · `getCurrentWeekKey` |
| `src/pages/GamePage.jsx` | suporte ao Modo Difícil (geração on-the-fly) · lógica de "beat personal" no reducer + UI |
| `src/pages/ModesPage.jsx` | substitui placeholders por `getAdvancedModes(levelIdx)` real |
| `src/App.jsx` | `startGame` gera `customQuestions` para personal/weekly · persiste `weeklyChallenge` no `handleGameEnd` |
| `CHANGELOG.md` | entrada [3.6.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-029.md` | este arquivo |

---

## Decisões técnicas

1. **Difícil: geração on-the-fly, não lista fixa** — combina com o timer
   (jogador pode responder muitas perguntas em 90s; lista de 15 limitaria).
2. **Personal: +1 ponto simbólico quando lento** — manter "acertei" visível
   sem inflar o score. % de bateres = score / score_máximo aproximado.
3. **Personal: fallback 2500ms quando sem dados** — primeiro contato com o
   modo, sem `factStats`, dá ao jogador um benchmark generoso (a maioria
   das pessoas responde em <2.5s para tabuadas conhecidas).
4. **Weekly: tracking só do best score** — incentiva o jogador a tentar
   melhorar, não punir replay. Leaderboard global (Fase 5) usará o mesmo
   campo.
5. **Hard.minLevel = 8** — alinha com a sugestão de roadmap. Em ~5 meses
   de jogo um usuário típico chega no Nível 8 (curva v3.0).
6. **Modos avançados NÃO pagam aposta** — `BetModal` só dispara em
   rush/survival/speed/daily (regra existente). Foi proposital: modos
   avançados são por habilidade pura.
7. **Não inseridos em MODE_LIST nem TRAINING_MODE_LIST** — `group: 'advanced'`
   garante que só aparecem na seção dedicada da ModesPage.

---

## Limitação conhecida — Leaderboard

O **Desafio Semanal Competitivo** ainda não tem leaderboard global. A
infraestrutura para isso (Supabase) já existe (`src/lib/supabase.js`,
`src/services/sync.js`), mas a UI de leaderboard será entregue na Fase 5
junto com:
- Leaderboard do Daily Challenge
- Compartilhar resultado (share card)
- Heatmap de ofensiva 365 dias

A pontuação do Desafio Semanal já está sendo persistida em
`data.weeklyChallenge.score` — sincronizada com a nuvem quando o usuário
logar — então quando a UI for adicionada, dados históricos não se perdem.

---

## Próximos passos (Fase 5 — Social e Retenção)

1. **Leaderboard do Desafio Diário** — top 20 global por `currentDailyScore`
   da data de hoje. Supabase.
2. **Leaderboard do Desafio Semanal** — top 20 global por `weeklyChallenge.score`
   da semana ISO atual.
3. **Calendário Heatmap de Ofensiva** — 365 dias estilo GitHub na StatsPage.
4. **Compartilhar Resultado** — gerar imagem do resumo da partida (canvas
   ou html2canvas).

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 28s, 0 erros)
- **Console dev server:** sem erros
- **Tamanhos:** index.js 1.107 kB / gzip 309 kB
- **Backward-compat:** `weeklyChallenge`, `state.beats`, `state.lastBeatPersonal`
  começam como undefined/0 — sem migração.
