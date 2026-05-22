import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Zap, Heart, Timer, Star } from 'lucide-react';
import { MODE_LIST } from '../constants';
import { useApp } from '../contexts/AppContext';
import { Button, EmptyState, pageVariants, pageTransition } from '../components/ui';

const modeIcons = { rush: Zap, survival: Heart, speed: Timer, daily: Star };

export default function RecordsPage({ onBack }) {
  const { data } = useApp();

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  const hasAnyRecord = MODE_LIST.some((m) => data.records?.[m.id] !== undefined);

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
          <h2 className="text-xl font-black text-gray-900">Recordes</h2>
          <p className="text-sm text-gray-400 font-semibold">Seus melhores resultados</p>
        </div>
      </div>

      {!hasAnyRecord ? (
        <EmptyState
          icon="🏆"
          title="Sem recordes ainda"
          description="Jogue uma partida para registrar seu primeiro recorde!"
        />
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          {MODE_LIST.map((mode) => {
            const Icon = modeIcons[mode.id];
            const record = data.records?.[mode.id];
            const hasRecord = record !== undefined;

            return (
              <motion.div
                key={mode.id}
                variants={item}
                className={`rounded-3xl overflow-hidden border ${mode.border}`}
              >
                {/* Mode header */}
                <div className={`bg-gradient-to-r ${mode.gradient} p-5 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Icon size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-lg">{mode.name}</p>
                      <p className="text-white/70 text-xs font-semibold">{mode.description}</p>
                    </div>
                  </div>
                  {hasRecord && (
                    <div className="text-right">
                      <p className="text-white/70 text-xs font-bold">Recorde</p>
                      <motion.p
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="text-white text-3xl font-black"
                      >
                        {record}
                      </motion.p>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className={`bg-gradient-to-br ${mode.gradientLight} px-5 py-4`}>
                  {hasRecord ? (
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className={mode.text} />
                      <span className={`text-sm font-bold ${mode.text}`}>
                        {record} pontos
                      </span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm font-semibold">
                      Nenhum registro ainda. Jogue para aparecer aqui!
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Global stats */}
          <motion.div variants={item} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
            <p className="font-black text-gray-700 mb-4 text-sm uppercase tracking-wide">
              Estatísticas Gerais
            </p>
            {[
              { label: 'Melhor Sequência', value: data.bestStreak || 0 },
              { label: 'Total de Acertos', value: data.totalCorrect || 0 },
              { label: 'Total de Partidas', value: data.totalGames || 0 },
              { label: 'XP Total', value: data.xp || 0 },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0"
              >
                <span className="text-gray-500 text-sm font-semibold">{label}</span>
                <span className="font-black text-gray-900">{value}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
