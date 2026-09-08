import { useCallback, useEffect, useState } from 'react';

/**
 * Verwaltet das Farbschema (dark = Standard / light).
 * Der Startwert kommt aus dem Inline-Script in index.html (kein Aufblitzen).
 */
export function useTheme() {
  const [theme, setTheme] = useState(() =>
    document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('eb-theme', theme);
    } catch (e) {
      /* localStorage nicht verfügbar – ignorieren */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'light' ? '#FBF9F4' : '#0A0A0B');
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggle };
}
