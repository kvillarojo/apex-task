/** Runtime enums / const maps. Types live in `types/todo.ts` and stay in sync with these values. */

export const ThemeMode = {
  Dark: 'dark',
  Light: 'light'
} as const;
export type ThemeMode = (typeof ThemeMode)[keyof typeof ThemeMode];

export const ViewMode = {
  List: 'list',
  Kanban: 'kanban',
  Eisenhower: 'eisenhower',
  Calendar: 'calendar',
  Analytics: 'analytics',
  Notes: 'notes'
} as const;
export type ViewModeValue = (typeof ViewMode)[keyof typeof ViewMode];

export const Priority = {
  P1: 'p1',
  P2: 'p2',
  P3: 'p3',
  P4: 'p4'
} as const;
export type PriorityValue = (typeof Priority)[keyof typeof Priority];

export const TaskStatus = {
  Todo: 'todo',
  InProgress: 'in_progress',
  Done: 'done',
  Archived: 'archived'
} as const;
export type TaskStatusValue = (typeof TaskStatus)[keyof typeof TaskStatus];

export const RecurrenceRule = {
  None: 'none',
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly'
} as const;
export type RecurrenceRuleValue = (typeof RecurrenceRule)[keyof typeof RecurrenceRule];

export const SmartFilter = {
  Inbox: 'inbox',
  Today: 'today',
  Upcoming: 'upcoming',
  Important: 'important',
  Completed: 'completed',
  All: 'all'
} as const;
export type SmartFilterValue = (typeof SmartFilter)[keyof typeof SmartFilter];

export const ModalId = {
  Tag: 'TagModal',
  Project: 'ProjectModal',
  People: 'PeopleModal',
  CommandPalette: 'CommandPaletteModal',
  TaskDetail: 'TaskDetailModal',
  NoteDetail: 'NoteDetailModal'
} as const;
export type ModalId = (typeof ModalId)[keyof typeof ModalId];

export const ModalSize = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
  Xl: 'xl',
  Ticket: 'ticket'
} as const;
export type ModalSize = (typeof ModalSize)[keyof typeof ModalSize];

export const IconFilter = {
  All: 'all',
  Work: 'work',
  Tech: 'tech',
  Life: 'life'
} as const;
export type IconFilter = (typeof IconFilter)[keyof typeof IconFilter];

export const ReminderPreset = {
  Today: 'today',
  Tomorrow: 'tomorrow',
  Weekend: 'weekend',
  NextWeek: 'nextWeek',
  Clear: 'clear'
} as const;
export type ReminderPreset = (typeof ReminderPreset)[keyof typeof ReminderPreset];

export const PRIORITY_OPTIONS = [
  { value: Priority.P1, label: 'P1 - Urgent' },
  { value: Priority.P2, label: 'P2 - High' },
  { value: Priority.P3, label: 'P3 - Medium' },
  { value: Priority.P4, label: 'P4 - Low' }
] as const;

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.Done, label: 'Done' },
  { value: TaskStatus.Archived, label: 'Archived' }
] as const;

export const RECURRENCE_OPTIONS = [
  { value: RecurrenceRule.None, label: 'None' },
  { value: RecurrenceRule.Daily, label: 'Daily' },
  { value: RecurrenceRule.Weekly, label: 'Weekly' },
  { value: RecurrenceRule.Monthly, label: 'Monthly' }
] as const;

export const VIEW_MODE_OPTIONS = [
  { value: ViewMode.List, label: 'List View' },
  { value: ViewMode.Kanban, label: 'Kanban Board' },
  { value: ViewMode.Eisenhower, label: 'Eisenhower Matrix' },
  { value: ViewMode.Calendar, label: 'Calendar Grid' },
  { value: ViewMode.Analytics, label: 'Analytics Dashboard' }
] as const;
