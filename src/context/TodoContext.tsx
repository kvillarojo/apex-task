import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  Task,
  Project,
  Assignee,
  ViewMode,
  FilterState,
  SmartFilter,
  Priority,
  TaskStatus,
  PomodoroState,
  TagDefinition
} from '../types/todo';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadProjectsFromStorage,
  saveProjectsToStorage,
  loadThemePreference,
  saveThemePreference,
  loadTagDefinitionsFromStorage,
  saveTagDefinitionsToStorage,
  loadAssigneesFromStorage,
  saveAssigneesToStorage
} from '../utils/storage';
import { isToday, isUpcoming, getTodayString } from '../utils/dateUtils';
import { soundEffects } from '../utils/audio';

interface TodoContextType {
  tasks: Task[];
  projects: Project[];
  assignees: Assignee[];
  viewMode: ViewMode;
  filter: FilterState;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  pomodoro: PomodoroState;
  editingTask: Task | null;
  commandPaletteOpen: boolean;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  moveTaskStatus: (id: string, newStatus: TaskStatus) => void;

  // Subtask Actions
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Project Actions
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  projectModalOpen: boolean;
  editingProject: Project | null;
  openCreateProjectModal: () => void;
  openEditProjectModal: (project: Project) => void;
  closeProjectModal: () => void;

  // Tag Actions
  tagDefinitions: TagDefinition[];
  tagModalOpen: boolean;
  openTagModal: () => void;
  closeTagModal: () => void;
  addCustomTag: (tag: string, color?: string) => void;
  updateTag: (oldName: string, newName: string, color: string) => void;
  removeCustomTag: (tag: string) => void;
  getTagColor: (tagName: string) => string;
 
  // Assignee Actions
  addAssignee: (assignee: Omit<Assignee, 'id'>) => void;
  updateAssignee: (id: string, updates: Partial<Omit<Assignee, 'id'>>) => void;
  deleteAssignee: (id: string) => void;
  peopleModalOpen: boolean;
  openPeopleModal: () => void;
  closePeopleModal: () => void;

  // View & Filter Actions
  setViewMode: (mode: ViewMode) => void;
  setSmartFilter: (smart: SmartFilter) => void;
  setFilter: (updates: Partial<FilterState>) => void;
  resetFilter: () => void;

  // Preference Actions
  setTheme: (theme: 'dark' | 'light') => void;
  toggleSound: () => void;
  setEditingTask: (task: Task | null) => void;
  setCommandPaletteOpen: (open: boolean) => void;

  // Pomodoro Timer Actions
  startPomodoro: (taskId?: string) => void;
  pausePomodoro: () => void;
  resetPomodoro: () => void;
  setPomodoroMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  setPomodoroMaximized: (maximized: boolean) => void;
  setPomodoroVisible: (visible: boolean) => void;
  setCustomTimeLeft: (seconds: number) => void;
  adjustTimeLeft: (deltaSeconds: number) => void;
  setModeDuration: (mode: 'work' | 'shortBreak' | 'longBreak', minutes: number) => void;

  // Data Actions
  exportData: () => void;
  importData: (jsonString: string) => boolean;

  // Calculated Selectors
  filteredTasks: Task[];
  stats: {
    total: number;
    completedToday: number;
    completionRate: number;
    streakDays: number;
    p1Count: number;
  };
  allTags: string[];
}

const initialFilter: FilterState = {
  smartFilter: 'inbox',
  projectId: null,
  tag: null,
  priority: null,
  searchQuery: '',
  sortBy: 'dueDate',
  sortOrder: 'asc'
};

const initialPomodoro: PomodoroState = {
  activeTaskId: null,
  mode: 'work',
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  timeLeft: 25 * 60,
  isRunning: false,
  totalCompletedSessions: 0,
  isMaximized: false,
  isVisible: false
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(loadTasksFromStorage);
  const [projects, setProjects] = useState<Project[]>(loadProjectsFromStorage);
  const [assignees, setAssignees] = useState<Assignee[]>(loadAssigneesFromStorage);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filter, setFilterState] = useState<FilterState>(initialFilter);
  const [theme, setThemeState] = useState<'dark' | 'light'>(loadThemePreference);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.isEnabled());
  const [pomodoro, setPomodoro] = useState<PomodoroState>(initialPomodoro);
  const [tagDefinitions, setTagDefinitions] = useState<TagDefinition[]>(loadTagDefinitionsFromStorage);
  const [tagModalOpen, setTagModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState<boolean>(false);
  const [projectModalOpen, setProjectModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [peopleModalOpen, setPeopleModalOpen] = useState<boolean>(false);

  // Sync tasks to localStorage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Sync projects to localStorage
  useEffect(() => {
    saveProjectsToStorage(projects);
  }, [projects]);

  // Sync assignees to localStorage
  useEffect(() => {
    saveAssigneesToStorage(assignees);
  }, [assignees]);

  // Sync tag definitions to localStorage
  useEffect(() => {
    saveTagDefinitionsToStorage(tagDefinitions);
  }, [tagDefinitions]);

  // Theme application
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveThemePreference(theme);
  }, [theme]);

  // Pomodoro Interval Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (pomodoro.isRunning && pomodoro.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoro(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (pomodoro.isRunning && pomodoro.timeLeft === 0) {
      soundEffects.playTimerFinishSound();
      const isWork = pomodoro.mode === 'work';
      const nextMode = isWork ? 'shortBreak' : 'work';
      const nextDuration = nextMode === 'work' ? pomodoro.workDuration : pomodoro.shortBreakDuration;

      setPomodoro(prev => ({
        ...prev,
        mode: nextMode,
        timeLeft: nextDuration,
        isRunning: false,
        totalCompletedSessions: isWork ? prev.totalCompletedSessions + 1 : prev.totalCompletedSessions
      }));
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [pomodoro.isRunning, pomodoro.timeLeft, pomodoro.mode, pomodoro.activeTaskId]);

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    soundEffects.playClickSound();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    soundEffects.playClickSound();
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isNowCompleted = !t.completed;
          if (isNowCompleted) {
            soundEffects.playCompleteSound();
            // Trigger confetti for high priority tasks or completing all
            if (t.priority === 'p1' || t.priority === 'p2') {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
          }
          return {
            ...t,
            completed: isNowCompleted,
            status: isNowCompleted ? 'done' : 'todo',
            completedAt: isNowCompleted ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  const moveTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          const isDone = newStatus === 'done';
          if (isDone && !t.completed) {
            soundEffects.playCompleteSound();
          }
          return {
            ...t,
            status: newStatus,
            completed: isDone,
            completedAt: isDone ? new Date().toISOString() : t.completedAt,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  // Subtask Actions
  const addSubtask = (taskId: string, title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const newSubtask = {
            id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
            title: trimmed,
            completed: false
          };
          return {
            ...t,
            subtasks: [...t.subtasks, newSubtask],
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return {
            ...t,
            subtasks: updatedSubtasks,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            subtasks: t.subtasks.filter(st => st.id !== subtaskId),
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
  };

  // Project Actions
  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: 'proj-' + Date.now()
    };
    setProjects(prev => [...prev, newProject]);
    soundEffects.playClickSound();
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    soundEffects.playClickSound();
  };

  const deleteProject = (id: string) => {
    if (id === 'inbox') return; // Cannot delete Inbox
    setProjects(prev => prev.filter(p => p.id !== id));
    // Reassign tasks in this project to inbox
    setTasks(prev => prev.map(t => (t.projectId === id ? { ...t, projectId: 'inbox' } : t)));
    if (filter.projectId === id) {
      setFilterState(prev => ({ ...prev, projectId: null, smartFilter: 'inbox' }));
    }
  };

  const openCreateProjectModal = () => {
    setEditingProject(null);
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setEditingProject(project);
    setProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setEditingProject(null);
    setProjectModalOpen(false);
  };

  // Tag Modal Actions
  const openTagModal = () => {
    setTagModalOpen(true);
  };

  const closeTagModal = () => {
    setTagModalOpen(false);
  };

  const DEFAULT_TAG_PALETTE = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16', '#d946ef'
  ];

  const getTagColor = (tagName: string): string => {
    const clean = tagName.trim().toLowerCase().replace(/^#/, '');
    const found = tagDefinitions.find(t => t.name.toLowerCase() === clean);
    if (found?.color) return found.color;
    
    // Deterministic fallback color based on name hash
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % DEFAULT_TAG_PALETTE.length;
    return DEFAULT_TAG_PALETTE[idx];
  };

  // Tag Actions
  const addCustomTag = (tag: string, color?: string) => {
    const clean = tag.trim().toLowerCase().replace(/^#/, '');
    if (!clean) return;

    setTagDefinitions(prev => {
      const idx = prev.findIndex(t => t.name.toLowerCase() === clean);
      if (idx >= 0) {
        if (color) {
          const updated = [...prev];
          updated[idx] = { name: clean, color };
          return updated;
        }
        return prev;
      }
      return [...prev, { name: clean, color: color || '#6366f1' }];
    });
    soundEffects.playClickSound();
  };

  const updateTag = (oldName: string, newName: string, newColor: string) => {
    const cleanOld = oldName.trim().toLowerCase().replace(/^#/, '');
    const cleanNew = newName.trim().toLowerCase().replace(/^#/, '');
    if (!cleanNew) return;

    setTagDefinitions(prev => {
      const idx = prev.findIndex(t => t.name.toLowerCase() === cleanOld);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { name: cleanNew, color: newColor };
        return updated;
      }
      return [...prev, { name: cleanNew, color: newColor }];
    });

    if (cleanOld !== cleanNew) {
      setTasks(prev =>
        prev.map(task => ({
          ...task,
          tags: task.tags.map(t => (t === cleanOld ? cleanNew : t))
        }))
      );
      if (filter.tag === cleanOld) {
        setFilterState(prev => ({ ...prev, tag: cleanNew }));
      }
    }
    soundEffects.playClickSound();
  };

  const removeCustomTag = (tag: string) => {
    const clean = tag.trim().toLowerCase().replace(/^#/, '');
    if (!clean) return;

    setTagDefinitions(prev => prev.filter(t => t.name.toLowerCase() !== clean));
    setTasks(prev => prev.map(task => ({
      ...task,
      tags: task.tags.filter(existingTag => existingTag !== clean)
    })));

    if (filter.tag === clean) {
      setFilterState(prev => ({ ...prev, tag: null, projectId: null, smartFilter: 'all' }));
    }
    soundEffects.playClickSound();
  };

  // Assignee Actions
  const addAssignee = (assigneeData: Omit<Assignee, 'id'>) => {
    const newAssignee: Assignee = {
      ...assigneeData,
      id: 'user-' + Date.now()
    };
    setAssignees(prev => [...prev, newAssignee]);
    soundEffects.playClickSound();
  };

  const updateAssignee = (id: string, updates: Partial<Omit<Assignee, 'id'>>) => {
    setAssignees(prev => prev.map(assignee => assignee.id === id ? { ...assignee, ...updates } : assignee));
    soundEffects.playClickSound();
  };

  const deleteAssignee = (id: string) => {
    setAssignees(prev => prev.filter(assignee => assignee.id !== id));
    setTasks(prev => prev.map(task => task.assigneeId === id ? { ...task, assigneeId: undefined } : task));
    soundEffects.playClickSound();
  };

  // Filter Actions
  const setSmartFilter = (smart: SmartFilter) => {
    setFilterState(prev => ({
      ...prev,
      smartFilter: smart,
      projectId: null,
      tag: null
    }));
  };

  const setFilter = (updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  const resetFilter = () => {
    setFilterState(initialFilter);
  };

  // Preference Actions
  const setTheme = (newTheme: 'dark' | 'light') => {
    setThemeState(newTheme);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    soundEffects.setEnabled(next);
    setSoundEnabled(next);
  };

  // Pomodoro Actions
  const startPomodoro = (taskId?: string) => {
    setPomodoro(prev => ({
      ...prev,
      activeTaskId: taskId ?? prev.activeTaskId,
      isRunning: true,
      isMaximized: true,
      isVisible: true
    }));
  };

  const pausePomodoro = () => {
    setPomodoro(prev => ({ ...prev, isRunning: false }));
  };

  const setPomodoroMaximized = (maximized: boolean) => {
    setPomodoro(prev => ({ ...prev, isMaximized: maximized }));
  };

  const setPomodoroVisible = (visible: boolean) => {
    setPomodoro(prev => ({ ...prev, isVisible: visible }));
  };

  const resetPomodoro = () => {
    const duration =
      pomodoro.mode === 'work'
        ? pomodoro.workDuration
        : pomodoro.mode === 'shortBreak'
        ? pomodoro.shortBreakDuration
        : pomodoro.longBreakDuration;
    setPomodoro(prev => ({ ...prev, isRunning: false, timeLeft: duration }));
  };

  const setPomodoroMode = (mode: 'work' | 'shortBreak' | 'longBreak') => {
    const duration =
      mode === 'work'
        ? pomodoro.workDuration
        : mode === 'shortBreak'
        ? pomodoro.shortBreakDuration
        : pomodoro.longBreakDuration;
    setPomodoro(prev => ({ ...prev, mode, timeLeft: duration, isRunning: false }));
  };

  const setCustomTimeLeft = (seconds: number) => {
    const valid = Math.max(0, Math.min(86400, seconds));
    setPomodoro(prev => ({ ...prev, timeLeft: valid }));
  };

  const adjustTimeLeft = (deltaSeconds: number) => {
    setPomodoro(prev => ({
      ...prev,
      timeLeft: Math.max(0, prev.timeLeft + deltaSeconds)
    }));
  };

  const setModeDuration = (mode: 'work' | 'shortBreak' | 'longBreak', minutes: number) => {
    const durationInSeconds = Math.max(1, Math.min(180, minutes)) * 60;
    setPomodoro(prev => {
      const isCurrentMode = prev.mode === mode;
      return {
        ...prev,
        workDuration: mode === 'work' ? durationInSeconds : prev.workDuration,
        shortBreakDuration: mode === 'shortBreak' ? durationInSeconds : prev.shortBreakDuration,
        longBreakDuration: mode === 'longBreak' ? durationInSeconds : prev.longBreakDuration,
        timeLeft: isCurrentMode && !prev.isRunning ? durationInSeconds : prev.timeLeft
      };
    });
  };

  // Data Actions
  const exportData = () => {
    const data = JSON.stringify(
      {
        version: 2,
        exportedAt: new Date().toISOString(),
        tasks,
        projects,
        mytodo_assignees_v1: assignees,
        tagDefinitions
      },
      null,
      2
    );
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${getTodayString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return false;
      }

      const hasImportableData =
        Array.isArray(parsed.tasks) ||
        Array.isArray(parsed.projects) ||
        Array.isArray(parsed.mytodo_assignees_v1) ||
        Array.isArray(parsed.assignees) ||
        Array.isArray(parsed.tagDefinitions);

      if (!hasImportableData) {
        return false;
      }

      if (Array.isArray(parsed.tasks)) {
        setTasks(parsed.tasks);
      }
      if (Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
      }
      const importedAssignees = Array.isArray(parsed.mytodo_assignees_v1)
        ? parsed.mytodo_assignees_v1
        : parsed.assignees;
      if (Array.isArray(importedAssignees)) {
        setAssignees(importedAssignees);
      }
      if (Array.isArray(parsed.tagDefinitions)) {
        setTagDefinitions(parsed.tagDefinitions);
      }
      return true;
    } catch {
      return false;
    }
  };

  // Extract All Unique Tags (from tasks + defined tags)
  const allTags = Array.from(new Set([...tagDefinitions.map(t => t.name), ...tasks.flatMap(t => t.tags)])).sort();

  // Filter Tasks
  const filteredTasks = tasks.filter(task => {
    // Search Query
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTags = task.tags.some(tag => tag.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags) return false;
    }

    // Specific Project Filter
    if (filter.projectId && task.projectId !== filter.projectId) {
      return false;
    }

    // Tag Filter
    if (filter.tag && !task.tags.includes(filter.tag)) {
      return false;
    }

    // Priority Filter
    if (filter.priority && task.priority !== filter.priority) {
      return false;
    }

    // Smart View Filter (only if specific project/tag is not overriding)
    if (!filter.projectId && !filter.tag) {
      switch (filter.smartFilter) {
        case 'inbox':
          return task.projectId === 'inbox' && !task.completed;
        case 'today':
          return isToday(task.dueDate) && !task.completed;
        case 'upcoming':
          return isUpcoming(task.dueDate) && !task.completed;
        case 'important':
          return (task.priority === 'p1' || task.priority === 'p2') && !task.completed;
        case 'completed':
          return task.completed;
        case 'all':
        default:
          return true;
      }
    }

    return true;
  }).sort((a, b) => {
    const order = filter.sortOrder === 'asc' ? 1 : -1;
    if (filter.sortBy === 'priority') {
      const map: Record<Priority, number> = { p1: 1, p2: 2, p3: 3, p4: 4 };
      return (map[a.priority] - map[b.priority]) * order;
    } else if (filter.sortBy === 'dueDate') {
      const dateA = a.dueDate || '9999-99-99';
      const dateB = b.dueDate || '9999-99-99';
      return dateA.localeCompare(dateB) * order;
    } else if (filter.sortBy === 'title') {
      return a.title.localeCompare(b.title) * order;
    } else {
      return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * order;
    }
  });

  // Calculate Stats
  const todayStr = getTodayString();
  const completedTodayCount = tasks.filter(t => t.completed && t.completedAt && t.completedAt.startsWith(todayStr)).length;
  const totalTasks = tasks.length;
  const totalCompleted = tasks.filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
  const p1Count = tasks.filter(t => !t.completed && (t.priority === 'p1' || t.priority === 'p2')).length;

  const stats = {
    total: totalTasks,
    completedToday: completedTodayCount,
    completionRate,
    streakDays: 5, // Active habit streak
    p1Count
  };

  return (
    <TodoContext.Provider
      value={{
        tasks,
        projects,
        assignees,
        peopleModalOpen,
        viewMode,
        filter,
        theme,
        soundEnabled,
        pomodoro,
        editingTask,
        commandPaletteOpen,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        moveTaskStatus,
        addSubtask,
        toggleSubtask,
        deleteSubtask,
        addProject,
        updateProject,
        deleteProject,
        projectModalOpen,
        editingProject,
        openCreateProjectModal,
        openEditProjectModal,
        closeProjectModal,
        tagDefinitions,
        tagModalOpen,
        openTagModal,
        closeTagModal,
        addCustomTag,
        updateTag,
        removeCustomTag,
        getTagColor,
        addAssignee,
        updateAssignee,
        deleteAssignee,
        openPeopleModal: () => setPeopleModalOpen(true),
        closePeopleModal: () => setPeopleModalOpen(false),
        setViewMode,
        setSmartFilter,
        setFilter,
        resetFilter,
        setTheme,
        toggleSound,
        setEditingTask,
        setCommandPaletteOpen,
        startPomodoro,
        pausePomodoro,
        resetPomodoro,
        setPomodoroMode,
        setPomodoroMaximized,
        setPomodoroVisible,
        setCustomTimeLeft,
        adjustTimeLeft,
        setModeDuration,
        exportData,
        importData,
        filteredTasks,
        stats,
        allTags
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return ctx;
};
