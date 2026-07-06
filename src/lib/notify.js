// Notificações reais via Web Notifications API.
// maybeMissionExpireReminder: avisa sobre missões diárias prestes a expirar.
//   Dispara quando restam ≤ 2h do dia e há missões pendentes/não resgatadas.
//   Se o app estiver aberto 2–6h antes da meia-noite, agenda para 1h antes.
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

// ── LEMBRETE DE MISSÕES EXPIRANDO ─────────────────────────────────────────
// Importações inline para evitar ciclo (missions importa storage, notify não depende deles)
export function maybeMissionExpireReminder(missionsData) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;

  const now     = new Date();
  const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
  const msLeft  = midnight - now;
  const ONE_HOUR = 3_600_000;
  const today   = now.toISOString().split('T')[0];
  const remKey  = `tr_mission_remind_${today}`;

  if (localStorage.getItem(remKey)) return; // já lembrou hoje

  // Verifica o estado atual das missões diárias
  const checkMissions = (md) => {
    if (!md?.daily?.missions) return { unfinished: 0, unclaimed: 0 };
    const ms = md.daily.missions;
    return {
      unfinished: ms.filter((m) => !m.completed).length,
      unclaimed:  ms.filter((m) => m.completed && !m.rewardClaimed).length,
    };
  };

  const fireNotif = (md, msRemaining) => {
    const { unfinished, unclaimed } = checkMissions(md);
    if (unfinished === 0 && unclaimed === 0) return; // tudo ok, sem aviso
    localStorage.setItem(remKey, '1');

    const hLeft = Math.ceil(msRemaining / ONE_HOUR);
    let msg;
    if (unclaimed > 0 && unfinished === 0) {
      msg = `Você tem ${unclaimed} recompensa${unclaimed > 1 ? 's' : ''} para resgatar antes da meia-noite!`;
    } else if (msRemaining <= ONE_HOUR) {
      msg = `Menos de 1h! ${unfinished} missão${unfinished > 1 ? 'ões' : ''} diária${unfinished > 1 ? 's' : ''} ainda por completar.`;
    } else {
      msg = `Faltam ${hLeft}h — não perca suas missões diárias de hoje!`;
    }
    showNotif('Missões Expirando ⏰', msg);
  };

  if (msLeft <= 2 * ONE_HOUR) {
    // Dentro das últimas 2h do dia → notifica agora
    fireNotif(missionsData, msLeft);
  } else if (msLeft <= 6 * ONE_HOUR) {
    // 2–6h restantes → agenda para exatamente 1h antes da meia-noite
    const delay = msLeft - ONE_HOUR;
    setTimeout(() => {
      // Relê o storage para verificar o estado mais recente
      try {
        const raw = localStorage.getItem('tabuada_rush_v2');
        const freshMd = raw ? JSON.parse(raw)?.missionsData : missionsData;
        fireNotif(freshMd, ONE_HOUR);
      } catch {
        fireNotif(missionsData, ONE_HOUR);
      }
    }, delay);
  }
  // > 6h: não agenda (abrirá o app novamente antes disso)
}

// ── LEMBRETE DE OFENSIVA ──────────────────────────────────────────────────
// Lembrete local ao abrir o app (1×/dia) se ainda não jogou hoje.
export function maybeStreakReminder(data = {}) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const today = new Date().toISOString().split('T')[0];
  if (data.lastPlayDate === today) return;                         // já praticou hoje
  if (localStorage.getItem('tr_last_reminder') === today) return;  // já lembrou hoje
  localStorage.setItem('tr_last_reminder', today);
  showNotif('Tabuada Rush 🔥', reminderMessage(data.currentStreak || 0));
}

// ── LEMBRETE DE CURVA DE ESQUECIMENTO [v4.0 · Fase 4] ───────────────────
// Aviso local (1×/dia) quando o modelo de decaimento de memória prevê que o
// jogador está prestes a esquecer fatos já praticados. MESMO LIMITE HONESTO
// do topo do arquivo: dispara com o app aberto, não é push de app fechado
// (isso exigiria Edge Function/VAPID — fora de escopo por ora, ver sessao-034).
export function maybeForgettingReminder(count) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  if (!count || count <= 0) return;
  const today = new Date().toISOString().split('T')[0];
  const remKey = `tr_forgetting_remind_${today}`;
  if (localStorage.getItem(remKey)) return; // já lembrou hoje
  localStorage.setItem(remKey, '1');
  const msg = count === 1
    ? 'Você tem 1 fato prestes a ser esquecido. Uma revisão rápida resolve! 🧠'
    : `Você tem ${count} fatos prestes a serem esquecidos. Uma revisão rápida resolve! 🧠`;
  showNotif('Hora de revisar 🧠', msg);
}
