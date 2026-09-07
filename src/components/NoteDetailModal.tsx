import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Tag as TagIcon,
  Pin,
  Clock,
  Check,
  ChevronDown,
  Bell,
  Search,
  CalendarDays,
  Sunrise,
  CalendarClock,
  AlarmClock
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { DescriptionEditor } from './DescriptionEditor';
import { getTodayString } from '../utils/dateUtils';

const NOTE_COLORS = [
  { name: 'Default', value: '' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Rose', value: '#ec4899' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Cyan', value: '#06b6d4' }
];

export const NoteDetailModal: React.FC = () => {
  const {
    editingNote,
    noteModalOpen,
    closeNoteModal,
    addNote,
    updateNote,
    deleteNote,
    projects,
    noteTags,
    getTagColor,
    requestNotificationPermission
  } = useTodo();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('inbox');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [mobilePicker, setMobilePicker] = useState<'project' | 'tags' | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const isNew = !editingNote || !editingNote.id;

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setProjectId(editingNote.projectId || 'inbox');
      setTags(editingNote.tags ? [...editingNote.tags] : []);
      setIsPinned(Boolean(editingNote.isPinned));
      setColor(editingNote.color || '');
      setReminderDate(editingNote.reminder?.date || '');
      setReminderTime(editingNote.reminder?.time || '');
    } else {
      setTitle('');
      setContent('');
      setProjectId('inbox');
      setTags([]);
      setIsPinned(false);
      setColor('');
      setReminderDate('');
      setReminderTime('');
    }
    setTagInput('');
    setMobilePicker(null);
    setTagSearch('');
  }, [editingNote, noteModalOpen]);

  if (!noteModalOpen) return null;

  // Auto-suggest tags
  const cleanInput = tagInput.trim().toLowerCase().replace(/^#/, '');
  const tagSuggestions = cleanInput
    ? noteTags.filter(t => t.toLowerCase().includes(cleanInput) && !tags.includes(t))
    : [];

  const handleSelectSuggestion = (tagToSelect: string) => {
    if (!tags.includes(tagToSelect)) {
      setTags([...tags, tagToSelect]);
    }
    setTagInput('');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagSuggestions.length > 0) {
        handleSelectSuggestion(tagSuggestions[0]);
      } else if (cleanInput) {
        if (!tags.includes(cleanInput)) {
          setTags([...tags, cleanInput]);
        }
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleMobileTag = (tag: string) => {
    setTags(currentTags => currentTags.includes(tag)
      ? currentTags.filter(currentTag => currentTag !== tag)
      : [...currentTags, tag]);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  // Quick Reminder Presets
  const applyPreset = (preset: 'today' | 'tomorrow' | 'weekend' | 'nextWeek' | 'clear') => {
    if (preset === 'clear') {
      setReminderDate('');
      setReminderTime('');
      return;
    }

    const now = new Date();
    if (preset === 'today') {
      setReminderDate(getTodayString());
      setReminderTime('18:00');
    } else if (preset === 'tomorrow') {
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setReminderDate(`${yyyy}-${mm}-${dd}`);
      setReminderTime('09:00');
    } else if (preset === 'weekend') {
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
      const saturday = new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000);
      const yyyy = saturday.getFullYear();
      const mm = String(saturday.getMonth() + 1).padStart(2, '0');
      const dd = String(saturday.getDate()).padStart(2, '0');
      setReminderDate(`${yyyy}-${mm}-${dd}`);
      setReminderTime('10:00');
    } else if (preset === 'nextWeek') {
      const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
      const nextMon = new Date(now.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000);
      const yyyy = nextMon.getFullYear();
      const mm = String(nextMon.getMonth() + 1).padStart(2, '0');
      const dd = String(nextMon.getDate()).padStart(2, '0');
      setReminderDate(`${yyyy}-${mm}-${dd}`);
      setReminderTime('09:00');
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle && !content.trim()) {
      closeNoteModal();
      return;
    }

    const reminder = reminderDate ? {
      date: reminderDate,
      time: reminderTime || '09:00',
      notified: false
    } : undefined;

    if (isNew) {
      addNote({
        title: trimmedTitle || 'Untitled Note',
        content,
        projectId: projectId || 'inbox',
        tags,
        isPinned,
        color: color || undefined,
        reminder
      });
    } else {
      updateNote(editingNote.id, {
        title: trimmedTitle || 'Untitled Note',
        content,
        projectId: projectId || 'inbox',
        tags,
        isPinned,
        color: color || undefined,
        reminder
      });
    }

    closeNoteModal();
  };

  const selectedProject = projects.find(project => project.id === projectId);
  const selectedAccent = NOTE_COLORS.find(option => option.value === color) || NOTE_COLORS[0];
  const reminderSummary = reminderDate
    ? `${reminderDate}${reminderTime ? ` · ${reminderTime}` : ''}`
    : 'No reminder set';
  const mobileTagResults = noteTags.filter(tag => tag.toLowerCase().includes(tagSearch.trim().toLowerCase()));

  return (
    <div className="modal-overlay" onClick={closeNoteModal}>
      <div
        className="modal-card ticket-modal-card note-modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          borderLeft: color ? `6px solid ${color}` : undefined
        }}
      >
        {/* Header */}
        <header className="ticket-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="ticket-modal-eyebrow">
              {isNew ? 'New Note' : 'Edit Note'}
            </span>
            <button
              type="button"
              className={`note-pin-pill-btn ${isPinned ? 'active' : ''}`}
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Pinned to top' : 'Click to pin note'}
            >
              <Pin size={13} />
              <span>{isPinned ? 'Pinned' : 'Pin note'}</span>
            </button>
          </div>

          <button
            onClick={closeNoteModal}
            className="ticket-modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>

        {/* Modal Body */}
        <div className="ticket-modal-body">
          {/* Left Column: Note Title & Quill Editor */}
          <div className="ticket-modal-column-left">
            <div className="form-group">
              <label>TITLE</label>
              <input
                type="text"
                value={title}
                placeholder="Note title..."
                onChange={e => setTitle(e.target.value)}
                className="form-input form-input-title"
                autoFocus={isNew}
              />
            </div>

            <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <label>CONTENT</label>
              <div style={{ flex: 1, minHeight: '260px' }}>
                <DescriptionEditor value={content} onChange={setContent} />
              </div>
            </div>
          </div>

          {/* Right Column: Project, Tags, Reminders, Color */}
          <aside className="ticket-modal-column-right">
            {/* Project & Organization */}
            <section className="details-panel">
              <h3 className="panel-title">Organization</h3>
              <div className="panel-content">
                <div className="form-group">
                  <label>PROJECT</label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="form-input desktop-project-select"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="mobile-picker-trigger"
                    onClick={() => setMobilePicker('project')}
                  >
                    <span className="mobile-project-dot" style={{ backgroundColor: selectedProject?.color || 'var(--primary)' }} />
                    <span>{selectedProject?.name || 'Inbox'}</span>
                    <ChevronDown size={18} />
                  </button>
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label>TAGS</label>
                  <div className="tags-container">
                    <div className="tags-list">
                      {tags.map(t => {
                        const tagColor = getTagColor(t);
                        return (
                          <span
                            key={t}
                            className="badge"
                            style={{
                              color: tagColor,
                              backgroundColor: `${tagColor}18`,
                              borderColor: `${tagColor}40`
                            }}
                          >
                            <TagIcon size={12} /> #{t}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(t)}
                              className="badge-close-btn"
                              aria-label={`Remove tag ${t}`}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="Add tag and press Enter..."
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="form-input form-input-tag"
                      />
                      {tagSuggestions.length > 0 && (
                        <div className="tag-suggestions">
                          {tagSuggestions.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleSelectSuggestion(s)}
                              className="suggestion-item"
                            >
                              <TagIcon size={12} />
                              <span>#{s}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="mobile-picker-trigger mobile-tag-trigger"
                      onClick={() => setMobilePicker('tags')}
                    >
                      <TagIcon size={17} />
                      <span>{tags.length ? `${tags.length} tag${tags.length === 1 ? '' : 's'} selected` : 'Add tags'}</span>
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>

                <div className="form-group note-accent-group">
                  <div className="note-control-heading">
                    <div>
                      <label>NOTE ACCENT</label>
                      <span>Used on the card edge and editor</span>
                    </div>
                    <span className="note-accent-current">
                      <span style={{ backgroundColor: color || 'var(--text-muted)' }} />
                      {selectedAccent.name}
                    </span>
                  </div>
                  <div className="note-color-picker" role="radiogroup" aria-label="Note accent">
                    {NOTE_COLORS.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.value)}
                        className={`note-color-swatch ${color === c.value ? 'active' : ''}`}
                        role="radio"
                        aria-checked={color === c.value}
                        style={{
                          '--accent-color': c.value || 'var(--text-muted)'
                        } as React.CSSProperties}
                        aria-label={`${c.name} accent`}
                        title={`${c.name} accent`}
                      >
                        <span className="note-color-swatch-dot" />
                        <span>{c.name}</span>
                        {color === c.value && (
                          <Check size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Reminder Section */}
            <section className="planning-panel">
              <h3 className="panel-title">
                <Clock size={14} style={{ marginRight: '6px' }} />
                Reminder
              </h3>
              <div className="panel-content">
                <div className={`reminder-status ${reminderDate ? 'is-set' : ''}`}>
                  <div className="reminder-status-icon">
                    {reminderDate ? <AlarmClock size={17} /> : <CalendarDays size={17} />}
                  </div>
                  <div>
                    <strong>{reminderDate ? 'Reminder scheduled' : 'Set a reminder'}</strong>
                    <span>{reminderSummary}</span>
                  </div>
                  {reminderDate && (
                    <button type="button" className="reminder-clear-btn" onClick={() => applyPreset('clear')}>
                      Clear
                    </button>
                  )}
                </div>

                <div className="reminder-section-label">Quick schedule</div>
                <div className="reminder-presets">
                  <button
                    type="button"
                    className="reminder-preset"
                    onClick={() => applyPreset('today')}
                  >
                    <Clock size={15} />
                    <span>Later today<small>6:00 PM</small></span>
                  </button>
                  <button
                    type="button"
                    className="reminder-preset"
                    onClick={() => applyPreset('tomorrow')}
                  >
                    <Sunrise size={15} />
                    <span>Tomorrow<small>9:00 AM</small></span>
                  </button>
                  <button
                    type="button"
                    className="reminder-preset"
                    onClick={() => applyPreset('weekend')}
                  >
                    <CalendarDays size={15} />
                    <span>This weekend<small>Saturday 10:00 AM</small></span>
                  </button>
                  <button
                    type="button"
                    className="reminder-preset"
                    onClick={() => applyPreset('nextWeek')}
                  >
                    <CalendarClock size={15} />
                    <span>Next Monday<small>9:00 AM</small></span>
                  </button>
                </div>

                <div className="reminder-section-label">Custom schedule</div>
                <div className="reminder-custom-fields">
                  <label className="form-group">
                    <span>DATE</span>
                    <input
                      type="date"
                      value={reminderDate}
                      onChange={e => setReminderDate(e.target.value)}
                      className="form-input"
                    />
                  </label>
                  <label className="form-group">
                    <span>TIME</span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                      className="form-input"
                    />
                  </label>
                </div>
                {reminderDate && !notificationsEnabled && typeof Notification !== 'undefined' && (
                  <button
                    type="button"
                    className="notification-permission-btn"
                    onClick={handleEnableNotifications}
                  >
                    <Bell size={14} /> Enable device alerts
                  </button>
                )}
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="ticket-modal-footer">
          {!isNew ? (
            <button
              type="button"
              className="btn-secondary btn-danger"
              onClick={() => deleteNote(editingNote.id)}
            >
              <Trash2 size={14} style={{ marginRight: '4px' }} />
              Delete Note
            </button>
          ) : (
            <div />
          )}

          <div className="footer-actions">
            <button type="button" className="btn-secondary" onClick={closeNoteModal}>
              Cancel
            </button>
            <button type="button" className="btn-primary" onClick={handleSave}>
              {isNew ? 'Create Note' : 'Save Changes'}
            </button>
          </div>
        </footer>
      </div>
      {mobilePicker && (
        <div className="mobile-picker-overlay" onClick={event => {
          event.stopPropagation();
          setMobilePicker(null);
        }}>
          <section
            className="mobile-picker-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={mobilePicker === 'project' ? 'Choose project' : 'Choose tags'}
            onClick={event => event.stopPropagation()}
          >
            <div className="mobile-sheet-handle" />
            <div className="mobile-sheet-heading">
              <div>
                <span className="ticket-modal-eyebrow">Organize note</span>
                <h3>{mobilePicker === 'project' ? 'Choose project' : 'Choose tags'}</h3>
              </div>
              <button type="button" className="ticket-modal-close-btn" onClick={() => setMobilePicker(null)} aria-label="Close picker">
                <X size={20} />
              </button>
            </div>
            {mobilePicker === 'project' ? (
              <div className="mobile-project-list">
                {projects.map(project => (
                  <button
                    key={project.id}
                    type="button"
                    className={`mobile-project-option ${project.id === projectId ? 'selected' : ''}`}
                    onClick={() => {
                      setProjectId(project.id);
                      setMobilePicker(null);
                    }}
                  >
                    <span className="mobile-project-dot" style={{ backgroundColor: project.color }} />
                    <span>{project.name}</span>
                    {project.id === projectId && <Check size={18} />}
                  </button>
                ))}
              </div>
            ) : (
              <>
                <label className="mobile-tag-search">
                  <Search size={17} />
                  <input value={tagSearch} onChange={event => setTagSearch(event.target.value)} placeholder="Search or create a tag" autoFocus />
                </label>
                <div className="mobile-tag-list">
                  {mobileTagResults.map(tag => {
                    const tagColor = getTagColor(tag);
                    const selected = tags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`mobile-tag-option ${selected ? 'selected' : ''}`}
                        onClick={() => toggleMobileTag(tag)}
                        style={{ '--tag-color': tagColor } as React.CSSProperties}
                      >
                        <span>#{tag}</span>
                        {selected && <Check size={17} />}
                      </button>
                    );
                  })}
                  {tagSearch.trim() && !noteTags.some(tag => tag.toLowerCase() === tagSearch.trim().toLowerCase()) && (
                    <button type="button" className="mobile-tag-option create" onClick={() => {
                      toggleMobileTag(tagSearch.trim().toLowerCase().replace(/^#/, ''));
                      setTagSearch('');
                    }}>
                      <TagIcon size={17} /> Create #{tagSearch.trim().replace(/^#/, '')}
                    </button>
                  )}
                </div>
                <button type="button" className="btn-primary mobile-sheet-done" onClick={() => setMobilePicker(null)}>Done</button>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
