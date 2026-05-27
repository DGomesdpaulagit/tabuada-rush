// ── ANÁLISE INTELIGENTE DO USUÁRIO ──────────────────────────────────────────
// NÃO é IA real. É um motor que interpreta os DADOS REAIS do usuário (sessões +
// estatísticas) e gera textos automáticos de evolução, precisão, velocidade,
// consistência e modos favoritos. As frases variam (sem repetição) mas são
// escolhidas de forma DETERMINÍSTICA a partir dos dados (estável, não aleatória).

const MODE_LABELS = {
  rush: 'Rush',
  survival: 'Sobrevivência',
  speed: 'Velocidade',
  daily: 'Desafio Diário',
};

// ── Variações de frases (variedade sem ser aleatório) ───────────────────────
const EVOL_UP = [
  'Seu desempenho subiu nas últimas partidas.',
  'Você está pontuando mais que antes — evoluindo!',
  'Sua pontuação recente está em alta.',
];
const EVOL_DOWN = [
  'Suas últimas partidas renderam menos — bora retomar o ritmo!',
  'Houve uma leve queda; uma sequência de treinos resolve.',
  'Seu desempenho recuou um pouco. Continue praticando!',
];
const EVOL_STABLE = [
  'Você mantém um desempenho estável e constante.',
  'Sua pontuação está firme e consistente.',
  'Ritmo equilibrado nas últimas partidas.',
];
const PREC_HIGH = [
  'Sua precisão está altíssima — quase não erra!',
  'Precisão de mestre: você acerta com folga.',
  'Você tem uma das melhores precisões possíveis.',
];
const PREC_UP = [
  'Sua precisão melhorou recentemente.',
  'Você está errando menos que antes.',
  'Acertos em alta nas últimas partidas.',
];
const PREC_OK = [
  'Boa precisão — dá pra refinar ainda mais.',
  'Sua taxa de acertos está sólida.',
  'Precisão consistente; foco nos detalhes leva ao topo.',
];
const PREC_LOW = [
  'Vá com calma nas respostas para subir a precisão.',
  'Reduzir a pressa pode aumentar seus acertos.',
  'Foque na precisão antes da velocidade.',
];
const SPEED_UP = [
  'Você está respondendo mais rápido!',
  'Seu reflexo matemático melhorou.',
  'Velocidade em evolução nos modos rápidos.',
];
const SPEED_GOOD = [
  'Você tem ótimo desempenho nos modos rápidos.',
  'Sua velocidade nos desafios rápidos impressiona.',
  'Reflexo afiado nos modos contra o tempo.',
];
// Velocidade baseada em TEMPO MÉDIO real de resposta (%t = segundos)
const SPEED_FASTER = [
  'Você está respondendo mais rápido — média de %ss!',
  'Seu tempo médio caiu para ~%ss. Mais ágil!',
  'Reflexo afiado: agora você responde em ~%ss.',
];
const SPEED_SLOWER = [
  'Você está respondendo com mais calma — foco na precisão.',
  'Seu tempo subiu um pouco; sem pressa, o importante é acertar.',
  'Ritmo mais tranquilo nas últimas partidas.',
];
const SPEED_STEADY = [
  'Seu tempo médio está estável em ~%ss.',
  'Ritmo de resposta constante (~%ss).',
  'Você mantém ~%ss por questão.',
];
const MODE_STRONG = [
  'Seu modo mais forte é o %s.',
  'Você brilha no modo %s.',
  'Seu melhor desempenho está no %s.',
];
const MODE_FAV = [
  'Seu modo favorito é o %s.',
  'Você joga muito o modo %s.',
  'O %s é o seu queridinho.',
];
const STREAK_GOOD = [
  'Você está há %n dias seguidos treinando — consistência!',
  '%n dias de ofensiva: que disciplina!',
  'Sequência de %n dias mantida. Continue assim!',
];
const CONSISTENCY = [
  'Jogar com frequência acelera sua evolução.',
  'A constância é o que mais faz você crescer.',
  'Manter uma rotina de treino faz diferença.',
];

function pick(arr, seed) {
  return arr[Math.abs(seed) % arr.length];
}
function pickMode(arr, seed, label) {
  return pick(arr, seed).replace('%s', label);
}
function pickNum(arr, seed, n) {
  return pick(arr, seed).replace('%n', n);
}
function pickTime(arr, seed, t) {
  return pick(arr, seed).replace('%s', t);
}

// Tempo médio de resposta (ms) de uma lista de sessões (só as cronometradas)
function meanRespMs(list) {
  const t = list.filter((s) => s.avgMs > 0);
  if (!t.length) return 0;
  return t.reduce((a, s) => a + s.avgMs, 0) / t.length;
}

function sessAcc(list) {
  let c = 0, w = 0;
  for (const s of list) { c += s.correct || 0; w += s.wrong || 0; }
  const t = c + w;
  return t ? c / t : 0;
}
function avgScore(list) {
  if (!list.length) return 0;
  return list.reduce((a, s) => a + (s.score || 0), 0) / list.length;
}
function avgCorrect(list) {
  if (!list.length) return 0;
  return list.reduce((a, s) => a + (s.correct || 0), 0) / list.length;
}

// Resumo mensal automático (relatório pessoal de evolução do mês atual)
function buildMonthly(sessions, data) {
  const now = new Date();
  const m = now.getMonth(), y = now.getFullYear();
  const sameMonth = (s, mm, yy) => {
    const d = new Date(s.date);
    return d.getMonth() === mm && d.getFullYear() === yy;
  };
  const monthList = sessions.filter((s) => sameMonth(s, m, y));
  if (!monthList.length) return null;

  const pm = m === 0 ? 11 : m - 1;
  const py = m === 0 ? y - 1 : y;
  const prevList = sessions.filter((s) => sameMonth(s, pm, py));

  // Precisão mensal sem Sobrevivência (lógica distinta → não comparável)
  const monthListAcc = monthList.filter((s) => s.mode !== 'survival');
  const prevListAcc  = prevList.filter((s) => s.mode !== 'survival');
  const accuracy = Math.round(sessAcc(monthListAcc) * 100);
  const prevAcc = prevListAcc.length ? Math.round(sessAcc(prevListAcc) * 100) : null;
  const avgS = Math.round(avgScore(monthList));
  const prevAvg = prevList.length ? Math.round(avgScore(prevList)) : null;

  const counts = {};
  for (const s of monthList) counts[s.mode] = (counts[s.mode] || 0) + 1;
  const favKey = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const daysActive = new Set(
    monthList.map((s) => new Date(s.date).toISOString().split('T')[0])
  ).size;

  const monthMs = meanRespMs(monthList);
  const prevMs = meanRespMs(prevList);

  return {
    monthName: now.toLocaleDateString('pt-BR', { month: 'long' }),
    games: monthList.length,
    accuracy,
    accDelta: prevAcc != null ? accuracy - prevAcc : null,
    avgScore: avgS,
    scoreDelta: prevAvg != null ? avgS - prevAvg : null,
    daysActive,
    favoriteMode: favKey ? MODE_LABELS[favKey] : '—',
    bestStreak: data.bestStreak || 0,
    streak: data.currentStreak || 0,
    avgMs: monthMs > 0 ? Math.round(monthMs) : 0,
    // Δ orientado: positivo = ficou MAIS RÁPIDO (tempo caiu) vs mês anterior
    avgMsDelta: monthMs > 0 && prevMs > 0 ? Math.round(prevMs - monthMs) : null,
  };
}

export function analyzeUser(data = {}) {
  const sessions = (data.sessions || []).filter((s) => s && s.date);
  const totalGames = data.totalGames || 0;
  const totalCorrect = data.totalCorrect || 0; // mantido para seed
  const streak = data.currentStreak || 0;
  const seed = totalGames * 3 + totalCorrect; // estável por estado, varia entre usuários

  // Sobrevivência tem lógica própria (termina após 3 erros) → excluída das métricas globais
  const nonSurvSessions = sessions.filter((s) => s.mode !== 'survival');
  const nsC = nonSurvSessions.reduce((a, s) => a + (s.correct || 0), 0);
  const nsW = nonSurvSessions.reduce((a, s) => a + (s.wrong   || 0), 0);
  const overallAcc = nsC + nsW > 0 ? Math.round((nsC / (nsC + nsW)) * 100) : 0;

  // Pouca informação → estado inicial acolhedor
  if (totalGames === 0 || sessions.length === 0) {
    return {
      headline: 'Jogue para o jogo começar a analisar sua evolução.',
      summary:
        'Ainda não há partidas suficientes para uma análise. Jogue algumas vezes e o jogo vai acompanhar seu progresso automaticamente!',
      insights: [
        { icon: '👋', tone: 'neutral', text: 'Bem-vindo! Suas análises aparecem aqui conforme você joga.' },
      ],
      monthly: null,
    };
  }

  const n = sessions.length;
  const half = Math.max(1, Math.min(5, Math.floor(n / 2)));
  const recent = sessions.slice(-half);
  const older = n >= half * 2 ? sessions.slice(-half * 2, -half) : [];

  const recentScore = avgScore(recent);
  const olderScore = avgScore(older);

  // Precisão: janelas sem Sobrevivência para não distorcer as métricas
  const nns = nonSurvSessions.length;
  const halfNs = Math.max(1, Math.min(5, Math.floor(nns / 2)));
  const recentNs = nonSurvSessions.slice(-halfNs);
  const olderNs  = nns >= halfNs * 2 ? nonSurvSessions.slice(-halfNs * 2, -halfNs) : [];
  const recentAcc = sessAcc(recentNs);
  const olderAcc  = sessAcc(olderNs);

  // Modo favorito (mais jogado) e mais forte (maior precisão, mín. 2 partidas)
  const counts = {};
  for (const s of sessions) if (s.mode) counts[s.mode] = (counts[s.mode] || 0) + 1;
  const favorite = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  let strongest = null, strongestAcc = -1;
  for (const mdl of Object.keys(counts)) {
    if (counts[mdl] < 2) continue;
    const a = sessAcc(sessions.filter((s) => s.mode === mdl));
    if (a > strongestAcc) { strongestAcc = a; strongest = mdl; }
  }

  const insights = [];

  // Evolução de pontos (recente vs anterior)
  if (older.length) {
    if (recentScore >= olderScore * 1.12)
      insights.push({ icon: '📈', tone: 'positive', text: pick(EVOL_UP, seed) });
    else if (recentScore <= olderScore * 0.85)
      insights.push({ icon: '💪', tone: 'warning', text: pick(EVOL_DOWN, seed) });
    else
      insights.push({ icon: '📊', tone: 'neutral', text: pick(EVOL_STABLE, seed) });
  }

  // Precisão (calculada sem Sobrevivência)
  if (overallAcc >= 90)
    insights.push({ icon: '🎯', tone: 'positive', text: pick(PREC_HIGH, seed) });
  else if (olderNs.length && recentAcc > olderAcc + 0.05)
    insights.push({ icon: '🎯', tone: 'positive', text: pick(PREC_UP, seed) });
  else if (overallAcc >= 70)
    insights.push({ icon: '🎯', tone: 'neutral', text: pick(PREC_OK, seed) });
  else
    insights.push({ icon: '🎯', tone: 'warning', text: pick(PREC_LOW, seed) });

  // Velocidade — usa TEMPO MÉDIO de resposta real (recente vs anterior).
  // Fallback para o proxy (acertos no modo Velocidade) quando não há tempo registrado.
  const recentMs = meanRespMs(recent);
  const olderMs = meanRespMs(older);
  const speedR = recent.filter((s) => s.mode === 'speed');
  const speedO = older.filter((s) => s.mode === 'speed');
  if (recentMs > 0 && olderMs > 0) {
    const secs = (recentMs / 1000).toFixed(1);
    if (recentMs < olderMs * 0.9)
      insights.push({ icon: '⚡', tone: 'positive', text: pickTime(SPEED_FASTER, seed, secs) });
    else if (recentMs > olderMs * 1.15)
      insights.push({ icon: '🐢', tone: 'neutral', text: pick(SPEED_SLOWER, seed) });
    else
      insights.push({ icon: '⚡', tone: 'neutral', text: pickTime(SPEED_STEADY, seed, secs) });
  } else if (recentMs > 0) {
    insights.push({
      icon: '⚡',
      tone: 'neutral',
      text: pickTime(SPEED_STEADY, seed, (recentMs / 1000).toFixed(1)),
    });
  } else if (speedR.length && speedO.length && avgCorrect(speedR) > avgCorrect(speedO)) {
    insights.push({ icon: '⚡', tone: 'positive', text: pick(SPEED_UP, seed) });
  } else if ((data.speedBest || 0) >= 15) {
    insights.push({ icon: '⚡', tone: 'positive', text: pick(SPEED_GOOD, seed) });
  }

  // Modo forte / favorito
  if (strongest)
    insights.push({ icon: '🏆', tone: 'positive', text: pickMode(MODE_STRONG, seed, MODE_LABELS[strongest]) });
  else if (favorite)
    insights.push({ icon: '❤️', tone: 'neutral', text: pickMode(MODE_FAV, seed, MODE_LABELS[favorite]) });

  // Ofensiva / consistência
  if (streak >= 3)
    insights.push({ icon: '🔥', tone: 'positive', text: pickNum(STREAK_GOOD, seed, streak) });
  else if (totalGames >= 10)
    insights.push({ icon: '📅', tone: 'neutral', text: pick(CONSISTENCY, seed) });

  const finalInsights = insights.slice(0, 5);

  const trendPhrase = older.length
    ? recentScore >= olderScore * 1.12
      ? 'e vem melhorando'
      : recentScore <= olderScore * 0.85
      ? 'com espaço para crescer'
      : 'mantendo um ritmo estável'
    : 'no começo da jornada';
  const summary =
    `Você já jogou ${totalGames} ${totalGames === 1 ? 'partida' : 'partidas'} ` +
    `com ${overallAcc}% de precisão, ${trendPhrase}.` +
    (favorite ? ` Seu modo favorito é ${MODE_LABELS[favorite]}.` : '');

  const headline = finalInsights[0]?.text || summary;
  const monthly = buildMonthly(sessions, data);

  return { headline, summary, insights: finalInsights, monthly };
}
