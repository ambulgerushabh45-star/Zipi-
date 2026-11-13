import { useCallback, useState } from 'react';

export function useMegaMenu() {
  const [activeId, setActiveId] = useState(null);

  const toggle = useCallback((id) => {
    setActiveId((prev) => (prev === id ? null : id));
  }, []);

  const open = useCallback((id) => {
    setActiveId(id);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
  }, []);

  return { activeId, toggle, open, close };
}
