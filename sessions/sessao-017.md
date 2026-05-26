# 📋 Sessão 017 — Push com app fechado (Web Push + Supabase)

**Data:** 2026-05-26
**Duração:** Sessão longa (infra de push)
**Resultado:** ✅ Infra de push implementada e implantada (tabela + Edge Function + cliente). Faltam 2 passos manuais do usuário (segredos + agendar cron) por segurança.

---

## 🎯 OBJETIVO

Notificações reais com o **app fechado** (lembrete de ofensiva), via Web Push + backend Supabase.

---

## ✅ O QUE FOI FEITO (automatizado via integração Supabase)

- **Chaves VAPID** geradas (pública vai no cliente; privada é segredo — fora do repo).
- **Tabela `push_subscriptions`** criada (RLS por usuário) — projeto `oevpmbdcvzplbbedrvyt`.
- **Edge Function `send-streak-reminders`** implantada (ACTIVE, `verify_jwt:false`, protegida por `x-cron-secret`): lê `profiles`, filtra quem não jogou hoje (`data.lastPlayDate`), envia Web Push (`npm:web-push`) com mensagem de ofensiva; remove subscriptions expiradas (404/410).
- Extensões `pg_cron` + `pg_net` habilitadas.

## ✅ O QUE FOI FEITO (cliente — no repo)

- `public/sw.js`: handler `push` (já existia da sessão anterior) exibe a notificação.
- `src/lib/push.js` (NOVO): `subscribeToPush(userId)` (pushManager.subscribe + salva no Supabase) e `unsubscribeFromPush()`. Chave pública VAPID embutida (é pública) / override por env.
- `SettingsPage`: toggle de Lembretes agora assina/cancela o push (quando logado) + mensagens.
- `App.jsx`: reassina o push ao logar (se notificações ON).
- `supabase/functions/send-streak-reminders/index.ts`: cópia versionada da função (usa `Deno.env`).
- `PUSH_SETUP.md`: guia dos 2 passos manuais (segredos + cron).

---

## ⏳ PENDENTE — 2 passos manuais do usuário (segurança)

A criação autônoma do cron foi **bloqueada pelo classificador de segurança** (job autônomo que
notifica todos os usuários + segredo no banco) — decisão que cabe ao usuário. Então:
1. **Definir 3 segredos** da Edge Function no Supabase: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`.
2. **Agendar o cron** (SQL pronto no `PUSH_SETUP.md`).
(Valores secretos passados ao usuário no chat — nunca commitados.)

---

## 🔧 DECISÕES TÉCNICAS

- **D057 — VAPID pública no cliente, privada como segredo:** pública é segura no front; privada só em Supabase Secrets. Nada sensível no repo.
- **D058 — Função protegida por `x-cron-secret` + `verify_jwt:false`:** cron chama sem JWT; autenticação custom por segredo compartilhado.
- **D059 — Cron/segredos manuais:** provisionamento de job autônomo + segredo é ação sensível de infra compartilhada → entregue ao usuário (bloqueio do classificador respeitado).
- **D060 — Push exige login:** subscription ligada ao usuário; anônimo (localStorage) não recebe push com app fechado.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — infra/lógica apenas.

---

## ⚠️ SEGREDOS (NÃO versionar)

- VAPID pública: no `push.js`/`PUSH_SETUP.md` (ok, é pública).
- VAPID privada + `CRON_SECRET`: passados só no chat ao usuário; definir como Edge Function Secrets.

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. Usuário concluir os 2 passos (segredos + cron) e testar em dispositivo real.
2. Economia/Loja (moedas).
3. Leaderboard global via Supabase.
4. Futuros: temporadas, sistema social, recompensas avançadas, gráficos, catálogo, marketplace, missões.
