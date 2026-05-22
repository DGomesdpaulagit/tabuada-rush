import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader, AlertCircle, LogIn, UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { pageVariants, pageTransition } from '../components/ui';

export default function AuthPage({ onBack, onSuccess }) {
  const { signIn, signUp } = useAuth();
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const { error: err } = tab === 'login'
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (err) {
      const msg = err.message;
      if (msg.includes('Invalid login') || msg.includes('invalid_credentials')) {
        setError('Email ou senha incorretos.');
      } else if (msg.includes('already registered') || msg.includes('already been registered')) {
        setError('Email já cadastrado. Tente fazer login.');
      } else if (msg.includes('Password should') || msg.includes('password')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(msg);
      }
      return;
    }

    if (tab === 'register') {
      setSuccess('Conta criada! Verifique seu email para confirmar o cadastro.');
    } else {
      onSuccess();
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center"
      >
        <div className="text-6xl">☁️</div>
        <div>
          <h2 className="text-xl font-black text-gray-900">Backend não configurado</h2>
          <p className="text-sm text-gray-500 font-semibold mt-2 max-w-xs leading-relaxed">
            Configure o Supabase para ativar login e sincronização em nuvem.
            <br />
            Siga as instruções em <code className="bg-gray-100 px-1 rounded text-xs">SUPABASE_SETUP.md</code>.
          </p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-violet-600 font-bold text-sm hover:text-violet-800 transition-colors"
        >
          <ArrowLeft size={14} /> Voltar ao menu
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className="flex flex-col gap-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Hero */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-5xl mb-3"
        >
          ☁️
        </motion.div>
        <h1 className="text-2xl font-black text-gray-900">Salvar Progresso</h1>
        <p className="text-sm text-gray-400 font-semibold mt-1">
          Acesse seu progresso em qualquer dispositivo
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        {[
          { id: 'login', label: 'Entrar', icon: LogIn },
          { id: 'register', label: 'Criar Conta', icon: UserPlus },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setError(''); setSuccess(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all
              ${tab === id
                ? 'bg-white shadow-sm text-violet-600'
                : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
            Email
          </label>
          <div className="relative">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-sm outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">
            Senha
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              className="w-full h-12 pl-11 pr-4 rounded-2xl border-2 border-gray-200 bg-white text-gray-900 font-semibold text-sm outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          {tab === 'register' && (
            <p className="text-xs text-gray-400 font-semibold px-1">Mínimo 6 caracteres</p>
          )}
        </div>

        {/* Feedback */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-2xl px-4 py-3 text-sm font-semibold"
            >
              <span>✅</span>
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-black text-base shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-60 transition-opacity active:scale-[0.98]"
        >
          {loading
            ? <Loader size={20} className="animate-spin" />
            : tab === 'login' ? 'Entrar' : 'Criar Conta'
          }
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs font-semibold text-gray-300">ou</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Guest */}
      <button
        onClick={onBack}
        className="w-full h-12 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-colors"
      >
        Jogar sem conta →
      </button>

      <p className="text-center text-xs text-gray-400 font-semibold pb-2">
        Com conta, XP, conquistas e recordes são sincronizados automaticamente.
      </p>
    </motion.div>
  );
}
