import { createContext, useContext, useState, useCallback } from 'react';
import { storage } from '../lib/storage';

const Ctx = createContext(null);

export function AppProvider({ children }) {
  const [data, setData] = useState(() => storage.get());

  const update = useCallback((updater) => {
    const next = storage.update(updater);
    setData(next);
    return next;
  }, []);

  const refresh = useCallback(() => setData(storage.get()), []);

  return <Ctx.Provider value={{ data, update, refresh }}>{children}</Ctx.Provider>;
}

export const useApp = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
