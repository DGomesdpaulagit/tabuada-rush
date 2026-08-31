import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import { dominioDaFaixa, diagnosticoDaColeta, CORTE_FAIXA, FLUENCIA_MULT } from '../utils/dominio';
import { pageVariants, pageTransition } from '../components/ui';

// ── PAINEL DE DOMÍNIO — FERRAMENTA DE FASE 1 (só em DEV) ────────────────────
// Não é tela do jogo: é o relatório que responde se a regra de domínio do
// ARQUITETURA_XP.md se comporta como a gente imaginou, rodando em cima do
// save REAL. Abre em `?screen=dominio`.
//
// Existe pra não ter que caçar isso no console: o DevTools bloqueia colar
// comando e a frase de desbloqueio muda de idioma.

const COR = {
  verde: 'text-success',
  amarelo: 'text-coin',
  vermelho: 'text-danger',
};
const PONTO = { verde: '🟢', amarelo: '🟡', vermelho: '🔴' };

function Caixa({ titulo, children }) {
  return (
    <div className="bg-surface border-2 border-border rounded-2xl p-4">
      <p className="text-xs font-black text-fg-muted uppercase tracking-wide mb-3">{titulo}</p>
      {children}
    </div>
  );
}

function Linha({ rotulo, valor, nota }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1">
      <span className="text-sm font-semibold text-fg-muted">{rotulo}</span>
      <span className="text-sm font-black text-fg tabular-nums text-right">
        {valor}
        {nota && <span className="block text-[11px] font-bold text-fg-muted/70">{nota}</span>}
      </span>
    </div>
  );
}

export default function DominioPage() {
  const { data } = useApp();
  const rel = dominioDaFaixa(data, 0);
  const diag = diagnosticoDaColeta(data);

  const semDado = diag.tentativas === 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-4"
    >
      <div>
        <h1 className="text-2xl font-black text-fg">Domínio — Fase 1</h1>
        <p className="text-sm font-semibold text-fg-muted mt-1">
          Relatório sobre o save real. Não muda nada no jogo.
        </p>
      </div>

      {semDado && (
        <div className="rounded-2xl border-2 border-danger/40 bg-danger/10 p-4">
          <p className="text-sm font-black text-danger">
            Nenhuma tentativa coletada ainda — jogue uma partida até o fim.
          </p>
        </div>
      )}

      <Caixa titulo="A coleta está prestando?">
        <Linha rotulo="Tentativas gravadas" valor={diag.tentativas} />
        <Linha rotulo="Com tempo de decisão" valor={`${diag.comDecisao} / ${diag.tentativas}`} />
        <Linha rotulo="Válidas pra fluência" valor={diag.validasFluencia} />
        <Linha
          rotulo="Mediana: decisão vs. total"
          valor={diag.medDec != null ? `${diag.medDec} / ${diag.medTot} ms` : '—'}
          nota={diag.pctDigitacao != null ? `digitação = ${diag.pctDigitacao}% do tempo` : null}
        />
        <Linha
          rotulo="1ª pergunta da partida"
          valor={diag.medDecQ1 != null ? `${diag.medDecQ1} ms` : '—'}
          nota={diag.medDecResto != null ? `demais: ${diag.medDecResto} ms` : null}
        />
        <Linha rotulo="Fatos tocados" valor={diag.fatosTocados} />
        <Linha
          rotulo="Exposição por conta (mín / mediana / máx)"
          valor={`${diag.expMin} / ${diag.expMediana ?? '—'} / ${diag.expMax}`}
          nota={
            diag.nuncaVistos > 0
              ? `${diag.nuncaVistos} conta(s) nunca sorteada(s) — o sorteio enviesa por tabuada, não por conta`
              : null
          }
        />
        <Linha
          rotulo="Dias distintos de prática"
          valor={diag.diasDistintos}
          nota={diag.diasDistintos < 4 ? 'consistência precisa de 4 — só o tempo resolve' : null}
        />
      </Caixa>

      <Caixa titulo={`Faixa ${rel.faixa.name}`}>
        <Linha
          rotulo="Base da fluência (p25)"
          valor={rel.base != null ? `${rel.base} ms` : '—'}
          nota={
            rel.base != null
              ? `fluente = até ${Math.round(rel.base * FLUENCIA_MULT)} ms`
              : 'poucos fatos com 5+ respostas'
          }
        />
        <Linha
          rotulo="Fatos medidos"
          valor={rel.fatosMedidos}
          nota={rel.estabilizando ? 'estabilizando: fluência ainda não pontua' : null}
        />
        <div className="h-px bg-border my-2" />
        <Linha rotulo="🟢 Dominados" valor={`${rel.verdes} de ${rel.total}`} />
        <Linha rotulo="🟡 Em desenvolvimento" valor={rel.amarelos} />
        <Linha rotulo="🔴 Precisam praticar" valor={rel.vermelhos} />
        <div className="mt-3 rounded-xl bg-surface-2 p-3">
          <p className="text-sm font-black text-fg">
            {rel.abre ? '✅ A faixa abriria' : '⛔ A faixa não abriria ainda'}
          </p>
          <p className="text-xs font-semibold text-fg-muted mt-0.5">
            Precisa de {Math.round(CORTE_FAIXA * 100)}% em verde e nenhum vermelho — está com{' '}
            {Math.round(rel.pctVerde * 100)}% e {rel.vermelhos} vermelho(s).
          </p>
        </div>
      </Caixa>

      <Caixa titulo="Fatos, do pior pro melhor">
        <div className="overflow-x-auto">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="text-[11px] font-black text-fg-muted uppercase">
                <th className="text-left py-1">Conta</th>
                <th className="text-right">Nota</th>
                <th className="text-right">Prec</th>
                <th className="text-right">Cons</th>
                <th className="text-right">Flu</th>
                <th className="text-right">Rec</th>
                <th className="text-right">Tent</th>
                <th className="text-right">Dec</th>
              </tr>
            </thead>
            <tbody>
              {rel.linhas.slice(0, 60).map((l) => (
                <tr key={l.fk} className="border-t border-border/50">
                  <td className="py-1 font-black text-fg">
                    {PONTO[l.estado]} {l.fk.replace('x', ' × ')}
                  </td>
                  <td className={`text-right font-black ${COR[l.estado]}`}>
                    {l.nota}
                    {l.travadoPorDias && <span className="text-[10px] font-bold text-fg-muted"> ⏳</span>}
                  </td>
                  <td className="text-right text-fg-muted">{l.partes.precisao ?? '—'}</td>
                  <td className="text-right text-fg-muted">{l.partes.consistencia ?? '—'}</td>
                  <td className="text-right text-fg-muted">{l.partes.fluencia ?? '—'}</td>
                  <td className="text-right text-fg-muted">{l.partes.recencia ?? '—'}</td>
                  <td className="text-right text-fg-muted">{l.tentativas}</td>
                  <td className="text-right text-fg-muted">{l.medDec ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] font-semibold text-fg-muted/70 mt-2">
          Prec = precisão recente · Cons = consistência (dias) · Flu = fluência · Rec = recência ·
          Tent = tentativas guardadas · Dec = mediana do tempo de decisão (ms)
          <br />⏳ = tem nota de verde, mas ainda não tem dias distintos suficientes
        </p>
      </Caixa>
    </motion.div>
  );
}
