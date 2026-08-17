/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // tema escuro controlado pela classe .dark no <html> (ver lib/prefs.js)
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      // v5.0 · Bloco 1 (2ª rodada): paleta própria "Caderno Quadriculado" —
      // fundo papel/creme, linhas azul-índigo, vermelho caneta pra correção.
      // Tema "matemática" (caderno, régua) em vez de copiar outro app.
      // Os tokens do Duolingo (feather/macaw/bee/...) continuam definidos
      // por enquanto — ainda em uso em telas que não foram re-tematizadas
      // nesta rodada (Modos/Recompensas/Estatísticas ficam pro próximo bloco).
      colors: {
        // v6.0 · Bloco 1: paleta semântica dark-first (ver DECISIONS.md D0xx).
        // Cada token aponta pra uma CSS var (globals.css) que muda de valor
        // via .dark no <html> — então bg-surface/text-fg/etc já funcionam
        // nos dois temas sem precisar de `dark:` espalhado pelas páginas.
        // Telas ainda não migradas (Modos/Estatísticas/Loja/Recompensas)
        // continuam usando os tokens legados abaixo até seus blocos.
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        fg: 'var(--fg)',
        'fg-muted': 'var(--fg-muted)',
        // rgb(var(--x) / <alpha-value>) em vez de var(--x) direto — as vars
        // guardam "R G B" (sem função), isso é o que deixa bg-accent/15 etc
        // funcionar com opacidade (var() puro não aceita modificador /NN).
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-dark': 'rgb(var(--accent-dark) / <alpha-value>)',
        streak: 'rgb(var(--streak) / <alpha-value>)',
        coin: 'rgb(var(--coin) / <alpha-value>)',
        danger: 'rgb(var(--destructive) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',

        // Legado — "Caderno Quadriculado" (v5.0), mantido pra telas que
        // ainda não migraram pro sistema de tokens novo acima.
        paper: '#FBF7EC',        // fundo principal — papel/creme, não branco puro
        'paper-line': '#C9D6F5', // linha de caderno quadriculado (textura sutil)
        ink: '#3B4FCC',          // azul-índigo — cor primária (era o verde/azul do Duolingo)
        'ink-dark': '#2A3A9E',   // sombra "chunky" do ink
        'ink-light': '#EEF1FC',
        pen: '#D64545',          // vermelho caneta — correção/erro
        'pen-dark': '#B93434',
        check: '#2F9E44',        // verde caneta — acerto/confirmação
        'check-dark': '#237A34',
        graphite: '#3A3A3A',     // texto principal — grafite, não preto puro
        'graphite-soft': '#767272',

        // Duolingo (mantido pra telas ainda não migradas — ver nota acima)
        feather: '#58CC02',
        wing: '#43C000',
        mask: '#89E219',
        macaw: '#1CB0F6',
        'macaw-dark': '#1899D6',
        cardinal: '#FF4B4B',
        'cardinal-dark': '#EA2B2B',
        bee: '#FFC800',
        'bee-dark': '#E5A800',
        fox: '#FF9600',
        beetle: '#CE82FF',
        eel: '#4B4B4B',
        wolf: '#777777',
        hare: '#AFAFAF',
        swan: '#E5E5E5',
        polar: '#F7F7F7',
      },
      animation: {
        'pop-in': 'popIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake': 'shake 0.35s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      // Sombras "chunky" estilo Duolingo: borda inferior sólida simulando
      // profundidade. Usadas pelo Button (ui/index.jsx) — o botão "afunda"
      // (active:translate-y) em vez de só encolher (scale).
      boxShadow: {
        'chunky-accent': '0 4px 0 0 rgb(var(--accent-dark))', // v6.0 — botão primário novo
        'chunky-surface': '0 4px 0 0 var(--border)',     // v6.0 — botão secundário novo
        chunky: '0 4px 0 0 #2A3A9E',          // ink → ink-dark
        'chunky-white': '0 4px 0 0 #E0DACB',  // borda de "papel" mais escura
        'chunky-danger': '0 4px 0 0 #B93434', // pen → pen-dark
        'chunky-check': '0 4px 0 0 #237A34',  // check → check-dark
        'chunky-amber': '0 4px 0 0 #E5A800',  // bee → bee-dark (mantido)
        // legado (telas ainda não migradas)
        'chunky-macaw': '0 4px 0 0 #1899D6',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-8px)' },
          '30%': { transform: 'translateX(8px)' },
          '45%': { transform: 'translateX(-6px)' },
          '60%': { transform: 'translateX(6px)' },
          '75%': { transform: 'translateX(-3px)' },
          '90%': { transform: 'translateX(3px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
