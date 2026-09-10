import React from 'react';
import {
  Pin,
  Clock,
  Tag as TagIcon,
  Trash2,
  Folder,
  AlertCircle
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { mergeThemeStyles } from '../../theme';
import type { Note } from '../../types/todo';
import { PROJECT_ICONS } from '../../constants/projectIcons';
import { getTodayString } from '../../utils/dateUtils';

interface NoteCardProps {
  note: Note;
}

// Utility to strip HTML tags for card preview
function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const {
    projects,
    openEditNoteModal,
    deleteNote,
    togglePinNote,
    getTagColor
  } = useTodo();

  const project = projects.find(p => p.id === note.projectId);
  const ProjectIcon = (project && PROJECT_ICONS[project.icon]) ? PROJECT_ICONS[project.icon] : Folder;
  const rawText = stripHtml(note.content || '');

  // Reminder status calculation
  const today = getTodayString();
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  let isOverdue = false;
  let reminderLabel = '';

  if (note.reminder) {
    const { date, time } = note.reminder;
    const timeStr = time || '09:00';
    
    if (date < today || (date === today && timeStr < currentTime)) {
      isOverdue = true;
    }

    if (date === today) {
      reminderLabel = `Today ${timeStr}`;
    } else {
      reminderLabel = `${date} ${timeStr}`;
    }
  }

  const handleCardClick = () => {
    openEditNoteModal(note);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePinNote(note.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(note.id);
  };

  return (
    <article
      className={`note-card ${note.isPinned ? 'pinned' : ''}`}
      onClick={handleCardClick}
      data-theme-component={ThemeComponent.NoteCard}
      style={mergeThemeStyles(ThemeComponent.NoteCard, {
        borderLeft: note.color ? `4px solid ${note.color}` : undefined
      })}
    >
      {/* Top Header */}
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title || 'Untitled Note'}</h3>
        <div className="note-card-actions">
          <button
            type="button"
            onClick={handlePinClick}
            className={`note-pin-btn ${note.isPinned ? 'active' : ''}`}
            title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
            aria-label={note.isPinned ? 'Unpin note' : 'Pin note to top'}
          >
            <Pin size={16} />
          </button>
          <button
            type="button"
            onClick={handleDeleteClick}
            className="note-delete-btn"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Snippet Body */}
      {rawText && (
        <p className="note-card-snippet">
          {rawText}
        </p>
      )}

      {/* Metadata Badges Footer */}
      <div className="note-card-footer">
        {/* Project Badge */}
        {project && (
          <span
            className="note-project-badge"
            style={{
              color: project.color,
              backgroundColor: `${project.color}15`,
              borderColor: `${project.color}30`
            }}
          >
            <ProjectIcon size={12} />
            <span>{project.name}</span>
          </span>
        )}

        {/* Reminder Pill */}
        {note.reminder && (
          <span
            className={`note-reminder-pill ${isOverdue ? 'overdue' : ''}`}
            title={isOverdue ? 'Reminder overdue' : 'Scheduled reminder'}
          >
            {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
            <span>{reminderLabel}</span>
          </span>
        )}

        {/* Tags List */}
        {note.tags.map(tag => {
          const color = getTagColor(tag);
          return (
            <span
              key={tag}
              className="badge"
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                color,
                backgroundColor: `${color}15`,
                borderColor: `${color}35`
              }}
            >
              <TagIcon size={10} />
              #{tag}
            </span>
          );
        })}
      </div>
    </article>
  );
};
