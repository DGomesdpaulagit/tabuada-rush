import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Lock, Check, Share2 } from 'lucide-react';
import { LEVELS, ACHIEVEMENTS, STREAK_GOALS } from '../constants';
import { SHOP_ITEM_MAP, POTION_MAP } from '../constants/shop';
import { CHESTS } from '../constants/loot';
import { getAccuracy, getAchievementProgress, todayStr } from '../utils';
import { getActiveMissions } from '../utils/missions';
import { emZonaDeRebaixamento } from '../utils/relegation';
import { getLeagueStandings } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { Button, pageTransition, stillInitial } from '../components/ui';
import { MissionIcon, MissionProgress } from './MissionsPage';
import { shareCard } from '../lib/shareCard';
import GameIcon from '../components/GameIcon';
import { REWARD_BG } from '../components/rewardBackgrounds';

// ── FLUXO DE RESUMO PÓS-PARTIDA [Fase 7 do PLANO_ACAO.md, sessão 072] ────────
// Substitui a antiga `ResultsPage.jsx` (removida) por uma sequência de
// páginas ao estilo Duolingo (referência do Davi), uma de cada vez, avançando
// no botão "Continuar". Ordem: Pontuação → XP → Missões → [Ofensiva, só na
// 1ª partida do dia] → [Meta batida, ocasional] → [Faixa mudou, ocasional] →
// Conquistas → 1 página por recompensa achada (Fase 6).

const DOW_LETTER = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

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

// [Fase 7.1, sessão 080] As tabelas de "Classificação" (POTION_RARITY/
// CHEST_RARITY) foram removidas junto com a caixa que as exibia — o Davi
// pediu pra nenhuma página de recompensa mostrar rótulo de raridade.

// [Fase 7, sessão 076, D054] Ícones COMBO recurso+baú — imagem ÚNICA já
// pronta, com o TIPO de baú escolhido pelo Davi por item (não é mais
// Comum/Raro/Épico da Loja — é uma classificação própria dele só pra
// isto): Madeira (Congelar Missão, Vida Extra), Ferro (Largada Turbo,
// Poção ×1,5), Ouro (Seguro de Ofensiva, +60s, Escudo, Poção ×2),
// Místico (Poção ×3, sozinha — o recurso mais raro). Onde existe entrada
// aqui, usa ISSO como ícone principal da página de recompensa em vez de
// recurso+baú separados.
//
// [sessão 082] O `FALLBACK_CHEST` (recurso + baú separados) sumiu: os 9
// recursos têm combo próprio agora. O do Seguro de Ofensiva estava pronto
// desde a sessão 076 dentro da folha `combo-grade-completa-v2.png` — eu
// tinha usado a versão ERRADA dela (baú de madeira, que virou o
// `bau-recurso` "genérico") e deixado a certa, em ouro, de fora.
const REWARD_COMBO = {
  powerup_streak_insurance: 'combo-seguro-ofensiva',
  powerup_mission_freeze: 'combo-congelar',
  powerup_life: 'combo-vida-extra',
  powerup_time: 'combo-tempo',
  powerup_shield: 'combo-escudo',
  powerup_headstart: 'combo-largada',
  'pocao-xp-1': 'combo-pocao-1',
  'pocao-xp-2': 'combo-pocao-2',
  'pocao-xp-3': 'combo-pocao-3',
};

// ── CASCA COMUM DE TODA PÁGINA ────────────────────────────────────────────────
// [Fase 7.1, sessão 080] O `<Confetti />` que ficava aqui (5 bolinhas
// coloridas ao redor do ícone principal) foi REMOVIDO de toda a sequência —
// o Davi reclamou do efeito em várias páginas diferentes e confirmou que é
// pra sumir de TODAS, não só das que ele citou. Sem substituto: a arte dos
// ícones já carrega o destaque visual sozinha.
function SummaryShell({ icon, iconBg, iconWrapClass = 'w-24 h-24 rounded-full', title, subtitle, children, footer, bgImage }) {
  return (
    <motion.div
      initial={stillInitial({ opacity: 0, x: 24 })}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={pageTransition}
      /* [sessão 086] Sem a barra superior (que sumiu no resumo inteiro), a
         página passa a ocupar a tela toda: `min-h` da altura da janela menos
         o respiro do container. O conteúdo fica centralizado no vão e o
         botão encosta no rodapé, em vez de tudo grudado no topo com um
         buraco embaixo. */
      className={`relative flex flex-col gap-5 -mx-4 px-4 py-6 min-h-[calc(100dvh-3rem)] ${
        bgImage ? '' : 'overflow-hidden rounded-3xl bg-background sm:mx-0 sm:rounded-3xl'
      }`}
    >
      {/* [sessão 085] A arte de fundo cobre a TELA INTEIRA, não só o cartão —
          pedido do Davi ("quero que complete a imagem inteira"). Por isso é uma
          camada `fixed`, e não o fundo deste elemento: assim ela vai de ponta a
          ponta da tela, passando por baixo do cabeçalho (que é `sticky z-40` e
          continua visível por cima) e sem sobrar faixa escura embaixo.
          O véu escuro por cima mantém o texto legível — os fundos vão do
          dourado claro (baú de ouro) ao roxo escuro (místico). */}
      {bgImage && (
        <>
          <div
            className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/25 via-black/30 to-black/55 pointer-events-none" />
        </>
      )}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center gap-3">
        <div className={`flex items-center justify-center shrink-0 ${iconWrapClass} ${iconBg}`}>
          {icon}
        </div>
        <h1 className={`text-3xl font-black leading-tight px-4 ${bgImage ? 'text-white' : 'text-coin'}`}>{title}</h1>
        {subtitle && (
          <p className={`font-semibold px-6 ${bgImage ? 'text-white/90' : 'text-fg-muted'}`}>{subtitle}</p>
        )}
        <div className="w-full flex flex-col gap-4 mt-2">{children}</div>
      </div>
      <div className="relative z-10 flex flex-col gap-2 mt-4">{footer}</div>
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
      icon={<GameIcon name="trofeu" size={96} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
      title="Tarefa concluída!"
      subtitle="Você mandou muito bem!"
      footer={footer}
    >
      <StatBox label="Pontuação total">
        <div className="flex items-center justify-center gap-2">
          <GameIcon name="trofeu" size={34} />
          <span className="text-4xl font-black text-coin">{result.score}</span>
        </div>
      </StatBox>
      <StatBox label="Desempenho">
        <div className="flex items-center justify-center gap-6">
          {/* Sem círculo colorido atrás dos ícones — só a arte pura (7.1).
              Desde a sessão 083 o "Erro" também é arte do Davi, não mais o
              X da lucide. */}
          <div className="flex items-center gap-2">
            <GameIcon name="resumo-acertos" size={36} />
            <div className="text-left">
              <p className="text-2xl font-black text-accent leading-none">{result.correct}</p>
              <p className="text-[10px] font-black text-fg-muted uppercase">Acertos</p>
            </div>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="flex items-center gap-2">
            <GameIcon name="resumo-erros" size={36} />
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
    // [Fase 7.1, sessão 080] Raio da lucide dentro de bolha amarela trocado
    // pelo ícone de XP de verdade do jogo (`xp`, mesma arte do Header).
    <SummaryShell
      icon={<GameIcon name="xp" size={96} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
      title="Excelente!"
      subtitle="Você ganhou XP!"
      footer={footer}
    >
      <StatBox label="Total de XP" labelClassName="text-graphite bg-coin -m-4 mb-3 p-3 rounded-t-2xl">
        <div className="flex items-center justify-center gap-2">
          <GameIcon name="xp" size={32} />
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
  const active = useMemo(
    () => getActiveMissions(data.missionsData, { zonaRebaixamento: emZonaDeRebaixamento(data) }),
    [data]
  );
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
                {/* [sessão 088] Mesma barra da aba Missões: número dentro e
                    baú encavalado na ponta. */}
                <div className="mt-2">
                  <MissionProgress mission={m} pct={pct} size={26} />
                </div>
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
            <GameIcon name="xp" size={32} />
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
  // [Fase 7.1, sessão 080] Antes o "concluído" era assumido (`i <= 0`, ou
  // seja: ontem SEMPRE aparecia feito, mesmo em quem jogou pela 1ª vez
  // hoje). Agora vem das sessões de verdade, na data LOCAL — mesma conta
  // do painel de ofensiva do Header (evita o bug de fuso do D040).
  const days = useMemo(() => {
    const played = new Set(
      (data.sessions || []).map((s) => s.localDate).filter(Boolean)
    );
    const arr = [];
    for (let i = -1; i <= 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      arr.push({
        key: i,
        letter: DOW_LETTER[d.getDay()],
        done: i === 0 ? true : played.has(key), // hoje acabou de ser jogado
        isToday: i === 0,
      });
    }
    return arr;
  }, [data.sessions]);

  return (
    <SummaryShell
      icon={<GameIcon name="ofensiva" size={96} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
      title="Ofensiva ativada!"
      subtitle="Continue assim e fortaleça sua sequência!"
      footer={footer}
    >
      <StatBox label="Dias de ofensiva">
        <p className="text-5xl font-black text-coin text-center">{data.currentStreak || 0}</p>
        <p className="text-xs font-black text-coin text-center uppercase mt-1">dias de ofensiva</p>
        {/* [Fase 7.1, sessão 080] Caixas quadradas com o número do dia dentro
            trocadas pelos MESMOS marcadores redondos do painel de ofensiva do
            Header (`dia-feito` laranja com check / `dia-vazio` sem cor) — só a
            letra do dia por cima, sem número, hoje marcado pela cor da letra. */}
        <div className="grid grid-cols-5 gap-1.5 mt-4">
          {days.map((d) => (
            <div key={d.key} className="flex flex-col items-center gap-1.5">
              <span className={`text-[11px] font-black ${d.isToday ? 'text-streak' : 'text-fg-muted'}`}>{d.letter}</span>
              <GameIcon name={d.done ? 'dia-feito' : 'dia-vazio'} size={30} />
            </div>
          ))}
        </div>
      </StatBox>
      {/* Caixa "Como funciona?" removida (7.1) — sobrou só a legenda curta. */}
      <p className="text-xs text-fg-muted font-semibold px-2">
        Pratique todos os dias pra aumentar sua ofensiva. Se pular um dia, ela zera!
      </p>
    </SummaryShell>
  );
}

// ── OCASIONAL 1 — Meta de ofensiva batida ─────────────────────────────────────
function StreakGoalPage({ result, onSelectStreakGoal, footer }) {
  const { data } = useApp();
  const suggestions = STREAK_GOALS.filter((g) => g > (data.currentStreak || 0)).slice(0, 3);
  return (
    <SummaryShell
      icon={<GameIcon name="ofensiva" size={96} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
      title="Meta de ofensiva concluída!"
      subtitle="Você superou sua meta. Muito foco e consistência!"
      footer={footer}
    >
      <StatBox label="Sua meta batida">
        <p className="text-4xl font-black text-coin text-center">{result.hitGoal} dias</p>
        {/* Emoji 🔥 trocado pelo ícone real de ofensiva (7.1). */}
        <p className="text-xs font-black text-accent text-center mt-1 flex items-center justify-center gap-1">
          Meta alcançada! <GameIcon name="ofensiva" size={16} />
        </p>
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
      icon={<GameIcon name={newLevel.badge} size={112} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
      title="Nova faixa alcançada!"
      subtitle="Você avançou na tabuada!"
      footer={footer}
    >
      <StatBox label="Sua evolução">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center opacity-60">
            <GameIcon name={prevLevel.badge} size={44} className="mx-auto" />
            <p className="text-xs font-black text-fg-muted mt-1">{prevLevel.name}</p>
            <p className="text-[10px] font-bold text-fg-muted">Até agora</p>
          </div>
          <span className="text-coin font-black text-xl">»</span>
          <div className="text-center">
            <GameIcon name={newLevel.badge} size={44} className="mx-auto" />
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
              {isLocked ? <Lock size={14} /> : isDone ? <Check size={16} /> : <GameIcon name={tier.badge} size={22} />}
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
      icon={<GameIcon name="trofeu" size={96} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
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
  // [Fase 7, sessão 075, D053] Com ícone combo (recurso+baú numa imagem só),
  // não faz sentido o círculo colorido por trás — a imagem já é o "cartão"
  // inteiro. Sem combo (só os 2 power-ups que ainda não têm arte), mantém o
  // círculo com o ícone do recurso sozinho, igual antes.
  const hasCombo = !!item.comboArt;
  // [Fase 7.1, sessão 080] Baú de MOEDA: baú ABERTO (arte nova, moedas à
  // vista) com o total ganho ACIMA dele — ícone de moeda + "+N", sem caixa
  // nem badge decorativo em volta (o recorte do badge antigo saía ruim).
  const isCoinChest = item.coins != null;

  // [sessão 083] Fundo próprio por recurso (arte do Davi) — sem entrada no
  // mapa, a página fica com o fundo escuro padrão.
  const bgImage = REWARD_BG[item.id];

  const icon = isCoinChest ? (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <GameIcon name="moedas" size={34} />
        {/* [sessão 085] Sempre no amarelo da moeda, mesmo sobre a arte de
            fundo — pedido do Davi. */}
        <span className="text-4xl font-black leading-none text-coin">+{item.coins}</span>
      </div>
      <GameIcon name={item.art} size={168} />
    </div>
  ) : (
    <GameIcon name={hasCombo ? item.comboArt : item.art} size={hasCombo ? 168 : 72} />
  );
  const plainIcon = hasCombo || isCoinChest;

  return (
    <SummaryShell
      icon={icon}
      iconBg={plainIcon ? '' : 'bg-coin/20'}
      iconWrapClass={plainIcon ? 'w-auto h-auto' : 'w-24 h-24 rounded-full'}
      title={`Você ganhou ${article} ${item.name}!`}
      subtitle={item.desc}
      footer={footer}
      bgImage={bgImage}
    >
      {/* Sem filhos: a caixa "Classificação" saiu na 7.1 e o baú separado
          (fallback de recurso sem combo) saiu na sessão 082 — todo recurso
          tem combo próprio agora. A página é só ícone + título + descrição. */}
    </SummaryShell>
  );
}

// ── PÁGINA 6 (sem nada achado) — aparece mesmo sem loot [D051] ────────────────
function RewardEmptyPage({ footer }) {
  return (
    // [sessão 083] Arte dedicada: baú aberto e VAZIO, com moscas — o Davi
    // gerou pra esta página exatamente com esse sentido.
    <SummaryShell
      icon={<GameIcon name="bau-vazio" size={132} />}
      iconBg=""
      iconWrapClass="w-auto h-auto"
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
          // Versão ABERTA da arte (7.1) — o fechado continua na Mochila/Loja.
          art: `${c.id}-aberto`,
          name: chest?.name || 'Baú',
          desc: 'Os multis já foram direto pra sua carteira!',
          coins: c.coins,
          comboArt: null,
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
          comboArt: REWARD_COMBO[id] || null,
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
          comboArt: REWARD_COMBO[id] || null,
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
