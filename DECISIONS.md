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
