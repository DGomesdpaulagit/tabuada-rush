// Web Audio API synthesizer — no audio files required
class AudioManager {
  constructor() {
    this._ctx = null;
    this.enabled = JSON.parse(localStorage.getItem('tr_audio') ?? 'true');
    this.volume = parseFloat(localStorage.getItem('tr_volume') ?? '0.6');
    this.musicOn = false;     // música de fundo tocando?
    this._musicTimer = null;
    this._musicStep = 0;
  }

  get ctx() {
    if (!this._ctx) {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this._ctx;
  }

  resume() {
    if (this._ctx?.state === 'suspended') this._ctx.resume();
  }

  setEnabled(val) {
    this.enabled = val;
    localStorage.setItem('tr_audio', JSON.stringify(val));
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    localStorage.setItem('tr_volume', String(this.volume));
  }

  _play(freq, duration, type = 'sine', vol = 0.28) {
    if (!this.enabled || this.volume === 0) return;
    try {
      const ctx = this.ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol * this.volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration + 0.01);
    } catch {
      // ignore — browser may block audio
    }
  }

  // Play a sequence of notes with equal spacing
  _seq(freqs, noteLen, type = 'sine', vol = 0.25) {
    freqs.forEach((freq, i) => {
      setTimeout(() => this._play(freq, noteLen * 1.8, type, vol), i * noteLen * 1000);
    });
  }

  // ── GAME SOUNDS ─────────────────────────────────────────────────────────────

  correct() {
    this._play(523.25, 0.12, 'sine', 0.28);
    setTimeout(() => this._play(659.25, 0.09, 'sine', 0.18), 70);
  }

  wrong() {
    this._play(196, 0.22, 'sawtooth', 0.22);
  }

  combo() {
    // C5 → E5 → G5 ascending arpeggio
    this._seq([523.25, 659.25, 783.99], 0.07);
  }

  levelUp() {
    // C5 → E5 → G5 → C6
    this._seq([523.25, 659.25, 783.99, 1046.5], 0.09);
  }

  achievement() {
    this._seq([523.25, 659.25, 783.99, 1046.5], 0.08);
    setTimeout(() => this._play(1046.5, 0.35, 'sine', 0.2), 380);
  }

  gameOver() {
    // Descending phrase C5 → B4 → A4 → G4
    this._seq([523.25, 493.88, 440, 392], 0.13);
  }

  victory() {
    this._seq([523.25, 659.25, 783.99, 1046.5], 0.1);
    setTimeout(() => {
      this._play(523.25, 0.08, 'sine', 0.12);
      this._play(659.25, 0.08, 'sine', 0.12);
      this._play(783.99, 0.08, 'sine', 0.12);
      this._play(1046.5, 0.45, 'sine', 0.22);
    }, 420);
  }

  click() {
    this._play(800, 0.04, 'sine', 0.1);
  }

  timerWarning() {
    this._play(880, 0.07, 'square', 0.12);
  }

  newRecord() {
    // Sparkling ascending run
    this._seq([523.25, 587.33, 659.25, 783.99, 880, 1046.5], 0.065);
  }

  // ── MÚSICA DE FUNDO (ambiente, gerada — sem arquivos) ───────────────────────
  // Loop suave de notas (pentatônica de Dó) + drone grave ocasional. Volume baixo,
  // independente dos efeitos sonoros (controle próprio), respeita o volume geral.
  _musicNote(freq, dur = 1.8, vol = 0.05) {
    if (this.volume <= 0) return;
    try {
      const ctx = this.ctx;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const v = Math.max(0.0008, vol * this.volume);
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0.0008, t);
      gain.gain.exponentialRampToValueAtTime(v, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch {
      // ignore
    }
  }

  startMusic() {
    if (this.musicOn) return;
    this.musicOn = true;
    this.resume();
    const melody = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63]; // C4 E4 G4 A4 G4 E4
    const step = () => {
      if (!this.musicOn) return;
      this._musicNote(melody[this._musicStep % melody.length]);
      if (this._musicStep % melody.length === 0) this._musicNote(130.81, 2.4, 0.04); // drone C3
      this._musicStep++;
    };
    step();
    this._musicTimer = setInterval(step, 1500);
  }

  stopMusic() {
    this.musicOn = false;
    if (this._musicTimer) clearInterval(this._musicTimer);
    this._musicTimer = null;
  }
}

export const audio = new AudioManager();
