// Edge Function: envia lembretes de OFENSIVA via Web Push para usuários que ainda
// NÃO jogaram hoje. Chamada por um cron diário (pg_cron + pg_net) com o header
// x-cron-secret. Funciona com o app FECHADO (push real).
//
// Segredos necessários (Edge Function Secrets no Supabase):
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetados automaticamente.)

import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2';

const VAPID_PUBLIC = Deno.env.get('VAPID_PUBLIC_KEY') ?? '';
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY') ?? '';
const CRON_SECRET = Deno.env.get('CRON_SECRET') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

webpush.setVapidDetails('mailto:tabuada-rush@example.com', VAPID_PUBLIC, VAPID_PRIVATE);

Deno.serve(async (req) => {
  // Autenticação simples por segredo (a função é chamada pelo cron, sem JWT)
  if (CRON_SECRET && req.headers.get('x-cron-secret') !== CRON_SECRET) {
    return new Response('unauthorized', { status: 401 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const today = new Date().toISOString().split('T')[0];

  // Usuários que NÃO jogaram hoje
  const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, data');
  if (pErr) return new Response(JSON.stringify({ error: pErr.message }), { status: 500 });

  const targets = (profiles ?? []).filter((p) => (p.data?.lastPlayDate ?? null) !== today);
  const ids = targets.map((p) => p.id);
  if (ids.length === 0) {
    return new Response(JSON.stringify({ sent: 0, candidates: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('*')
    .in('user_id', ids);

  const dataByUser = new Map(targets.map((p) => [p.id, p.data || {}]));
  let sent = 0;
  let removed = 0;

  for (const s of subs ?? []) {
    const d = dataByUser.get(s.user_id) || {};
    const streak = d.currentStreak || 0;
    const body =
      streak > 0
        ? `Sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'} está acabando 🔥 Treine agora!`
        : 'Você ainda não treinou hoje. Bora manter a tabuada afiada! 🚀';
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ title: 'Tabuada Rush 🔥', body })
      );
      sent++;
    } catch (e) {
      const code = (e && (e.statusCode || e.status)) || 0;
      if (code === 404 || code === 410) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', s.endpoint);
        removed++;
      }
    }
  }

  return new Response(JSON.stringify({ sent, removed, candidates: ids.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
