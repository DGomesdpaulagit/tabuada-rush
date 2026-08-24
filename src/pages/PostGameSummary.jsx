import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, X, Zap, Flame, Lock, Check, Share2 } from 'lucide-react';
import { LEVELS, ACHIEVEMENTS, STREAK_GOALS } from '../constants';
import { SHOP_ITEM_MAP, POTION_MAP, RARITIES } from '../constants/shop';
import { CHESTS } from '../constants/loot';
import { getAccuracy, getAchievementProgress, todayStr } from '../utils';
import { getActiveMissions } from '../utils/missions';
import { getLeagueStandings } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageTransition } from '../components/ui';
import { MissionIcon, progressLabel } from './MissionsPage';
import { shareCard } from '../lib/shareCard';
import GameIcon from '../components/GameIcon';

// ── FLUXO DE RESUMO PÓS-PARTIDA [Fase 7 do PLANO_ACAO.md, sessão 072] ────────
// Substitui a antiga `ResultsPage.jsx` (removida) por uma sequência de
// páginas ao estilo Duolingo (referência do Davi), uma de cada vez, avançando
// no botão "Continuar". Ordem: Pontuação → XP → Missões → [Ofensiva, só na
// 1ª partida do dia] → [Meta batida, ocasional] → [Faixa mudou, ocasional] →
// Conquistas → 1 página por recompensa achada (Fase 6).

const DOW_LETTER = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const DOW_LABEL = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

// Gênero de cada item de loot pra frase "Você ganhou um(a) ..." — lista fixa
// e pequena, mais seguro que tentar inferir automaticamente.
//
// ⚠️ PADRÃO DE ADIÇÃO DE RECURSO (pedido explícito do Davi, sessão 073,
// D051): TODO item novo em `SHOP_ITEMS`/`POTIONS` (constants/shop.js) ou
// `CHESTS` (constants/loot.js) precisa de uma entrada aqui também. Sem
// entrada, cai no masculino (`|| 'm'` em `RewardPage`) — pode sair errado
// ("um Vida Extra" em vez de "uma Vida Extra").
const LOOT_GENDER = {
  powerup_streak_insurance: 'm',
  powerup_mission_freeze: 'm',
  powerup_life: 'f',
  powerup_time: 'm',
  powerup_shield: 'm',
  powerup_headstart: 'f',
  'pocao-xp-1': 'f',
  'pocao-xp-2': 'f',
  'pocao-xp-3': 'f',
  'bau-madeira': 'm',
  'bau-ferro': 'm',
  'bau-ouro': 'm',
  'bau-mistico': 'm',
};

// "Classificação" pra poções/baús — power-ups já têm RARITIES próprio.
const POTION_RARITY = { 1.5: 'Comum', 2: 'Raro', 3: 'Épico' };
const CHEST_RARITY = { 'bau-madeira': 'Comum', 'bau-ferro': 'Raro', 'bau-ouro': 'Épico', 'bau-mistico': 'Lendário' };

// [Fase 6, sessão 074, D052] Baú como EMBALAGEM de recurso — o tier do
// baú que aparece na página de recompensa agora bate com a raridade do
// recurso, não é mais genérico. Davi deu 1 exemplo (Poção ×3, a mais rara
// das 3, tem que vir num Baú Místico) — dessa âncora derivei o resto:
// Comum→Madeira, Raro→Ferro, Épico→Místico. Baú de OURO fica de fora de
// propósito: só existem 3 níveis de raridade pros recursos hoje (contra 4
// tiers de baú), e Místico já é a âncora confirmada pro topo — Ouro
// continua exclusivo do baú-COM-MOEDA da Fase 6. Mapeamento sinalizado,
// não formalmente confirmado por ele (só o exemplo do topo foi dado).
const RARITY_CHEST = { common: 'bau-madeira', rare: 'bau-ferro', epic: 'bau-mistico' };
const POTION_CHEST = { 1.5: 'bau-madeira', 2: 'bau-ferro', 3: 'bau-mistico' };

function Confetti() {
  const dots = [
    { x: -70, y: -10, color: 'bg-coin', shape: 'rounded-full', rotate: 0 },
    { x: 68, y: -18, color: 'bg-coin', shape: 'rounded-full', rotate: 0 },
    { x: -50, y: 30, color: 'bg-rose-500', shape: 'rounded-full', rotate: 20 },
    { x: 55, y: 40, color: 'bg-blue-500', shape: 'rotate-45', rotate: 0 },
    { x: -30, y: -35, color: 'bg-emerald-500', shape: 'rounded-full', rotate: -20 },
  ];
  return (
    <div className="relative w-full h-0">
      {dots.map((d, i) => (
        <span
          key={i}
          className={`absolute w-2.5 h-2.5 ${d.color} ${d.shape} opacity-90`}
          style={{ left: `calc(50% + ${d.x}px)`, top: d.y, transform: `rotate(${d.rotate}deg)` }}
        />
      ))}
    </div>
  );
}

// ── CASCA COMUM DE TODA PÁGINA ────────────────────────────────────────────────
function SummaryShell({ icon, iconBg, title, subtitle, children, footer }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={pageTransition}
      className="flex flex-col gap-5 bg-background rounded-3xl -mx-4 px-4 py-6 min-h-[70vh] sm:mx-0 sm:rounded-3xl"
    >
      <div className="flex-1 flex flex-col items-center text-center gap-3">
        <Confetti />
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
          {icon}
        </div>
        <h1 className="text-3xl font-black text-coin leading-tight px-4">{title}</h1>
        {subtitle && <p className="text-fg-muted font-semibold px-6">{subtitle}</p>}
        <div className="w-full flex flex-col gap-4 mt-2">{children}</div>
      </div>
      <div className="flex flex-col gap-2 mt-4">{footer}</div>
    </motion.div>
  );
}

function StatBox({ label, labelClassName = 'text-fg-muted', children }) {
  return (
    <div className="border-2 border-border rounded-2xl p-4 overflow-hidden">
      <p className={`text-xs font-black uppercase tracking-wide text-center mb-3 ${labelClassName}`}>{label}</p>
      {children}
    </div>
  );
}

function ContinueButton({ onClick, label = 'Continuar' }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-2xl bg-coin text-graphite font-black text-base shadow-lg active:scale-[0.98] transition-transform"
    >
      {label}
    </button>
  );
}

// ── PÁGINA 1 — Pontuação + Acertos/Erros ──────────────────────────────────────
function ScorePage({ result, footer }) {
  return (
    <SummaryShell
      icon={<Trophy size={44} className="text-graphite" />}
      iconBg="bg-coin"
      title="Tarefa concluída!"
      subtitle="Você mandou muito bem!"
      footer={footer}
    >
      <StatBox label="Pontuação total">
        <div className="flex items-center justify-center gap-2">
          <Trophy size={28} className="text-coin" />
          <span className="text-4xl font-black text-coin">{result.score}</span>
        </div>
      </StatBox>
      <StatBox label="Desempenho">
        <div className="flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center">
              <GameIcon name="resumo-acertos" size={26} />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-accent leading-none">{result.correct}</p>
              <p className="text-[10px] font-black text-fg-muted uppercase">Acertos</p>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-full bg-rose-500/15 flex items-center justify-center">
              <X size={22} className="text-rose-500" />
            </div>
            <div className="text-left">
              <p className="text-2xl font-black text-rose-500 leading-none">{result.wrong}</p>
              <p className="text-[10px] font-black text-fg-muted uppercase">Erros</p>
            </div>
          </div>
        </div>
      </StatBox>
    </SummaryShell>
  );
}

// ── PÁGINA 2 — XP total + % de acerto ─────────────────────────────────────────
function XpPage({ result, footer }) {
  const accuracy = getAccuracy(result.correct, result.correct + result.wrong);
  const accLabel = accuracy >= 90 ? 'Acertou muito!' : accuracy >= 70 ? 'Bom trabalho!' : 'Continue praticando!';
  return (
    <SummaryShell
      icon={<Zap size={44} className="text-graphite" fill="currentColor" />}
      iconBg="bg-coin"
      title="Excelente!"
      subtitle="Você ganhou XP!"
      footer={footer}
    >
      <StatBox label="Total de XP" labelClassName="text-graphite bg-coin -m-4 mb-3 p-3 rounded-t-2xl">
        <div className="flex items-center justify-center gap-2">
          <Zap size={26} className="text-coin" fill="currentColor" />
          <span className="text-3xl font-black text-coin">{result.gameXp || 0}</span>
          <span className="text-xs font-black text-fg-muted uppercase self-end mb-1.5">XP ganho</span>
        </div>
      </StatBox>
      <StatBox label="Porcentagem de acerto" labelClassName="text-graphite bg-accent -m-4 mb-3 p-3 rounded-t-2xl">
        <div className="flex items-center justify-center gap-2">
          <GameIcon name="resumo-acertos" size={28} />
          <span className="text-3xl font-black text-accent">{accuracy}%</span>
        </div>
        <p className="text-xs font-black text-fg-muted text-center mt-1">{accLabel}</p>
      </StatBox>
    </SummaryShell>
  );
}

// ── PÁGINA 3 — Progresso das missões ──────────────────────────────────────────
function MissionsProgressPage({ footer }) {
  const { data } = useApp();
  const [tab, setTab] = useState('daily');
  const active = useMemo(() => getActiveMissions(data.missionsData), [data.missionsData]);
  const monthlyAccepted = active.monthly.accepted.filter((c) => !c.resolved);
  const list = tab === 'daily' ? active.daily.missions : monthlyAccepted;

  // [D051] "Resumo do dia" — soma as sessões de HOJE (`localDate`, sessão
  // 073, evita o bug de fuso do `date` em ISO/UTC — D040). Sessions
  // salvas ANTES desta sessão não têm `localDate`/`xp` (undefined vira 0
  // na soma) — o resumo só fica completo pra partidas jogadas a partir de
  // agora, não é possível reconstruir XP de sessões antigas.
  const todaySessions = (data.sessions || []).filter((s) => s.localDate === todayStr());
  const todayCorrect = todaySessions.reduce((sum, s) => sum + (s.correct || 0), 0);
  const todayXp = todaySessions.reduce((sum, s) => sum + (s.xp || 0), 0);

  return (
    <SummaryShell
      icon={<Target size={44} className="text-white" />}
      iconBg="bg-accent"
      title="Progresso das Missões!"
      subtitle="Continue assim para conquistar tudo!"
      footer={footer}
    >
      <div className="flex gap-2 p-1 rounded-2xl bg-surface-2">
        {[{ id: 'daily', label: 'Diárias' }, { id: 'monthly', label: 'Mensais' }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-colors ${
              tab === t.id ? 'bg-coin text-graphite' : 'text-fg-muted'
            }`}
          >
            {t.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2 text-left">
        {list.length === 0 && (
          <p className="text-sm text-fg-muted font-semibold text-center py-4">
            {tab === 'daily' ? 'Nenhuma missão hoje.' : 'Nenhum desafio mensal aceito ainda.'}
          </p>
        )}
        {list.map((m) => {
          const pct = Math.min(100, Math.round((m.progress / m.target) * 100));
          return (
            <div key={m.id} className="p-3 rounded-2xl border-2 border-border flex items-start gap-3">
              <MissionIcon type={m.type} emoji={m.emoji} size={22} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-fg leading-tight">{m.title}</p>
                <div className="h-1.5 rounded-full bg-surface-2 mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${m.completed ? 'bg-accent' : 'bg-coin'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] font-bold text-fg-muted mt-1">{progressLabel(m)}</p>
              </div>
            </div>
          );
        })}
      </div>
      <StatBox label="Resumo do dia">
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-2">
            <GameIcon name="resumo-acertos" size={32} />
            <div className="text-left">
              <p className="text-xl font-black text-accent leading-none">{todayCorrect}</p>
              <p className="text-[10px] font-black text-fg-muted uppercase">Acertos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={32} className="text-coin" fill="currentColor" />
            <div className="text-left">
              <p className="text-xl font-black text-coin leading-none">{todayXp}</p>
              <p className="text-[10px] font-black text-fg-muted uppercase">XP ganho</p>
            </div>
          </div>
        </div>
      </StatBox>
    </SummaryShell>
  );
}

// ── PÁGINA 4 — Ofensiva ativada (1ª partida do dia) ───────────────────────────
function StreakPage({ footer }) {
  const { data } = useApp();
  const days = useMemo(() => {
    const arr = [];
    for (let i = -1; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      arr.push({
        key: i,
        letter: DOW_LETTER[dow],
        label: i === -1 ? 'ONTEM' : i === 0 ? 'HOJE' : i === 1 ? 'AMANHÃ' : DOW_LABEL[dow],
        done: i <= 0,
        isToday: i === 0,
        count: i >= 1 ? i : null,
      });
    }
    return arr;
  }, []);

  return (
    <SummaryShell
      icon={<Flame size={44} className="text-white" fill="currentColor" />}
      iconBg="bg-orange-500"
      title="Ofensiva ativada!"
      subtitle="Continue assim e fortaleça sua sequência!"
      footer={footer}
    >
      <StatBox label="Dias de ofensiva">
        <p className="text-5xl font-black text-coin text-center">{data.currentStreak || 0}</p>
        <p className="text-xs font-black text-coin text-center uppercase mt-1">dias de ofensiva</p>
        <div className="grid grid-cols-5 gap-1.5 mt-4">
          {days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1">
              <span className={`text-[10px] font-black ${d.isToday ? 'text-coin' : 'text-fg-muted'}`}>{d.letter}</span>
              <span className={`text-[9px] font-bold ${d.isToday ? 'text-coin' : 'text-fg-muted'}`}>{d.label}</span>
              <div
                className={`w-full aspect-square rounded-xl border-2 flex items-center justify-center ${
                  d.isToday ? 'border-coin bg-coin/10' : 'border-border'
                }`}
              >
                {d.done ? (
                  <Check size={16} className="text-coin" />
                ) : (
                  <span className="text-xs font-black text-fg-muted">{d.count}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </StatBox>
      <div className="border-2 border-border rounded-2xl p-3 flex items-start gap-3 text-left">
        <div className="w-8 h-8 rounded-full border-2 border-coin flex items-center justify-center shrink-0">
          <Flame size={14} className="text-coin" />
        </div>
        <div>
          <p className="text-sm font-black text-fg">Como funciona?</p>
          <p className="text-xs text-fg-muted font-semibold">
            Pratique todos os dias pra aumentar sua ofensiva. Se pular um dia, ela zera!
          </p>
        </div>
      </div>
    </SummaryShell>
  );
}

// ── OCASIONAL 1 — Meta de ofensiva batida ─────────────────────────────────────
function StreakGoalPage({ result, onSelectStreakGoal, footer }) {
  const { data } = useApp();
  const suggestions = STREAK_GOALS.filter((g) => g > (data.currentStreak || 0)).slice(0, 3);
  return (
    <SummaryShell
      icon={<Flame size={44} className="text-white" fill="currentColor" />}
      iconBg="bg-coin"
      title="Meta de ofensiva concluída!"
      subtitle="Você superou sua meta. Muito foco e consistência!"
      footer={footer}
    >
      <StatBox label="Sua meta batida">
        <p className="text-4xl font-black text-coin text-center">{result.hitGoal} dias</p>
        <p className="text-xs font-black text-accent text-center mt-1">Meta alcançada! 🔥</p>
      </StatBox>
      {suggestions.length > 0 ? (
        <div>
          <p className="text-xs font-black text-fg-muted uppercase tracking-wide mb-2">
            Que tal aumentar o desafio?
          </p>
          <div className="grid grid-cols-3 gap-2">
            {suggestions.map((g) => (
              <button
                key={g}
                onClick={() => onSelectStreakGoal(g)}
                className="py-3 rounded-2xl border-2 border-border hover:border-coin transition-colors"
              >
                <span className="block text-lg font-black text-fg">{g}</span>
                <span className="block text-[10px] font-bold text-fg-muted">dias</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-fg-muted font-semibold text-center">
          Você já bateu a maior meta disponível — continue assim!
        </p>
      )}
    </SummaryShell>
  );
}

// ── OCASIONAL 2 — Faixa de tabuada mudou ──────────────────────────────────────
function TierPage({ result, footer }) {
  const prevLevel = LEVELS[result.prevLevelIdx];
  const newLevel = LEVELS[result.newLevelIdx];
  const windowStart = Math.max(0, result.newLevelIdx - 2);
  const windowEnd = Math.min(LEVELS.length, result.newLevelIdx + 3);
  const track = LEVELS.slice(windowStart, windowEnd);

  return (
    <SummaryShell
      icon={<span className="text-4xl">{newLevel.badge}</span>}
      iconBg="bg-coin"
      title="Nova faixa alcançada!"
      subtitle="Você avançou na tabuada!"
      footer={footer}
    >
      <StatBox label="Sua evolução">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center opacity-60">
            <span className="block text-3xl">{prevLevel.badge}</span>
            <p className="text-xs font-black text-fg-muted mt-1">{prevLevel.name}</p>
            <p className="text-[10px] font-bold text-fg-muted">Até agora</p>
          </div>
          <span className="text-coin font-black text-xl">»</span>
          <div className="text-center">
            <span className="block text-3xl">{newLevel.badge}</span>
            <p className="text-xs font-black text-coin mt-1">{newLevel.name}</p>
            <p className="text-[10px] font-bold text-coin">Nova faixa</p>
          </div>
        </div>
      </StatBox>
      <StatBox label="O que mudou?">
        <p className="text-sm font-bold text-fg text-center">
          Agora você desbloqueou exercícios da tabuada do {newLevel.rangeMin}.
        </p>
      </StatBox>
      <div className="flex items-center justify-center gap-2">
        {track.map((tier, i) => {
          const globalIdx = windowStart + i;
          const isCurrent = globalIdx === result.newLevelIdx;
          const isDone = globalIdx < result.newLevelIdx;
          const isLocked = globalIdx > result.newLevelIdx;
          return (
            <div
              key={tier.name}
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${
                isCurrent
                  ? 'bg-coin text-graphite font-black'
                  : isDone
                  ? 'bg-accent/20 text-accent'
                  : 'bg-surface-2 text-fg-muted'
              }`}
            >
              {isLocked ? <Lock size={14} /> : isDone ? <Check size={16} /> : tier.badge}
            </div>
          );
        })}
      </div>
    </SummaryShell>
  );
}

// ── PÁGINA 5 — Conquistas ─────────────────────────────────────────────────────
function AchievementsPage({ footer }) {
  const { data } = useApp();
  const list = useMemo(() => {
    const unlockedIds = data.achievements || [];
    const withProgress = ACHIEVEMENTS
      .map((a) => ({ a, unlocked: unlockedIds.includes(a.id), progress: getAchievementProgress(a, data) }))
      .filter((x) => x.progress);
    const notYet = withProgress
      .filter((x) => !x.unlocked)
      .sort((x, y) => y.progress.current / y.progress.target - x.progress.current / x.progress.target);
    return notYet.slice(0, 5);
  }, [data]);

  return (
    <SummaryShell
      icon={<Trophy size={44} className="text-graphite" />}
      iconBg="bg-coin"
      title="Suas conquistas"
      subtitle="Você está indo muito bem!"
      footer={footer}
    >
      <div className="flex flex-col gap-2 text-left">
        {list.length === 0 && (
          <p className="text-sm text-fg-muted font-semibold text-center py-4">Sem conquistas em progresso pra mostrar agora.</p>
        )}
        {list.map(({ a, progress }) => {
          const pct = Math.min(100, Math.round((progress.current / progress.target) * 100));
          return (
            <div key={a.id} className="p-3 rounded-2xl border-2 border-border flex items-center gap-3">
              <span className="text-2xl shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-fg leading-tight">{a.title}</p>
                <p className="text-xs text-fg-muted font-semibold">{a.desc}</p>
                <div className="h-1.5 rounded-full bg-surface-2 mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full bg-coin" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="text-xs font-black text-fg-muted shrink-0">{progress.current}/{progress.target}</span>
            </div>
          );
        })}
      </div>
    </SummaryShell>
  );
}

// ── PÁGINA 6 — Recompensas achadas (1 página por item) ────────────────────────
function RewardPage({ item, footer }) {
  const gender = LOOT_GENDER[item.id] || 'm';
  const article = gender === 'f' ? 'uma' : 'um';

  return (
    <SummaryShell
      icon={<GameIcon name={item.art} size={72} />}
      iconBg="bg-coin/20"
      title={`Você ganhou ${article} ${item.name}!`}
      subtitle={item.desc}
      footer={footer}
    >
      <StatBox label="Classificação">
        <p className="text-lg font-black text-coin text-center">{item.rarityLabel}</p>
      </StatBox>
      {/* [Fase 6, sessão 074, D052] Baú-embalagem — o TIER bate com a
          raridade do recurso (RARITY_CHEST/POTION_CHEST), sem legenda —
          o ícone certo já comunica sozinho de onde veio. */}
      {item.chestArt && (
        <div className="flex items-center justify-center">
          <GameIcon name={item.chestArt} size={48} />
        </div>
      )}
    </SummaryShell>
  );
}

// ── PÁGINA 6 (sem nada achado) — aparece mesmo sem loot [D051] ────────────────
function RewardEmptyPage({ footer }) {
  return (
    <SummaryShell
      icon={<GameIcon name="bau-recurso" size={56} />}
      iconBg="bg-surface-2"
      title="Nada desta vez"
      subtitle="Baús e power-ups são sorteados a cada partida — continue jogando pra achar algo!"
      footer={footer}
    />
  );
}

// ── AÇÕES FINAIS (última página da sequência) ─────────────────────────────────
function FinalActions({ onReplay, onHome, result }) {
  const { data } = useApp();
  const accuracy = getAccuracy(result.correct, result.correct + result.wrong);
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        onClick={() => {
          const { league } = getLeagueStandings(data);
          shareCard({
            mode: result.mode,
            score: result.score,
            correct: result.correct,
            wrong: result.wrong,
            accuracy,
            bestStreak: result.bestStreak,
            qiChar: league.emoji,
            qiName: `Liga ${league.name}`,
          });
        }}
        className="w-full"
      >
        <Share2 size={16} />
        Compartilhar resultado
      </Button>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={onHome} className="flex-1">Menu</Button>
        <ContinueButton onClick={onReplay} label="Jogar novamente" />
      </div>
    </div>
  );
}

// ── CONTROLADOR PRINCIPAL ──────────────────────────────────────────────────────
export default function PostGameSummary({ result, onReplay, onHome, onSelectStreakGoal }) {
  // [ferramenta de verificação, só em DEV] `?page=N` pula direto pra página N
  // da sequência — clicar em "Continuar" depende da transição do
  // AnimatePresence completar, que trava neste ambiente de preview (mesma
  // causa raiz do `?screen=`, D034). Sem footprint em produção.
  const [idx, setIdx] = useState(() => {
    if (!import.meta.env.DEV) return 0;
    const n = Number(new URLSearchParams(window.location.search).get('page'));
    return Number.isFinite(n) && n > 0 ? n : 0;
  });

  const pages = useMemo(() => {
    // [D051] Pedido explícito do Davi: páginas 1/2/3/5/6 aparecem em TODA
    // partida, mesmo sem conteúdo pra mostrar (XP=0 no Zen; sem recompensa
    // nenhuma) — não são condicionais ao resultado. Só a Ofensiva (4) e as
    // 2 ocasionais são de verdade condicionais.
    const list = [{ type: 'score' }, { type: 'xp' }, { type: 'missions' }];
    if (result.firstMatchToday) list.push({ type: 'streak' });
    if (result.metaHit) list.push({ type: 'streakGoal' });
    if (result.tierChanged) list.push({ type: 'tier' });
    list.push({ type: 'achievements' });

    const loot = result.loot || { chests: [], powerupIds: [], potionIds: [] };
    const hasLoot = loot.chests.length > 0 || loot.powerupIds.length > 0 || loot.potionIds.length > 0;
    if (!hasLoot) list.push({ type: 'reward-empty' });
    loot.chests.forEach((c) => {
      const chest = CHESTS.find((ch) => ch.id === c.id);
      list.push({
        type: 'reward',
        item: {
          id: c.id,
          art: chest?.art,
          name: chest?.name || 'Baú',
          desc: `Continha ${c.coins} moedas!`,
          rarityLabel: CHEST_RARITY[c.id] || 'Especial',
          chestArt: null, // já É o baú, não embala outro
        },
      });
    });
    loot.powerupIds.forEach((id) => {
      const shopItem = SHOP_ITEM_MAP[id];
      if (!shopItem) return;
      list.push({
        type: 'reward',
        item: {
          id,
          art: shopItem.art,
          name: shopItem.name,
          desc: shopItem.desc,
          rarityLabel: RARITIES[shopItem.rarity]?.label || 'Comum',
          chestArt: RARITY_CHEST[shopItem.rarity] || 'bau-madeira',
        },
      });
    });
    loot.potionIds.forEach((id) => {
      const potion = POTION_MAP[id];
      if (!potion) return;
      list.push({
        type: 'reward',
        item: {
          id,
          art: potion.art,
          name: potion.name,
          desc: `Multiplica seu XP por ${String(potion.multiplier).replace('.', ',')}× por até ${potion.durationMin} minutos.`,
          rarityLabel: POTION_RARITY[potion.multiplier] || 'Especial',
          chestArt: POTION_CHEST[potion.multiplier] || 'bau-madeira',
        },
      });
    });
    return list;
  }, [result]);

  const page = pages[Math.min(idx, pages.length - 1)];
  const isLast = idx >= pages.length - 1;
  const goNext = () => setIdx((i) => Math.min(i + 1, pages.length - 1));
  // Última página de QUALQUER tipo (não só recompensa) termina no mesmo lugar
  // — compartilhar/menu/jogar de novo — nunca só "Continuar" levando direto
  // pro menu sem chance de replay/compartilhar.
  const footer = isLast
    ? <FinalActions onReplay={onReplay} onHome={onHome} result={result} />
    : <ContinueButton onClick={goNext} />;

  return (
    <AnimatePresence mode="wait">
      {page.type === 'score' && <ScorePage key={idx} result={result} footer={footer} />}
      {page.type === 'xp' && <XpPage key={idx} result={result} footer={footer} />}
      {page.type === 'missions' && <MissionsProgressPage key={idx} footer={footer} />}
      {page.type === 'streak' && <StreakPage key={idx} footer={footer} />}
      {page.type === 'streakGoal' && (
        <StreakGoalPage key={idx} result={result} onSelectStreakGoal={onSelectStreakGoal} footer={footer} />
      )}
      {page.type === 'tier' && <TierPage key={idx} result={result} footer={footer} />}
      {page.type === 'achievements' && <AchievementsPage key={idx} footer={footer} />}
      {page.type === 'reward' && <RewardPage key={idx} item={page.item} footer={footer} />}
      {page.type === 'reward-empty' && <RewardEmptyPage key={idx} footer={footer} />}
    </AnimatePresence>
  );
}
