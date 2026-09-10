import {
  ModalId,
  ThemeComponent,
  type ModalId as ModalIdType,
  type ThemeComponent as ThemeComponentType
} from '../constants/enums';
import type { ThemeTokenOverrides } from './tokens';

/**
 * Per-component theme overrides.
 * Fill entries later to restyle a specific modal/surface without touching global tokens.
 *
 * Example:
 *   [ModalId.Tag]: { [ThemeToken.Primary]: '#0ea5e9', [ThemeToken.BgModal]: '#0b1220' }
 */
export const themeOverrides: Partial<Record<ThemeComponentKey, ThemeTokenOverrides>> = {
  [ModalId.Tag]: {},
  [ModalId.Project]: {},
  [ModalId.People]: {},
  [ModalId.CommandPalette]: {},
  [ModalId.TaskDetail]: {},
  [ModalId.NoteDetail]: {},
  [ThemeComponent.AnalyticsView]: {},
  [ThemeComponent.ListView]: {},
  [ThemeComponent.KanbanView]: {},
  [ThemeComponent.EisenhowerView]: {},
  [ThemeComponent.DescriptionEditor]: {},
  [ThemeComponent.Header]: {},
  [ThemeComponent.MobileBottomNav]: {},
  [ThemeComponent.NotesView]: {},
  [ThemeComponent.PomodoroWidget]: {},
  [ThemeComponent.ReminderToast]: {},
  [ThemeComponent.Sidebar]: {},
  [ThemeComponent.TaskInput]: {},
  [ThemeComponent.TaskItem]: {},
  [ThemeComponent.NoteCard]: {}
};

export type ThemeComponentKey = ModalIdType | ThemeComponentType;
