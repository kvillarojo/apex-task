/** CSS custom property names used by the app theme. */
export const ThemeToken = {
  BgApp: '--bg-app',
  BgSidebar: '--bg-sidebar',
  BgCard: '--bg-card',
  BgCardHover: '--bg-card-hover',
  BgInput: '--bg-input',
  BgModal: '--bg-modal',
  BorderColor: '--border-color',
  BorderHighlight: '--border-highlight',
  TextPrimary: '--text-primary',
  TextSecondary: '--text-secondary',
  TextMuted: '--text-muted',
  Primary: '--primary',
  PrimaryHover: '--primary-hover',
  PrimaryLight: '--primary-light',
  AccentGlow: '--accent-glow',
  GlassBg: '--glass-bg',
  GlassBorder: '--glass-border',
  ShadowLg: '--shadow-lg'
} as const;

export type ThemeToken = (typeof ThemeToken)[keyof typeof ThemeToken];

export type ThemeTokenOverrides = Partial<Record<ThemeToken, string>>;
