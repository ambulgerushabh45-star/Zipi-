import { useCallback, useEffect, useRef, useState } from 'react';

const OPEN_DELAY_MS = 120;
const CLOSE_DELAY_MS = 220;

export function useMegaMenu() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);

  const clearTimers = useCallback(() => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  const show = useCallback((id: string | null) => {
    activeRef.current = id;
    setActiveId(id);
  }, []);

  const hoverItem = useCallback(
    (id: string | null) => {
      clearTimers();
      if (id === null || activeRef.current !== null) {
        show(id);
        return;
      }
      openTimer.current = window.setTimeout(() => show(id), OPEN_DELAY_MS);
    },
    [clearTimers, show],
  );

  const leaveArea = useCallback(() => {
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => show(null), CLOSE_DELAY_MS);
  }, [show]);

  const enterArea = useCallback(() => {
    window.clearTimeout(closeTimer.current);
  }, []);

  const open = useCallback(
    (id: string) => {
      clearTimers();
      show(id);
    },
    [clearTimers, show],
  );

  const close = useCallback(() => {
    clearTimers();
    show(null);
  }, [clearTimers, show]);

  useEffect(() => clearTimers, [clearTimers]);

  useEffect(() => {
    if (activeId === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeId, close]);

  return { activeId, hoverItem, enterArea, leaveArea, open, close };
}
