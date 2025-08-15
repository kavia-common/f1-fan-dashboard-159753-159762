import { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useSystemTheme - returns 'dark' or 'light' based on OS preference, updating on changes.
 */
export default function useSystemTheme() {
  const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  const [val, setVal] = useState(mq && mq.matches ? 'dark' : 'light');

  useEffect(() => {
    if (!mq) return;
    const handler = (e) => setVal(e.matches ? 'dark' : 'light');
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, [mq]);

  return val;
}
