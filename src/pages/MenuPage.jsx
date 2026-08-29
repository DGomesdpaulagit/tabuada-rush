import { motion } from 'framer-motion';
import { Gamepad2, BarChart2, LogIn, Cloud, Settings, ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { getModeUnlock } from '../utils';
import { getLeagueStandings } from '../utils/leagues';
import { getActiveMissions } from '../utils/missions';
import { MODES } from '../constants';
import { Button, pageVariants, pageTransition } from '../components/ui';
import GameIcon, { LeagueIcon } from '../components/GameIcon';
import { MissionProgress } from './MissionsPage';

// ── PAINEL DE INÍCIO — FASE 8, blocos 8.3/8.4/8.5 [sessão 093] ───────────────
// O que saiu daqui e por quê:
//   · card de perfil (liga + ofensiva + meta): ofensiva e meta agora moram no
//     painel do Header; a liga virou caixa própria (8.3)
//   · caixa "X fatos prestes a serem esquecidos": pedido explícito do Davi
//   · botão "Recompensas": o hub morreu junto com a Temporada; Missões agora
//     se alcança pela caixa de Missões do dia (8.4) e a Loja pelo Header
//   · insight da Análise Inteligente: era mais um card de texto competindo com
//     o que importa aqui, que é começar uma partida
//
// O que a página é agora: os 3 modos (8.5) como assunto principal, com liga e
// missões do dia numa coluna de apoio à direita no desktop — no celular tudo
// empilha, modos primeiro.

// Ordena os modos pelos MAIS JOGADOS (conta as partidas em `sessions`).
// Quem nunca jogou vê a ordem padrão do jogo: Rush primeiro, depois os de
// treino. Sem rótulo dizendo "mais jogados" — pedido do Davi.
const ORDEM_PADRAO = ['rush', 'zen', 'review'];

function modosPorUso(sessions = []) {
  const partidas = sessions.reduce((acc, s) => {
    if (!s?.mode) return acc;
    return { ...acc, [s.mode]: (acc[s.mode] || 0) + 1 };
  }, {});
  return ORDEM_PADRAO
    .map((id) => ({ id, mode: MODES[id], partidas: partidas[id] || 0 }))
    .filter((m) => m.mode)
    .sort((a, b) => b.partidas - a.partidas || ORDEM_PADRAO.indexOf(a.id) - ORDEM_PADRAO.indexOf(b.id));
}

// Onde o jogador está em relação à zona de rebaixamento/promoção — a legenda
// da caixa de divisão, no mesmo espírito do "5 posições acima da zona de
// rebaixamento!" da referência que o Davi mandou.
function legendaDaDivisao(posicao, total, league) {
  const promo = league.promotionCount || 0;
  const rebaixa = league.relegationCount || 0;
  const primeiroRebaixado = total - rebaixa + 1;

  if (promo && posicao <= promo) return 'Você está na zona de promoção!';
  if (rebaixa && posicao >= primeiroRebaixado) return 'Cuidado: você está na zona de rebaixamento!';
  if (promo) {
    const faltam = posicao - promo;
    if (faltam <= 3) return `${faltam} ${faltam === 1 ? 'posição' : 'posições'} para a zona de promoção!`;
  }
  if (rebaixa) {
    const acima = primeiroRebaixado - posicao;
    return `${acima} ${acima === 1 ? 'posição' : 'posições'} acima da zona de rebaixamento!`;
  }
  return 'Jogue para subir na classificação!';
}

// ── Cabeçalho de caixa: título à esquerda, atalho à direita ─────────────────
function TituloCaixa({ children, acao, onAcao }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <p className="text-sm font-black text-fg">{children}</p>
      <button
        onClick={onAcao}
        className="text-[11px] font-black text-accent hover:underline shrink-0 uppercase tracking-wide"
      >
        {acao}
      </button>
    </div>
  );
}

export default function MenuPage({ onStart, onNavigate }) {
  const { data, cloudSyncing } = useApp();
  const { user } = useAuth();

  const { league, playerRank, total: leagueTotal } = getLeagueStandings(data);
  const missoes = getActiveMissions(data.missionsData).daily.missions;
  const modos = modosPorUso(data.sessions);
  const [principal, ...secundarios] = modos;

  const jogar = (id) => {
    const { unlocked } = getModeUnlock(id, data);
    return unlocked ? onStart(id) : onNavigate('modes');
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-6"
    >
      {/* ── Cabeçalho ────────────────────────────────────────────────────── */}
      {/* [sessão 093] Botões saíram de cima do título: antes eram
          `absolute` e o "Tabuada Rush" encostava neles (dívida anotada na
          revisão de telas da sessão 086). Agora o cabeçalho é uma linha
          própria e o título respira embaixo. */}
      <div className="flex items-start justify-between gap-3 pt-2">
        <div className="min-w-0">
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="text-4xl font-black text-accent leading-none"
          >
            Tabuada Rush
          </motion.h1>
          <p className="text-fg-muted text-sm font-semibold mt-1.5">
            Memorize a tabuada. Domine a multiplicação.
          </p>
          {cloudSyncing && (
            <p className="flex items-center gap-1 mt-1 text-xs text-accent font-semibold">
              <Cloud size={11} className="animate-pulse" />
              Sincronizando...
            </p>
          )}
          {user && !cloudSyncing && (
            <p className="flex items-center gap-1 mt-1 text-xs text-success font-semibold">
              <Cloud size={11} />
              {user.email}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('settings')}
            title="Configurações"
            className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors"
          >
            <Settings size={15} />
          </button>
          {!user && (
            <button
              onClick={() => onNavigate('auth')}
              title="Entrar / Criar conta"
              className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors"
            >
              <LogIn size={15} />
            </button>
          )}
        </div>

      </div>

      {/* Duas colunas no desktop: modos à esquerda, apoio à direita.
          No celular vira uma coluna só, com os modos primeiro. */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* ── 8.5 · OS 3 MODOS ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {principal && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => jogar(principal.id)}
              className={`w-full text-left rounded-3xl p-5 bg-gradient-to-br ${principal.mode.gradient} text-white shadow-lg`}
            >
              <p className="text-3xl font-black leading-tight">{principal.mode.name}</p>
              <p className="text-sm font-semibold text-white/85 mt-1 leading-snug">
                {principal.mode.description}
              </p>
              {/* [sessão 093] `bg-white` NÃO serve aqui: no tema escuro o
                  projeto redefine o branco (vira #25252d) e o botão sumia.
                  `bg-coin` é o mesmo amarelo do "Continuar" do resumo. */}
              <span className="mt-4 inline-flex items-center gap-2 bg-coin text-graphite font-black text-sm px-5 py-2.5 rounded-2xl shadow">
                Jogar agora
                <ChevronRight size={16} />
              </span>
            </motion.button>
          )}

          <div className="grid grid-cols-2 gap-3">
            {secundarios.map(({ id, mode }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => jogar(id)}
                className="text-left bg-surface rounded-2xl p-4 border-2 border-border hover:border-accent/40 transition-colors"
              >
                <p className="text-base font-black text-fg leading-tight">{mode.name}</p>
                <p className="text-xs font-semibold text-fg-muted mt-1 leading-snug">
                  {mode.description}
                </p>
              </motion.button>
            ))}
          </div>

          <Button variant="secondary" onClick={() => onNavigate('modes')} className="w-full">
            <Gamepad2 size={16} />
            Modos de jogo
          </Button>
        </div>

        {/* ── Coluna de apoio: divisão (8.3) + missões do dia (8.4) ─────── */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-surface rounded-2xl p-4 border-2 border-border"
          >
            <TituloCaixa acao="Ver divisão" onAcao={() => onNavigate('ranking')}>
              Divisão {league.name}
            </TituloCaixa>
            <div className="flex items-center gap-3">
              <LeagueIcon leagueId={league.id} size={48} />
              <div className="min-w-0">
                <p className="text-xs font-bold text-fg-muted">Sua posição</p>
                <p className="text-2xl font-black text-fg leading-tight tabular-nums">
                  {playerRank}º <span className="text-sm text-fg-muted font-bold">de {leagueTotal}</span>
                </p>
              </div>
            </div>
            <p className="text-xs font-bold text-accent mt-2 leading-snug">
              {legendaDaDivisao(playerRank, leagueTotal, league)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-surface rounded-2xl p-4 border-2 border-border"
          >
            <TituloCaixa acao="Ver todas" onAcao={() => onNavigate('missions')}>
              Missões do dia
            </TituloCaixa>
            <div className="flex flex-col gap-3">
              {missoes.length === 0 && (
                <p className="text-xs font-semibold text-fg-muted">Nenhuma missão hoje.</p>
              )}
              {missoes.map((m) => (
                <div key={m.id}>
                  <p className="text-xs font-black text-fg leading-tight mb-1.5 truncate">{m.title}</p>
                  <MissionProgress
                    mission={m}
                    pct={Math.min((m.progress / m.target) * 100, 100)}
                    size={24}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          <Button variant="secondary" onClick={() => onNavigate('stats')} className="w-full">
            <BarChart2 size={16} />
            Estatísticas
          </Button>
        </div>
      </div>

      {/* Rodapé com o resumo de sempre */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-around py-3 bg-surface rounded-2xl border-2 border-border"
      >
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.totalGames || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Partidas</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.bestStreak || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Melhor Seq.</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-lg font-black text-fg">{data.totalCorrect || 0}</p>
          <p className="text-xs font-semibold text-fg-muted">Acertos</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
