import type { CSSProperties } from 'react';
import { themeOverrides, type ThemeComponentKey } from './overrides';
import type { ThemeTokenOverrides } from './tokens';

const STYLE_TAG_ID = 'apex-theme-component-overrides';

/** Convert override map into a React style object (CSS variables). */
export function overridesToStyle(overrides?: ThemeTokenOverrides): CSSProperties | undefined {
  if (!overrides) return undefined;
  const entries = Object.entries(overrides).filter(([, value]) => Boolean(value));
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as CSSProperties;
}

/** Props to spread onto a component root for theme override targeting. */
export function getThemeComponentProps(component: ThemeComponentKey): {
  'data-theme-component': ThemeComponentKey;
  style?: CSSProperties;
} {
  return {
    'data-theme-component': component,
    style: overridesToStyle(themeOverrides[component])
  };
}

/** Merge component override styles with additional inline styles. */
export function mergeThemeStyles(
  component: ThemeComponentKey,
  extra?: CSSProperties
): CSSProperties | undefined {
  const overrideStyle = overridesToStyle(themeOverrides[component]);
  if (!overrideStyle && !extra) return undefined;
  return { ...overrideStyle, ...extra };
}

function buildOverrideCss(): string {
  return (Object.entries(themeOverrides) as [ThemeComponentKey, ThemeTokenOverrides | undefined][])
    .map(([component, tokens]) => {
      if (!tokens) return '';
      const decls = Object.entries(tokens)
        .filter(([, value]) => Boolean(value))
        .map(([token, value]) => `  ${token}: ${value};`)
        .join('\n');
      if (!decls) return '';
      return `[data-theme-component="${component}"] {\n${decls}\n}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

/** Inject (or refresh) a global style tag for component-level theme overrides. */
export function applyThemeOverrides(): void {
  if (typeof document === 'undefined') return;

  const css = buildOverrideCss();
  let styleTag = document.getElementById(STYLE_TAG_ID) as HTMLStyleElement | null;

  if (!css) {
    styleTag?.remove();
    return;
  }

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = css;
}
