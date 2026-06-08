# Sessão 027 — Tabuada Rush 3.0 · FASE 2 (Repetição Espaçada + Inverso + Certificados)

**Data:** 2026-06-08
**Versão:** 3.3.0 → **3.4.0**
**Tipo:** Implementação (Fase 2 do roadmap 3.0 — coração pedagógico)
**Próxima sessão:** Fase 3 — Economia e Loja Reformulada (power-ups spot, seguro de ofensiva, apostas, oferta da semana)

---

## Resumo executivo

Fase 2 entrega o **coração científico** da Tabuada Rush 3.0:

1. **Modo Flashcard com SRS (SM-2)** — o único modo que realmente cria memória
   de longo prazo, via repetição espaçada por fato.
2. **Modo Inverso** — recuperação reversa ("= 56 → diga os fatores"), exigente,
   exercita compreensão real.
3. **Certificados de Domínio por Tabuada** — 8 certificados (2–9) desbloqueados
   apenas por domínio real dos 10 fatos da tabuada. Não compráveis.

Bonus: o banner Desafio Diário foi removido do menu (a pedido do usuário) —
o desafio continua acessível como card principal dentro da ModesPage.

---

## 1. Banner Desafio Diário removido

**Arquivo:** `src/pages/MenuPage.jsx`

O bloco do banner âmbar/rosé foi excluído. O Desafio Diário continua:
- Acessível via `ModesPage` (1º card dos "Modos Principais", com badge "🌟 Hoje")
- O botão "Escolher Modo" no menu agora ocupa a posição visual de destaque

---

## 2. Modo Inverso (`MODES.inverse`)

**Arquivos:** `src/constants/index.js`, `src/pages/GamePage.jsx`, `src/pages/ModesPage.jsx`

### Definição do modo
```js
inverse: {
  id: 'inverse', name: 'Inverso', emoji: '🔄',
  gradient: 'from-indigo-500 to-blue-600',
  questions: 15, xpMultiplier: 0.20,
  inverse: true,  // flag lida pelo GamePage
  group: 'advanced',
}
```

### Mudanças no `GamePage`
- `init()` gera 15 perguntas com `getRandomQuestion(3)` (pool difícil 2..9)
  quando `mode === 'inverse'`. Fresco a cada partida (não usa seed do dia).
- Estado adicional: `inputValB` + `inputRefB`.
- UI condicional: quando `isInverse`, o card de pergunta mostra `= 56` e dois
  inputs lado-a-lado (`a × b`). Enter no primeiro pula para o segundo.
- Validação: aceita **qualquer par** cujo produto bata e ambos estejam em
  [1..10] — então tanto 7×8 quanto 8×7 são válidos para 56.
- Mensagem de erro: "Errou! Era 7 × 8" (em vez de "Resp: 56").

### Visibilidade
- Não aparece em `MODE_LIST` nem `TRAINING_MODE_LIST` (group=advanced).
- Exibido em seção própria "Recuperação Reversa · Fase 2" na `ModesPage`,
  com badge `NOVO`.

---

## 3. Modo Flashcard com SRS

**Arquivos:** `src/utils/index.js` (algoritmo + queries), `src/pages/FlashcardPage.jsx`

### Algoritmo SM-2 simplificado

Cada fato armazena: `srsData[fk] = { interval, easeFactor, reps, nextReview, lastReview }`
(`fk` = "min×max", a mesma chave normalizada do Mapa de Domínio).

```
quality 'wrong':  interval = 10 min,            ease -= 0.2
quality 'hard':   interval = max(1d, prev * 1.2), ease -= 0.05
quality 'easy':
  reps==1: 3 dias
  reps==2: 6 dias
  reps>2:  interval = prev * ease
  ease += 0.05 (cap 3.0)

ease base: 2.5, piso 1.3
```

Decisão: SM-2 puro é complexo demais para o caso (só 80 fatos finitos).
Esta variante prioriza intuição:
- Errar = 10 min depois (curva crítica logo após errar)
- Fácil = cresce no fator de facilidade
- Hard = cresce devagar, mantém na fila

### Funções públicas (`utils/index.js`)
- `getAllFactKeys()` — 80 chaves canônicas (2×1 até 9×10, normalizadas)
- `parseFactKey(fk) → { a, b, ans }`
- `updateSrsFact(prev, quality, now)` — retorna novo registro
- `countDueFlashcards(srsData)` — pendentes hoje (vencidos + novos)
- `getReviewQueue(srsData, limit=20)` — fila ordenada (vencidos primeiro, novos depois)

### `FlashcardPage.jsx`
Fluxo por card:
1. Mostra "a × b" + input "Sua resposta..."
2. Jogador digita → "Revelar"
3. Card revela a resposta correta e o jogador vê se acertou
4. **Avaliação 3-botões: Errei / Difícil / Fácil**
   - Se digitação foi errada, apenas o botão "Errei" fica habilitado (os outros aparecem desabilitados — feedback honesto)
5. Avança para o próximo

Ao final da fila (até 20 fatos): tela de resumo com `easy/hard/wrong` e
contagem de pendentes restantes.

### Acesso
- Botão na `ModesPage`, seção "Memorização Real · Fase 2", com badge NOVO
- Badge no menu principal: o botão "Escolher Modo" agora exibe
  `🃏 N flashcards para revisar` quando há fatos vencidos

---

## 4. Certificados de Domínio por Tabuada

**Arquivos:** `src/utils/index.js`, `src/pages/AchievementsPage.jsx`

### Critério
Um certificado da Tabuada do N é desbloqueado quando **TODOS os 10 fatos**
daquela tabuada (N×1 até N×10) estão `dominated`, usando o mesmo critério
do Mapa de Domínio:
- ≥3 amostras
- ≥90% de acerto
- Tempo médio de resposta < 1.5s

### `computeCertificates(factStats)`
Retorna `[{ table, dominated, total: 10, unlocked }]` para cada tabuada 2..9.

### Onde aparecem
- Seção "Certificados de Domínio" no topo da `AchievementsPage`
  (antes das conquistas existentes)
- Grid 4×2 com 🏅 quando desbloqueado, 🔒 quando bloqueado, e contagem `N/10`
- Subtítulo: "Conquistados por domínio real — não podem ser comprados"

### Filosofia
São os primeiros itens do jogo que NÃO podem ser comprados na loja. Domínio
real é o único caminho. Isto será expandido na Fase 5/6 (visualização no
perfil + share card).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/constants/index.js` | + `MODES.inverse` |
| `src/utils/index.js` | + SRS (SM-2) · + `computeCertificates` · + helpers de fatos |
| `src/pages/MenuPage.jsx` | banner removido · badge "X flashcards" |
| `src/pages/ModesPage.jsx` | seções Inverso + Flashcard (novos) · `onNavigate` para flashcard |
| `src/pages/GamePage.jsx` | suporte ao modo inverso (2 inputs, validação por par) |
| `src/pages/FlashcardPage.jsx` | **novo** — UI SRS + algoritmo de avaliação |
| `src/pages/AchievementsPage.jsx` | seção Certificados no topo |
| `src/App.jsx` | rota `flashcard` |
| `CHANGELOG.md` | entrada [3.4.0] |
| `MEMORY_CORE.md` | status atualizado |
| `MEMORY.md` | versão atualizada |
| `sessions/sessao-027.md` | este arquivo |

---

## Decisões técnicas

1. **`getRandomQuestion(3)` para inverso** — pool difícil (2..9) faz sentido:
   o modo já é desafiador, não precisa apresentar 2×1.
2. **Inverso aceita 7×8 e 8×7** — pedagogicamente, o que importa é encontrar
   um par válido. Restrição `[1..10]` evita "trapaças" do tipo 56=56×1
   (que requer a∈[1..10] mas violaria b=1, ainda válido, ok).
   - Decisão consciente: 56×1 e 1×56 não passam porque a=56 > 10.
3. **SM-2 simplificado, não puro** — o original usa 6 níveis de qualidade
   (0..5). Para flashcards de tabuada, 3 níveis (errei/difícil/fácil) é
   suficiente e UX-friendly.
4. **Fila de 20 fatos por sessão** — limite ergonômico (~3-5 min de revisão).
   Se há mais pendentes, próxima sessão pega o restante.
5. **`feedback === 'wrong'` força quality='wrong'** — se a digitação foi
   errada, não importa o que o jogador clique, o sistema marca como erro.
   Honestidade > flexibilidade nesse caso.
6. **Certificados fora de `data.achievements`** — eles são derivados de
   `factStats` em runtime, não persistidos como flags. Vantagem: se o
   jogador perder domínio (ex.: começar a errar mais), o certificado
   "desaparece" automaticamente. Pode parecer punitivo mas é honesto.

---

## Próximos passos (Fase 3 — Economia e Loja Reformulada)

1. **Power-ups Spot** — comprar no momento de perder (modal de last-chance)
2. **Seguro de Ofensiva (100🪙)** — restaura ofensiva quebrada em 24h
3. **Congelar Missão Diária (50🪙)** — pausa missão por 24h
4. **Apostas de Partida** — apostar 10/25/50, 3× se bater recorde
5. **Oferta da Semana na Loja** — 2-3 itens com 40% off rotativo (segunda-feira)
6. **Temas de GamePage** — cosméticos com valor real (gradiente da pergunta, etc)

---

## Status para retomar

- **Build:** ✅ Passou (`npm run build`, 35s, 0 erros)
- **Console dev server:** sem erros (`preview_start` + `preview_console_logs`)
- **Tamanhos:** index.js 1.094 kB / gzip 305 kB (sem grande crescimento)
- **Backward-compat:** todos os campos novos (`srsData`, certificados derivados)
  iniciam vazios para usuários existentes. Sem migração necessária.
