# 📋 Sessão 016 — Auditoria e correção do sistema de notificações

**Data:** 2026-05-26
**Duração:** Sessão média (auditoria + correção realista)
**Resultado:** ⚠️→✅ (parcial) Corrigido para funcionar de verdade no mobile (foreground via Service Worker). Notificações com app FECHADO seguem dependendo de Push + backend (bloco futuro).

---

## 🎯 OBJETIVO

Certificar honestamente o sistema de notificações e corrigir o que não funcionava.

---

## 🔍 AUDITORIA — ESTADO ANTERIOR (v2.9.0)

Problemas críticos encontrados:
1. **Service Worker nunca era registrado** (nenhum `navigator.serviceWorker.register` no `src`). O `sw.js` da raiz era código morto.
2. O `sw.js` não tinha handlers de `push`/`notificationclick`.
3. `notify.js` usava `new Notification()` direto → **quebra no Android Chrome** ("Illegal constructor").
4. Sem `public/` → `sw.js`/ícones não eram servidos de forma confiável (dev/Vercel).

**Conclusão da auditoria:** funcionava só no **desktop com a aba aberta**; quebrado no mobile; nunca com app fechado.

---

## ✅ O QUE FOI CORRIGIDO (sem backend)

- **`public/sw.js`** (NOVO): SW com `notificationclick` (foca/abre o app) e `push` (pronto para o backend futuro). Sem cache de fetch (evita servir app desatualizado).
- **Registro do SW** em `main.jsx` (`navigator.serviceWorker.register('/sw.js')`).
- **`notify.js`** agora usa `registration.showNotification()` (via `serviceWorker.ready`) — **compatível com mobile/Android**; fallback `new Notification()` no desktop sem SW.
- **Ícones** copiados para `public/icons/` → `/icons/icon-192.png` resolve (notificação + PWA).
- **Mensagens focadas em ofensiva** com variação: "Sua ofensiva de N dias está acabando 🔥", "Você ainda não treinou hoje — não perca sua ofensiva!", "Faltam poucas horas para manter sua sequência...".

**Verificado no preview:** SW registrado (scope /), `/sw.js` e `/icons/icon-192.png` = 200, `registration.showNotification` disponível. (Permissão = denied no ambiente headless → disparo real só no navegador/dispositivo do usuário.)

---

## 📋 CERTIFICAÇÃO HONESTA (o que funciona × o que não)

| Requisito | Status |
|-----------|--------|
| Desktop: notificação real do SO (canto/central) com app ABERTO | ✅ |
| Mobile (Android Chrome / PWA) com app ABERTO | ✅ (corrigido via SW) |
| Pede permissão / salva / respeita bloqueio / funciona após aceitar | ✅ |
| Ativar/desativar nas Configurações + persistir | ✅ |
| Mensagens focadas em ofensiva/prática diária | ✅ |
| **App FECHADO / minimizado / tela bloqueada / agendado** | ❌ requer Push API + backend VAPID |
| **iOS Safari (aba comum)** | ❌ só PWA instalada na tela inicial + Web Push (iOS 16.4+) |

**Veredito:** o sistema agora envia **notificações reais do SO** (não alertas internos) e funciona no mobile **enquanto o app está aberto**. Para o comportamento de "app moderno" com app FECHADO (lembrete agendado mesmo sem abrir), é OBRIGATÓRIO o bloco de Push + backend.

---

## 🧭 PLANO PARA "APP FECHADO" (próximo bloco — precisa de infra)

1. Gerar par de chaves **VAPID**.
2. `pushManager.subscribe()` no cliente; salvar a subscription no **Supabase** (tabela).
3. **Supabase Edge Function** + **pg_cron** (ex.: 1×/dia à noite) que envia Web Push (lib `web-push`) para quem não jogou hoje → o `push` handler do `sw.js` (já pronto) exibe a notificação.
4. Requer: deploy da edge function + chaves VAPID nas env vars (ação do usuário no Supabase/Vercel).

---

## 🔧 DECISÕES TÉCNICAS

- **D054 — showNotification via SW:** caminho correto e cross-platform (Android exige SW). Corrige o bug do `new Notification()`.
- **D055 — SW sem cache de fetch:** evita servir versão desatualizada do app (segurança do deploy).
- **D056 — Honestidade sobre app fechado:** não simular push sem backend; deixar o handler `push` pronto e documentar o plano.

---

## 🎨 IDENTIDADE VISUAL

✅ Inalterada — mudanças de infra/lógica apenas.

---

## 📋 PRÓXIMOS PASSOS / SESSÕES / ETAPAS

1. **Bloco: Push com app fechado** (VAPID + Supabase Edge Function + cron) — conforme plano acima.
2. Economia/Loja (moedas).
3. Leaderboard global via Supabase.
4. Futuros: temporadas, sistema social, recompensas avançadas, gráficos, catálogo, marketplace, missões.
