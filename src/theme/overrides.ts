import { ModalId, type ModalId as ModalIdType } from '../constants/enums';
import type { ThemeTokenOverrides } from './tokens';

/**
 * Per-component theme overrides.
 * Fill entries later to restyle a specific modal/surface without touching global tokens.
 *
 * Example:
 *   [ModalId.Tag]: { [ThemeToken.Primary]: '#0ea5e9', [ThemeToken.BgModal]: '#0b1220' }
 */
export const themeOverrides: Partial<Record<ModalIdType, ThemeTokenOverrides>> = {
  [ModalId.Tag]: {},
  [ModalId.Project]: {},
  [ModalId.People]: {},
  [ModalId.CommandPalette]: {},
  [ModalId.TaskDetail]: {},
  [ModalId.NoteDetail]: {}
};

export type ThemeComponentKey = ModalIdType;
