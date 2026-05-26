// Notificações reais via Web Notifications API.
// Usa o Service Worker (registration.showNotification) — compatível com mobile,
// inclusive Android Chrome (onde `new Notification()` é proibido). Fallback para
// `new Notification()` no desktop sem SW.
//
// LIMITE HONESTO: estas notificações disparam enquanto o app está aberto/rodando
// (ex.: ao abrir o app). Notificações com o app FECHADO exigem Push API + backend
// VAPID (bloco futuro) — o handler `push` já está pronto no public/sw.js.

const ICON = '/icons/icon-192.png';

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission() {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

// Pede permissão e confirma. Retorna: 'granted' | 'denied' | 'unsupported'
export async function enableNotifications() {
  if (!notificationsSupported()) return 'unsupported';
  let perm = Notification.permission;
  if (perm === 'default') {
    try { perm = await Notification.requestPermission(); } catch { return 'denied'; }
  }
  if (perm === 'granted') {
    await showNotif('Tabuada Rush 🔥', 'Notificações ativadas! Vou te lembrar de manter a ofensiva.');
    return 'granted';
  }
  return perm; // 'denied'
}

// Mostra uma notificação real (via SW quando disponível; senão new Notification)
export async function showNotif(title, body) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const opts = { body, icon: ICON, badge: ICON, tag: 'tabuada-rush' };
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, opts);
        return;
      }
    }
  } catch {
    // cai no fallback
  }
  try { new Notification(title, opts); } catch { /* ignore */ }
}

// Mensagens focadas em OFENSIVA / continuidade diária
function reminderMessage(streak) {
  const withStreak = [
    `Sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'} está acabando 🔥`,
    `Você ainda não treinou hoje — não perca sua ofensiva! 🔥`,
    `Faltam poucas horas para manter sua sequência de ${streak} ${streak === 1 ? 'dia' : 'dias'}.`,
  ];
  const noStreak = [
    'Você ainda não treinou hoje. Que tal praticar a tabuada? 🚀',
    'Bora começar uma ofensiva hoje! 🔥',
  ];
  const pool = streak > 0 ? withStreak : noStreak;
  // Escolha estável por dia (varia, mas não aleatória no mesmo dia)
  const seed = new Date().getDate();
  return pool[seed % pool.length];
}

// Lembrete local ao abrir o app (1×/dia) se ainda não jogou hoje.
export function maybeStreakReminder(data = {}) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const today = new Date().toISOString().split('T')[0];
  if (data.lastPlayDate === today) return;                         // já praticou hoje
  if (localStorage.getItem('tr_last_reminder') === today) return;  // já lembrou hoje
  localStorage.setItem('tr_last_reminder', today);
  showNotif('Tabuada Rush 🔥', reminderMessage(data.currentStreak || 0));
}
