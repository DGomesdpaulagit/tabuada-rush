// ── Geração de imagem de "share card" via Canvas API ────────────────────────
// Sem dependência nova — produz PNG 1080×1080 (formato quadrado, bom para
// stories/feeds). Retorna um data URL que pode ser baixado ou compartilhado.

const W = 1080;
const H = 1080;

// Paleta por modo (espelha o gradiente da UI)
const MODE_THEMES = {
  rush:     { from: '#7C3AED', to: '#A855F7', label: 'Rush' },
  survival: { from: '#F43F5E', to: '#EC4899', label: 'Sobrevivência' },
  speed:    { from: '#FBBF24', to: '#F97316', label: 'Velocidade' },
  daily:    { from: '#34D399', to: '#0D9488', label: 'Desafio Diário' },
  zen:      { from: '#2DD4BF', to: '#06B6D4', label: 'Zen' },
  review:   { from: '#3B82F6', to: '#4F46E5', label: 'Revisão' },
  hard:     { from: '#F97316', to: '#DC2626', label: 'Difícil' },
  personal: { from: '#EAB308', to: '#D97706', label: 'Recorde Pessoal' },
  weekly:   { from: '#EC4899', to: '#E11D48', label: 'Desafio Semanal' },
  inverse:  { from: '#6366F1', to: '#2563EB', label: 'Inverso' },
};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Centraliza texto e suporta cor + fonte.
function centerText(ctx, text, x, y, font, color, align = 'center') {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function generateShareCard({ mode, score, correct, wrong, accuracy, bestStreak, qiChar, qiName, isNewRecord }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const theme = MODE_THEMES[mode] || MODE_THEMES.rush;

  // ── Fundo: gradiente diagonal do tema ───────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, theme.from);
  bg.addColorStop(1, theme.to);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Overlay sutil para legibilidade
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, W, H);

  // ── Cabeçalho: TABUADA RUSH ─────────────────────────────────────────────
  centerText(ctx, 'TABUADA RUSH', W / 2, 110, 'bold 56px Nunito, system-ui, sans-serif', '#ffffff');
  centerText(ctx, theme.label.toUpperCase(), W / 2, 175, 'bold 32px Nunito, system-ui, sans-serif', 'rgba(255,255,255,0.85)');

  // ── Card central com score ──────────────────────────────────────────────
  const cardX = 90;
  const cardY = 230;
  const cardW = W - 180;
  const cardH = 540;
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  roundRect(ctx, cardX, cardY, cardW, cardH, 40);
  ctx.fill();

  // SCORE grande
  centerText(ctx, String(score), W / 2, cardY + 200, 'bold 220px Nunito, system-ui, sans-serif', '#111827');
  centerText(ctx, 'PONTOS', W / 2, cardY + 320, 'bold 38px Nunito, system-ui, sans-serif', '#6B7280');

  // Badge "NOVO RECORDE"
  if (isNewRecord) {
    const bw = 380, bh = 64;
    const bx = W / 2 - bw / 2;
    const by = cardY + 360;
    ctx.fillStyle = '#F59E0B';
    roundRect(ctx, bx, by, bw, bh, 32);
    ctx.fill();
    centerText(ctx, '🏆 NOVO RECORDE!', W / 2, by + bh / 2, 'bold 32px Nunito, system-ui, sans-serif', '#ffffff');
  }

  // Stats em 3 colunas
  const sy = cardY + (isNewRecord ? 460 : 420);
  const colW = cardW / 3;
  const stats = [
    { label: 'Precisão', value: `${accuracy}%` },
    { label: 'Acertos', value: String(correct) },
    { label: 'Sequência', value: String(bestStreak) },
  ];
  stats.forEach((s, i) => {
    const cx = cardX + colW * i + colW / 2;
    centerText(ctx, s.value, cx, sy, 'bold 56px Nunito, system-ui, sans-serif', '#7C3AED');
    centerText(ctx, s.label, cx, sy + 52, 'bold 22px Nunito, system-ui, sans-serif', '#9CA3AF');
  });

  // ── Rodapé: personagem QI ───────────────────────────────────────────────
  if (qiChar) {
    centerText(ctx, qiChar, W / 2, H - 165, '110px serif', '#ffffff');
    if (qiName) {
      centerText(ctx, qiName, W / 2, H - 75, 'bold 32px Nunito, system-ui, sans-serif', 'rgba(255,255,255,0.9)');
    }
  } else {
    centerText(ctx, 'tabuada-rush-rho.vercel.app', W / 2, H - 75, 'bold 28px Nunito, system-ui, sans-serif', 'rgba(255,255,255,0.85)');
  }

  return canvas.toDataURL('image/png');
}

// Dispara download do PNG gerado.
export function downloadShareCard(props) {
  const dataUrl = generateShareCard(props);
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `tabuada-rush-${props.mode}-${props.score}pts.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Tenta usar Web Share API se disponível; fallback para download.
export async function shareCard(props) {
  const dataUrl = generateShareCard(props);
  try {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `tabuada-rush-${props.mode}-${props.score}pts.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Meu resultado no Tabuada Rush',
        text: `Fiz ${props.score} pontos no ${props.mode}! Tente bater meu recorde: tabuada-rush-rho.vercel.app`,
      });
      return true;
    }
  } catch (_) { /* fallthrough */ }
  // Fallback: download
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `tabuada-rush-${props.mode}-${props.score}pts.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  return false;
}
