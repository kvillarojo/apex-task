import React, { useState } from 'react';
import {
  Plus,
  StickyNote,
  Pin,
  Clock,
  Sparkles
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styled from 'styled-components';
import styles from './NotesView.module.css';

const ProjectChip = styled.button<{ $color: string; $active: boolean }>`
  border-color: ${({ $color, $active }) => ($active ? $color : undefined)};
`;
const ProjectDot = styled.span<{ $color: string }>`background-color: ${({ $color }) => $color};`;
import { NoteCard } from '../NoteCard';

export const NotesView: React.FC = () => {
  const {
    filteredNotes,
    notes,
    noteProjects,
    noteTags,
    filter,
    setFilter,
    openCreateNoteModal
  } = useTodo();

  const [activeTab, setActiveTab] = useState<'all' | 'pinned' | 'reminders'>('all');
  const [quickTitle, setQuickTitle] = useState('');

  // Tab Filtering
  const displayedNotes = filteredNotes.filter(n => {
    if (activeTab === 'pinned') return n.isPinned;
    if (activeTab === 'reminders') return Boolean(n.reminder);
    return true;
  });

  const pinnedNotes = displayedNotes.filter(n => n.isPinned);
  const otherNotes = activeTab === 'pinned' ? [] : displayedNotes.filter(n => !n.isPinned);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = quickTitle.trim();
    if (!title) {
      openCreateNoteModal();
      return;
    }
    openCreateNoteModal(undefined, title);
    setQuickTitle('');
  };

  const handleProjectFilterClick = (projId: string) => {
    if (filter.projectId === projId) {
      setFilter({ projectId: null });
    } else {
      setFilter({ projectId: projId });
    }
  };

  const handleTagFilterClick = (tag: string) => {
    if (filter.tag === tag) {
      setFilter({ tag: null });
    } else {
      setFilter({ tag });
    }
  };

  return (
    <div {...getThemeComponentProps(ThemeComponent.NotesView)} className="notes-page-container">
      {/* Top Banner & Quick Create Header */}
      <div className="notes-header-bar">
        <div>
          <h2 className="notes-page-title">
            <StickyNote size={22} color="var(--primary)" />
            <span>Notes</span>
            <span className="notes-counter-badge">{notes.length}</span>
          </h2>
          <p className="notes-page-subtitle">
            Project documentation, quick memos, tags & reminders
          </p>
        </div>
      </div>

      {/* Quick Take A Note Bar */}
      <form className="notes-quick-bar" onSubmit={handleQuickSubmit}>
        <div className="notes-quick-icon">
          <Sparkles size={18} color="var(--primary)" />
        </div>
        <input
          type="text"
          placeholder="Take a quick note or memo... press Enter to compose"
          value={quickTitle}
          onChange={e => setQuickTitle(e.target.value)}
        />
        <button
          type="button"
          className={`btn-secondary ${styles.composeButton}`}
          onClick={() => openCreateNoteModal()}
        >
          <Plus size={14} className={styles.composeIcon} />
          Compose
        </button>
      </form>

      {/* Horizontal Filter Chips Bar (Touch & Mobile Friendly) */}
      <div className="notes-filter-chips-wrapper">
        <div className="notes-filter-chips">
          <button
            type="button"
            className={`filter-chip ${activeTab === 'all' && !filter.projectId && !filter.tag ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('all');
              setFilter({ projectId: null, tag: null });
            }}
          >
            All ({notes.length})
          </button>

          <button
            type="button"
            className={`filter-chip ${activeTab === 'pinned' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'pinned' ? 'all' : 'pinned')}
          >
            <Pin size={12} />
            <span>Pinned ({notes.filter(n => n.isPinned).length})</span>
          </button>

          <button
            type="button"
            className={`filter-chip ${activeTab === 'reminders' ? 'active' : ''}`}
            onClick={() => setActiveTab(activeTab === 'reminders' ? 'all' : 'reminders')}
          >
            <Clock size={12} />
            <span>Reminders ({notes.filter(n => Boolean(n.reminder)).length})</span>
          </button>

          {/* Project Chips */}
          <div className="chips-separator" />
          {noteProjects.map(p => (
            <ProjectChip
              key={p.id}
              type="button"
              className={`filter-chip project-chip ${filter.projectId === p.id ? 'active' : ''}`}
              $color={p.color}
              $active={filter.projectId === p.id}
              onClick={() => handleProjectFilterClick(p.id)}
            >
              <ProjectDot className={styles.projectDot} $color={p.color} />
              <span>{p.name}</span>
            </ProjectChip>
          ))}

          {/* Tag Chips */}
          {noteTags.length > 0 && <div className="chips-separator" />}
          {noteTags.map(t => (
            <button
              key={t}
              type="button"
              className={`filter-chip tag-chip ${filter.tag === t ? 'active' : ''}`}
              onClick={() => handleTagFilterClick(t)}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {displayedNotes.length === 0 && (
        <div className="notes-empty-state">
          <div className="notes-empty-icon">
            <StickyNote size={36} />
          </div>
          <h3 className="notes-empty-title">
            {filter.searchQuery || filter.projectId || filter.tag
              ? 'No matching notes found'
              : 'No notes created yet'}
          </h3>
          <p className="notes-empty-desc">
            {filter.searchQuery || filter.projectId || filter.tag
              ? 'Try clearing active project or tag filters to see more notes.'
              : 'Capture ideas, write documentation, assign projects and tags, or set timely reminders.'}
          </p>
          <button
            type="button"
            className={`btn-primary ${styles.createButton}`}
            onClick={() => openCreateNoteModal()}
          >
            <Plus size={16} />
            <span>Create First Note</span>
          </button>
        </div>
      )}

      {/* Pinned Section */}
      {pinnedNotes.length > 0 && (
        <section className="notes-section">
          <div className="notes-section-header">
            <Pin size={14} color="var(--primary)" />
            <span>PINNED ({pinnedNotes.length})</span>
          </div>
          <div className="notes-grid">
            {pinnedNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}

      {/* Other / All Notes Section */}
      {otherNotes.length > 0 && (
        <section className="notes-section">
          {pinnedNotes.length > 0 && (
            <div className="notes-section-header">
              <span>OTHERS ({otherNotes.length})</span>
            </div>
          )}
          <div className="notes-grid">
            {otherNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
