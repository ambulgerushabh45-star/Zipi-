import { useCallback, useRef, useState } from 'react';

export function useMegaMenu() {
  const [activeId, setActiveId] = useState(null);
  const timeoutRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const open = useCallback((id) => {
    clearTimer();
    setActiveId(id);
  }, [clearTimer]);

  const close = useCallback((immediate = false) => {
    clearTimer();
    if (immediate) {
      setActiveId(null);
    } else {
      timeoutRef.current = setTimeout(() => {
        setActiveId(null);
      }, 160);
    }
  }, [clearTimer]);

  const toggle = useCallback((id) => {
    clearTimer();
    setActiveId((prev) => (prev === id ? null : id));
  }, [clearTimer]);

  return { activeId, toggle, open, close, clearTimer };
}
