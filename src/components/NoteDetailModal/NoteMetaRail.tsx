import React, { useEffect, useRef, useState } from 'react';
import {
  Trash2,
  Tag as TagIcon,
  Folder,
  Clock,
  ChevronDown,
  Check
} from 'lucide-react';
import { NOTE_COLORS } from '../../constants/colors';
import { TagChipInput } from '../common';
import type { Project } from '../../types/todo';
import type { ReminderPreset } from '../../constants/enums';
import { ReminderPopover } from './ReminderPopover';
import styles from './NoteDetailModal.module.css';

type OpenPanel = 'project' | 'tags' | 'accent' | 'reminder' | null;

interface NoteMetaRailProps {
  isNew: boolean;
  projectId: string;
  setProjectId: (value: string) => void;
  projects: Project[];
  selectedProject?: Project;
  tags: string[];
  setTags: (tags: string[]) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  noteTags: string[];
  getTagColor: (tag: string) => string;
  color: string;
  setColor: (value: string) => void;
  reminderDate: string;
  reminderTime: string;
  reminderSummary: string;
  notificationsEnabled: boolean;
  setReminderDate: (value: string) => void;
  setReminderTime: (value: string) => void;
  onApplyPreset: (preset: ReminderPreset) => void;
  onEnableNotifications: () => void;
  onOpenProjectPicker: () => void;
  onOpenTagsPicker: () => void;
  onDelete?: () => void;
  onClose: () => void;
  onSave: () => void;
}

export const NoteMetaRail: React.FC<NoteMetaRailProps> = ({
  isNew,
  projectId,
  setProjectId,
  projects,
  selectedProject,
  tags,
  setTags,
  tagInput,
  setTagInput,
  noteTags,
  getTagColor,
  color,
  setColor,
  reminderDate,
  reminderTime,
  reminderSummary,
  notificationsEnabled,
  setReminderDate,
  setReminderTime,
  onApplyPreset,
  onEnableNotifications,
  onOpenProjectPicker,
  onOpenTagsPicker,
  onDelete,
  onClose,
  onSave
}) => {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const selectedAccent = NOTE_COLORS.find(option => option.value === color) || NOTE_COLORS[0];

  useEffect(() => {
    if (!openPanel) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!railRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [openPanel]);

  const togglePanel = (panel: Exclude<OpenPanel, null>) => {
    setOpenPanel(current => (current === panel ? null : panel));
  };

  return (
    <div className={styles.rail} ref={railRef}>
      <div className={styles.chipRow}>
        {/* Project */}
        <div className={styles.chipWrap}>
          <button
            type="button"
            className={`${styles.chip} ${styles.chipDesktop}`}
            onClick={() => togglePanel('project')}
            aria-expanded={openPanel === 'project'}
          >
            <span
              className={styles.projectDot}
              style={{ backgroundColor: selectedProject?.color || 'var(--primary)' }}
            />
            <span>{selectedProject?.name || 'Inbox'}</span>
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className={`${styles.chip} ${styles.chipMobile}`}
            onClick={onOpenProjectPicker}
          >
            <span
              className={styles.projectDot}
              style={{ backgroundColor: selectedProject?.color || 'var(--primary)' }}
            />
            <span>{selectedProject?.name || 'Inbox'}</span>
            <ChevronDown size={14} />
          </button>
          {openPanel === 'project' && (
            <div className={styles.popover} role="listbox" aria-label="Choose project">
              {projects.map(project => (
                <button
                  key={project.id}
                  type="button"
                  className={`${styles.menuItem} ${project.id === projectId ? styles.menuItemActive : ''}`}
                  onClick={() => {
                    setProjectId(project.id);
                    setOpenPanel(null);
                  }}
                >
                  <span className={styles.projectDot} style={{ backgroundColor: project.color }} />
                  <Folder size={14} />
                  <span>{project.name}</span>
                  {project.id === projectId && <Check size={14} className={styles.menuCheck} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className={styles.chipWrap}>
          <button
            type="button"
            className={`${styles.chip} ${styles.chipDesktop}`}
            onClick={() => togglePanel('tags')}
            aria-expanded={openPanel === 'tags'}
          >
            <TagIcon size={14} />
            <span>{tags.length ? `${tags.length} tag${tags.length === 1 ? '' : 's'}` : 'Tags'}</span>
            <ChevronDown size={14} />
          </button>
          <button
            type="button"
            className={`${styles.chip} ${styles.chipMobile}`}
            onClick={onOpenTagsPicker}
          >
            <TagIcon size={14} />
            <span>{tags.length ? `${tags.length} tag${tags.length === 1 ? '' : 's'}` : 'Tags'}</span>
            <ChevronDown size={14} />
          </button>
          {openPanel === 'tags' && (
            <div className={`${styles.popover} ${styles.tagsPopover}`}>
              <TagChipInput
                tags={tags}
                tagInput={tagInput}
                onTagInputChange={setTagInput}
                onTagsChange={setTags}
                availableTags={noteTags}
                getTagColor={getTagColor}
                placeholder="Add tag…"
                inputClassName={styles.fieldInput}
              />
            </div>
          )}
        </div>

        {/* Accent */}
        <div className={styles.chipWrap}>
          <button
            type="button"
            className={styles.chip}
            onClick={() => togglePanel('accent')}
            aria-expanded={openPanel === 'accent'}
          >
            <span
              className={styles.accentDot}
              style={{ backgroundColor: color || 'var(--text-muted)' }}
            />
            <span>{selectedAccent.name}</span>
            <ChevronDown size={14} />
          </button>
          {openPanel === 'accent' && (
            <div className={`${styles.popover} ${styles.accentPopover}`} role="radiogroup" aria-label="Note accent">
              {NOTE_COLORS.map(option => (
                <button
                  key={option.name}
                  type="button"
                  className={`${styles.accentOption} ${color === option.value ? styles.accentOptionActive : ''}`}
                  onClick={() => {
                    setColor(option.value);
                    setOpenPanel(null);
                  }}
                  style={{ '--accent-color': option.value || 'var(--text-muted)' } as React.CSSProperties}
                  role="radio"
                  aria-checked={color === option.value}
                >
                  <span className={styles.accentOptionDot} />
                  <span>{option.name}</span>
                  {color === option.value && <Check size={13} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reminder */}
        <div className={styles.chipWrap}>
          <button
            type="button"
            className={`${styles.chip} ${reminderDate ? styles.chipActive : ''}`}
            onClick={() => togglePanel('reminder')}
            aria-expanded={openPanel === 'reminder'}
          >
            <Clock size={14} />
            <span>{reminderDate ? reminderSummary : 'Reminder'}</span>
            <ChevronDown size={14} />
          </button>
          {openPanel === 'reminder' && (
            <ReminderPopover
              reminderDate={reminderDate}
              reminderTime={reminderTime}
              reminderSummary={reminderSummary}
              notificationsEnabled={notificationsEnabled}
              setReminderDate={setReminderDate}
              setReminderTime={setReminderTime}
              onApplyPreset={onApplyPreset}
              onEnableNotifications={onEnableNotifications}
            />
          )}
        </div>
      </div>

      <div className={styles.railActions}>
        {!isNew && onDelete && (
          <button type="button" className={styles.deleteBtn} onClick={onDelete}>
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        )}
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={onSave}>
          {isNew ? 'Create' : 'Save'}
        </button>
      </div>
    </div>
  );
};
