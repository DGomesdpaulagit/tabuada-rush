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
