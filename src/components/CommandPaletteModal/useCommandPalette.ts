import { useEffect, useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import type { Task, ViewMode } from '../../types/todo';

export function useCommandPalette() {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    projects,
    setEditingTask,
    setViewMode,
    setFilter,
    theme,
    setTheme,
    openCreateProjectModal,
    openTagModal
  } = useTodo();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const matchedTasks = query.trim()
    ? tasks.filter(
        task =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : tasks.slice(0, 5);

  const matchedProjects = query.trim()
    ? projects.filter(project => project.name.toLowerCase().includes(query.toLowerCase()))
    : projects;

  const close = () => {
    setQuery('');
    setCommandPaletteOpen(false);
  };

  const handleSelectTask = (task: Task) => {
    setEditingTask(task);
    close();
  };

  const handleSelectView = (mode: ViewMode) => {
    setViewMode(mode);
    close();
  };

  const handleSelectProject = (projectId: string) => {
    const targetProj = projects.find(project => project.id === projectId);
    if (targetProj?.defaultView) {
      setViewMode(targetProj.defaultView);
    }
    setFilter({ projectId, smartFilter: 'all' });
    close();
  };

  const handleCreateProject = () => {
    close();
    openCreateProjectModal();
  };

  const handleManageTags = () => {
    close();
    openTagModal();
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    close();
  };

  return {
    open: commandPaletteOpen,
    close,
    query,
    setQuery,
    matchedTasks,
    matchedProjects,
    theme,
    handleSelectTask,
    handleSelectView,
    handleSelectProject,
    handleCreateProject,
    handleManageTags,
    handleToggleTheme
  };
}
