# 🔔 Push com app fechado — Setup final

O código (cliente + Edge Function + tabela) já está pronto e implantado. Faltam só
**2 passos manuais** na sua conta Supabase (não dá para automatizar com segurança).

> Projeto Supabase: **tabuada-rush** (`oevpmbdcvzplbbedrvyt`).
> Já feito automaticamente: tabela `push_subscriptions`, deploy da função
> `send-streak-reminders`, extensões `pg_cron`/`pg_net`.

---

## ✅ Passo 1 — Definir os segredos da Edge Function

No painel do Supabase: **Edge Functions → (menu) Secrets** (ou Project Settings → Functions → Secrets),
adicione 3 segredos:

| Nome | Valor |
|------|-------|
| `VAPID_PUBLIC_KEY` | `BCKZ2m-gB_2DqjiIo8LSjs46Zjo3Pt8I6Ypx3Acp3IkdS1X5H4F3-q4wkG8SWaqio6eW6n6t-tGfRYVICkWSE4c` |
| `VAPID_PRIVATE_KEY` | *(enviado no chat — NÃO fica salvo aqui)* |
| `CRON_SECRET` | *(enviado no chat — NÃO fica salvo aqui)* |

> `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` já são injetados automaticamente — não precisa criar.

---

## ✅ Passo 2 — Agendar o lembrete diário (cron)

No **SQL Editor** do Supabase, rode (troque `COLE_O_CRON_SECRET` pelo mesmo valor do segredo):

```sql
select cron.schedule(
  'streak-reminders-daily',
  '0 23 * * *',  -- 23:00 UTC = 20:00 horário de Brasília
  $job$
  select net.http_post(
    url := 'https://oevpmbdcvzplbbedrvyt.supabase.co/functions/v1/send-streak-reminders',
    headers := jsonb_build_object('Content-Type','application/json','x-cron-secret','COLE_O_CRON_SECRET'),
    body := '{}'::jsonb
  );
  $job$
);
```

Para mudar o horário, ajuste o `'0 23 * * *'` (formato cron, em UTC).
Para cancelar: `select cron.unschedule('streak-reminders-daily');`

---

## 🧪 Testar

1. No app (navegador real / celular), faça **login** e ative **Lembretes** em Configurações → aceite a permissão.
2. Para testar o envio na hora (sem esperar o cron), rode no SQL Editor o mesmo `net.http_post` do Passo 2.
3. Feche o app → você deve receber a notificação.

---

## ℹ️ Importante

- Funciona com o app **fechado** porque o envio vem do servidor (Supabase) para o serviço de push do navegador.
- Precisa estar **logado** (a inscrição de push fica ligada à sua conta).
- **iPhone:** instale o app na tela inicial (Compartilhar → "Adicionar à Tela de Início"). No iOS, push web só funciona com o PWA instalado (iOS 16.4+).
- O lembrete vai para quem **não jogou hoje** (`data.lastPlayDate` ≠ hoje), com mensagem de ofensiva.
