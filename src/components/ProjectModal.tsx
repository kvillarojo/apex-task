import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Sparkles,
  Briefcase,
  Code,
  Terminal,
  Rocket,
  Target,
  Book,
  GraduationCap,
  Heart,
  Activity,
  Dumbbell,
  Compass,
  Plane,
  ShoppingBag,
  DollarSign,
  Palette,
  Folder,
  Star,
  Zap,
  Cpu,
  Coffee,
  Home,
  Music,
  Film,
  CheckCircle2,
  Inbox,
  Flame,
  Bookmark,
  Smile,
  Sun,
  Trophy,
  Wrench,
  Shield,
  Globe,
  Clock,
  MessageSquare,
  Layout,
  Check
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { ViewMode } from '../types/todo';

export const PROJECT_ICONS: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  // General & Folders
  Folder,
  Inbox,
  Star,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,

  // Work & Business
  Briefcase,
  Target,
  Rocket,
  DollarSign,
  Trophy,
  Shield,
  MessageSquare,

  // Tech & Dev
  Code,
  Terminal,
  Cpu,
  Zap,
  Globe,
  Wrench,

  // Learning & Personal
  Book,
  GraduationCap,
  Coffee,
  Home,
  Heart,
  Smile,

  // Fitness & Health
  Activity,
  Dumbbell,
  Flame,
  Sun,

  // Lifestyle & Travel
  Plane,
  Compass,
  ShoppingBag,
  Palette,
  Music,
  Film
};

export const COLOR_PALETTE = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Slate', value: '#64748b' }
];

interface ProjectTemplate {
  name: string;
  color: string;
  icon: string;
  description: string;
  defaultView: ViewMode;
}

const TEMPLATES: ProjectTemplate[] = [
  {
    name: 'Work Sprint',
    color: '#3b82f6',
    icon: 'Briefcase',
    description: 'Weekly goals, team syncs & sprint deliverables',
    defaultView: 'kanban'
  },
  {
    name: 'Dev Project',
    color: '#06b6d4',
    icon: 'Code',
    description: 'Software features, code reviews & releases',
    defaultView: 'kanban'
  },
  {
    name: 'Goals & Habits',
    color: '#f59e0b',
    icon: 'Target',
    description: 'High-impact milestones & personal aspirations',
    defaultView: 'eisenhower'
  },
  {
    name: 'Fitness & Health',
    color: '#10b981',
    icon: 'Activity',
    description: 'Workouts, nutrition & healthy habits',
    defaultView: 'calendar'
  },
  {
    name: 'Study & Notes',
    color: '#8b5cf6',
    icon: 'GraduationCap',
    description: 'Coursework, readings & research topics',
    defaultView: 'list'
  },
  {
    name: 'Trip Planner',
    color: '#f97316',
    icon: 'Plane',
    description: 'Itineraries, bookings & packing checklists',
    defaultView: 'calendar'
  },
  {
    name: 'Design Lab',
    color: '#ec4899',
    icon: 'Palette',
    description: 'UI/UX mockups, brand assets & creative ideas',
    defaultView: 'kanban'
  },
  {
    name: 'Personal & Errands',
    color: '#64748b',
    icon: 'ShoppingBag',
    description: 'Daily errands, groceries & home maintenance',
    defaultView: 'list'
  }
];

export const ProjectModal: React.FC = () => {
  const {
    projectModalOpen,
    editingProject,
    closeProjectModal,
    addProject,
    updateProject,
    deleteProject
  } = useTodo();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Folder');
  const [defaultView, setDefaultView] = useState<ViewMode>('list');
  const [iconFilter, setIconFilter] = useState<'all' | 'work' | 'tech' | 'life'>('all');

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
      setColor('#6366f1');
      setIcon('Folder');
      setDefaultView('list');
    }
  }, [editingProject, projectModalOpen]);

  if (!projectModalOpen) return null;

  const isEditing = Boolean(editingProject);

  const handleApplyTemplate = (tmpl: ProjectTemplate) => {
    setName(tmpl.name);
    setDescription(tmpl.description);
    setColor(tmpl.color);
    setIcon(tmpl.icon);
    setDefaultView(tmpl.defaultView);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        defaultView
      });
    }
    closeProjectModal();
  };

  const handleDelete = () => {
    if (editingProject) {
      if (confirm(`Are you sure you want to delete "${editingProject.name}"? Tasks will be moved to Inbox.`)) {
        deleteProject(editingProject.id);
        closeProjectModal();
      }
    }
  };

  // Resolve Icon Component for preview
  const SelectedIconComponent = PROJECT_ICONS[icon] || Folder;

  // Filter icons based on category tab
  const iconEntries = Object.entries(PROJECT_ICONS).filter(([iconName]) => {
    if (iconFilter === 'all') return true;
    if (iconFilter === 'work') return ['Briefcase', 'Target', 'Rocket', 'DollarSign', 'Trophy', 'Shield', 'MessageSquare'].includes(iconName);
    if (iconFilter === 'tech') return ['Code', 'Terminal', 'Cpu', 'Zap', 'Globe', 'Wrench'].includes(iconName);
    if (iconFilter === 'life') return ['Book', 'GraduationCap', 'Coffee', 'Home', 'Heart', 'Smile', 'Activity', 'Dumbbell', 'Flame', 'Sun', 'Plane', 'Compass', 'ShoppingBag', 'Palette', 'Music', 'Film'].includes(iconName);
    return true;
  });

  return (
    <div className="modal-overlay" onClick={closeProjectModal}>
      <div
        className="modal-card project-modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '640px',
          maxWidth: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div className="project-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: `${color}22`,
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${color}33`
              }}
            >
              <SelectedIconComponent size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isEditing ? 'Update project settings and branding' : 'Organize your tasks with custom colors, icons & views'}
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={closeProjectModal} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="project-modal-body">
          {/* Quick Starter Templates (Only shown when creating new project) */}
          {!isEditing && (
            <div className="project-modal-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sparkles size={14} color="var(--primary)" />
                <span className="project-section-label">Quick Starter Templates</span>
              </div>
              <div className="project-templates-scroll">
                {TEMPLATES.map(tmpl => {
                  const TmplIcon = PROJECT_ICONS[tmpl.icon] || Folder;
                  return (
                    <button
                      key={tmpl.name}
                      type="button"
                      className="project-template-pill"
                      onClick={() => handleApplyTemplate(tmpl)}
                    >
                      <span style={{ color: tmpl.color, display: 'flex' }}>
                        <TmplIcon size={14} />
                      </span>
                      <span>{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Preview Card */}
          <div className="project-modal-section">
            <span className="project-section-label">Live Preview</span>
            <div className="project-live-preview-card" style={{ borderLeft: `4px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="project-preview-icon-box"
                  style={{ backgroundColor: `${color}25`, color: color }}
                >
                  <SelectedIconComponent size={20} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {name.trim() || 'Untitled Project'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: `${color}20`,
                        color: color,
                        fontWeight: 600
                      }}
                    >
                      {defaultView.toUpperCase()} VIEW
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {description.trim() || 'No description provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details (Name & Description) */}
          <div className="project-modal-section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="project-input-label">PROJECT NAME *</label>
                <input
                  type="text"
                  placeholder="e.g., Marketing Campaign, Product Launch..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="project-text-input"
                  maxLength={50}
                  autoFocus
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label className="project-input-label">DESCRIPTION / OBJECTIVE</label>
                  <input
                    type="text"
                    placeholder="Short goal or summary..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="project-text-input"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="project-input-label">DEFAULT VIEW MODE</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={defaultView}
                      onChange={e => setDefaultView(e.target.value as ViewMode)}
                      className="project-text-input"
                      style={{ cursor: 'pointer', appearance: 'none', paddingRight: '28px' }}
                    >
                      <option value="list">List View</option>
                      <option value="kanban">Kanban Board</option>
                      <option value="eisenhower">Eisenhower Matrix</option>
                      <option value="calendar">Calendar Grid</option>
                      <option value="analytics">Analytics Dashboard</option>
                    </select>
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-muted)', display: 'flex' }}>
                      <Layout size={14} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette Selection */}
          <div className="project-modal-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="project-section-label">Color Theme</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Custom:</span>
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  style={{
                    width: '24px',
                    height: '24px',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                  title="Pick custom hex color"
                />
              </div>
            </div>

            <div className="project-color-grid">
              {COLOR_PALETTE.map(c => {
                const isSelected = color.toLowerCase() === c.value.toLowerCase();
                return (
                  <button
                    key={c.name}
                    type="button"
                    className={`project-color-swatch ${isSelected ? 'selected' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => setColor(c.value)}
                    title={c.name}
                  >
                    {isSelected && <Check size={14} color="#ffffff" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selection */}
          <div className="project-modal-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="project-section-label">Project Icon</span>
              {/* Category Filter Tabs */}
              <div className="project-icon-tabs">
                <button
                  type="button"
                  className={`project-icon-tab ${iconFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setIconFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`project-icon-tab ${iconFilter === 'work' ? 'active' : ''}`}
                  onClick={() => setIconFilter('work')}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={`project-icon-tab ${iconFilter === 'tech' ? 'active' : ''}`}
                  onClick={() => setIconFilter('tech')}
                >
                  Tech
                </button>
                <button
                  type="button"
                  className={`project-icon-tab ${iconFilter === 'life' ? 'active' : ''}`}
                  onClick={() => setIconFilter('life')}
                >
                  Life
                </button>
              </div>
            </div>

            <div className="project-icon-grid">
              {iconEntries.map(([iconKey, IconComponent]) => {
                const isSelected = icon === iconKey;
                return (
                  <button
                    key={iconKey}
                    type="button"
                    className={`project-icon-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setIcon(iconKey)}
                    style={{
                      borderColor: isSelected ? color : undefined,
                      backgroundColor: isSelected ? `${color}18` : undefined,
                      color: isSelected ? color : 'var(--text-secondary)'
                    }}
                    title={iconKey}
                  >
                    <IconComponent size={18} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Actions Footer */}
          <div className="project-modal-footer">
            {isEditing && editingProject && editingProject.id !== 'inbox' ? (
              <button
                type="button"
                className="btn-secondary"
                style={{ color: 'var(--priority-p1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                onClick={handleDelete}
              >
                <Trash2 size={15} /> Delete
              </button>
            ) : (
              <div />
            )}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn-secondary" onClick={closeProjectModal}>
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!name.trim()}
                style={{
                  backgroundColor: color,
                  boxShadow: `0 4px 14px ${color}44`
                }}
              >
                {isEditing ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

