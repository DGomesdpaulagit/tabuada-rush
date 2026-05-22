import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../constants';
import { useApp } from '../contexts/AppContext';
import { Button, pageVariants, pageTransition } from '../components/ui';

export default function AchievementsPage({ onBack }) {
  const { data } = useApp();
  const unlocked = data.achievements || [];
  const categories = [...new Set(ACHIEVEMENTS.map((a) => a.category))];

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
