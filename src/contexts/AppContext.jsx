import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage } from '../lib/storage';
import { applyStreakDecay } from '../utils';
import { useAuth } from './AuthContext';
import { loadCloudData, saveCloudData } from '../services/sync';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  // Ao iniciar, aplica o reset de ofensiva (dia perdido / virada de ano) e persiste.
  const [data, setData] = useState(() => {
    const decayed = applyStreakDecay(storage.get());
    storage.set(decayed);
    return decayed;
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
        storage.set(decayed);
        setData(decayed);
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
