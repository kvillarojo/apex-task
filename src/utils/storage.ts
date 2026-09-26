import type { Task, Project, Assignee, TagDefinition, Note } from '../types/todo';

const TASKS_STORAGE_KEY = 'mytodo_tasks_v1';
const NOTES_STORAGE_KEY = 'mytodo_notes_v1';
const PROJECTS_STORAGE_KEY = 'mytodo_projects_v1';
const ASSIGNEES_STORAGE_KEY = 'mytodo_assignees_v1';
const THEME_STORAGE_KEY = 'mytodo_theme_v1';
const TAG_DEFINITIONS_STORAGE_KEY = 'mytodo_tag_definitions_v1';
const CUSTOM_TAGS_STORAGE_KEY = 'mytodo_custom_tags_v1';

import { getTodayString, addDays } from './dateUtils';

export const DEFAULT_ASSIGNEES: Assignee[] = [];

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', color: '#3b82f6', icon: 'Inbox', scope: 'shared' },
  { id: 'proj_alpha', name: 'Project Alpha', color: '#8b5cf6', icon: 'Layers', defaultView: 'timeline', scope: 'shared' },
  { id: 'proj_beta', name: 'Project Beta', color: '#06b6d4', icon: 'Briefcase', defaultView: 'timeline', scope: 'shared' }
];

export function getDefaultTasks(): Task[] {
  const today = getTodayString();
  return [
    {
      id: 'demo-task-1',
      title: 'Dev and QA',
      description: '<p>Core feature development, unit tests, and QA test execution.</p>',
      completed: false,
      status: 'in_progress',
      priority: 'p1',
      startDate: today,
      dueDate: addDays(today, 6),
      recurring: 'none',
      projectId: 'proj_alpha',
      tags: ['release', 'dev', 'qa'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-2',
      title: 'Regression testing',
      description: '<p>Full end-to-end regression test suite.</p>',
      completed: false,
      status: 'todo',
      priority: 'p2',
      startDate: addDays(today, 5),
      dueDate: addDays(today, 10),
      recurring: 'none',
      projectId: 'proj_alpha',
      tags: ['release', 'qa'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-3',
      title: 'CAB Approval',
      description: '<p>Change Advisory Board submission and review.</p>',
      completed: false,
      status: 'todo',
      priority: 'p2',
      startDate: addDays(today, 11),
      dueDate: addDays(today, 12),
      recurring: 'none',
      projectId: 'proj_alpha',
      tags: ['release', 'cab'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-4',
      title: 'Go Live & Rollout',
      description: '<p>Production deployment and post-release verification.</p>',
      completed: false,
      status: 'todo',
      priority: 'p1',
      startDate: addDays(today, 13),
      dueDate: addDays(today, 15),
      recurring: 'none',
      projectId: 'proj_alpha',
      tags: ['release', 'prod'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Project Beta timeline tasks (overlapping with Project Alpha)
    {
      id: 'demo-task-5',
      title: 'Dev and QA',
      description: '<p>Backend API refactoring and integration testing.</p>',
      completed: false,
      status: 'in_progress',
      priority: 'p2',
      startDate: addDays(today, 3),
      dueDate: addDays(today, 9),
      recurring: 'none',
      projectId: 'proj_beta',
      tags: ['backend', 'qa'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-6',
      title: 'Regression testing',
      description: '<p>Regression verification on staging environment.</p>',
      completed: false,
      status: 'todo',
      priority: 'p2',
      startDate: addDays(today, 8),
      dueDate: addDays(today, 13),
      recurring: 'none',
      projectId: 'proj_beta',
      tags: ['testing'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-7',
      title: 'CAB',
      description: '<p>Submit change request to CAB.</p>',
      completed: false,
      status: 'todo',
      priority: 'p3',
      startDate: addDays(today, 14),
      dueDate: addDays(today, 15),
      recurring: 'none',
      projectId: 'proj_beta',
      tags: ['cab'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-task-8',
      title: 'Go Live',
      description: '<p>Global launch and monitoring.</p>',
      completed: false,
      status: 'todo',
      priority: 'p1',
      startDate: addDays(today, 16),
      dueDate: addDays(today, 18),
      recurring: 'none',
      projectId: 'proj_beta',
      tags: ['launch'],
      subtasks: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      const defaults = getDefaultTasks();
      saveTasksToStorage(defaults);
      return defaults;
    }
    const parsed: Task[] = JSON.parse(raw);
    if (parsed.length === 0) {
      const defaults = getDefaultTasks();
      saveTasksToStorage(defaults);
      return defaults;
    }
    // Migration guard: ensure all tasks have a comments array (added in v2)
    return parsed.map(t => ({ ...t, comments: t.comments ?? [] }));
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return getDefaultTasks();
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks to localStorage', err);
  }
}

export function loadProjectsFromStorage(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) {
      saveProjectsToStorage(DEFAULT_PROJECTS);
      return DEFAULT_PROJECTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((p: Project) => {
        if ((p.id === 'proj_alpha' || p.id === 'proj_beta') && p.scope === 'tasks') {
          return { ...p, scope: 'shared' };
        }
        return p;
      });
    }
    return DEFAULT_PROJECTS;
  } catch (err) {
    console.error('Failed to load projects from localStorage', err);
    return DEFAULT_PROJECTS;
  }
}

export function saveProjectsToStorage(projects: Project[]): void {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage', err);
  }
}

export function loadThemePreference(): 'dark' | 'light' {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'; // Default to sleek dark
}

export function saveThemePreference(theme: 'dark' | 'light'): void {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function loadTagDefinitionsFromStorage(): TagDefinition[] {
  try {
    const raw = localStorage.getItem(TAG_DEFINITIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    const legacy = localStorage.getItem(CUSTOM_TAGS_STORAGE_KEY);
    if (legacy) {
      const parsedLegacy = JSON.parse(legacy);
      if (Array.isArray(parsedLegacy)) {
        return parsedLegacy.map((tag: string) => ({ name: tag, color: '#6366f1' }));
      }
    }
    return [];
  } catch {
    return [];
  }
}

export function saveTagDefinitionsToStorage(tagDefs: TagDefinition[]): void {
  try {
    localStorage.setItem(TAG_DEFINITIONS_STORAGE_KEY, JSON.stringify(tagDefs));
  } catch (err) {
    console.error('Failed to save tag definitions to localStorage', err);
  }
}

export function loadCustomTagsFromStorage(): string[] {
  try {
    const tagDefs = loadTagDefinitionsFromStorage();
    if (tagDefs.length > 0) {
      return tagDefs.map(t => t.name);
    }
    const raw = localStorage.getItem(CUSTOM_TAGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function loadAssigneesFromStorage(): Assignee[] {
  try {
    const raw = localStorage.getItem(ASSIGNEES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load assignees from localStorage', err);
    return [];
  }
}

export function saveCustomTagsToStorage(customTags: string[]): void {
  try {
    localStorage.setItem(CUSTOM_TAGS_STORAGE_KEY, JSON.stringify(customTags));
  } catch (err) {
    console.error('Failed to save custom tags to localStorage', err);
  }
}

export function saveAssigneesToStorage(assignees: Assignee[]): void {
  try {
    localStorage.setItem(ASSIGNEES_STORAGE_KEY, JSON.stringify(assignees));
  } catch (err) {
    console.error('Failed to save assignees to localStorage', err);
  }
}

export function loadNotesFromStorage(): Note[] {
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load notes from localStorage', err);
    return [];
  }
}

export function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage', err);
  }
}
