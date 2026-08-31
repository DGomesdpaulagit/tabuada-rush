import { predictRecallProbability, getFactKey } from './index';
import { LEVELS } from '../constants';

// ── CÁLCULO DE DOMÍNIO [Fase 1, sessão 099] ─────────────────────────────────
// Implementa a Tabela-Mãe do ARQUITETURA_XP.md. É FUNÇÃO PURA: lê o save e
// devolve números. Não grava nada, não muda regra nenhuma, não destrava faixa.
// Na Fase 3 é ela que passa a decidir a progressão — por enquanto só mede.
//
// PRINCÍPIO (v3 do documento): a faixa se abre com APRENDIZADO, não com XP.
// E o que se mede é FLUÊNCIA, não "memorização": o jogo não sabe o que se
// passa na cabeça de ninguém, só observa comportamento.

export const PESOS = { precisao: 40, consistencia: 25, fluencia: 20, recencia: 15 };
// Sem fluência (período de estabilização), os 20 pontos dela vão pra precisão.
export const PESOS_ESTAVEL = { precisao: 60, consistencia: 25, fluencia: 0, recencia: 15 };

export const VERDE = 80;              // nota mínima pra 🟢
export const AMARELO = 50;            // abaixo disso é 🔴
export const PISO_PRECISAO = 70;      // catraca: abaixo disso é 🔴 sempre
export const FLUENCIA_MULT = 1.4;     // fluente = mediana ≤ base × isto
export const FLUENCIA_TETO = 2.5;     // acima de base × isto, fluência = 0
export const DIAS_ALVO = 4;           // dias distintos pra consistência cheia
// ⚠️ CATRACA DE DIAS [medida na Fase 1, sessão 099]. Com os pesos da
// Tabela-Mãe, um fato com precisão, fluência e recência perfeitas mas
// praticado num DIA SÓ soma 81 — e 81 já é verde. Ou seja: "10 acertos numa
// tarde" viraria "dominado", exatamente o que a consistência existia pra
// impedir. Não é problema de peso, é de validade: aprendizado não se
// estabelece numa sessão. Então dias distintos vira catraca, igual à
// precisão.
export const MIN_DIAS_VERDE = 3;
export const MIN_RESPOSTAS_BASE = 5;  // respostas pra um fato entrar na base
export const MIN_FATOS_BASE = 15;     // fatos medidos pra a base ser confiável
export const CORTE_FAIXA = 0.95;      // 95% em 🟢 e nenhum 🔴

const mediana = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
};

const percentil = (xs, p) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(p * s.length))];
};

// Tempo de DECISÃO mediano do fato — só das tentativas válidas pra fluência
// (`d` só é gravado quando passou nos descartes: aba escondida, power-up na
// frente, > 30s). Ver GamePage.jsx.
export function medianaDecisao(fato) {
  const ult = fato?.ult || [];
  // Fora a primeira pergunta da partida: medida na Fase 1, ela é ~60% mais
  // lenta que as demais (2966 ms contra 1860 ms) porque carrega o tempo de se
  // situar. Só descarta se sobrar amostra — num fato que só apareceu como
  // primeira pergunta, é melhor um dado sujo que dado nenhum.
  const semQ1 = ult.filter((t) => !t.q1);
  const fonte = semQ1.length >= 3 ? semQ1 : ult;
  return mediana(fonte.map((t) => t.d).filter((d) => d != null && d > 0));
}

// ── A BASE DA FLUÊNCIA ──────────────────────────────────────────────────────
// Percentil 25 das medianas — o quarto mais rápido do jogador é, quase por
// definição, o que ele já tem de cor. Funciona desde o primeiro dia e não
// depende de nenhum fato já estar verde (a definição se morderia).
export function baseFluencia(fatos = {}) {
  const medianas = Object.values(fatos)
    .filter((f) => (f?.ult || []).filter((t) => t.d != null).length >= MIN_RESPOSTAS_BASE)
    .map(medianaDecisao)
    .filter((m) => m != null);
  return {
    base: percentil(medianas, 0.25),
    fatosMedidos: medianas.length,
    // Amostra pequena = base não confiável. Nesse período a fluência não
    // pontua e o peso dela vai pra precisão.
    estabilizando: medianas.length < MIN_FATOS_BASE,
  };
}

// ── OS QUATRO COMPONENTES (cada um de 0 a 100) ──────────────────────────────

// Últimas 10 tentativas — não a vida inteira. Um fato que era ruim e melhorou
// tem que poder ficar verde.
export function precisaoRecente(fato) {
  const ult = (fato?.ult || []).slice(-10);
  if (!ult.length) return null;
  return Math.round((ult.filter((t) => t.ok).length / ult.length) * 100);
}

// DIAS DISTINTOS, não número de acertos: 10 acertos numa tarde não é memória,
// é sessão. Por isso `dias` existe separado do `ult`.
export function consistencia(fato) {
  const dias = (fato?.dias || []).length;
  return Math.round(Math.min(1, dias / DIAS_ALVO) * 100);
}

// Relativa ao próprio jogador — nunca um limite universal. Quem é lento é
// lento na base também, então o que se cobra é que ESTE fato saia tão rápido
// quanto os fatos mais rápidos DELE.
export function fluencia(fato, base) {
  if (!base) return null;
  const med = medianaDecisao(fato);
  if (med == null) return null;
  const alvo = base * FLUENCIA_MULT;
  if (med <= alvo) return 100;
  const teto = base * FLUENCIA_TETO;
  if (med >= teto) return 0;
  return Math.round(((teto - med) / (teto - alvo)) * 100);
}

export function recencia(fato, agora = Date.now()) {
  return Math.round(predictRecallProbability(fato, agora) * 100);
}

// ── A NOTA ──────────────────────────────────────────────────────────────────
export function notaDoFato(fato, base, opcoes = {}) {
  const { estabilizando = false, agora = Date.now() } = opcoes;
  const p = precisaoRecente(fato);
  if (p == null) return { nota: 0, estado: 'vermelho', partes: {}, semDados: true };

  const c = consistencia(fato);
  const f = estabilizando ? null : fluencia(fato, base);
  const r = recencia(fato, agora);

  // Sem fluência (estabilizando OU sem tempo válido gravado), o peso dela vai
  // pra precisão — em vez de contar como zero e punir quem não tem o dado.
  const pesos = f == null ? PESOS_ESTAVEL : PESOS;
  const nota = Math.round(
    (p * pesos.precisao + c * pesos.consistencia + (f ?? 0) * pesos.fluencia + r * pesos.recencia) / 100
  );

  // Duas catracas, e nenhuma delas é questão de peso:
  //   1. precisão < 70% → velocidade nunca compensa erro;
  //   2. menos de MIN_DIAS_VERDE dias distintos → não dá pra chamar de
  //      aprendido o que só aconteceu numa sessão (ver MIN_DIAS_VERDE).
  const dias = (fato?.dias || []).length;
  const estado =
    p < PISO_PRECISAO
      ? 'vermelho'
      : nota >= VERDE && dias >= MIN_DIAS_VERDE
      ? 'verde'
      : nota >= AMARELO
      ? 'amarelo'
      : 'vermelho';

  return {
    nota,
    estado,
    partes: { precisao: p, consistencia: c, fluencia: f, recencia: r },
    pesos,
    // Por que não é verde apesar da nota — o painel usa isso pra explicar.
    travadoPorDias: nota >= VERDE && dias < MIN_DIAS_VERDE,
  };
}

// ── OS FATOS DE UMA FAIXA ───────────────────────────────────────────────────
// `a` vem do intervalo da faixa e `b` é sempre 1..10 (ver getRandomQuestion).
// Normalizado por getFactKey, então 3×7 e 7×3 são o mesmo fato.
export function fatosDaFaixa(idx = 0) {
  const faixa = LEVELS[idx] || LEVELS[0];
  const chaves = new Set();
  for (let a = faixa.rangeMin; a <= faixa.rangeMax; a++) {
    for (let b = 1; b <= 10; b++) chaves.add(getFactKey('mult', a, b));
  }
  return [...chaves];
}

// ── O RELATÓRIO DA FAIXA ────────────────────────────────────────────────────
export function dominioDaFaixa(data = {}, idx = 0, agora = Date.now()) {
  const fatos = data.factStats?.mult || {};
  const { base, fatosMedidos, estabilizando } = baseFluencia(fatos);
  const chaves = fatosDaFaixa(idx);

  const linhas = chaves.map((fk) => {
    const fato = fatos[fk];
    const { nota, estado, partes, semDados, travadoPorDias } = notaDoFato(fato, base, { estabilizando, agora });
    return {
      fk,
      nota,
      estado,
      partes,
      semDados: !!semDados,
      travadoPorDias: !!travadoPorDias,
      tentativas: (fato?.ult || []).length,
      dias: (fato?.dias || []).length,
      medDec: medianaDecisao(fato),
    };
  });

  const conta = (e) => linhas.filter((l) => l.estado === e).length;
  const verdes = conta('verde');
  return {
    faixa: LEVELS[idx] || LEVELS[0],
    base,
    fatosMedidos,
    estabilizando,
    total: linhas.length,
    verdes,
    amarelos: conta('amarelo'),
    vermelhos: conta('vermelho'),
    pctVerde: linhas.length ? verdes / linhas.length : 0,
    // A faixa abre com 95% em verde E nenhum vermelho: a folga impede travar
    // em dois fatos teimosos, o "nenhum vermelho" impede a folga virar buraco.
    abre: linhas.length > 0 && verdes / linhas.length >= CORTE_FAIXA && conta('vermelho') === 0,
    linhas: linhas.sort((a, b) => a.nota - b.nota),
  };
}

// ── DIAGNÓSTICO DA COLETA (Fase 1) ──────────────────────────────────────────
// Responde o que a Fase 1 precisa saber ANTES de calibrar: o dado que está
// entrando presta? E quais perguntas ainda não dá pra responder?
export function diagnosticoDaColeta(data = {}) {
  const cal = data.calibra || [];
  const fatos = data.factStats?.mult || {};
  const comDec = cal.filter((c) => c.d != null);
  const medDec = mediana(comDec.map((c) => c.d));
  const medTot = mediana(cal.map((c) => c.tot).filter(Boolean));
  const q1 = cal.filter((c) => c.q1);
  const resto = cal.filter((c) => !c.q1);
  const diasDistintos = new Set(Object.values(fatos).flatMap((f) => f?.dias || [])).size;

  // Quão desigual está a exposição entre as contas da faixa? O sorteio de
  // hoje já enviesa por TABUADA (`weakBias`, em generateQuestion), mas não por
  // CONTA — então dá pra ter conta com 20 tentativas ao lado de conta com 1.
  const daFaixa = fatosDaFaixa(0);
  const exposicoes = daFaixa.map((fk) => (fatos[fk]?.ult || []).length);
  const nuncaVistos = exposicoes.filter((n) => n === 0).length;

  return {
    nuncaVistos,
    expMin: exposicoes.length ? Math.min(...exposicoes) : 0,
    expMax: exposicoes.length ? Math.max(...exposicoes) : 0,
    expMediana: mediana(exposicoes),
    tentativas: cal.length,
    comDecisao: comDec.length,
    validasFluencia: cal.filter((c) => c.flu).length,
    medDec,
    medTot,
    // Era a razão de existir do `firstKeyMs`: se a digitação for uma fatia
    // grande, medir fluência pelo tempo até o envio mistura motor com
    // pensamento.
    pctDigitacao: medDec && medTot ? Math.round(100 * (1 - medDec / medTot)) : null,
    // Hipótese registrada no documento (4.2): a 1ª pergunta da partida pode
    // conter tempo de se situar. Era pra MEDIR, não pra supor.
    medDecQ1: mediana(q1.map((c) => c.d).filter((d) => d != null)),
    medDecResto: mediana(resto.map((c) => c.d).filter((d) => d != null)),
    diasDistintos,
    fatosTocados: Object.keys(fatos).length,
  };
}
