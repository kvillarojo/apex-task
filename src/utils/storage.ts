import type { Task, Project, Assignee, TagDefinition, Note } from '../types/todo';

const TASKS_STORAGE_KEY = 'mytodo_tasks_v1';
const NOTES_STORAGE_KEY = 'mytodo_notes_v1';
const PROJECTS_STORAGE_KEY = 'mytodo_projects_v1';
const ASSIGNEES_STORAGE_KEY = 'mytodo_assignees_v1';
const THEME_STORAGE_KEY = 'mytodo_theme_v1';
const TAG_DEFINITIONS_STORAGE_KEY = 'mytodo_tag_definitions_v1';
const CUSTOM_TAGS_STORAGE_KEY = 'mytodo_custom_tags_v1';

export const DEFAULT_ASSIGNEES: Assignee[] = [];

export const DEFAULT_PROJECTS: Project[] = [
  { id: 'inbox', name: 'Inbox', color: '#3b82f6', icon: 'Inbox' }
];

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
    return [];
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
    return JSON.parse(raw);
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

