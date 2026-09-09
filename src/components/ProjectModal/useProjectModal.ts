import { useEffect, useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { DEFAULT_ACCENT } from '../../constants/colors';
import { IconFilter, type IconFilter as IconFilterType } from '../../constants/enums';
import { filterProjectIcons, getProjectIcon } from '../../constants/projectIcons';
import type { ViewMode } from '../../types/todo';
import type { ProjectTemplate } from './projectTemplates.data';

export function useProjectModal() {
  const {
    projectModalOpen,
    editingProject,
    closeProjectModal,
    addProject,
    updateProject,
    deleteProject,
    viewMode
  } = useTodo();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DEFAULT_ACCENT);
  const [icon, setIcon] = useState('Folder');
  const [defaultView, setDefaultView] = useState<ViewMode>('list');
  const [iconFilter, setIconFilter] = useState<IconFilterType>(IconFilter.All);

  useEffect(() => {
    if (editingProject) {
      setName(editingProject.name);
      setDescription(editingProject.description || '');
      setColor(editingProject.color);
      setIcon(editingProject.icon || 'Folder');
      setDefaultView(editingProject.defaultView || 'list');
    } else {
      setName('');
      setDescription('');
      setColor(DEFAULT_ACCENT);
      setIcon('Folder');
      setDefaultView('list');
    }
  }, [editingProject, projectModalOpen]);

  const isEditing = Boolean(editingProject);
  const SelectedIcon = getProjectIcon(icon);
  const iconEntries = filterProjectIcons(iconFilter);

  const handleApplyTemplate = (tmpl: ProjectTemplate) => {
    setName(tmpl.name);
    setDescription(tmpl.description);
    setColor(tmpl.color);
    setIcon(tmpl.icon);
    setDefaultView(tmpl.defaultView);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    if (isEditing && editingProject) {
      updateProject(editingProject.id, {
        name: cleanName,
        description: description.trim() || undefined,
        color,
        icon,
        defaultView
      });
    } else {
      addProject({
        name: cleanName,
        description: description.trim() || undefined,
        color,
        icon,
        defaultView,
        scope: viewMode === 'notes' ? 'notes' : 'tasks'
      });
    }
    closeProjectModal();
  };

  const handleDelete = () => {
    if (!editingProject) return;
    if (confirm(`Are you sure you want to delete "${editingProject.name}"? Tasks will be moved to Inbox.`)) {
      deleteProject(editingProject.id);
      closeProjectModal();
    }
  };

  return {
    open: projectModalOpen,
    close: closeProjectModal,
    editingProject,
    isEditing,
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    icon,
    setIcon,
    defaultView,
    setDefaultView,
    iconFilter,
    setIconFilter,
    SelectedIcon,
    iconEntries,
    handleApplyTemplate,
    handleSubmit,
    handleDelete
  };
}
