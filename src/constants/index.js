// ── MODES ──────────────────────────────────────────────────────────────────
// v5.0 · Bloco 1 (continuação): o leque de 10 modos foi cortado pra 3.
// Rush agora é a SOMA do que eram Rush+Sobrevivência+Velocidade+Desafio Diário:
// um timer que começa curto e CRESCE a cada acerto (bonusTime), e 3 vidas —
// a partida acaba quando o tempo zera OU quando erra 3 vezes, o que vier primeiro.
// É o modo que sustenta a ofensiva diária (qualquer partida jogada conta).
export const MODES = {
  rush: {
    id: 'rush',
    name: 'Rush',
    emoji: '⚡',
    description: 'Acerte rápido pra ganhar tempo — 3 erros ou o tempo acabam com tudo',
    gradient: 'from-feather to-mask',
    gradientLight: 'from-mask/10 to-mask/5',
    shadow: 'shadow-mask/30',
    text: 'text-wing',
    border: 'border-mask/30',
    bg: 'bg-feather',
    timer: 30,       // começa curto — urgência desde o primeiro segundo
    lives: 3,
    questions: null,
    bonusTime: 3,    // cada acerto soma 3s ao relógio — "banco de tempo"
    xpMultiplier: 0.20,
    scoreScale: 1,
    group: 'main',
  },
  // ── MODOS DE TREINO — aprendizado sem pressão competitiva ─────────────────
  zen: {
    id: 'zen',
    name: 'Zen',
    emoji: '🧘',
    description: 'Treino livre, sem pressão',
    gradient: 'from-macaw to-macaw-dark',
    gradientLight: 'from-macaw/10 to-macaw/5',
    shadow: 'shadow-macaw/30',
    text: 'text-macaw-dark',
    border: 'border-macaw/30',
    bg: 'bg-macaw',
    timer: null,
    lives: null,
    questions: null,
    bonusTime: 0,
    xpMultiplier: 0,   // Zen é treino livre — sem XP, sem moeda, sem pressão
    group: 'training',
  },
  review: {
    id: 'review',
    name: 'Revisão',
    emoji: '📚',
    description: 'Foca nas tabuadas que você mais erra',
    gradient: 'from-bee to-bee-dark',
    gradientLight: 'from-bee/15 to-bee/5',
    shadow: 'shadow-bee/30',
    text: 'text-bee-dark',
    border: 'border-bee/30',
    bg: 'bg-bee',
    timer: null,
    lives: null,
    questions: 15,        // 15 questões focadas nas tabuadas mais erradas
    bonusTime: 0,
    xpMultiplier: 0.16,   // estudo focado — XP médio
    group: 'training',
  },
};

// Modo(s) principal(is) exibidos em destaque no menu de modos
export const MODE_LIST = Object.values(MODES).filter((m) => m.group === 'main');
// Modos de treino (Zen + Revisão)
export const TRAINING_MODE_LIST = Object.values(MODES).filter((m) => m.group === 'training');

// ── FAIXAS DE TABUADA (progressão de nível) [v6.0 · Bloco 3] ────────────────
// Substitui os 28 níveis abstratos (nomes tipo "Iniciante"/"Mestre") por 20
// faixas LITERAIS de tabuada — o "nível" do jogador é o intervalo do fator
// que ele está treinando, andando de trás pra frente: 2×10 primeiro (a mais
// importante e, de propósito, a mais difícil de passar), depois 10×20,
// 20×30... até 190×200 (planejamento-6.0.md seção 6). Confirmado com o Davi
// (2026-08-17): o fator da PERGUNTA mesmo vai até 200, não é só rótulo —
// ver DECISIONS.md D022 pra decisão e a tensão com "só multiplicação
// tradicional" que isso abre.
//
// Mantém o formato `{name, title, xp, badge}` que `getLevelIdx`/
// `getXpProgress`/etc já sabem ler (não precisou reescrever essas funções) +
// dois campos novos, `rangeMin`/`rangeMax`, que o motor de perguntas usa pra
// saber que fator `a` sortear na faixa atual do jogador (ver
// utils/getRandomQuestion).
//
// CALIBRAÇÃO DA 1ª FAIXA (2×10) — ESTIMATIVA, não medição real (sem
// telemetria de jogadores ainda, recalibrar quando tiver dados de verdade):
// assumindo ~100 XP/dia num jogador engajado (~2-3 partidas de Rush/dia,
// XP = score × 0.20, ver App.jsx MODE_XP_MULT), 24.000 XP ≈ 240 dias ≈ 8
// meses — dentro da janela de 6-10 meses que o Davi pediu no áudio. Faixas
// seguintes ficam progressivamente MAIS RÁPIDAS de passar (delta de XP cai
// 18% por faixa, chão de 1.500 XP) — reflete que quanto mais tabuada o
// jogador já sabe, mais fácil fica aprender a próxima (áudio do Davi).
const TABUADA_TIER_RANGES = [
  [2, 10],
  ...Array.from({ length: 19 }, (_, i) => [10 + i * 10, 20 + i * 10]),
];
const TIER_BADGES = ['🌱', '📚', '✏️', '🧮', '🎯', '⚡', '🚀', '🎲', '💪', '📐', '♟️', '🗺️', '🔬', '🎓', '✨', '🎼', '🏅', '🥇', '📜', '🦉'];
const FIRST_TIER_XP = 24000;
const TIER_XP_DECAY = 0.82;
const TIER_XP_FLOOR = 1500;

function buildTabuadaTiers() {
  let xp = 0;
  let delta = FIRST_TIER_XP;
  return TABUADA_TIER_RANGES.map(([min, max], i) => {
    const tier = {
      name: `Tabuada ${min}×${max}`,
      title: `Tabuada ${min}×${max}`,
      xp,
      badge: TIER_BADGES[i] || '🔢',
      rangeMin: min,
      rangeMax: max,
    };
    xp += delta;
    delta = Math.max(TIER_XP_FLOOR, Math.round(delta * TIER_XP_DECAY));
    return tier;
  });
}

export const LEVELS = buildTabuadaTiers();

// Metas de ofensiva diária que o usuário pode escolher (modal de login / nova meta)
export const STREAK_GOALS = [5, 10, 15, 20, 35, 40];

// Marcos de ofensiva (dias consecutivos absolutos) que dão ESCOLHA DE RECOMPENSA.
// A partir de 40 dias e seguindo em 100, 250, 365. Após a virada de ano a ofensiva
// reinicia (as conquistas, não).
export const STREAK_REWARD_MILESTONES = [40, 100, 250, 365];

// ── VIDAS DIÁRIAS [v6.0 · Bloco 2] ──────────────────────────────────────────
// Modelo Duolingo: um erro em QUALQUER modo consome 1 vida do pote do dia
// (não é por partida). Reseta ao virar o dia (ver getLivesInfo em utils).
// Zerou? Não dá pra começar partida nova até repor (comprar com moeda — caro
// de propósito, ver planejamento-6.0.md seção 5) ou esperar o próximo dia.
export const DAILY_LIVES_MAX = 5;
export const LIFE_REFILL_PRICE = 150; // moedas — repõe o pote inteiro de volta a 5

// ── ACHIEVEMENTS ───────────────────────────────────────────────────────────

export const ACHIEVEMENTS = [
  {
    id: 'first_game',
    title: 'Primeiro Passo',
    desc: 'Complete sua primeira partida',
    icon: '🎯',
    category: 'Progresso',
    check: (s) => s.totalGames >= 1,
  },
  {
    id: 'score_100',
    title: 'Centenário',
    desc: 'Faça 100 pontos em uma partida',
    icon: '💯',
    category: 'Pontuação',
    check: (s) => s.bestScore >= 100,
  },
  {
    id: 'score_300',
    title: 'Trezentos',
    desc: 'Faça 300 pontos em uma partida',
    icon: '🏅',
    category: 'Pontuação',
    check: (s) => s.bestScore >= 300,
  },
  {
    id: 'score_500',
    title: 'Quinhentos',
    desc: 'Faça 500 pontos em uma partida',
    icon: '🏆',
    category: 'Pontuação',
    check: (s) => s.bestScore >= 500,
  },
  {
    id: 'streak_5',
    title: 'Aquecendo',
    desc: '5 acertos consecutivos',
    icon: '🔥',
    category: 'Sequência',
    check: (s) => s.bestStreak >= 5,
  },
  {
    id: 'streak_10',
    title: 'Em Chamas',
    desc: '10 acertos consecutivos',
    icon: '🔥',
    category: 'Sequência',
    check: (s) => s.bestStreak >= 10,
  },
  {
    id: 'streak_20',
    title: 'Invencível',
    desc: '20 acertos consecutivos',
    icon: '⚡',
    category: 'Sequência',
    check: (s) => s.bestStreak >= 20,
  },
  {
    id: 'games_5',
    title: 'Comprometido',
    desc: 'Complete 5 partidas',
    icon: '🎮',
    category: 'Dedicação',
    check: (s) => s.totalGames >= 5,
  },
  {
    id: 'games_20',
    title: 'Veterano',
    desc: 'Complete 20 partidas',
    icon: '🌟',
    category: 'Dedicação',
    check: (s) => s.totalGames >= 20,
  },
  {
    id: 'games_50',
    title: 'Lendário',
    desc: 'Complete 50 partidas',
    icon: '👑',
    category: 'Dedicação',
    check: (s) => s.totalGames >= 50,
  },
  {
    id: 'accuracy_90',
    title: 'Precisão Cirúrgica',
    desc: '90%+ de acertos em uma partida com 10+ respostas',
    icon: '🎯',
    category: 'Precisão',
    check: (s) => s.bestAccuracy >= 90,
  },
  {
    id: 'daily_first',
    title: 'Desafiante',
    desc: 'Complete o Desafio Diário pela 1ª vez',
    icon: '🗓️',
    category: 'Diário',
    check: (s) => s.dailyCompleted >= 1,
  },
  {
    id: 'daily_7',
    title: 'Consistente',
    desc: 'Complete o Desafio Diário 7 vezes',
    icon: '📅',
    category: 'Diário',
    check: (s) => s.dailyCompleted >= 7,
  },
  {
    id: 'all_modes',
    title: 'Explorador',
    desc: 'Jogue todos os modos de jogo',
    icon: '🗺️',
    category: 'Exploração',
    check: (s) => (s.modesPlayed || []).length >= 3,
  },
  {
    id: 'survival_30',
    title: 'Sobrevivente',
    desc: 'Responda 30 perguntas no modo Sobrevivência',
    icon: '💪',
    category: 'Modos',
    check: (s) => s.survivalBest >= 30,
  },
  {
    id: 'speed_20',
    title: 'Raio',
    desc: 'Responda 20 perguntas no modo Velocidade',
    icon: '⚡',
    category: 'Modos',
    check: (s) => s.speedBest >= 20,
  },

  // ── OFENSIVA (dias consecutivos jogando) ──────────────────────────────────
  {
    id: 'ofensiva_5',
    title: 'Faísca',
    desc: 'Mantenha 5 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 5,
  },
  {
    id: 'ofensiva_10',
    title: 'Chama Acesa',
    desc: 'Mantenha 10 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 10,
  },
  {
    id: 'ofensiva_15',
    title: 'Constância',
    desc: 'Mantenha 15 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 15,
  },
  {
    id: 'ofensiva_20',
    title: 'Disciplina',
    desc: 'Mantenha 20 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 20,
  },
  {
    id: 'ofensiva_35',
    title: 'Inabalável',
    desc: 'Mantenha 35 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 35,
  },
  {
    id: 'ofensiva_40',
    title: 'Fogo Eterno',
    desc: 'Mantenha 40 dias de ofensiva',
    icon: '🔥',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 40,
  },
  {
    id: 'ofensiva_100',
    title: 'Centena em Chamas',
    desc: 'Mantenha 100 dias de ofensiva',
    icon: '💯',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 100,
  },
  {
    id: 'ofensiva_250',
    title: 'Inferno Imparável',
    desc: 'Mantenha 250 dias de ofensiva',
    icon: '🌋',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 250,
  },
  {
    id: 'ofensiva_365',
    title: 'Ano de Fogo',
    desc: 'Mantenha 365 dias de ofensiva',
    icon: '🎆',
    category: 'Ofensiva',
    check: (s) => (s.bestDayStreak || 0) >= 365,
  },
];
