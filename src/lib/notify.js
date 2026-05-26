// Notificações reais via Web Notifications API (básico, sem servidor/push).
// - Pede permissão ao ativar.
// - Lembrete local de ofensiva quando o app é aberto e o usuário não jogou hoje.
// (Notificações com o app fechado dependem de Push + backend → bloco futuro.)

const ICON = '/icons/icon-192.png';

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Pede permissão e confirma. Retorna: 'granted' | 'denied' | 'unsupported'
export async function enableNotifications() {
  if (!notificationsSupported()) return 'unsupported';
  let perm = Notification.permission;
  if (perm === 'default') {
    try { perm = await Notification.requestPermission(); } catch { return 'denied'; }
  }
  if (perm === 'granted') {
    notify('Tabuada Rush', 'Notificações ativadas! Vamos manter sua ofensiva 🔥');
    return 'granted';
  }
  return perm; // 'denied'
}

export function notify(title, body) {
  try {
    if (notificationsSupported() && Notification.permission === 'granted') {
      new Notification(title, { body, icon: ICON });
    }
  } catch {
    // ignore
  }
}

// Lembrete local ao abrir o app (1x por dia) se ainda não jogou hoje.
export function maybeStreakReminder(data = {}) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const today = new Date().toISOString().split('T')[0];
  if (data.lastPlayDate === today) return;               // já praticou hoje
  if (localStorage.getItem('tr_last_reminder') === today) return; // já lembrou hoje
  localStorage.setItem('tr_last_reminder', today);
  const streak = data.currentStreak || 0;
  notify(
    'Tabuada Rush 🔥',
    streak > 0
      ? `Não perca sua ofensiva de ${streak} ${streak === 1 ? 'dia' : 'dias'}! Treine hoje.`
      : 'Que tal treinar a tabuada hoje? 🚀'
  );
}
