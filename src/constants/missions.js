// ── POOL DE MISSÕES DIÁRIAS ───────────────────────────────────────────────────
// 3 são sorteadas deterministicamente por dia. Sem risco — se não completar,
// não perde nada; se completar, só ganha (planejamento-6.0.md seção 7).
//
// [sessão 088] ALVOS SUBIRAM, recompensas ficaram iguais. O Davi jogou e
// achou fácil demais ("20 acertos numa partida vale 30 moedas? isso é uma
// partida só"). Agora: partidas 1→2 e 3→5, acertos numa partida 20→35, no dia
// 50→120, sequências 10→15 e 15→25, pontuação 100→250 e 200→500. As de
// PRECISÃO não mudaram — são de qualidade, não de quantidade, e 90% já é
// difícil. Os desafios MENSAIS ficaram como estavam (ele disse que estão bons).
export const DAILY_MISSION_POOL = [
  {
    id: 'dm_play_2',
    title: 'Duas Partidas',
    desc: 'Jogue 2 partidas hoje',
    type: 'play',
    target: 2,
    reward: 20,
    emoji: '🎮',
  },
  {
    id: 'dm_play_5',
    title: 'Cinco Partidas',
    desc: 'Jogue 5 partidas hoje',
    type: 'play',
    target: 5,
    reward: 40,
    emoji: '🎮',
  },
  {
    id: 'dm_correct_35',
    title: '35 Acertos',
    desc: 'Acerte 35 contas em uma única partida',
    type: 'correct_single',
    target: 35,
    reward: 30,
    emoji: '✅',
  },
  {
    id: 'dm_correct_120',
    title: '120 Acertos',
    desc: 'Acerte 120 contas no total hoje',
    type: 'correct_day',
    target: 120,
    reward: 35,
    emoji: '✅',
  },
  {
    id: 'dm_streak_15',
    title: 'Sequência de 15',
    desc: 'Faça uma sequência de 15 acertos',
    type: 'streak',
    target: 15,
    reward: 40,
    emoji: '🔥',
  },
  {
    id: 'dm_streak_25',
    title: 'Sequência de 25',
    desc: 'Faça uma sequência de 25 acertos',
    type: 'streak',
    target: 25,
    reward: 55,
    emoji: '🔥',
  },
  {
    id: 'dm_acc_80',
    title: 'Precisão de 80%',
    desc: 'Termine uma partida com 80% de precisão',
    type: 'accuracy',
    target: 80,
    reward: 45,
    emoji: '🎯',
  },
  {
    id: 'dm_acc_90',
    title: 'Precisão de 90%',
    desc: 'Termine uma partida com 90% de precisão',
    type: 'accuracy',
    target: 90,
    reward: 60,
    emoji: '🎯',
  },
  {
    id: 'dm_score_250',
    title: 'Duzentos e Cinquenta',
    desc: 'Faça 250 pontos em uma partida',
    type: 'score',
    target: 250,
    reward: 30,
    emoji: '💯',
  },
  {
    id: 'dm_score_500',
    title: 'Quinhentos Pontos',
    desc: 'Faça 500 pontos em uma partida',
    type: 'score',
    target: 500,
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
