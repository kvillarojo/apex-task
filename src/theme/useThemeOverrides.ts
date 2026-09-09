import { useEffect } from 'react';
import { applyThemeOverrides } from './applyThemeOverrides';

/**
 * Ensures component-level theme override CSS is present.
 * Call once near the app root (e.g. inside TodoProvider consumers).
 */
export function useThemeOverrides(): void {
  useEffect(() => {
    applyThemeOverrides();
  }, []);
}
