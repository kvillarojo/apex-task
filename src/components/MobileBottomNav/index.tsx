import React from 'react';
import {
  CheckSquare,
  StickyNote,
  Calendar,
  Menu,
  Plus
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';

export const MobileBottomNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    openCreateNoteModal,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    notes,
    tasks
  } = useTodo();

  const handleFabClick = () => {
    if (viewMode === 'notes') {
      openCreateNoteModal();
    } else {
      // Focus task input or scroll to top
      const inputEl = document.querySelector('.task-input-main input') as HTMLInputElement | null;
      if (inputEl) {
        inputEl.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const activeTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        className="mobile-fab"
        onClick={handleFabClick}
        aria-label={viewMode === 'notes' ? 'Create new note' : 'Create new task'}
        title={viewMode === 'notes' ? 'Create new note' : 'Create new task'}
      >
        <Plus size={24} />
      </button>

      {/* Mobile Bottom Navigation Bar */}
      <nav {...getThemeComponentProps(ThemeComponent.MobileBottomNav)} className="mobile-bottom-nav">
        <button
          type="button"
          className={`mobile-tab-btn ${viewMode !== 'notes' && viewMode !== 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}
        >
          <div className="mobile-tab-icon-wrapper">
            <CheckSquare size={20} />
            {activeTasksCount > 0 && (
              <span className="mobile-tab-badge">{activeTasksCount}</span>
            )}
          </div>
          <span>Tasks</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${viewMode === 'notes' ? 'active' : ''}`}
          onClick={() => setViewMode('notes')}
        >
          <div className="mobile-tab-icon-wrapper">
            <StickyNote size={20} />
            {notes.length > 0 && (
              <span className="mobile-tab-badge">{notes.length}</span>
            )}
          </div>
          <span>Notes</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}
        >
          <div className="mobile-tab-icon-wrapper">
            <Calendar size={20} />
          </div>
          <span>Calendar</span>
        </button>

        <button
          type="button"
          className={`mobile-tab-btn ${mobileDrawerOpen ? 'active' : ''}`}
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          aria-label="Open project and tag menu"
        >
          <div className="mobile-tab-icon-wrapper">
            <Menu size={20} />
          </div>
          <span>Menu</span>
        </button>
      </nav>
    </>
  );
};
