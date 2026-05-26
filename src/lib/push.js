// Push Web (notificações com o app FECHADO) — lado do cliente.
// Assina o navegador no serviço de push e salva a "subscription" no Supabase,
// para o backend (Edge Function agendada) poder enviar os lembretes de ofensiva.
//
// Requer: usuário LOGADO (para o servidor saber de quem é) + permissão concedida
// + Service Worker registrado (public/sw.js, com handler `push`).

import { supabase, isSupabaseConfigured } from './supabase';

// Chave PÚBLICA VAPID (pode ficar no cliente — é pública). Override por env se quiser.
const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  'BCKZ2m-gB_2DqjiIo8LSjs46Zjo3Pt8I6Ypx3Acp3IkdS1X5H4F3-q4wkG8SWaqio6eW6n6t-tGfRYVICkWSE4c';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export function pushSupported() {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

// Assina o push e salva no Supabase. Retorna true se ok.
export async function subscribeToPush(userId) {
  if (!pushSupported() || !isSupabaseConfigured || !supabase || !userId) return false;
  if (Notification.permission !== 'granted') return false;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }
    const json = sub.toJSON();
    const { error } = await supabase.from('push_subscriptions').upsert(
      {
        user_id: userId,
        endpoint: sub.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
      { onConflict: 'endpoint' }
    );
    return !error;
  } catch (e) {
    console.error('[push] subscribe:', e);
    return false;
  }
}

// Cancela a assinatura local e remove do Supabase.
export async function unsubscribeFromPush() {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint);
      }
      await sub.unsubscribe();
    }
  } catch {
    // ignore
  }
}
