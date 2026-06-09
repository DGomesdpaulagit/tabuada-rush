import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Volume2, Music, Sun, Moon, Bell, User, LogOut, LogIn,
  Type, Contrast, Sparkles, Cloud, Trash2, AlertTriangle, GraduationCap,
} from 'lucide-react';
import { LEVELS } from '../constants';
import { getLevelIdx, getQiInfo } from '../utils';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { prefs } from '../lib/prefs';
import { audio } from '../lib/audioManager';
import { enableNotifications } from '../lib/notify';
import { subscribeToPush, unsubscribeFromPush } from '../lib/push';
import { Button, pageVariants, pageTransition } from '../components/ui';
import { storage, DEFAULTS } from '../lib/storage';
import { saveCloudData } from '../services/sync';
import { isSupabaseConfigured } from '../lib/supabase';

// ── Switch on/off no estilo do projeto ──────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`w-11 h-6 rounded-full relative shrink-0 transition-colors ${on ? 'bg-violet-600' : 'bg-gray-300'}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}

function ResetButton({ onReset, hasCloud }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onReset();
    // onReset faz reload, mas se falhar:
    setLoading(false);
  };

  if (confirm) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <p className="text-sm font-black text-rose-700">Tem certeza? Esta ação não pode ser desfeita.</p>
        </div>
        {hasCloud && (
          <p className="text-xs text-rose-500 font-semibold mb-3">
            ☁️ Seus dados na nuvem também serão apagados.
          </p>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-black hover:bg-rose-700 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? 'Apagando...' : 'Sim, apagar tudo'}
          </button>
          <button
            onClick={() => setConfirm(false)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gray-200 text-gray-700 text-sm font-black hover:bg-gray-300 active:scale-[0.98] transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirm(true)}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-rose-200 text-rose-600 text-sm font-black hover:bg-rose-50 active:scale-[0.98] transition-all"
    >
      <Trash2 size={15} />
      Resetar Progresso
    </button>
  );
}

function Row({ icon, label, desc, children }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon && (
        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 font-semibold leading-snug">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">{title}</p>
      {children}
    </div>
  );
}

export default function SettingsPage({ onBack, onNavigate }) {
  const { data, cloudSyncing, update } = useApp();
  const { user, signOut } = useAuth();

  // Toggle persistido em data (sincroniza via Supabase)
  const includeExtraTables = !!data.includeExtraTables;
  const toggleExtraTables = (v) => update((prev) => ({ ...prev, includeExtraTables: v }));

  // Reset completo: grava DEFAULTS na nuvem + no localStorage + recarrega.
  // Usar saveCloudData (upsert com DEFAULTS) em vez de setar null evita que o
  // AppContext restaure dados antigos ao fazer login logo após o reset.
  const handleReset = useCallback(async () => {
    if (user && isSupabaseConfigured) {
      try {
        await saveCloudData(user.id, { ...DEFAULTS });
      } catch { /* ignora — reset local continua de qualquer forma */ }
    }
    storage.set({ ...DEFAULTS });
    window.location.reload();
  }, [user]);

  const p = prefs.get();
  const [theme, setThemeState] = useState(p.theme);
  const [music, setMusic] = useState(p.music);
  const [notifications, setNotif] = useState(p.notifications);
  const [largeText, setLarge] = useState(p.largeText);
  const [reduceMotion, setRM] = useState(p.reduceMotion);
  const [highContrast, setHC] = useState(p.highContrast);
  const [sfx, setSfx] = useState(audio.enabled);
  const [volume, setVolume] = useState(audio.volume);
  const [notifMsg, setNotifMsg] = useState('');

  const setTheme = (t) => { setThemeState(t); prefs.update({ theme: t }); audio.click(); };
  // Música real: liga/desliga a trilha gerada no audioManager
  const toggleMusic = (v) => {
    setMusic(v);
    prefs.update({ music: v });
    if (v) audio.startMusic();
    else audio.stopMusic();
  };
  // Notificações reais: pede permissão e assina o push (lembrete com app fechado)
  const toggleNotif = async (v) => {
    if (!v) {
      setNotif(false); prefs.update({ notifications: false }); setNotifMsg('');
      await unsubscribeFromPush();
      return;
    }
    const res = await enableNotifications();
    if (res === 'granted') {
      setNotif(true); prefs.update({ notifications: true });
      if (user) {
        const ok = await subscribeToPush(user.id);
        setNotifMsg(ok
          ? 'Lembretes ativados — você será avisado mesmo com o app fechado.'
          : 'Lembretes ativados neste dispositivo.');
      } else {
        setNotifMsg('Ativado! Faça login para receber lembretes com o app fechado.');
      }
    } else {
      setNotif(false); prefs.update({ notifications: false });
      setNotifMsg(res === 'denied'
        ? 'Permissão negada — ative as notificações nas configurações do navegador.'
        : 'Seu navegador não suporta notificações.');
    }
  };
  const toggleLarge = (v) => { setLarge(v); prefs.update({ largeText: v }); };
  const toggleRM = (v) => { setRM(v); prefs.update({ reduceMotion: v }); };
  const toggleHC = (v) => { setHC(v); prefs.update({ highContrast: v }); };
  const toggleSfx = (v) => { setSfx(v); audio.setEnabled(v); if (v) audio.correct(); };
  const changeVol = (v) => { setVolume(v); audio.setVolume(v); };

  const levelIdx = getLevelIdx(data.xp || 0);
  const level = LEVELS[levelIdx];
  const qi = getQiInfo(data);

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
          <h2 className="text-xl font-black text-gray-900">Configurações</h2>
          <p className="text-sm text-gray-400 font-semibold">Preferências e acessibilidade</p>
        </div>
      </div>

      {/* SOM */}
      <Section title="Som">
        <Row icon={<Volume2 size={15} />} label="Efeitos sonoros" desc="Sons de acerto, erro, combo...">
          <Toggle on={sfx} onChange={toggleSfx} />
        </Row>
        <Row icon={<Volume2 size={15} />} label="Volume" desc={`${Math.round(volume * 100)}%`}>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(volume * 100)}
            onChange={(e) => changeVol(Number(e.target.value) / 100)}
            onPointerUp={() => sfx && audio.click()}
            className="w-28 accent-violet-600"
          />
        </Row>
        <Row icon={<Music size={15} />} label="Música" desc="Trilha de fundo ambiente">
          <Toggle on={music} onChange={toggleMusic} />
        </Row>
      </Section>

      {/* APARÊNCIA */}
      <Section title="Aparência">
        <p className="text-sm font-bold text-gray-800 mb-1">Tema</p>
        <p className="text-xs text-gray-400 font-semibold mb-3">
          Adapta leitura e contraste — mantém as cores do jogo.
        </p>
        <div className="flex gap-2">
          {[
            { id: 'light', label: 'Claro', icon: <Sun size={15} /> },
            { id: 'dark', label: 'Escuro', icon: <Moon size={15} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-black border transition-colors
                ${theme === t.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      {/* ACESSIBILIDADE */}
      <Section title="Acessibilidade">
        <Row icon={<Type size={15} />} label="Texto grande" desc="Aumenta o tamanho das fontes">
          <Toggle on={largeText} onChange={toggleLarge} />
        </Row>
        <Row icon={<Sparkles size={15} />} label="Reduzir animações" desc="Menos movimento na interface">
          <Toggle on={reduceMotion} onChange={toggleRM} />
        </Row>
        <Row icon={<Contrast size={15} />} label="Alto contraste" desc="Reforça leitura de textos e bordas">
          <Toggle on={highContrast} onChange={toggleHC} />
        </Row>
      </Section>

      {/* NOTIFICAÇÕES */}
      <Section title="Notificações">
        <Row icon={<Bell size={15} />} label="Lembretes" desc="Aviso para manter sua ofensiva ao abrir o app">
          <Toggle on={notifications} onChange={toggleNotif} />
        </Row>
        {notifMsg && (
          <p className="text-xs font-bold text-amber-600 mt-1">{notifMsg}</p>
        )}
      </Section>

      {/* CONTEÚDO AVANÇADO — Fase 6 do roadmap 3.0 */}
      <Section title="Conteúdo Avançado">
        <Row
          icon={<GraduationCap size={15} />}
          label="Tabuadas do 11 e 12"
          desc="Inclui fatores 11 e 12 nos modos padrão (além do currículo básico)"
        >
          <Toggle on={includeExtraTables} onChange={toggleExtraTables} />
        </Row>
        <p className="text-[11px] font-bold text-gray-400 mt-2 leading-snug">
          Ativa apenas a partir do Nível 3 dentro da partida — para iniciantes
          não atrapalhar. Daily/Weekly não são afetados (mantêm pool padrão para
          comparação justa).
        </p>
      </Section>

      {/* CONTA */}
      <Section title="Conta">
        <div className="flex items-center gap-3 py-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-2xl shrink-0">
            {level.badge}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 leading-tight truncate">{level.name}</p>
            <p className="text-xs text-gray-400 font-semibold truncate">
              {level.title} · {qi.char.emoji} {qi.char.name}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 mb-3">
          {[
            { label: 'XP', value: data.xp || 0 },
            { label: 'QI', value: qi.qi },
            { label: 'Moedas', value: data.coins || 0 },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-gray-50 border border-gray-100 p-2 text-center">
              <p className="text-base font-black text-gray-900">{s.value}</p>
              <p className="text-[11px] font-bold text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {user ? (
          <>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 mb-3">
              <Cloud size={13} className={cloudSyncing ? 'animate-pulse' : ''} />
              {cloudSyncing ? 'Sincronizando...' : `Conectado: ${user.email}`}
            </div>
            <Button variant="secondary" onClick={signOut} className="w-full">
              <LogOut size={16} />
              Sair da conta
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-semibold mb-3">
              Entre para sincronizar seu progresso na nuvem entre dispositivos.
            </p>
            <Button variant="secondary" onClick={() => onNavigate('auth')} className="w-full">
              <LogIn size={16} />
              Entrar / Criar conta
            </Button>
          </>
        )}
      </Section>

      {/* ZONA DE PERIGO */}
      <Section title="Zona de Perigo">
        <p className="text-xs text-gray-400 font-semibold mb-3">
          Apaga todo o progresso local e na nuvem (XP, conquistas, recordes, moedas). Irreversível.
        </p>
        <ResetButton onReset={handleReset} hasCloud={!!user} />
      </Section>

      {/* SOBRE */}
      <div className="text-center text-xs text-gray-400 font-semibold">
        Tabuada Rush · v3.1
      </div>

      <Button variant="secondary" onClick={onBack} className="w-full">
        <ArrowLeft size={16} />
        Voltar ao Menu
      </Button>
    </motion.div>
  );
}
