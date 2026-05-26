// Preferências do usuário (tema, música, notificações, acessibilidade).
// Persistidas em localStorage (device-level). O áudio (efeitos/volume) continua
// em audioManager (tr_audio/tr_volume); aqui ficam as demais preferências.

const KEY = 'tr_prefs';

const DEFAULTS = {
  theme: 'light',        // 'light' | 'dark'
  music: false,          // música de fundo (preparado; trilha em bloco futuro)
  notifications: false,  // lembretes/avisos (estrutura preparada)
  largeText: false,      // acessibilidade: texto maior
  reduceMotion: false,   // acessibilidade: reduzir animações
  highContrast: false,   // acessibilidade: alto contraste
};

export const prefs = {
  get() {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  },
  set(p) {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch (e) {
      console.error('[prefs] write error:', e);
    }
  },
  update(patch) {
    const next = { ...this.get(), ...patch };
    this.set(next);
    applyPrefs(next);
    return next;
  },
};

// Aplica as preferências ao <html> (classes que o CSS usa).
export function applyPrefs(p = prefs.get()) {
  const el = document.documentElement;
  el.classList.toggle('dark', p.theme === 'dark');
  el.classList.toggle('large-text', !!p.largeText);
  el.classList.toggle('reduce-motion', !!p.reduceMotion);
  el.classList.toggle('high-contrast', !!p.highContrast);
}
