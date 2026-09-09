import React from 'react';
import { X, Tag as TagIcon, Check, Search } from 'lucide-react';
import type { Project } from '../../types/todo';

interface MobilePickerSheetProps {
  mode: 'project' | 'tags';
  projects: Project[];
  projectId: string;
  setProjectId: (value: string) => void;
  tags: string[];
  noteTags: string[];
  tagSearch: string;
  setTagSearch: (value: string) => void;
  mobileTagResults: string[];
  getTagColor: (tag: string) => string;
  onToggleTag: (tag: string) => void;
  onCreateTag: () => void;
  onClose: () => void;
}

export const MobilePickerSheet: React.FC<MobilePickerSheetProps> = ({
  mode,
  projects,
  projectId,
  setProjectId,
  tags,
  noteTags,
  tagSearch,
  setTagSearch,
  mobileTagResults,
  getTagColor,
  onToggleTag,
  onCreateTag,
  onClose
}) => (
  <div
    className="mobile-picker-overlay"
    onClick={event => {
      event.stopPropagation();
      onClose();
    }}
  >
    <section
      className="mobile-picker-sheet"
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'project' ? 'Choose project' : 'Choose tags'}
      onClick={event => event.stopPropagation()}
    >
      <div className="mobile-sheet-handle" />
      <div className="mobile-sheet-heading">
        <div>
          <span className="ticket-modal-eyebrow">Organize note</span>
          <h3>{mode === 'project' ? 'Choose project' : 'Choose tags'}</h3>
        </div>
        <button
          type="button"
          className="ticket-modal-close-btn"
          onClick={onClose}
          aria-label="Close picker"
        >
          <X size={20} />
        </button>
      </div>

      {mode === 'project' ? (
        <div className="mobile-project-list">
          {projects.map(project => (
            <button
              key={project.id}
              type="button"
              className={`mobile-project-option ${project.id === projectId ? 'selected' : ''}`}
              onClick={() => {
                setProjectId(project.id);
                onClose();
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
            <input
              value={tagSearch}
              onChange={event => setTagSearch(event.target.value)}
              placeholder="Search or create a tag"
              autoFocus
            />
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
                  onClick={() => onToggleTag(tag)}
                  style={{ '--tag-color': tagColor } as React.CSSProperties}
                >
                  <span>#{tag}</span>
                  {selected && <Check size={17} />}
                </button>
              );
            })}
            {tagSearch.trim() &&
              !noteTags.some(tag => tag.toLowerCase() === tagSearch.trim().toLowerCase()) && (
                <button type="button" className="mobile-tag-option create" onClick={onCreateTag}>
                  <TagIcon size={17} /> Create #{tagSearch.trim().replace(/^#/, '')}
                </button>
              )}
          </div>
          <button type="button" className="btn-primary mobile-sheet-done" onClick={onClose}>
            Done
          </button>
        </>
      )}
    </section>
  </div>
);
