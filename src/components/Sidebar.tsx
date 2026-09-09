import React from 'react';
import {
  CheckSquare,
  Inbox,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  ListTodo,
  Plus,
  Folder,
  Trash2,
  Edit2,
  StickyNote,
  X
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { SmartFilter } from '../types/todo';
import { isToday, isUpcoming } from '../utils/dateUtils';
import { PROJECT_ICONS } from '../constants/projectIcons';

export const Sidebar: React.FC = () => {
  const {
    tasks,
    notes,
    projects,
    filter,
    setSmartFilter,
    setFilter,
    viewMode,
    setViewMode,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    openCreateProjectModal,
    openEditProjectModal,
    openTagModal,
    deleteProject,
    allTags,
    noteTags,
    taskProjects,
    noteProjects,
    getTagColor,
    stats
  } = useTodo();

  // Smart count calculations
  const inboxCount = tasks.filter(t => t.projectId === 'inbox' && !t.completed).length;
  const todayCount = tasks.filter(t => isToday(t.dueDate) && !t.completed).length;
  const upcomingCount = tasks.filter(t => isUpcoming(t.dueDate) && !t.completed).length;
  const importantCount = tasks.filter(t => (t.priority === 'p1' || t.priority === 'p2') && !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const allCount = tasks.filter(t => !t.completed).length;
  const notesCount = notes.length;
  const visibleTags = viewMode === 'notes' ? noteTags : allTags;
  const visibleProjects = viewMode === 'notes' ? noteProjects : taskProjects;

  const handleSmartClick = (smart: SmartFilter) => {
    if (viewMode === 'notes') {
      setViewMode('list');
    }
    setSmartFilter(smart);
    setMobileDrawerOpen(false);
  };

  const handleNotesClick = () => {
    setViewMode('notes');
    setFilter({ projectId: null, tag: null });
    setMobileDrawerOpen(false);
  };

  const handleProjectClick = (projectId: string) => {
    const targetProj = projects.find(p => p.id === projectId);
    if (targetProj?.defaultView && viewMode !== 'notes') {
      setViewMode(targetProj.defaultView);
    }
    setFilter({ projectId, smartFilter: 'all', tag: null });
    setMobileDrawerOpen(false);
  };

  const handleTagClick = (tag: string) => {
    if (filter.tag === tag) {
      setFilter({ tag: null, projectId: null, smartFilter: 'all' });
    } else {
      setFilter({ tag, projectId: null, smartFilter: 'all' });
    }
    setMobileDrawerOpen(false);
  };

  return (
    <>
      {mobileDrawerOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileDrawerOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="logo-badge">
              <CheckSquare size={22} />
            </div>
            <div>
              <h1 className="logo-title">Apex Task</h1>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Productivity Suite</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-mobile-close-btn"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-content">
          {/* Smart Filters Navigation */}
          <div className="nav-section">
            <span className="nav-section-title">Views</span>

            <button
              className={`nav-item ${viewMode === 'notes' && !filter.projectId && !filter.tag ? 'active' : ''}`}
              onClick={handleNotesClick}
            >
              <div className="nav-item-left">
                <StickyNote size={18} color="#ec4899" />
                <span>Notes</span>
              </div>
              {notesCount > 0 && (
                <span className="nav-badge" style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' }}>
                  {notesCount}
                </span>
              )}
            </button>

            <button
              className={`nav-item ${viewMode !== 'notes' && filter.smartFilter === 'inbox' && !filter.projectId && !filter.tag ? 'active' : ''}`}
              onClick={() => handleSmartClick('inbox')}
            >
              <div className="nav-item-left">
                <Inbox size={18} color="#3b82f6" />
                <span>Tasks</span>
              </div>
              {inboxCount > 0 && <span className="nav-badge">{inboxCount}</span>}
            </button>

          <button
            className={`nav-item ${filter.smartFilter === 'today' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => handleSmartClick('today')}
          >
            <div className="nav-item-left">
              <Calendar size={18} color="#10b981" />
              <span>Today</span>
            </div>
            {todayCount > 0 && (
              <span className="nav-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                {todayCount}
              </span>
            )}
          </button>

          <button
            className={`nav-item ${filter.smartFilter === 'upcoming' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => handleSmartClick('upcoming')}
          >
            <div className="nav-item-left">
              <Clock size={18} color="#8b5cf6" />
              <span>Upcoming</span>
            </div>
            {upcomingCount > 0 && <span className="nav-badge">{upcomingCount}</span>}
          </button>

          <button
            className={`nav-item ${filter.smartFilter === 'important' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => handleSmartClick('important')}
          >
            <div className="nav-item-left">
              <Star size={18} color="#f59e0b" />
              <span>Important</span>
            </div>
            {importantCount > 0 && (
              <span className="nav-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>
                {importantCount}
              </span>
            )}
          </button>

          <button
            className={`nav-item ${filter.smartFilter === 'completed' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => handleSmartClick('completed')}
          >
            <div className="nav-item-left">
              <CheckCircle2 size={18} color="#64748b" />
              <span>Completed</span>
            </div>
            <span className="nav-badge">{completedCount}</span>
          </button>

          <button
            className={`nav-item ${filter.smartFilter === 'all' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => handleSmartClick('all')}
          >
            <div className="nav-item-left">
              <ListTodo size={18} color="#6366f1" />
              <span>All Tasks</span>
            </div>
            <span className="nav-badge">{allCount}</span>
          </button>
        </div>

        {/* Projects Section */}
        <div className="nav-section">
          <div className="nav-section-title">
            <span>Projects</span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={openCreateProjectModal}
              title="Create New Project"
            >
              <Plus size={16} />
            </button>
          </div>

          {visibleProjects.map(project => {
            const count = viewMode === 'notes'
              ? notes.filter(note => note.projectId === project.id).length
              : tasks.filter(task => task.projectId === project.id && !task.completed).length;
            const isActive = filter.projectId === project.id;
            const IconComponent = PROJECT_ICONS[project.icon] || Folder;

            return (
              <div
                key={project.id}
                className={`nav-item project-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="nav-item-left" style={{ minWidth: 0 }}>
                  <span style={{ color: project.color, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <IconComponent size={16} />
                  </span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {project.name}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  {count > 0 && <span className="nav-badge">{count}</span>}
                  
                  {project.id !== 'inbox' && (
                    <div className="project-item-actions">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          openEditProjectModal(project);
                        }}
                        className="project-action-btn"
                        title="Edit Project"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                        className="project-action-btn delete-proj-btn"
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tags Section */}
        <div className="nav-section">
          <div className="nav-section-title">
            <span>{viewMode === 'notes' ? 'Note tags' : 'Tags'}</span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={openTagModal}
              title="Manage & Create Tags"
            >
              <Plus size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 6px' }}>
            {visibleTags.length > 0 ? (
              <div className="sidebar-tags-cloud">
                {visibleTags.map(tag => {
                  const count = viewMode === 'notes'
                    ? notes.filter(note => note.tags.includes(tag)).length
                    : tasks.filter(task => task.tags.includes(tag) && !task.completed).length;
                  const isSelected = filter.tag === tag;
                  const color = getTagColor(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      className={`sidebar-tag-pill ${isSelected ? 'active' : ''}`}
                      style={{
                        backgroundColor: isSelected ? color : `${color}18`,
                        borderColor: isSelected ? color : `${color}40`,
                        color: isSelected ? '#ffffff' : color
                      }}
                      title={`Filter by #${tag}`}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? '#ffffff' : color,
                          flexShrink: 0
                        }}
                      />
                      <span>#{tag}</span>
                      {count > 0 && (
                        <span
                          className="sidebar-tag-count"
                          style={{
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : `${color}25`,
                            color: isSelected ? '#ffffff' : color
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <button
                type="button"
                onClick={openTagModal}
                className="btn-secondary"
                style={{
                  fontSize: '0.75rem',
                  padding: '6px 10px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  color: 'var(--text-muted)'
                }}
              >
                <Plus size={13} /> Add first tag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Footer Stats Preview */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span>Completion Rate</span>
          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{stats.completionRate}%</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', backgroundColor: 'var(--bg-input)', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${stats.completionRate}%`,
              background: 'linear-gradient(90deg, #6366f1, #10b981)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </aside>
  </>
  );
};
