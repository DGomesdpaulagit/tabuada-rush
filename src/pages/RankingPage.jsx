import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, X } from 'lucide-react';
import { LEAGUES } from '../constants/leagues';
import { getLeagueStandings, getCycleDaysRemaining } from '../utils/leagues';
import { useApp } from '../contexts/AppContext';
import { pageVariants, pageTransition } from '../components/ui';
import GameIcon, { LeagueIcon } from '../components/GameIcon';

// ── LIGAS [layout de 2 colunas, referência Duolingo] ─────────────────────────
// Estrutura (pedido do Davi, ver DECISIONS.md D035):
//   Coluna esquerda  → escudos + bloco da divisão (FIXOS) + classificação
//                      (rola SOZINHA, dentro da própria caixa — a página não
//                      desce, quem desce é a lista)
//   Coluna direita   → painel de contexto, pra não sobrar espaço vazio e o
//                      conteúdo parar de ficar centralizado demais
// Regra de acesso não mudou (D031): só liga já alcançada (`leagueHighestId`)
// é clicável; acima disso, escudo cinza com cadeado.
const MEDALS = ['🥇', '🥈', '🥉'];

// Linha da classificação — usada na lista principal e no painel lateral.
// Vira botão quando `onSelect` é passado (abre a ficha do personagem no
// painel da direita); a linha do próprio jogador nunca é clicável, não tem
// ficha pra mostrar.
function RosterRow({ entry, rank, inPromotion, inRelegation, compact = false, onSelect, selected }) {
  const clicavel = !!onSelect && !entry.isPlayer;
  const Tag = clicavel ? 'button' : 'div';
  return (
    <Tag
      {...(clicavel ? { type: 'button', onClick: () => onSelect(entry, rank) } : {})}
      className={`w-full text-left flex items-center gap-3 rounded-2xl transition-all
        ${compact ? 'px-2 py-1.5' : 'px-3 py-2.5'}
        ${entry.isPlayer
          ? 'bg-surface-2 border-2 border-accent'
          : selected
            ? 'bg-surface-2 border-2 border-border'
            : `border-2 border-transparent ${clicavel ? 'hover:bg-surface-2' : ''}`}`}
    >
      <span
        className={`w-7 text-center text-sm font-black shrink-0 tabular-nums
          ${inPromotion ? 'text-check-dark' : inRelegation ? 'text-pen-dark' : 'text-fg-muted'}`}
      >
        {MEDALS[rank - 1] || rank}
      </span>
      <div
        className={`rounded-full flex items-center justify-center shrink-0 bg-surface-2
          ${compact ? 'w-8 h-8 text-base' : 'w-10 h-10 text-xl'}`}
      >
        {entry.emoji}
      </div>
      <p className={`flex-1 min-w-0 font-black text-sm truncate ${entry.isPlayer ? 'text-accent' : 'text-fg'}`}>
        {entry.name}
      </p>
      <p className="text-sm font-black text-fg-muted tabular-nums shrink-0">{entry.xp} XP</p>
    </Tag>
  );
}

export default function RankingPage({ onBack }) {
  const { data } = useApp();

  const currentLeagueId = LEAGUES.some((l) => l.id === data.leagueId) ? data.leagueId : LEAGUES[0].id;
  const currentIdx = LEAGUES.findIndex((l) => l.id === currentLeagueId);
  const storedHighestIdx = LEAGUES.findIndex((l) => l.id === data.leagueHighestId);
  const highestIdx = Math.max(currentIdx, storedHighestIdx);

  const [selectedId, setSelectedId] = useState(currentLeagueId);
  // Personagem cuja ficha está aberta no painel da direita (null = nenhum).
  const [ficha, setFicha] = useState(null);
  const selectedLeague = LEAGUES.find((l) => l.id === selectedId) || LEAGUES[currentIdx];

  // Trocar de divisão fecha a ficha — o personagem aberto é de outra liga.
  const trocarLiga = (id) => {
    setSelectedId(id);
    setFicha(null);
  };
  const standings = getLeagueStandings(data, selectedLeague.id);
  const daysLeft = getCycleDaysRemaining();

  const isOwnLeague = selectedLeague.id === currentLeagueId;
  const rank = standings.playerRank;
  const promoCut = selectedLeague.promotionCount;

  // Contexto do painel lateral: quem está logo acima e logo abaixo do jogador,
  // e a distância em XP — é o que transforma "estou em 9º" em "faltam 40 XP".
  const acima = isOwnLeague && rank > 1 ? standings.entries[rank - 2] : null;
  const abaixo = isOwnLeague && rank < standings.total ? standings.entries[rank] : null;
  const meuXp = isOwnLeague ? standings.entries[rank - 1]?.xp ?? 0 : 0;
  const faltaPraSubir = acima ? Math.max(1, acima.xp - meuXp) : null;
  const vantagem = abaixo ? Math.max(0, meuXp - abaixo.xp) : null;
  const foraDaZona = isOwnLeague && promoCut > 0 && rank > promoCut;
  const xpPraZona = foraDaZona ? Math.max(1, (standings.entries[promoCut - 1]?.xp ?? 0) - meuXp) : null;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      /* SÓ no desktop (lg+): altura travada no que sobra da janela (100dvh −
         --header-h − o py-6 do container do App). Sem isso a PÁGINA rola,
         e página rolando é justamente o que o Davi não quer aqui: quem rola é
         a lista de personagens, dentro da própria caixa. Bônus: sem scroll
         vertical na página não aparece barra de rolagem, e sem barra some
         também a sobra de 4px que causava scroll horizontal.
         No celular NÃO trava: com as colunas empilhadas o conteúdo passa de
         1500px e a altura fixa cortaria metade dos personagens sem como
         alcançá-los — lá a página rola normal, como se espera de mobile. */
      className="flex flex-col lg:h-[calc(100dvh-var(--header-h)-3rem)] lg:overflow-hidden"
    >
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted hover:bg-border transition-colors mb-4 shrink-0"
      >
        <ArrowLeft size={18} />
      </button>

      <div className="flex flex-col lg:flex-row lg:items-stretch gap-6 lg:flex-1 lg:min-h-0">
        {/* ── Coluna da liga ───────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Escudos — só ícones, sem rótulo de texto (evita colisão).
              O padrão aqui é `overflow-x-auto` no PAI + `w-max mx-auto` no
              FILHO, de propósito: com `justify-center` direto num container
              que transborda, o navegador corta pela ESQUERDA e o primeiro
              escudo some pela metade (era o Bronze cortado). Assim, quando
              cabe (desktop) o `mx-auto` centraliza; quando não cabe
              (celular) começa da esquerda e rola, sem cortar nem empurrar a
              página. */}
          <div className="overflow-x-auto shrink-0">
            <div className="flex items-end gap-2 w-max mx-auto pb-1">
            {LEAGUES.map((league, idx) => {
              const unlocked = idx <= highestIdx;
              const isSelected = league.id === selectedLeague.id;
              return (
                <button
                  key={league.id}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => trocarLiga(league.id)}
                  title={unlocked ? league.name : 'Divisão bloqueada'}
                  className={`shrink-0 flex items-center justify-center transition-all
                    ${isSelected ? 'w-16 h-16' : 'w-11 h-11 opacity-70 hover:opacity-100'}
                    ${unlocked ? '' : 'cursor-not-allowed'}`}
                >
                  {unlocked
                    ? <LeagueIcon leagueId={league.id} size={isSelected ? 64 : 44} alt={league.name} />
                    : <GameIcon name="divisao-bloqueada" size={isSelected ? 58 : 40} />}
                </button>
              );
            })}
            </div>
          </div>

          {/* Bloco da divisão — FIXO, nunca sai da tela */}
          <div className="text-center mt-4 shrink-0">
            <h2 className="text-2xl font-black text-fg">Divisão {selectedLeague.name}</h2>
            <p className="text-sm text-fg-muted font-semibold mt-1">
              {promoCut > 0
                ? `Os ${promoCut} primeiros avançam pra próxima divisão.`
                : 'Divisão mais alta — não há pra onde subir.'}
            </p>
            <p className="text-sm font-black text-coin mt-1">
              {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}
            </p>
          </div>

          <div className="h-px bg-border my-5 shrink-0" />

          {/* Classificação — no desktop é ELA que rola, não a página
              (`lg:min-h-0` é o que permite o flex encolher e a rolagem
              acontecer aqui dentro). No celular flui normal e quem rola é a
              página. */}
          <div className="flex flex-col gap-2 lg:overflow-y-auto lg:flex-1 lg:min-h-0 lg:pr-1">
            {standings.entries.map((e, i) => (
              <RosterRow
                key={e.name + i}
                entry={e}
                rank={i + 1}
                inPromotion={i + 1 <= promoCut}
                inRelegation={i + 1 > standings.total - selectedLeague.relegationCount}
                onSelect={(entry, rank) => setFicha({ ...entry, rank })}
                selected={ficha?.name === e.name}
              />
            ))}
          </div>
        </div>

        {/* ── Painel lateral ───────────────────────────────────────────── */}
        <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-4 lg:overflow-y-auto lg:min-h-0">
          {/* Ficha do personagem — aparece no topo ao clicar numa linha da
              classificação. Usa a `desc` que cada um dos 114 personagens já
              tem em constants/leagues.js. */}
          {ficha && (
            <motion.div
              key={ficha.name}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 text-white bg-gradient-to-br ${selectedLeague.gradient} shadow-lg shrink-0`}
            >
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
                  {ficha.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-lg leading-tight">{ficha.name}</p>
                  <p className="text-white/75 text-xs font-bold">
                    {ficha.rank}º na Divisão {selectedLeague.name} · {ficha.xp} XP
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFicha(null)}
                  aria-label="Fechar ficha"
                  className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              {ficha.desc && (
                <p className="text-sm font-semibold text-white/90 mt-3 leading-snug">{ficha.desc}</p>
              )}
            </motion.div>
          )}

          {isOwnLeague ? (
            <>
              <div className="bg-surface border-2 border-border rounded-2xl p-4">
                <p className="font-black text-fg mb-3">Sua corrida</p>

                {acima ? (
                  <div className="mb-3">
                    <p className="text-xs font-bold text-fg-muted mb-1.5 flex items-center gap-1">
                      <TrendingUp size={13} className="text-check-dark" />
                      Faltam <span className="text-fg">{faltaPraSubir} XP</span> pra passar
                    </p>
                    <RosterRow entry={acima} rank={rank - 1} inPromotion={rank - 1 <= promoCut} inRelegation={false} compact />
                  </div>
                ) : (
                  <p className="text-sm font-bold text-check-dark mb-3">
                    🏆 Você está em 1º lugar na divisão!
                  </p>
                )}

                {abaixo && (
                  <div>
                    <p className="text-xs font-bold text-fg-muted mb-1.5 flex items-center gap-1">
                      <TrendingDown size={13} className="text-pen-dark" />
                      {vantagem} XP de vantagem sobre
                    </p>
                    <RosterRow entry={abaixo} rank={rank + 1} inPromotion={false} inRelegation={false} compact />
                  </div>
                )}
              </div>

              <div className="bg-surface border-2 border-border rounded-2xl p-4">
                <p className="font-black text-fg mb-2 flex items-center gap-2">
                  <GameIcon name="podio" size={18} />
                  Zona de promoção
                </p>
                {promoCut === 0 ? (
                  <p className="text-sm font-semibold text-fg-muted">
                    Você está na divisão mais alta. Aqui o jogo é só não cair.
                  </p>
                ) : foraDaZona ? (
                  /* Antes isso era uma frase corrida e quebrava feio no meio
                     de "(693 XP)" — número numa linha, unidade na outra.
                     Agora cada dado é um bloco próprio, e os pares
                     número+unidade levam `whitespace-nowrap` pra nunca
                     rachar no meio. */
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold text-fg-muted leading-snug">
                      Você está em{' '}
                      <span className="text-fg font-black whitespace-nowrap">{rank}º</span> de{' '}
                      <span className="text-fg font-black whitespace-nowrap">{standings.total}</span>.
                    </p>
                    <div className="flex items-center justify-between gap-3 bg-surface-2 rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-fg-muted">Pra entrar na zona</span>
                      <span className="text-sm font-black text-fg whitespace-nowrap">
                        +{xpPraZona} XP
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-fg-muted leading-snug">
                      Faltam{' '}
                      <span className="text-fg font-black whitespace-nowrap">
                        {rank - promoCut} {rank - promoCut === 1 ? 'posição' : 'posições'}
                      </span>
                      .
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-check-dark leading-snug">
                    Você está dentro! Em{' '}
                    <span className="font-black whitespace-nowrap">{rank}º</span> — mantenha até o
                    ciclo virar e sobe de divisão.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="bg-surface border-2 border-border rounded-2xl p-4">
              <p className="font-black text-fg mb-1">Você já passou por aqui</p>
              <p className="text-sm font-semibold text-fg-muted mb-3">
                Sua divisão atual é a{' '}
                <span className="text-fg font-black">{LEAGUES[currentIdx].name}</span>.
              </p>
              <p className="text-xs font-bold text-fg-muted mb-1.5">Líder desta divisão</p>
              {standings.entries[0] && (
                <RosterRow
                  entry={standings.entries[0]}
                  rank={1}
                  inPromotion
                  inRelegation={false}
                  compact
                  onSelect={(entry, rank) => setFicha({ ...entry, rank })}
                  selected={ficha?.name === standings.entries[0].name}
                />
              )}
            </div>
          )}

          {!ficha && (
            <p className="text-xs font-semibold text-fg-muted text-center px-2 shrink-0">
              Toque num personagem da lista pra ver a ficha dele.
            </p>
          )}
        </aside>
      </div>
    </motion.div>
  );
}
