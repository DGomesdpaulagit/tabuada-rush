// Service Worker do Tabuada Rush
// Foco: notificações REAIS via registration.showNotification (compatível com mobile,
// inclusive Android Chrome, onde `new Notification()` é proibido). Inclui handler de
// clique (foca/abre o app) e handler de `push` JÁ PRONTO para o futuro backend de push
// (Push API + servidor VAPID). NÃO faz cache de fetch (evita servir app desatualizado).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Clique na notificação → foca uma aba aberta ou abre o app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    (async () => {
      const all = await clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const c of all) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })()
  );
});

// Push (app fechado) — requer backend VAPID enviando as mensagens (bloco futuro).
// Já deixamos o handler pronto para quando o servidor existir.
self.addEventListener('push', (event) => {
  let data = { title: 'Tabuada Rush', body: 'Não perca sua ofensiva! 🔥' };
  try {
    if (event.data) data = Object.assign(data, event.data.json());
  } catch {
    // payload não-JSON: usa default
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'tabuada-rush',
    })
  );
});
