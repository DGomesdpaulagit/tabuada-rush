// ── POOL DE MISSÕES DIÁRIAS ───────────────────────────────────────────────────
// 3 são sorteadas deterministicamente por dia. Sem risco — se não completar,
// não perde nada; se completar, só ganha (planejamento-6.0.md seção 7).
export const DAILY_MISSION_POOL = [
  {
    id: 'dm_play_1',
    title: 'Primeira Partida',
    desc: 'Jogue 1 partida hoje',
    type: 'play',
    target: 1,
    reward: 20,
    emoji: '🎮',
  },
  {
    id: 'dm_play_3',
    title: 'Três Partidas',
    desc: 'Jogue 3 partidas hoje',
    type: 'play',
    target: 3,
    reward: 40,
    emoji: '🎮',
  },
  {
    id: 'dm_correct_20',
    title: '20 Acertos',
    desc: 'Acerte 20 contas em uma única partida',
    type: 'correct_single',
    target: 20,
    reward: 30,
    emoji: '✅',
  },
  {
    id: 'dm_correct_50',
    title: '50 Acertos',
    desc: 'Acerte 50 contas no total hoje',
    type: 'correct_day',
    target: 50,
    reward: 35,
    emoji: '✅',
  },
  {
    id: 'dm_streak_10',
    title: 'Sequência de 10',
    desc: 'Faça uma sequência de 10 acertos',
    type: 'streak',
    target: 10,
    reward: 40,
    emoji: '🔥',
  },
  {
    id: 'dm_streak_15',
    title: 'Sequência de 15',
    desc: 'Faça uma sequência de 15 acertos',
    type: 'streak',
    target: 15,
    reward: 55,
    emoji: '🔥',
  },
  {
    id: 'dm_acc_80',
    title: 'Precisão de 80%',
    desc: 'Alcance 80% de precisão em uma partida',
    type: 'accuracy',
    target: 80,
    reward: 45,
    emoji: '🎯',
  },
  {
    id: 'dm_acc_90',
    title: 'Precisão de 90%',
    desc: 'Alcance 90% de precisão em uma partida',
    type: 'accuracy',
    target: 90,
    reward: 60,
    emoji: '🎯',
  },
  {
    id: 'dm_score_100',
    title: 'Cem Pontos',
    desc: 'Faça 100 pontos em uma partida',
    type: 'score',
    target: 100,
    reward: 30,
    emoji: '💯',
  },
  {
    id: 'dm_score_200',
    title: 'Duzentos Pontos',
    desc: 'Faça 200 pontos em uma partida',
    type: 'score',
    target: 200,
    reward: 50,
    emoji: '💯',
  },
];

// ── POOL DE DESAFIOS MENSAIS [v6.0 · Bloco 5] ────────────────────────────────
// Diferente das diárias: precisa ACEITAR pra entrar (utils/missions.js
// acceptChallenge). Completar até o prazo → ganha `reward`. Não completar →
// desconta `penalty` do saldo (pode ficar negativo, quitado automaticamente
// do próximo ganho — ver planejamento-6.0.md seção 7, confirmado com o Davi
// mesmo sendo estruturalmente uma mecânica de aposta/dívida, ver DECISIONS.md).
// `penalty` ≈ 20% do `reward`, mesma proporção do exemplo que o Davi deu no
// áudio (ganha 500 / perde 100). Metas revisadas pra serem alcançáveis com
// jogo consistente (não sobre-humano) — o pool antigo (pré-risco) tinha metas
// como "250 partidas/mês" que garantiriam penalidade pra quase todo mundo.
export const MONTHLY_CHALLENGE_POOL = [
  {
    id: 'mc_play_40',
    title: '40 Partidas',
    desc: 'Jogue 40 partidas este mês (~1-2/dia)',
    type: 'play',
    target: 40,
    reward: 350,
    penalty: 70,
    emoji: '🎮',
  },
  {
    id: 'mc_play_80',
    title: '80 Partidas',
    desc: 'Jogue 80 partidas este mês (~3/dia)',
    type: 'play',
    target: 80,
    reward: 700,
    penalty: 140,
    emoji: '🎮',
  },
  {
    id: 'mc_correct_1500',
    title: '1.500 Acertos',
    desc: 'Acerte 1.500 contas este mês (~50/dia)',
    type: 'correct_month',
    target: 1500,
    reward: 400,
    penalty: 80,
    emoji: '✅',
  },
  {
    id: 'mc_correct_3000',
    title: '3.000 Acertos',
    desc: 'Acerte 3.000 contas este mês (~100/dia)',
    type: 'correct_month',
    target: 3000,
    reward: 800,
    penalty: 160,
    emoji: '✅',
  },
  {
    id: 'mc_streak_month_15',
    title: '15 Dias de Ofensiva',
    desc: 'Mantenha 15 dias consecutivos de ofensiva este mês',
    type: 'streak_month',
    target: 15,
    reward: 450,
    penalty: 90,
    emoji: '🔥',
  },
  {
    id: 'mc_score_250',
    title: 'Pontuação 250',
    desc: 'Faça 250 pontos em uma única partida este mês',
    type: 'score',
    target: 250,
    reward: 300,
    penalty: 60,
    emoji: '💯',
  },
];
