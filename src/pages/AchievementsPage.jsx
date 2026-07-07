import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Award, Crown } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { computeCertificates, computeOperationMastery, OPERATIONS, OPERATION_ORDER } from '../utils';
import { Button, OperationTabs, pageVariants, pageTransition } from '../components/ui';

export default function AchievementsPage({ onBack }) {
  const { data } = useApp();
  const [certOperation, setCertOperation] = useState('mult'); // aba de certificados (v4.0 · Fase 2)
  const unlocked = data.achievements || [];
  const categories = [...new Set(ACHIEVEMENTS.map((a) => a.category))];
  const certificates = computeCertificates(data.factStats?.[certOperation] || {}, certOperation);
  const certsUnlocked = certificates.filter((c) => c.unlocked).length;
  const certLabel = (table) =>
    certOperation === 'mult' ? `Tab. ${table}` : `${OPERATIONS[certOperation].symbol}${table}`;

  // [v4.0 · Fase 6] Certificado "Matemática Fundamental Completa" — cruza as 4 operações
  const operationMastery = computeOperationMastery(data);
  const fullMastery = operationMastery.every((m) => m.allCertsUnlocked);
  const completedOpsCount = operationMastery.filter((m) => m.allCertsUnlocked).length;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-xl font-black text-gray-900">Conquistas</h2>
          <p className="text-sm text-gray-400 font-semibold">
            {unlocked.length}/{ACHIEVEMENTS.length} desbloqueadas
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-600">Progresso Geral</span>
          <span className="text-sm font-black text-violet-600">
            {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
          </span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full"
          />
        </div>
      </div>

      {/* ── MATEMÁTICA FUNDAMENTAL COMPLETA [v4.0 · Fase 6] ───────────────
          Certificado supremo: cruza as 4 operações — só desbloqueia quando
          TODOS os certificados de domínio (mult/add/sub/div) estão completos. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-5 border-2 transition-all ${
          fullMastery
            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-100 border-amber-400 shadow-lg shadow-amber-200'
            : 'bg-gray-50 border-gray-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
            fullMastery ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white' : 'bg-gray-200 text-gray-400'
          }`}>
            <Crown size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`font-black text-sm ${fullMastery ? 'text-amber-800' : 'text-gray-600'}`}>
              Matemática Fundamental Completa
            </p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">
              Domínio total nas 4 operações — {completedOpsCount}/4 completas
            </p>
          </div>
          {!fullMastery && <Lock size={16} className="text-gray-300 shrink-0" />}
        </div>
        {!fullMastery && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {operationMastery.map((m) => (
              <span
                key={m.operation}
                className={`text-[10px] font-black px-2 py-1 rounded-full ${
                  m.allCertsUnlocked ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {m.label}: {m.dominated}/{m.total}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── CERTIFICADOS DE DOMÍNIO ──────────────────────────────────────
          Únicas conquistas que NÃO podem ser compradas — apenas conquistadas
          por domínio real (todos os 10 fatos da tabuada dominados). */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
            <Award size={13} className="text-amber-500" />
            Certificados de Domínio
          </p>
          <span className="text-[11px] font-black text-amber-600">
            {certsUnlocked}/{certificates.length}
          </span>
        </div>
        <p className="text-[11px] text-gray-400 font-semibold mb-3 px-1">
          Conquistados por domínio real — não podem ser comprados
        </p>
        <OperationTabs
          operations={OPERATION_ORDER.map((id) => OPERATIONS[id])}
          value={certOperation}
          onChange={setCertOperation}
          className="mb-3"
        />
        <div className="grid grid-cols-4 gap-2">
          {certificates.map((c) => (
            <motion.div
              key={c.table}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-2xl p-3 text-center border transition-all
                ${c.unlocked
                  ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-sm'
                  : 'bg-gray-50 border-gray-100'}`}
            >
              <div className={`text-2xl mb-0.5 ${c.unlocked ? '' : 'grayscale opacity-30'}`}>
                {c.unlocked ? '🏅' : '🔒'}
              </div>
              <p className={`text-sm font-black ${c.unlocked ? 'text-amber-700' : 'text-gray-400'}`}>
                {certLabel(c.table)}
              </p>
              <p className="text-[10px] font-bold text-gray-400">
                {c.dominated}/{c.total}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.map((cat) => {
        const items = ACHIEVEMENTS.filter((a) => a.category === cat);
        return (
          <div key={cat}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3 px-1">
              {cat}
            </p>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3"
            >
              {items.map((a) => {
                const isUnlocked = unlocked.includes(a.id);
                return (
                  <motion.div
                    key={a.id}
                    variants={item}
                    className={`rounded-2xl p-4 border transition-all ${
                      isUnlocked
                        ? 'bg-white border-gray-100 shadow-sm'
                        : 'bg-gray-50 border-gray-100 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-3xl ${!isUnlocked ? 'grayscale opacity-40' : ''}`}>
                        {a.icon}
                      </span>
                      {!isUnlocked && (
                        <Lock size={14} className="text-gray-300 mt-1" />
                      )}
                      {isUnlocked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                    </div>
                    <p className={`font-black text-sm ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5 leading-snug">
                      {a.desc}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        );
      })}

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
