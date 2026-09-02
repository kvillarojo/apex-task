import React, { useState, useEffect } from 'react';
import { Search, CheckSquare, List, Kanban, Grid, Calendar, BarChart3, Sun, Moon, Plus, Folder, Tag } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { ViewMode } from '../types/todo';
import { PROJECT_ICONS } from './ProjectModal';

export const CommandPaletteModal: React.FC = () => {
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

  // Global hotkey listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      } else if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const matchedTasks = query.trim()
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
    : tasks.slice(0, 5);

  const matchedProjects = query.trim()
    ? projects.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : projects;

  const handleSelectTask = (task: typeof tasks[0]) => {
    setEditingTask(task);
    setCommandPaletteOpen(false);
  };

  const handleSelectView = (mode: ViewMode) => {
    setViewMode(mode);
    setCommandPaletteOpen(false);
  };

  const handleSelectProject = (projectId: string) => {
    const targetProj = projects.find(p => p.id === projectId);
    if (targetProj?.defaultView) {
      setViewMode(targetProj.defaultView);
    }
    setFilter({ projectId, smartFilter: 'all' });
    setCommandPaletteOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="modal-card"
        onClick={e => e.stopPropagation()}
        style={{ width: '600px', padding: '16px', gap: '12px' }}
      >
        {/* Command Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', backgroundColor: 'var(--bg-input)', borderRadius: '10px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Type a command or search tasks & projects..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-primary)', fontSize: '0.95rem' }}
            autoFocus
          />
          <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--bg-card)', color: 'var(--text-muted)' }}>
            ESC to close
          </span>
        </div>

        {/* Command Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Quick Actions */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>ACTIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                className="nav-item"
                onClick={() => {
                  setCommandPaletteOpen(false);
                  openCreateProjectModal();
                }}
              >
                <div className="nav-item-left">
                  <Plus size={16} color="var(--primary)" />
                  <span>Create New Project</span>
                </div>
              </button>
              <button
                className="nav-item"
                onClick={() => {
                  setCommandPaletteOpen(false);
                  openTagModal();
                }}
              >
                <div className="nav-item-left">
                  <Tag size={16} color="var(--primary)" />
                  <span>Manage & Create Tags</span>
                </div>
              </button>
            </div>
          </div>

          {/* Views Navigation Commands */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button className="nav-item" onClick={() => handleSelectView('list')}>
                <div className="nav-item-left"><List size={16} /> Switch to List View</div>
              </button>
              <button className="nav-item" onClick={() => handleSelectView('kanban')}>
                <div className="nav-item-left"><Kanban size={16} /> Switch to Kanban Board</div>
              </button>
              <button className="nav-item" onClick={() => handleSelectView('eisenhower')}>
                <div className="nav-item-left"><Grid size={16} /> Switch to Eisenhower Matrix</div>
              </button>
              <button className="nav-item" onClick={() => handleSelectView('calendar')}>
                <div className="nav-item-left"><Calendar size={16} /> Switch to Calendar View</div>
              </button>
              <button className="nav-item" onClick={() => handleSelectView('analytics')}>
                <div className="nav-item-left"><BarChart3 size={16} /> Switch to Analytics</div>
              </button>
              <button className="nav-item" onClick={() => { setTheme(theme === 'dark' ? 'light' : 'dark'); setCommandPaletteOpen(false); }}>
                <div className="nav-item-left">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme</div>
              </button>
            </div>
          </div>

          {/* Tasks Results */}
          {matchedTasks.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>TASKS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {matchedTasks.map(t => (
                  <button key={t.id} className="nav-item" onClick={() => handleSelectTask(t)}>
                    <div className="nav-item-left">
                      <CheckSquare size={16} color="var(--primary)" />
                      <span>{t.title}</span>
                    </div>
                    <span className="badge">{t.priority.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {matchedProjects.length > 0 && (
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>PROJECTS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {matchedProjects.map(p => {
                  const IconComp = PROJECT_ICONS[p.icon] || Folder;
                  return (
                    <button key={p.id} className="nav-item" onClick={() => handleSelectProject(p.id)}>
                      <div className="nav-item-left">
                        <span style={{ color: p.color, display: 'flex', alignItems: 'center' }}>
                          <IconComp size={16} />
                        </span>
                        <span>{p.name}</span>
                      </div>
                      {p.description && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
