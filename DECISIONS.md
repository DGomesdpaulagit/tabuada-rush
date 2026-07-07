# 🏛️ DECISIONS.md — Decisões Arquiteturais

---

## D001 — localStorage em vez de backend

**Data:** 2026-05-22  
**Contexto:** O projeto original usava Base44 SDK como backend.  
**Decisão:** Usar localStorage com abstração via `src/lib/storage.js`  
**Motivo:** Sem dependência de servidor, funciona offline, mais simples para v2.0  
**Trade-off:** Dados não sincronizados entre dispositivos, sem auth  
**Revisitar quando:** Quisermos leaderboards, sync multi-dispositivo ou auth social

---

## D002 — useReducer para GamePage

**Data:** 2026-05-22  
**Contexto:** GamePage tem estado complexo (score, streak, lives, phase, question, timer)  
**Decisão:** useReducer com actions (TICK, CORRECT, WRONG, NEXT, END)  
**Motivo:** Estado previsível, transições claras, sem bugs de stale closure nos updates  
**Trade-off:** Mais verboso do que useState múltiplos  

---

## D003 — Sem React Query

**Data:** 2026-05-22  
**Contexto:** App original usava @tanstack/react-query para dados do Base44  
**Decisão:** Não incluir React Query — apenas Context + localStorage  
**Motivo:** Sem chamadas de rede assíncronas, seria overhead desnecessário  
**Revisitar quando:** Adicionar backend real

---

## D004 — Gradientes inline via className Tailwind

**Data:** 2026-05-22  
**Contexto:** Cada modo tem seu gradiente  
**Decisão:** Armazenar classes Tailwind como strings nos MODES constants  
**Motivo:** Simples, sem CSS customizado, funciona com purge do Tailwind  
**Cuidado:** Classes precisam existir COMPLETAS no código (não concatenar parcialmente)

---

## D005 — Seed LCG para Desafio Diário

**Data:** 2026-05-22  
**Contexto:** 20 perguntas do dia precisam ser as mesmas para todos os usuários  
**Decisão:** Linear Congruential Generator com seed = YYYYMMDD  
**Motivo:** Determinístico, sem backend, sem sync necessário  
**Implementação:** `src/utils/index.js` → `getDailyQuestions()`

---

## D006 — AnimatePresence mode="wait"

**Data:** 2026-05-22  
**Contexto:** Transições entre páginas no App.jsx  
**Decisão:** `mode="wait"` para aguardar exit antes de enter  
**Motivo:** Evita sobreposição de páginas, transição limpa  
**Trade-off:** Levemente mais lento, mas mais elegante

---

## D008 — Supabase para Auth e Cloud Sync

**Data:** 2026-05-22  
**Contexto:** Usuário quer persistência real em nuvem e autenticação  
**Decisão:** Supabase (PostgreSQL + Auth) com tabela `profiles` (JSONB)  
**Motivo:** Free tier generoso (50k MAU), auth email/senha pronto, fácil com Vite, padrão React SaaS  
**Trade-off:** Requer configuração manual (criar projeto, SQL, .env)  
**Estrutura:** Um único campo `data JSONB` espelha o shape do localStorage — sem migrations extras

---

## D009 — Web Audio API para Sons

**Data:** 2026-05-22  
**Contexto:** Usuário quer sons polidos sem poluição sonora  
**Decisão:** Web Audio API sintetizada (oscillators) — zero arquivos de áudio  
**Motivo:** Sem downloads, sem CORS, funciona offline, altamente configurável, som "premium" moderno  
**Trade-off:** Sons sintéticos (não samples reais), mas adequados para o estilo do produto  
**Implementação:** `AudioManager` singleton em `src/lib/audioManager.js`

---

## D010 — Login Opcional (Guest Mode)

**Data:** 2026-05-22  
**Contexto:** Usuário não deve ser forçado a criar conta para jogar  
**Decisão:** App 100% funcional sem login; login adiciona cloud sync mas não é obrigatório  
**Motivo:** Reduz fricção de onboarding, preserva uso offline, respeita o usuário  
**Como incentiva:** Badge "Jogar sem conta" muted + explicação de benefícios

---

## D011 — Export via Browser Blob API

**Data:** 2026-05-22  
**Contexto:** Usuário quer exportar dados (JSON/CSV)  
**Decisão:** Download direto via `URL.createObjectURL(new Blob(...))` — sem servidor  
**Motivo:** Zero dependências, funciona offline, instantâneo  
**Implementação:** `downloadFile()` helper em StatsPage.jsx

---

## D012 — Remover React.StrictMode

**Data:** 2026-05-22  
**Contexto:** StrictMode monta/desmonta componentes em dev — interfere com Framer Motion AnimatePresence  
**Decisão:** Remover StrictMode de main.jsx  
**Motivo:** React 18 StrictMode simula unmount/remount, o AnimatePresence trata como exit → stuck at opacity 0  
**Trade-off:** Perde detecção de side effects acidentais em dev; risco mínimo para este projeto  
**Revisitar quando:** Framer Motion lançar fix oficial para React 18 StrictMode

---

## D013 — Vercel para Deploy

**Data:** 2026-05-22  
**Contexto:** App React/Vite precisa de hosting estático com suporte a env vars e CI/CD  
**Decisão:** Vercel via CLI (`vercel --prod`)  
**Motivo:** Zero config para Vite, env vars por interface, HTTPS automático, CDN global, free tier generoso  
**Variáveis configuradas:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`  
**URL produção:** https://tabuada-rush-rho.vercel.app

---

## D007 — Dados da Batalha 2P não persistidos

**Data:** 2026-05-22  
**Contexto:** Modo 2 jogadores local  
**Decisão:** Estado apenas em memória React, sem salvar no localStorage  
**Motivo:** Sessão informal, não faz sentido registrar como "partida" normal  
**Revisitar quando:** Quisermos histórico de batalhas ou ELO rating

---

## D008 — Desbloqueio progressivo de modos (UNLOCK_RULES)

**Data:** 2026-06-08 · sessao-032
**Contexto:** Até a v3.8.0 todos os modos eram acessíveis desde a primeira partida.
Davi pediu uma jornada de descoberta: começar só com Zen e ir destravando os demais conforme progresso real.
**Decisão:** Mapa central `UNLOCK_RULES` em `utils/index.js` com regras por modo.
Tipos suportados: `level`, `totalGames`, `totalCorrect`, `totalWrong`, `bestDayStreak`, `certificates`.
Função `getModeUnlock(modeId, data) → { unlocked, reason, current, target }`.
Aplicada na `ModesPage.jsx` (UI) e em `App.jsx::handleStart` (bloqueio defensivo).
**Motivo:**
- Cria sensação de progresso e descoberta (cada modo virando "recompensa")
- Evita sobrecarregar usuário novo com muitas opções de uma vez
- Vai ao encontro da filosofia da 3.0 ("domínio real" > "tempo jogado")
**Trade-off:** Usuários novos veem só Zen no início — risco de pensar que o app é raso. Mitigado pelo texto claro de unlock ("Nível 2: Aprendiz") que mostra o caminho.
**Compatibilidade:** Regras consultam apenas campos já existentes em `data` — usuários antigos automaticamente têm tudo desbloqueado.
**Revisitar quando:** Métricas mostrarem alta taxa de abandono no início (Zen-only).
Aí relaxar regras ou aumentar o XP do Zen.

---

## D009 — Zen quietamente dá XP

**Data:** 2026-06-08 · sessao-032
**Contexto:** Com o desbloqueio progressivo, Rush exige Nível 2. Para chegar lá, o usuário precisa de uma fonte de XP — só Zen está disponível no início.
Antes: `MODES.zen.xpMultiplier = 0` (Zen não dava XP). Conflito.
**Decisão:**
- Zen passa a dar XP discretamente: `xpMultiplier: 0` → `0.10` (mais baixo que qualquer outro modo)
- A UI continua **sem mencionar XP** no Zen: badge mudou de "Sem XP" para "Pratique 🌿"; descrição "Treino livre, sem pressão"; in-game "Sem pressão 🌿"
- O usuário descobre o XP **somente** ao terminar e ver a stat "XP Ganho" na ResultsPage
**Motivo:** Davi pediu explicitamente para o usuário não saber upfront que Zen dá XP ("não fala 'pratique 10 partidas Zen pra ganhar XP', só fala 'pratique'"). Cria momento de surpresa positiva.
**Trade-off:** Quebra a promessa anterior do "Sem XP" (mas isso era uma decisão antiga que não fazia mais sentido com o desbloqueio progressivo).
**Revisitar quando:** Sentirmos que o ritmo de XP em Zen está rápido ou lento demais para a primeira hora de jogo.

---

## D010 — Modo Difícil adaptativo (pool derivado de tableStats)

**Data:** 2026-07-02 · sessao-033
**Contexto:** Até a v3.9 o Modo Difícil tinha pool fixo 7/8/9 (as "mais difíceis" na média histórica). Davi pediu para trocar por adaptativo — que treine as tabuadas que ELE erra mais.
**Decisão:** `getHardTabuadaPool(tableStats)` calcula score de dificuldade individual:
- 60% peso na taxa de erro do jogador naquela tabuada
- 40% peso no tempo médio de resposta
- Requer >=3 amostras por tabuada; fallback para 7/8/9 quando dados insuficientes
Retorna as 3 tabuadas com maior score. `getHardQuestion(tableStats)` amostra desse pool.
**Motivo:**
- Cada jogador treina o que precisa (personalização real)
- Coerente com filosofia da 3.0 (domínio real, dados-first)
- Fallback preserva experiência de usuário novo
**Trade-off:**
- Recorde do Difícil perde valor comparativo entre jogadores (pools diferentes)
- Aceito: Difícil não tem leaderboard; valor é individual
**Revisitar quando:** Quisermos comparação de Difícil entre jogadores — aí volta a ser fixo ou tem 2 sub-modos (fixo/adaptativo).

---

## D014 — Reversão da 4.0: remoção de Soma/Subtração/Divisão

**Data:** 2026-07-06 · sessao-042
**Contexto:** A 4.0 (Fases 1-6, sessões 035-040) expandiu o jogo de "só multiplicação" pra 4 operações fundamentais, com seletor de operação, Mapa de Domínio/Certificados/QI cobrindo as 4. Davi trouxe uma reflexão: o propósito ORIGINAL do Tabuada Rush é decorar a TABUADA — ele criou o jogo porque escrever a tabuada toda à mão pra treinar era cansativo, e ele mesmo ainda não decorou. A 4.0 trocou esse objetivo específico e mensurável por algo vago ("ser bom em matemática"), e o próprio código já estava forçando abstrações (`cellFact`, `isValid`) pra encaixar divisão/subtração numa estrutura pensada pra multiplicação — sinal de que a direção não era essa.
**Decisão:** Remover por completo `add`/`sub`/`div` do registro `OPERATIONS`, o seletor de operação, as abas de operação (Mapa de Domínio/Certificados), o radar cross-operação e o certificado "Matemática Fundamental Completa" (só faziam sentido com 4 operações). O Tabuada Rush volta a ser exclusivamente sobre multiplicação.
**O que foi MANTIDO** (não é reversão total da 4.0 — só da amplitude de operações):
- Curva de esquecimento (`predictRecallProbability`/`getFactsAtRisk`, Fase 4) — roda em cima de `factStats.mult`
- Motor preditivo no Modo Revisão (componente de "staleness" na fórmula de dificuldade, Fase 4)
- Banner "Fatos a Vencer" + lembrete local (Fase 4)
- Viés adaptativo por fatos fracos em Rush/Sobrevivência/Velocidade/Zen + toggle "Foco em Fraquezas" (Fase 5)
**Motivo:** Alinhar o produto de volta ao propósito original e pessoal do criador — decorar a tabuada — em vez de virar um "jogo de matemática genérico". A amplitude de conteúdo (4 operações) e a profundidade de inteligência adaptativa eram os dois pilares da 4.0; só o segundo sobreviveu.
**Trade-off:** Todo o trabalho de Fases 1, 2, 3 e partes da 6 (código de `add`/`sub`/`div`, `cellFact`, seletor de operação, radar, certificado supremo) foi descartado — ainda existe no histórico do Git caso um dia vire um projeto separado ("jogo de matemática completo"), mas não faz mais parte do Tabuada Rush.
**Revisitar quando:** Davi quiser construir esse "jogo de matemática completo" — deve nascer como projeto NOVO, não como expansão do Tabuada Rush (decisão explícita de Davi, pra não repetir a diluição de foco).
