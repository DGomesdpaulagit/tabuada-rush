# Sessão 038 — Tabuada Rush 4.0 · FASE 4 (Inteligência Preditiva)

**Data:** 2026-07-06
**Versão:** 3.13.0 → **3.14.0**
**Tipo:** Implementação (Fase 4 do roadmap 4.0 — primeiro passo do pilar "Inteligência Adaptativa")
**Próxima sessão:** Fase 5 — Adaptação Universal

---

## Resumo

Com "Matemática Completa" fechada (Fases 1-3), a 4.0 muda de eixo: em vez de
mais conteúdo, o pilar agora é **prever** o esquecimento em vez de só reagir
a erros. Esta fase adiciona um modelo de decaimento de memória que roda
**passivamente** sobre qualquer partida, nas 4 operações — sem exigir que o
jogador entre num modo específico (diferente do SRS do Flashcard, que só
existe pra multiplicação e depende de autoavaliação subjetiva).

---

## O modelo: curva de esquecimento

Inspirado na curva de Ebbinghaus: `R(t) = e^(-t/S)`, onde `R` é a
probabilidade estimada de o jogador ainda lembrar um fato, `t` é o tempo (em
dias) desde a última prática, e `S` é a "força de memória" — quanto maior,
mais devagar o fato decai.

`S` é estimada a partir de sinais que **já existiam** em `factStats`/
`tableStats` (nenhum dado novo precisou ser coletado do zero, só um campo
adicional):
- precisão histórica (`correct/total`)
- velocidade média (`totalMs/count`)
- volume de repetição (`count`, satura em 10)

Um fato dominado (≥90% acerto, rápido, praticado 10+ vezes) pode levar ~10
dias para cair abaixo do limiar de retenção (`R < 0.5`); um fato mal-sabido
decai em 1-2 dias.

**O que faltava para isso funcionar:** saber HÁ QUANTO TEMPO cada fato foi
praticado pela última vez. `factStats`/`tableStats` só guardavam contadores
agregados (correct/wrong/totalMs/count), sem timestamp. Adicionado
`lastPracticed` (ISO string), atualizado em `handleGameEnd` a cada partida.

---

## O que foi feito

### 1. `src/App.jsx::handleGameEnd`
Cada entrada de `tableStats`/`factStats` (qualquer operação) agora grava
`lastPracticed: new Date().toISOString()` — um timestamp por chamada de
`handleGameEnd` (não por questão individual), suficiente para o modelo.

### 2. Modelo preditivo (`src/utils/index.js`)
- `predictRecallProbability(stat, now)` — probabilidade 0-1 de o jogador
  ainda lembrar. Sem `lastPracticed` (nunca praticado) → retorna 0, mas isso
  NÃO conta como "esquecido" (é "não aprendido", categoria já coberta pelo
  Mapa de Domínio) — ver próximo item.
- `getFactsAtRisk(factStats, now)` — fatos JÁ praticados com recall previsto
  abaixo do limiar (0.5), ordenados do mais esquecido pro menos.
- `countFactsAtRiskAllOps(data)` — soma as 4 operações, usado no banner do menu.

### 3. Motor preditivo aplicado ao Modo Revisão (`getRevisionQuestions`)
A fórmula de dificuldade ganhou um 4º componente — "staleness" (dias desde a
última prática, saturando em 14 dias):
```
40% taxa de erro | 25% tempo médio | 15% volume de erros | 20% staleness
```
(antes: 50/30/20, sem staleness). Isso é literalmente "motor preditivo
aplicado às 4 operações" (`getRevisionQuestions` já era genérico por
operação desde a Fase 2) — reaproveita o modo existente em vez de criar um
novo, e passa a puxar pra revisão fatos que estão ESQUECENDO mesmo que não
tenham erro recente registrado.

### 4. Painel "Fatos a Vencer" (`MenuPage.jsx`)
Banner novo (estilo rose/orange, ícone `Brain`) mostrando a contagem
agregada das 4 operações. Toque → inicia o Modo Revisão diretamente SE
desbloqueado; senão, navega para "Escolher Modo" (onde o motivo do bloqueio
fica visível) — evitado um dead-end silencioso (`handleStart` já bloqueia
modos indisponíveis sem feedback nenhum).

### 5. Lembrete local (`lib/notify.js::maybeForgettingReminder`)
Mesmo padrão de `maybeStreakReminder`/`maybeMissionExpireReminder` (aviso via
`Notification`/Service Worker, 1×/dia, com o app aberto). **Limite honesto
assumido deliberadamente:** isso NÃO é push com o app fechado — exigiria
Edge Function + VAPID (infra do `lib/push.js`, mais pesada). Dado que
`lib/notify.js` já tem exatamente esse padrão client-side estabelecido para
os outros 2 lembretes, reaproveitei em vez de abrir uma frente de backend
nova só para isto.

---

## Verificação (ponta a ponta, no navegador)

1. `predictRecallProbability` testado com 4 cenários via `import()` dinâmico:
   fato recente+bom (R=0.95), fato antigo+bom (R=0.135, abaixo do limiar),
   fato ruim+recente (R=0.63, ainda acima do limiar), nunca praticado (R=0)
2. `getFactsAtRisk` corretamente isolou só o fato "antigo" dos 4 cenários
3. Seed de dados reais no `localStorage` (2 fatos praticados há 25 dias) →
   banner "2 fatos prestes a serem esquecidos" apareceu no Menu
4. **Bug pego durante o teste**: clique no banner não fazia nada quando
   Revisão estava bloqueada (conta de teste com só 6 erros totais, precisa
   de 20) — `handleStart` bloqueia silenciosamente. Corrigido: banner navega
   pra "Escolher Modo" quando Revisão está bloqueada, com legenda adaptada
   ("Toque para ver como desbloquear a Revisão")

**Build:** ✅ `npm run build`, 0 erros (2780 módulos, ~13-28s)

---

## Decisões técnicas

1. **Timestamp POR PARTIDA, não por questão** — `lastPracticed` é gravado
   uma vez por `handleGameEnd`, não por questão individual dentro da
   partida (todas as questões da mesma partida recebem o mesmo timestamp).
   Granularidade suficiente pro modelo (a diferença de segundos dentro de
   uma partida é irrelevante numa escala de dias).
2. **Modelo passivo, não um modo novo** — em vez de criar "Modo Preditivo",
   o sinal de esquecimento foi injetado no Modo Revisão já existente
   (`getRevisionQuestions`). Menos superfície nova, mais valor imediato
   (Revisão fica mais esperta sem o jogador precisar aprender um conceito novo).
3. **Nunca-praticado ≠ esquecido** — importante não confundir "não aprendi
   ainda" (Mapa de Domínio já cobre com o estado "sem dados") com "aprendi e
   esqueci" (este modelo). Um fato sem `lastPracticed` retorna recall=0 mas
   é EXCLUÍDO de `getFactsAtRisk` — senão os 28-176 fatos nunca tocados por
   operação inflariam o contador do banner sem sentido nenhum.
4. **Notificação client-side (`lib/notify.js`), não push real
   (`lib/push.js`)** — reaproveita o padrão já estabelecido pros outros 2
   lembretes em vez de abrir uma nova frente de Edge Function/VAPID pra um
   recurso "bom ter". Registrado como limite honesto, igual o comentário já
   existente no topo do arquivo.

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `src/utils/index.js` | `predictRecallProbability`, `getFactsAtRisk`, `countFactsAtRiskAllOps`; `getRevisionQuestions` com staleness |
| `src/App.jsx` | `handleGameEnd` grava `lastPracticed`; chama `maybeForgettingReminder` |
| `src/lib/notify.js` | novo `maybeForgettingReminder` |
| `src/pages/MenuPage.jsx` | banner "Fatos a Vencer" (com fallback de bloqueio) |
| `CHANGELOG.md` | entrada [3.14.0] |
| `MEMORY_CORE.md` | Fase 4 marcada ✅, próxima sessão = Fase 5 |
| `MEMORY.md` | schema `lastPracticed`, versão |
| `sessions/sessao-038.md` | este arquivo |

---

## Status para retomar

- **Build:** ✅ limpo
- **Fase 4 da 4.0:** ✅ completa — modelo de esquecimento rodando, Revisão
  mais esperta, banner + lembrete no Menu
- **Próxima sessão:** Fase 5 — Adaptação Universal. Generalizar o Modo
  Difícil adaptativo (v3.10, hoje só multiplicação) pra Rush/Survival/Speed
  em qualquer operação — viés (não exclusividade) pelos fatos mais fracos,
  ~60/40 fraco/aleatório, toggle em Settings. Ver `sessao-034.md`.
