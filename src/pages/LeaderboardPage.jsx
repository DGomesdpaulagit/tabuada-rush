import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Cloud, AlertCircle, Crown, Medal } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { fetchDailyLeaderboard, fetchWeeklyLeaderboard } from '../services/leaderboard';
import { getCurrentWeekKey, todayStr, getQiInfo } from '../utils';
import { pageVariants, pageTransition, Button, EmptyState } from '../components/ui';

const TABS = [
  { id: 'daily',  label: 'Diário',  emoji: '🌟' },
  { id: 'weekly', label: 'Semanal', emoji: '🏆' },
];

function rankColor(idx) {
  if (idx === 0) return { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🥇' };
  if (idx === 1) return { bg: 'bg-gray-100', text: 'text-gray-600', icon: '🥈' };
  if (idx === 2) return { bg: 'bg-orange-100', text: 'text-orange-600', icon: '🥉' };
  return { bg: 'bg-violet-50', text: 'text-violet-600', icon: null };
}

export default function LeaderboardPage({ onBack }) {
  const { data } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [state, setState] = useState({ loading: true, result: null });

  const today = todayStr();
  const week = getCurrentWeekKey(new Date());

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, result: null });
    const fetcher = activeTab === 'daily'
      ? fetchDailyLeaderboard(today)
      : fetchWeeklyLeaderboard(week);
    fetcher.then((r) => { if (!cancelled) setState({ loading: false, result: r }); });
    return () => { cancelled = true; };
  }, [activeTab, today, week]);

  const myDaily  = data.currentDailyDate === today ? (data.currentDailyScore || 0) : null;
  const myWeekly = data.weeklyChallenge?.week === week ? (data.weeklyChallenge?.score || 0) : null;
  const myScore = activeTab === 'daily' ? myDaily : myWeekly;
  const myQi = getQiInfo(data);

  const { loading, result } = state;

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
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            Leaderboard
          </h2>
          <p className="text-sm text-gray-400 font-semibold">Top 20 — comparação justa</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === t.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-200'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Meu score */}
      {myScore != null && (
        <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-violet-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{myQi.char.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-violet-200">
                Seu Score · {activeTab === 'daily' ? 'Hoje' : 'Esta semana'}
              </p>
              <p className="text-xl font-black leading-tight">{myScore} pontos</p>
            </div>
            <span className="text-2xl font-black tabular-nums">{user ? '☁️' : ''}</span>
          </div>
        </div>
      )}

      {/* Estado: sem login */}
      {!user && (
        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-5 text-center">
          <Cloud size={28} className="mx-auto text-violet-400 mb-2" />
          <p className="text-sm font-black text-violet-700 mb-1">Login necessário</p>
          <p className="text-xs text-violet-500 font-semibold">
            Faça login para sincronizar seu score e ver o leaderboard global.
          </p>
        </div>
      )}

      {/* Estado: loading */}
      {loading && user && (
        <div className="text-center py-8 text-gray-400 font-semibold text-sm">
          Carregando ranking...
        </div>
      )}

      {/* Estado: Supabase não configurado ou tabelas não criadas */}
      {!loading && result && !result.ok && user && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-center">
          <AlertCircle size={28} className="mx-auto text-amber-500 mb-2" />
          <p className="text-sm font-black text-amber-700 mb-1">
            {result.reason === 'no_table'
              ? 'Leaderboard ainda não foi ativado'
              : result.reason === 'unconfigured'
              ? 'Nuvem não configurada'
              : 'Não foi possível carregar'}
          </p>
          <p className="text-xs text-amber-600 font-semibold leading-snug">
            {result.reason === 'no_table'
              ? 'O administrador precisa rodar a migração SQL do leaderboard. Veja SUPABASE_SETUP.md.'
              : result.reason === 'unconfigured'
              ? 'Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env'
              : 'Tente novamente em alguns segundos.'}
          </p>
        </div>
      )}

      {/* Estado: lista */}
      {!loading && result?.ok && user && (
        result.entries.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="Ainda sem pontuações"
            description={`Seja o primeiro a pontuar no Desafio ${activeTab === 'daily' ? 'Diário' : 'Semanal'} desta ${activeTab === 'daily' ? 'data' : 'semana'}!`}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {result.entries.map((entry, idx) => {
              const rc = rankColor(idx);
              const isMe = entry.user_id === user.id;
              return (
                <motion.div
                  key={entry.user_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.025 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all
                    ${isMe
                      ? 'bg-violet-50 border-violet-300 shadow-sm'
                      : `${rc.bg} border-gray-100`}`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shrink-0 ${rc.bg} ${rc.text}`}>
                    {rc.icon || `#${idx + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">
                      {entry.display_name || 'Anônimo'}
                      {isMe && <span className="ml-1.5 text-[10px] font-bold text-violet-600">(você)</span>}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">
                      {new Date(entry.updated_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <p className="text-lg font-black text-gray-900 tabular-nums shrink-0">
                    {entry.score}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )
      )}

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
