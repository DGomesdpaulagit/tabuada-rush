import { useState, useCallback } from 'react';
import { audio } from '../lib/audioManager';

export function useAudio() {
  const [enabled, setEnabledState] = useState(() => audio.enabled);

  const toggle = useCallback(() => {
    const next = !audio.enabled;
    audio.setEnabled(next);
    setEnabledState(next);
    audio.click();
  }, []);

  return { enabled, toggle, audio };
}
