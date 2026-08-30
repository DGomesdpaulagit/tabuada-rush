import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { fraseDaOfensiva } from '../constants/streakPhrases';
import GameIcon from './GameIcon';

// ── OFENSIVA: ESTADO, CALENDÁRIO E PAINEL COMPLETO [Fase 8.2, sessão 096] ────
// Três estados, e não mais dois: antes o Header tratava "sem ofensiva" e
// "congelada pelo Seguro" como a mesma coisa (chama azul), o que era mentira —
// quem está com 0 dias não tem nada congelado, só apagado.

export const ESTADOS = {
  acesa: { icone: 'ofensiva', texto: 'text-streak', fundo: 'bg-streak/10', borda: 'border-streak/30' },
  congelada: { icone: 'ofensiva-congelada', texto: 'text-frozen', fundo: 'bg-frozen/10', borda: 'border-frozen/30' },
  apagada: { icone: 'ofensiva-apagada', texto: 'text-fg-muted', fundo: 'bg-surface-2', borda: 'border-border' },
};

export function estadoDaOfensiva(data = {}) {
  if (data.streakInsuredAt) return 'congelada';
  return (data.currentStreak || 0) > 0 ? 'acesa' : 'apagada';
}

// Data em fuso LOCAL (YYYY-MM-DD). `toISOString()` não serve: converte pra UTC
// e, no Brasil, tudo depois das 21h cai no dia seguinte (ver D040).
export function dataLocal(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function diasJogados(data = {}) {
  const jogados = new Set();
  for (const s of data.sessions || []) {
    if (s?.localDate) {
      jogados.add(s.localDate);
      continue;
    }
    if (!s?.date) continue;
    const d = new Date(s.date);
    if (!isNaN(d.getTime())) jogados.add(dataLocal(d));
  }
  return jogados;
}

// Próxima conquista de ofensiva ainda não batida — deriva de ACHIEVEMENTS
// (categoria "Ofensiva") em vez de duplicar os números.
export function proximaConquista(data = {}) {
  const meta = ACHIEVEMENTS.filter((a) => a.category === 'Ofensiva').find((a) => !a.check(data));
  if (!meta) return null;
  const m = meta.desc.match(/(\d+)/);
  const alvo = m ? parseInt(m[1], 10) : null;
  return { ...meta, alvo, faltam: alvo != null ? Math.max(0, alvo - (data.currentStreak || 0)) : null };
}

const LETRAS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

// ── Calendário do mês ────────────────────────────────────────────────────────
function CalendarioMensal({ data, estado }) {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const primeiro = new Date(ano, mes, 1);
  const totalDias = new Date(ano, mes + 1, 0).getDate();
  const jogados = diasJogados(data);
  const congeladoEm = data.streakInsuredAt ? dataLocal(new Date(data.streakInsuredAt)) : null;
  const hojeChave = dataLocal(hoje);

  const celulas = [];
  for (let i = 0; i < primeiro.getDay(); i++) celulas.push(null);
  for (let dia = 1; dia <= totalDias; dia++) {
    const chave = dataLocal(new Date(ano, mes, dia));
    celulas.push({
      dia,
      chave,
      feito: jogados.has(chave),
      congelado: chave === congeladoEm,
      hoje: chave === hojeChave,
      futuro: new Date(ano, mes, dia) > hoje,
    });
  }

  const nomeMes = primeiro.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div>
      <p className="text-center text-xs font-black text-fg-muted uppercase tracking-wide mb-3">
        {nomeMes}
      </p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {LETRAS.map((l, i) => (
          <span key={i} className="text-center text-[10px] font-black text-fg-muted">{l}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {celulas.map((c, i) =>
          !c ? (
            <span key={`v${i}`} />
          ) : (
            <div
              key={c.chave}
              className={`aspect-square rounded-lg flex items-center justify-center text-[11px] font-black tabular-nums
                ${c.congelado
                  ? 'bg-frozen/20 text-frozen'
                  : c.feito
                    ? 'bg-streak/20 text-streak'
                    : c.hoje
                      ? `border-2 ${ESTADOS[estado].borda} text-fg`
                      : c.futuro
                        ? 'text-fg-muted/40'
                        : 'text-fg-muted'}`}
            >
              {c.feito || c.congelado ? (
                <GameIcon name={c.congelado ? 'dia-congelado' : 'dia-feito'} size={18} />
              ) : (
                c.dia
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── Painel completo (o "Ver mais") ───────────────────────────────────────────
export default function StreakPanel({ data, onFechar }) {
  const estado = estadoDaOfensiva(data);
  const visual = ESTADOS[estado];
  const streak = data.currentStreak || 0;
  const recorde = data.bestDayStreak || 0;
  const meta = data.streakGoal;
  const metaBase = data.streakGoalBase || 0;
  const metaProgresso = Math.max(0, streak - metaBase);
  const conquista = proximaConquista(data);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60"
      onClick={onFechar}
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-surface border-2 border-border rounded-3xl w-full max-w-md max-h-[88vh] overflow-y-auto shadow-2xl"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border sticky top-0 bg-surface z-10">
          <p className="font-black text-fg">Ofensiva</p>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="w-8 h-8 rounded-lg bg-surface-2 hover:bg-border flex items-center justify-center text-fg-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Estado atual: ícone grande + contagem + a frase da situação */}
          <div className={`rounded-2xl p-4 flex items-center gap-4 ${visual.fundo}`}>
            <GameIcon name={visual.icone} size={64} />
            <div className="min-w-0">
              <p className={`text-2xl font-black leading-tight ${visual.texto}`}>
                {streak} {streak === 1 ? 'dia' : 'dias'}
              </p>
              <p className="text-xs font-bold text-fg-muted leading-snug mt-0.5">
                {fraseDaOfensiva(estado)}
              </p>
            </div>
          </div>

          <CalendarioMensal data={data} estado={estado} />

          {/* Meta de ofensiva */}
          <div>
            <p className="text-xs font-black text-fg-muted uppercase tracking-wide mb-2">Meta de ofensiva</p>
            {meta ? (
              <div className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3">
                <span className="text-sm font-black text-fg tabular-nums shrink-0">{Math.min(metaProgresso, meta)}</span>
                <div className="flex-1 h-2.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full bg-coin"
                    style={{ width: `${Math.min((metaProgresso / meta) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-black text-coin tabular-nums shrink-0">{meta}</span>
              </div>
            ) : (
              <p className="text-xs font-semibold text-fg-muted bg-surface-2 rounded-2xl p-3">
                Você ainda não definiu uma meta de ofensiva.
              </p>
            )}
          </div>

          {/* Próxima conquista */}
          {conquista && (
            <div>
              <p className="text-xs font-black text-fg-muted uppercase tracking-wide mb-2">Próxima conquista</p>
              <div className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3">
                <GameIcon name="conquista-bloqueada" size={26} />
                <div className="min-w-0">
                  <p className="text-sm font-black text-fg leading-tight">{conquista.title}</p>
                  <p className="text-xs font-semibold text-fg-muted">
                    {conquista.faltam > 0
                      ? `Faltam ${conquista.faltam} ${conquista.faltam === 1 ? 'dia' : 'dias'}`
                      : 'Desbloqueia na próxima partida!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recorde geral — saiu do painel do Header e vive aqui e no Perfil */}
          <div className="flex items-center justify-between bg-surface-2 rounded-2xl p-3">
            <span className="text-xs font-black text-fg-muted uppercase tracking-wide">Recorde geral</span>
            <span className="text-sm font-black text-fg tabular-nums">
              {recorde} {recorde === 1 ? 'dia' : 'dias'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
