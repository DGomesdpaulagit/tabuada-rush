import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../lib/storage';
import { applyStreakDecay } from '../utils';
import { resolveChallenges } from '../utils/missions';
import { useAuth } from './AuthContext';
import { loadCloudData, saveCloudData } from '../services/sync';

const Ctx = createContext(null);

// [v6.0 · Bloco 5] Resolve desafios mensais vencidos (prazo passou) e aplica
// a moeda (ganho ou penalidade) — seguro rodar no load, diferente da liga
// (ver applyLeaguePromotion): resolução é um evento TERMINAL (marca
// `resolved: true` e nunca reverte), não existe risco de "ping-pong".
function applyChallengeResolutions(data) {
  const { missionsData, resolutions } = resolveChallenges(data.missionsData);
  if (!resolutions.length) return data;
  const coinDelta = resolutions.reduce(
    (sum, r) => sum + (r.won ? r.challenge.reward : -r.challenge.penalty),
    0
  );
  return { ...data, missionsData, coins: (data.coins || 0) + coinDelta };
}

export function AppProvider({ children }) {
  const { user } = useAuth();
  // Ao iniciar, aplica o reset de ofensiva (dia perdido / virada de ano) e persiste.
  // [v6.0 · Bloco 4] Promoção/rebaixamento de liga NÃO é checado aqui de
  // propósito — só em App.jsx handleGameEnd (depois de uma partida de
  // verdade). Cheguei a checar no load também, mas isso criava um "ping-pong":
  // jogador é promovido, entra na liga nova com 0 XP (correto, ninguém chega
  // com XP emprestado), fecha o app, abre de novo sem ter jogado nada — 0 XP
  // ainda é o último lugar, cai relegado na hora, sem nunca ter tido a chance
  // de jogar na liga nova. Só reavaliar no fim de partida garante que o
  // jogador sempre teve pelo menos 1 chance de pontuar antes de qualquer
  // rebaixamento.
  const [data, setData] = useState(() => {
    const decayed = applyStreakDecay(storage.get());
    const resolved = applyChallengeResolutions(decayed);
    storage.set(resolved);
    return resolved;
  });
  const [cloudSyncing, setCloudSyncing] = useState(false);

  // When user logs in: load cloud data or migrate local → cloud
  useEffect(() => {
    if (!user) return;
    setCloudSyncing(true);
    loadCloudData(user.id).then((cloudData) => {
      setCloudSyncing(false);
      if (cloudData && Object.keys(cloudData).length > 0) {
        const decayed = applyStreakDecay(cloudData); // reset de ofensiva também no login
        const resolved = applyChallengeResolutions(decayed);
        storage.set(resolved);
        setData(resolved);
      } else {
        // First login: push localStorage data to cloud
        const localData = storage.get();
        saveCloudData(user.id, localData);
      }
    });
  }, [user?.id]);

  const update = useCallback(
    (updater) => {
      const next = storage.update(updater);
      setData(next);
      if (user) saveCloudData(user.id, next);
      return next;
    },
    [user]
  );

  const refresh = useCallback(() => setData(storage.get()), []);

  return (
    <Ctx.Provider value={{ data, update, refresh, cloudSyncing }}>
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
