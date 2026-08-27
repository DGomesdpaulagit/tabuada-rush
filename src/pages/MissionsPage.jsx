import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getActiveMissions, claimMission, freezeMission, acceptChallenge, freezeChallenge } from '../utils/missions';
import { pageVariants, pageTransition, Progress } from '../components/ui';
import GameIcon from '../components/GameIcon';
import { chestForCoins } from '../constants/loot';

// ── Tabs [v6.0 · Bloco 5] ─────────────────────────────────────────────────────
// Semanais removidas por pedido do Davi — só diárias (sem risco) e mensais
// (desafios que precisam ser aceitos, com recompensa/penalidade).
const TABS = [
  { id: 'daily',   label: 'Diárias', art: 'missao-diaria' },
  { id: 'monthly', label: 'Mensais', art: 'missao-mensal' },
];

// Ícone por TIPO de missão (constants/missions.js campo `type`) — arte do
// Davi, sessões 066/068. `streak`/`streak_month` (sequência) e `correct_*`
// (acertos) reaproveitam o mesmo alvo verde de `accuracy` — pedido explícito
// dele (sessão 068), substitui o halter que existia só pra `correct_*`.
const TYPE_ICON = {
  play: 'missao-tipo-partidas',
  accuracy: 'missao-tipo-precisao',
  streak: 'missao-tipo-precisao',
  streak_month: 'missao-tipo-precisao',
  correct_single: 'missao-tipo-precisao',
  correct_day: 'missao-tipo-precisao',
  correct_month: 'missao-tipo-precisao',
  score: 'missao-tipo-pontuacao',
};

// Emoji do pool fica como reserva só pra um `type` novo que ainda não tenha
// entrada em TYPE_ICON — hoje todos os 7 tipos já têm arte.
// Exportado — reaproveitado pela página de Missões do resumo pós-partida
// (Fase 7, sessão 072) pra não duplicar o mapeamento tipo→ícone.
export function MissionIcon({ type, emoji, size = 24 }) {
  const art = TYPE_ICON[type];
  return art
    ? <GameIcon name={art} size={size} className="shrink-0" />
    : <span className="text-2xl mt-0.5 shrink-0">{emoji}</span>;
}

// ── BAÚ DA MISSÃO [Fase 7.1 bloco 2, sessão 087] ─────────────────────────────
// No fim da barra de progresso de cada missão: o baú do tier que combina com
// a recompensa DAQUELA missão (não uma regra fixa pro dia). Fechado enquanto
// ela não completa, ABERTO quando completa — o baú abrindo é o feedback de
// "terminei". Exportado porque a página de missões do resumo pós-partida
// mostra a mesma coisa.
export function MissionChest({ coins, completa, size = 26, className = '' }) {
  const tier = chestForCoins(coins || 0);
  return (
    <GameIcon
      name={completa ? `${tier}-aberto` : tier}
      size={size}
      className={`shrink-0 ${className}`}
      alt={completa ? 'Baú aberto — missão concluída' : 'Baú fechado — missão em andamento'}
    />
  );
}

// ── BARRA DE PROGRESSO DA MISSÃO [sessão 088] ────────────────────────────────
// Estilo da referência que o Davi mandou (Duolingo): barra grossa com o
// número DENTRO, e o baú encavalado na ponta direita — a barra passa por
// baixo dele, em vez de terminar antes. É isso que dá a sensação de que o
// baú está "na linha de chegada".
export function MissionProgress({ mission, pct, size = 30 }) {
  // Preenchimento SEMPRE na cor da moeda (a barra "enche de moeda" até o
  // baú), como na referência. O número fica escuro quando o preenchimento
  // já passou do meio e claro quando ainda está sobre o trilho cinza — é o
  // que mantém ele legível nos dois casos.
  const sobreCheio = pct >= 50;
  return (
    <div className="flex items-center">
      <div className="relative flex-1">
        <Progress value={pct} colorClass="bg-coin" className="h-5 bg-surface-2" />
        <span
          className={`absolute inset-0 flex items-center justify-center text-[11px] font-black tabular-nums ${
            sobreCheio ? 'text-graphite' : 'text-fg-muted'
          }`}
        >
          {progressCompact(mission)}
        </span>
      </div>
      {/* -ml puxa o baú pra cima do fim da barra */}
      <MissionChest coins={mission.reward} completa={mission.completed} size={size} className="-ml-3 relative z-10" />
    </div>
  );
}

function resetLabel(tab) {
  const now = new Date();
  if (tab === 'daily') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const ms = tomorrow - now;
    const h  = Math.floor(ms / 3_600_000);
    const m  = Math.floor((ms % 3_600_000) / 60_000);
    return `Renova em ${h}h ${m}m`;
  }
  return 'Novos desafios no 1º dia do mês';
}

// [sessão 088] Número curto pra caber DENTRO da barra, no estilo do
// Duolingo que o Davi mandou de referência ("10 / 15"). A unidade já está
// escrita na descrição da missão logo acima, então não precisa repetir.
export function progressCompact(mission) {
  const { progress: p, target: t } = mission;
  return mission.type === 'accuracy' ? `${p} / ${t}%` : `${p} / ${t}`;
}

export function progressLabel(mission) {
  const { progress: p, target: t } = mission;
  switch (mission.type) {
    case 'play':          return `${p}/${t} partidas`;
    case 'streak':        return `${p}/${t} acertos seguidos`;
    case 'streak_month':  return `${p}/${t} dias de ofensiva`;
    case 'accuracy':      return `${p}/${t}% de precisão`;
    case 'score':         return `${p}/${t} pontos`;
    default:              return `${p}/${t} acertos`;
  }
}

function daysUntil(dateStr) {
  const ms = new Date(dateStr + 'T23:59:59') - new Date();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export default function MissionsPage({ onBack, embedded = false }) {
  const { data, update } = useApp();
  const [activeTab, setActiveTab] = useState('daily');

  const active = getActiveMissions(data.missionsData);
  const dailyMissions = active.daily.missions;
  const acceptedChallenges = active.monthly.accepted.filter((c) => !c.resolved);
  const acceptedIds = new Set(acceptedChallenges.map((c) => c.id));
  const poolChallenges = active.monthly.pool.filter((c) => !acceptedIds.has(c.id));

  const claimableCoins = dailyMissions
    .filter((m) => m.completed && !m.rewardClaimed)
    .reduce((s, m) => s + (m.reward || 0), 0);

  const handleClaim = (mission) => {
    if (!mission.completed || mission.rewardClaimed) return;
    update((prev) => ({
      ...prev,
      missionsData: claimMission(prev.missionsData, mission.id),
      coins: (prev.coins || 0) + (mission.reward || 0),
    }));
  };

  // [D043] Congelar missão diária: SÓ consome 1 missionFreeze do estoque —
  // o fallback de comprar com moeda direto aqui foi removido a pedido do
  // Davi. O item precisa estar na Mochila antes (comprado na Loja ou
  // achado jogando, ver PLANO_ACAO.md Fases 3/5/6); o botão nem aparece
  // sem estoque (ver JSX abaixo).
  const handleFreezeDaily = (mission) => {
    update((prev) => {
      const stock = prev.powerups?.missionFreeze || 0;
      if (stock === 0) return prev;
      return {
        ...prev,
        missionsData: freezeMission(prev.missionsData, mission.id),
        powerups: { ...(prev.powerups || {}), missionFreeze: stock - 1 },
      };
    });
  };

  // [v6.0 · Bloco 5] Aceitar um desafio mensal — sem custo, mas passa a
  // arriscar a penalidade se não cumprir até o prazo.
  const handleAccept = (challenge) => {
    update((prev) => ({
      ...prev,
      missionsData: acceptChallenge(prev.missionsData, challenge.id),
    }));
  };

  // [D043] Congelar desafio mensal aceito (+10 dias de prazo): mesma regra
  // nova da diária — só consome estoque, sem fallback de moeda.
  const handleFreezeChallenge = (challenge) => {
    update((prev) => {
      const stock = prev.powerups?.missionFreeze || 0;
      if (stock === 0) return prev;
      return {
        ...prev,
        missionsData: freezeChallenge(prev.missionsData, challenge.id),
        powerups: { ...(prev.powerups || {}), missionFreeze: stock - 1 },
      };
    });
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {!embedded && (
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-fg">Missões</h2>
            <p className="text-xs font-semibold text-fg-muted">Complete para ganhar moedas</p>
          </div>
          <div className="flex items-center gap-1.5 bg-coin/15 border border-coin/30 rounded-2xl px-3 py-1.5">
            <GameIcon name="moedas" size={16} />
            <span className="text-sm font-black text-coin">{data.coins || 0}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-accent text-white shadow-md'
                : 'bg-surface-2 text-fg-muted hover:bg-border'
            }`}
          >
            <GameIcon name={t.art} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-fg-muted">
          <Clock size={11} />
          {resetLabel(activeTab)}
        </div>
        {activeTab === 'daily' && claimableCoins > 0 && (
          <span className="text-xs font-black text-success bg-success/15 rounded-full px-2.5 py-0.5">
            +{claimableCoins} <GameIcon name="moedas" size={14} className="inline-block align-text-bottom" /> para resgatar
          </span>
        )}
      </div>

      {/* ── DIÁRIAS — sem risco, como sempre foram ─────────────────────────── */}
      {activeTab === 'daily' && (
        <div className="flex flex-col gap-3">
          {dailyMissions.map((mission) => {
            const pct      = Math.min((mission.progress / mission.target) * 100, 100);
            const canClaim = mission.completed && !mission.rewardClaimed;
            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border-2 transition-all ${
                  mission.rewardClaimed
                    ? 'bg-surface-2 border-border opacity-60'
                    : canClaim
                    ? 'bg-success/10 border-success/30 shadow-sm'
                    : 'bg-surface border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MissionIcon type={mission.type} emoji={mission.emoji} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-black text-fg leading-tight">{mission.title}</p>
                      <span className="text-xs font-black text-coin shrink-0"><GameIcon name="moedas" size={13} className="inline-block align-text-bottom" /> {mission.reward}</span>
                    </div>
                    <p className="text-xs text-fg-muted font-semibold mb-2">{mission.desc}</p>
                    <MissionProgress mission={mission} pct={pct} />
                  </div>
                </div>

                {canClaim && (
                  <button
                    onClick={() => handleClaim(mission)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-success text-white text-sm font-black hover:bg-success/90 active:scale-[0.98] transition-all"
                  >
                    🎁 Resgatar +{mission.reward} moedas
                  </button>
                )}
                {mission.rewardClaimed && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-success">
                    <CheckCircle size={12} />
                    Recompensa resgatada
                  </div>
                )}
                {/* [D043] Só aparece com o item já na Mochila (estoque > 0) —
                    sem fallback de compra com moeda aqui. */}
                {!mission.completed && !mission.frozen && (data.powerups?.missionFreeze || 0) > 0 && (
                  <button
                    onClick={() => handleFreezeDaily(mission)}
                    className="mt-2 w-full py-2 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 text-xs font-black hover:bg-cyan-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                  >
                    <GameIcon name="pu-congelar" size={14} />
                    Congelar (estoque ×{data.powerups.missionFreeze})
                  </button>
                )}
                {mission.frozen && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-cyan-600">
                    <GameIcon name="pu-congelar" size={14} />
                    Congelada — sobrevive até amanhã
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── MENSAIS — precisa aceitar; recompensa se cumprir, penalidade se não ── */}
      {activeTab === 'monthly' && (
        <div className="flex flex-col gap-5">
          {acceptedChallenges.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-black text-fg-muted uppercase tracking-wide px-1">Aceitos</p>
              {acceptedChallenges.map((c) => {
                const pct = Math.min((c.progress / c.target) * 100, 100);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border-2 bg-surface border-border"
                  >
                    <div className="flex items-start gap-3">
                      <MissionIcon type={c.type} emoji={c.emoji} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-sm font-black text-fg leading-tight">{c.title}</p>
                          <span className="text-xs font-black text-coin shrink-0"><GameIcon name="moedas" size={13} className="inline-block align-text-bottom" /> +{c.reward}</span>
                        </div>
                        <p className="text-xs text-fg-muted font-semibold mb-2">{c.desc}</p>
                        <MissionProgress mission={c} pct={pct} />
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-fg-muted">{progressLabel(c)}</p>
                          <p className="text-xs font-bold text-fg-muted">{daysUntil(c.deadline)}d restantes</p>
                        </div>
                      </div>
                    </div>
                    {!c.completed && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-danger">
                        <AlertTriangle size={12} />
                        Não cumprir custa <GameIcon name="moedas" size={13} className="inline-block align-text-bottom" /> {c.penalty} do seu saldo
                      </p>
                    )}
                    {/* [D043] Mesma regra da diária — só aparece com estoque */}
                    {!c.completed && !c.frozen && (data.powerups?.missionFreeze || 0) > 0 && (
                      <button
                        onClick={() => handleFreezeChallenge(c)}
                        className="mt-2 w-full py-2 rounded-xl border border-cyan-200 bg-cyan-50 text-cyan-700 text-xs font-black hover:bg-cyan-100 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                      >
                        <GameIcon name="pu-congelar" size={14} />
                        Congelar +10 dias (estoque ×{data.powerups.missionFreeze})
                      </button>
                    )}
                    {c.frozen && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-cyan-600">
                        <GameIcon name="pu-congelar" size={14} />
                        Congelado — prazo estendido
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {poolChallenges.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-black text-fg-muted uppercase tracking-wide px-1">
                Disponíveis pra aceitar
              </p>
              {poolChallenges.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl border-2 border-dashed border-border bg-surface-2"
                >
                  <div className="flex items-start gap-3">
                    <MissionIcon type={c.type} emoji={c.emoji} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-fg leading-tight">{c.title}</p>
                      <p className="text-xs text-fg-muted font-semibold mb-1">{c.desc}</p>
                      <p className="text-xs font-bold">
                        <span className="text-coin">Ganha <GameIcon name="moedas" size={13} className="inline-block align-text-bottom" /> {c.reward}</span>
                        {' · '}
                        <span className="text-danger">perde <GameIcon name="moedas" size={13} className="inline-block align-text-bottom" /> {c.penalty} se não cumprir</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAccept(c)}
                    className="mt-3 w-full py-2.5 rounded-xl bg-accent text-white text-sm font-black hover:bg-accent/90 active:scale-[0.98] transition-all"
                  >
                    Aceitar Desafio
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {acceptedChallenges.length === 0 && poolChallenges.length === 0 && (
            <div className="text-center py-12 text-fg-muted">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm font-semibold">Nenhum desafio disponível</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'daily' && dailyMissions.length === 0 && (
        <div className="text-center py-12 text-fg-muted">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm font-semibold">Nenhuma missão ativa</p>
        </div>
      )}
    </motion.div>
  );
}
