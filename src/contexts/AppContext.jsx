import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../lib/storage';
import { applyStreakDecay } from '../utils';
import { resolveChallenges } from '../utils/missions';
import { checkInactivityRelegation } from '../utils/leagues';
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
  // [v6.0 · Bloco 4, refinado pós-reset] PROMOÇÃO de liga nunca é checada
  // aqui — só em App.jsx handleGameEnd (depois de uma partida de verdade).
  // REBAIXAMENTO por inatividade agora É checado no load, mas com grace
  // period (`checkInactivityRelegation`, ver utils/leagues.js) — é a versão
  // segura da checagem que causava o "ping-pong" documentado em D023
  // (jogador recém-promovido com 0 XP sendo rebaixado de volta na hora, sem
  // nunca ter jogado na liga nova). Com o grace period, só rebaixa depois de
  // alguns dias de fato parado — "não praticar" volta a custar posição, como
  // o áudio original pedia, sem reintroduzir o bug.
  const [data, setData] = useState(() => {
    const decayed = applyStreakDecay(storage.get());
    const resolved = applyChallengeResolutions(decayed);
    const leagueChecked = checkInactivityRelegation(resolved).data;
    // [v6.0 · Bloco 6] "No jogo desde..." no Perfil — setado uma única vez,
    // no primeiro load que não tem `createdAt` ainda (retroativo pra quem
    // já jogava antes deste bloco: a partir de agora, não desde sempre).
    const withCreatedAt = leagueChecked.createdAt
      ? leagueChecked
      : { ...leagueChecked, createdAt: new Date().toISOString() };
    storage.set(withCreatedAt);
    return withCreatedAt;
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
        const leagueChecked = checkInactivityRelegation(resolved).data;
        storage.set(leagueChecked);
        setData(leagueChecked);
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
