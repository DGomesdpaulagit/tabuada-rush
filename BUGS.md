# 🐛 BUGS.md

---

## ✅ RESOLVIDOS

| ID | Bug | Causa | Solução | Data |
|----|-----|-------|---------|------|
| B001 | Sobrevivência mostrava 0:00 nos resultados | Timer não iniciava para survival mode | Timer agora conta up para todos modos sem countdown | 2026-05-22 |
| B003 | Animações Framer Motion travadas em opacity 0 em dev | React.StrictMode + AnimatePresence mode="wait" no React 18 | Removido StrictMode de main.jsx | 2026-05-22 |
| B004 | Streak incrementava múltiplas vezes no mesmo dia | Lógica: se lastPlay === today → incrementava mesmo assim | Corrigido: mantém valor quando lastPlay === today | 2026-05-22 |
| B005 | FlashcardPage não aceitava digitação no input | useEffect dep `[fact, revealed]` — `fact = parseFactKey()` cria objeto novo a cada render → effect roda sempre → `setInputVal('')` em todo keystroke | Trocado dep para `[currentFk, revealed]` (string estável) | 2026-06-08 |
| B006 | LeaderboardPage mostrava "Tente novamente em alguns segundos" quando tabelas não existiam | `parseError` só reconhecia código Postgres `42P01`; Supabase/PostgREST retorna `PGRST205` em vez disso | Adicionados `PGRST205`/`PGRST202` + patterns de texto (`could not find the table`, `schema cache`, etc.) ao parseError | 2026-06-08 |
| B007 | Contagem de certificados hardcoded (`{certsUnlocked}/8`) na AchievementsPage | Fase 1 da 4.0 generalizou o Mapa de Domínio (`MasteryMap`) via registro `OPERATIONS`, mas o "8" da tela de Conquistas ficou preso, sem acompanhar | Trocado para `{certificates.length}` — já deriva de `OPERATIONS.mult.domainRows.length` via `computeCertificates` | 2026-07-06 |
| B008 | `GamePage` sempre fatiava `tableStats` em `.mult`, mesmo jogando soma/subtração | Resquício da Fase 1 (`data.tableStats?.mult`) nunca corrigido nas Fases 2/3 porque só o Modo Difícil (sempre mult) usava esse campo até a Fase 5 introduzir o viés adaptativo pra outras operações | `tableStatsAll` (objeto completo) passado pro `init()`, que fatia pela operação efetiva da partida | 2026-07-06 |
| B009 | Caixa "Partidas/Melhor Seq./Acertos" no rodapé da Arena ilegível no tema escuro (fundo e texto quase da mesma cor) | `bg-paper`/`border-[#E0DACB]` (tokens "Caderno Quadriculado") não tinham override em `html.dark` — só classes Tailwind puras (`bg-gray-*`, `bg-white`) tinham, então o fundo ficava creme claro mesmo no escuro enquanto o texto virava claro também | Migrado pra tokens semânticos novos (`bg-surface`/`border-border`/`text-fg`) que já se adaptam ao tema via CSS var — ver D020 | 2026-08-16 |
| B010 | App inteiro travava ao abrir (`TypeError: Cannot read properties of undefined (reading 'map')`) pra quem já tinha dado salvo de ANTES do Bloco 5 | `getActiveMissions` só reinicializava `monthly` quando o mês mudava — usuário com `missionsData.monthly` no formato antigo (`{month, missions}`, sem `pool`/`accepted`) e no MESMO mês corrente mantinha o formato velho; `resolveChallenges` chamado no load (`AppContext.jsx`) fazia `active.monthly.accepted.map(...)` e `accepted` era `undefined` — quebrava o `AppProvider` inteiro, travando o app pra qualquer tela | `getActiveMissions` agora também checa `Array.isArray(md.monthly.accepted)` — se o formato for o antigo, migra pro novo automaticamente (mesmo com o mês igual) | 2026-08-17 |

---

## 🔴 ATIVOS

| ID | Bug | Prioridade | Reprodução |
|----|-----|-----------|------------|
| — | Nenhum bug ativo registrado | — | — |

---

## 🟡 A INVESTIGAR

| ID | Comportamento | Contexto |
|----|---------------|---------|
| B002 | `onEnd` pode ser stale no GamePage effect | `useEffect([state.phase])` não inclui `onEnd` na dep array — pode causar dados incorretos se `handleGameEnd` recriado durante partida longa |

---

## 📝 TEMPLATE

```
**ID:** BXXX
**Status:** Ativo / Resolvido
**Prioridade:** Alta / Média / Baixa
**Descrição:** O que acontece
**Reprodução:** Passos para reproduzir
**Causa:** Por que acontece
**Solução:** Como foi ou será resolvido
**Data:** YYYY-MM-DD
```
