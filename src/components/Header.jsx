import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getLevelIdx, getXpProgress, getLivesInfo, todayStr } from '../utils';
import { DAILY_LIVES_ENABLED } from '../constants';
import { LEVELS, ACHIEVEMENTS, DAILY_LIVES_MAX, LIFE_PRICE } from '../constants';
import { Progress } from './ui';
import GameIcon from './GameIcon';
import StreakPanel, { ESTADOS, estadoDaOfensiva, proximaConquista } from './StreakPanel';
import { fraseDaOfensiva } from '../constants/streakPhrases';

// ── HEADER [v6.0 · escada de Ligas / barra maior] ────────────────────────────
// Reescrita a pedido do Davi: os 4 indicadores (faixa/ofensiva/moedas/vidas)
// viram um único grupo de "pills" hoverável — passar o mouse (ou tocar, no
// celular) abre um painel com detalhe + atalho pra onde aquilo se resolve
// (Perfil ou Loja). Onde no Duolingo fica a bandeira do idioma, aqui fica o
// selo da faixa de tabuada atual — é o equivalente direto (identidade
// central do progresso do jogador).
const DAY_LABELS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// Semana atual pro painel da ofensiva. Cada dia vira um de três estados,
// que são exatamente os três marcadores da arte que o Davi forneceu:
//   'feito'     → jogou nesse dia
//   'congelado' → o Seguro de Ofensiva cobriu esse dia (`streakInsuredAt`);
//                 a ofensiva ficou preservada sem ele ter jogado
//   'vazio'     → não jogou (ou o dia ainda nem chegou)
// Data no fuso LOCAL (YYYY-MM-DD). Não dá pra usar `toISOString()` aqui:
// ele converte pra UTC, e no Brasil (UTC-3) tudo que acontece depois das
// 21h cai no dia seguinte. Uma partida às 22h de quinta apareceria na
// sexta no calendário. Ver nota sobre `todayStr()` em BUGS.md — a mesma
// armadilha existe no resto do app e é decisão separada.
function dataLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function currentWeekActivity(data) {
  const sessions = data.sessions || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - today.getDay());
  const todayKey = dataLocal(today);

  const playedDates = new Set();
  for (const s of sessions) {
    if (!s?.date) continue;
    const d = new Date(s.date);
    if (isNaN(d.getTime())) continue;
    playedDates.add(dataLocal(d));
  }

  // Dia em que o seguro foi consumido — é o único "congelado" que dá pra
  // afirmar com dado real; não invento congelamento onde não houve.
  const insuredKey = data.streakInsuredAt ? dataLocal(new Date(data.streakInsuredAt)) : null;

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(sunday);
    day.setDate(sunday.getDate() + i);
    const key = dataLocal(day);
    const estado = playedDates.has(key) ? 'feito' : key === insuredKey ? 'congelado' : 'vazio';
    return { key, label: DAY_LABELS[i], isToday: key === todayKey, isFuture: day > today, estado };
  });
}

// Próxima conquista de ofensiva ainda não batida — deriva de ACHIEVEMENTS
// (categoria "Ofensiva") em vez de duplicar os números aqui.
function nextStreakAchievement(data) {
  const goal = ACHIEVEMENTS.filter((a) => a.category === 'Ofensiva').find((a) => !a.check(data));
  if (!goal) return null;
  const match = goal.desc.match(/(\d+)/);
  const targetDays = match ? parseInt(match[1], 10) : null;
  const daysToGo = targetDays != null ? Math.max(0, targetDays - (data.currentStreak || 0)) : null;
  return { ...goal, targetDays, daysToGo };
}

function hoursUntilPotRefill() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(1, Math.ceil((midnight - now) / 3600000));
}

// ── ITEM DE ESTATÍSTICA (pill + painel no hover) ─────────────────────────────
function StatItem({ id, openId, setOpenId, trigger, children }) {
  const isOpen = openId === id;
  const closeTimer = useRef(null);

  const open = () => {
    clearTimeout(closeTimer.current);
    setOpenId(id);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpenId((k) => (k === id ? null : k)), 140);
  };

  return (
    <div className="relative" onMouseEnter={open} onMouseLeave={scheduleClose}>
      <button
        type="button"
        onClick={() => setOpenId(isOpen ? null : id)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-black text-base transition-colors
          ${isOpen ? 'bg-surface-2' : 'hover:bg-surface-2'}`}
      >
        {trigger}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onMouseEnter={open}
            onMouseLeave={scheduleClose}
            className="absolute right-0 top-full mt-2 w-72 max-w-[88vw] bg-surface border-2 border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelCta({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-accent text-white font-black text-sm hover:bg-accent/90 transition-colors"
    >
      {children}
      <ChevronRight size={15} />
    </button>
  );
}

export default function Header({ onNavigate }) {
  const { data, update } = useApp();
  const [openId, setOpenId] = useState(null);
  // [Fase 8.2] modal completo de ofensiva, aberto pelo "Ver mais" do painel
  const [painelOfensiva, setPainelOfensiva] = useState(false);

  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const nextLevel = LEVELS[levelIdx + 1];
  const xpProgress = getXpProgress(data.xp || 0);

  const streak = data.currentStreak || 0;
  const bestStreak = data.bestDayStreak || 0;
  const weekActivity = currentWeekActivity(data);
  const streakGoal = nextStreakAchievement(data);

  // [Fase 8.2, sessão 096] Agora são TRÊS situações, não duas: acesa,
  // congelada (Seguro segurando, `streakInsuredAt`) e APAGADA (nenhuma
  // ofensiva). Antes "sem ofensiva" era desenhada como congelada, o que
  // dizia uma coisa errada — quem está em 0 dia não tem nada congelado.
  const situacao = estadoDaOfensiva(data);
  const visual = ESTADOS[situacao];
  const conquistaOfensiva = proximaConquista(data);

  const coins = data.coins || 0;

  const { remaining: lives, max: maxLives } = getLivesInfo(data);
  const livesFull = lives >= maxLives;
  const canRefill = coins >= LIFE_PRICE;

  const goTo = (screen) => {
    setOpenId(null);
    onNavigate?.(screen);
  };

  // [sessão 090] Uma vida por compra, a `LIFE_PRICE`. Botão some de vez
  // quando o pote está cheio.
  const buyLife = () => {
    if (!canRefill || livesFull) return;
    update((prev) => ({
      ...prev,
      coins: (prev.coins || 0) - LIFE_PRICE,
      livesData: { date: todayStr(), remaining: Math.min(DAILY_LIVES_MAX, getLivesInfo(prev).remaining + 1) },
    }));
  };

  return (
    <header
      /* Altura vem de --header-h (globals.css) — a RankingPage usa a MESMA
         variável pra travar a altura dela. Ver comentário lá no CSS. */
      className="sticky top-0 z-40 flex items-center justify-end px-4 bg-surface border-b-2 border-border h-[var(--header-h)] shrink-0"
    >
      <div className="flex items-center gap-2">
        {/* Faixa de tabuada — equivalente à "bandeira" do Duolingo */}
        <StatItem
          id="faixa"
          openId={openId}
          setOpenId={setOpenId}
          trigger={
            <>
              <GameIcon name={level?.badge} size={22} />
              <span className="text-fg">{level?.rangeMin}×{level?.rangeMax}</span>
            </>
          }
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <GameIcon name={level?.badge} size={34} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-fg-muted">Faixa atual</p>
                <p className="font-black text-fg leading-tight truncate">{level?.name}</p>
              </div>
            </div>
            {nextLevel ? (
              <>
                <Progress value={xpProgress.pct} colorClass="bg-accent" className="mb-1.5" />
                <p className="text-xs font-bold text-fg-muted">
                  Faltam <span className="text-fg">{xpProgress.toNext} XP</span> pra <GameIcon name={nextLevel.badge} size={14} className="inline-block align-text-bottom" /> {nextLevel.rangeMin}×{nextLevel.rangeMax}
                </p>
              </>
            ) : (
              <p className="text-xs font-bold text-fg-muted">Faixa máxima alcançada! 🎉</p>
            )}
          </div>
          <div className="px-4 pb-4">
            <PanelCta onClick={() => goTo('perfil')}>Ver perfil</PanelCta>
          </div>
        </StatItem>

        {/* Ofensiva */}
        <StatItem
          id="streak"
          openId={openId}
          setOpenId={setOpenId}
          trigger={
            <>
              <GameIcon name={visual.icone} size={20} />
              {/* Cor do número acompanha a situação */}
              <span className={visual.texto}>{streak}</span>
            </>
          }
        >
          <div className="p-4">
            {/* [Fase 8.2] O bloco inteiro veste a cor da situação: laranja
                acesa, azul congelada, neutro apagada — pedido do Davi. */}
            <div className={`rounded-2xl p-3 mb-3 ${visual.fundo}`}>
              <div className="flex items-center gap-3">
                <GameIcon name={visual.icone} size={52} />
                <div className="min-w-0">
                  <p className={`text-lg font-black leading-tight ${visual.texto}`}>
                    {streak > 0 ? `${streak} dia${streak === 1 ? '' : 's'} de ofensiva` : 'Nenhuma ofensiva ainda'}
                  </p>
                  {/* O RECORDE saiu daqui (vive no Perfil e no painel completo).
                      No lugar entra uma das 15 frases do Davi, conforme a
                      situação — ver constants/streakPhrases.js. */}
                  <p className="text-xs font-bold text-fg-muted leading-snug mt-0.5">
                    {fraseDaOfensiva(situacao)}
                  </p>
                </div>
              </div>

              {/* Semana: caixas maiores e mais juntas que antes */}
              <div className="flex items-center justify-between gap-0.5 mt-3">
                {weekActivity.map((d) => (
                  <div key={d.key} className="flex flex-col items-center gap-1">
                    <span className={`text-[10px] font-black ${d.isToday ? visual.texto : 'text-fg-muted'}`}>
                      {d.label}
                    </span>
                    <GameIcon
                      name={`dia-${d.estado}`}
                      size={28}
                      className={d.isFuture ? 'opacity-40' : ''}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Próxima conquista de ofensiva */}
            {conquistaOfensiva && (
              <div className="flex items-center gap-2.5 bg-surface-2 rounded-xl px-3 py-2.5 mb-3">
                <GameIcon name="conquista-bloqueada" size={22} />
                <div className="min-w-0">
                  <p className="text-xs font-black text-fg leading-tight truncate">{conquistaOfensiva.title}</p>
                  <p className="text-[11px] font-bold text-fg-muted">
                    {conquistaOfensiva.faltam > 0
                      ? `Faltam ${conquistaOfensiva.faltam} ${conquistaOfensiva.faltam === 1 ? 'dia' : 'dias'}`
                      : 'Desbloqueia na próxima partida!'}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="px-4 pb-4">
            <PanelCta onClick={() => { setOpenId(null); setPainelOfensiva(true); }}>Ver mais</PanelCta>
          </div>
        </StatItem>

        {/* Moedas */}
        <StatItem
          id="coins"
          openId={openId}
          setOpenId={setOpenId}
          trigger={
            <>
              <GameIcon name="moedas" size={20} />
              <span className="text-coin">{coins}</span>
            </>
          }
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-1">
              <GameIcon name="moedas" size={32} />
              <div className="min-w-0">
                <p className="font-black text-fg leading-tight">Multis</p>
                <p className="text-xs font-bold text-fg-muted">Você tem {coins.toLocaleString('pt-BR')} multis</p>
              </div>
            </div>
            <p className="text-xs text-fg-muted font-semibold mt-2">
              Use seus multis na loja pra comprar power-ups e repor vidas.
            </p>
          </div>
          <div className="px-4 pb-4">
            <PanelCta onClick={() => goTo('shop')}>Ir pra loja</PanelCta>
          </div>
        </StatItem>

        {/* Vidas */}
        <StatItem
          id="lives"
          openId={openId}
          setOpenId={setOpenId}
          trigger={
            <>
              <GameIcon name="vidas" size={20} />
              {/* [Fase 1] com o pote desligado o número seria sempre 5 e
                  pareceria bug — o infinito diz a verdade. */}
              <span className="text-danger">{DAILY_LIVES_ENABLED ? lives : '∞'}</span>
            </>
          }
        >
          <div className="p-4">
            <p className="font-black text-fg text-center mb-2">Vidas</p>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {Array.from({ length: maxLives }, (_, i) => (
                <GameIcon
                  key={i}
                  name="vidas"
                  size={24}
                  className={i < lives ? '' : 'opacity-25 grayscale'}
                />
              ))}
            </div>
            <p className="text-xs font-bold text-fg-muted text-center mb-3">
              {livesFull ? 'Pote cheio!' : `O pote reabastece em ${hoursUntilPotRefill()}h`}
            </p>
            <button
              type="button"
              onClick={buyLife}
              disabled={livesFull || !canRefill}
              className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-surface-2 font-black text-sm text-fg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-border transition-colors"
            >
              <span className="flex items-center gap-2">
                <GameIcon name="vidas" size={16} />
                Comprar 1 vida
              </span>
              <span className="flex items-center gap-1 text-coin"><GameIcon name="moedas" size={15} />{LIFE_PRICE}</span>
            </button>
          </div>
          <div className="px-4 pb-4">
            <PanelCta onClick={() => goTo('shop')}>Ir pra loja</PanelCta>
          </div>
        </StatItem>
      </div>
      {/* [Fase 8.2] Painel completo da ofensiva — calendário do mês, meta,
          conquista e recorde geral. Fica fora do <header> pra não herdar o
          `sticky`/`z-40` dele. */}
      <AnimatePresence>
        {painelOfensiva && <StreakPanel data={data} onFechar={() => setPainelOfensiva(false)} />}
      </AnimatePresence>
    </header>
  );
}
