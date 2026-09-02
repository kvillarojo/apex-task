export type Priority = 'p1' | 'p2' | 'p3' | 'p4';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';

export type RecurrenceRule = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Assignee {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  role?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO string
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  recurring: RecurrenceRule;
  projectId: string;
  assigneeId?: string;
  tags: string[];
  subtasks: Subtask[];
  estimatedMinutes?: number;
  actualMinutes?: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  defaultView?: ViewMode;
}

export interface TagDefinition {
  name: string;
  color: string;
}

export interface CustomTags {
  tag: string;
}

export type ViewMode = 'list' | 'kanban' | 'eisenhower' | 'calendar' | 'analytics';

export type SmartFilter = 'inbox' | 'today' | 'upcoming' | 'important' | 'completed' | 'all';

export interface FilterState {
  smartFilter: SmartFilter;
  projectId: string | null;
  tag: string | null;
  priority: Priority | null;
  searchQuery: string;
  sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface PomodoroState {
  activeTaskId: string | null;
  mode: 'work' | 'shortBreak' | 'longBreak';
  workDuration: number; // in seconds (default 25*60)
  shortBreakDuration: number; // in seconds (default 5*60)
  longBreakDuration: number; // in seconds (default 15*60)
  timeLeft: number; // in seconds
  isRunning: boolean;
  totalCompletedSessions: number;
  isMaximized: boolean;
  isVisible: boolean;
}

