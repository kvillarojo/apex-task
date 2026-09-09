import React from 'react';
import { Tag as TagIcon, Check, ChevronDown } from 'lucide-react';
import { NOTE_COLORS } from '../../constants/colors';
import { TagChipInput } from '../common';
import type { Project } from '../../types/todo';

interface NoteOrganizationPanelProps {
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
  onOpenProjectPicker: () => void;
  onOpenTagsPicker: () => void;
}

export const NoteOrganizationPanel: React.FC<NoteOrganizationPanelProps> = ({
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
  onOpenProjectPicker,
  onOpenTagsPicker
}) => {
  const selectedAccent = NOTE_COLORS.find(option => option.value === color) || NOTE_COLORS[0];

  return (
    <section className="details-panel">
      <h3 className="panel-title">Organization</h3>
      <div className="panel-content">
        <div className="form-group">
          <label>PROJECT</label>
          <select
            value={projectId}
            onChange={event => setProjectId(event.target.value)}
            className="form-input desktop-project-select"
          >
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button type="button" className="mobile-picker-trigger" onClick={onOpenProjectPicker}>
            <span
              className="mobile-project-dot"
              style={{ backgroundColor: selectedProject?.color || 'var(--primary)' }}
            />
            <span>{selectedProject?.name || 'Inbox'}</span>
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="form-group">
          <label>TAGS</label>
          <TagChipInput
            tags={tags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onTagsChange={setTags}
            availableTags={noteTags}
            getTagColor={getTagColor}
            placeholder="Add tag and press Enter..."
          />
          <button
            type="button"
            className="mobile-picker-trigger mobile-tag-trigger"
            onClick={onOpenTagsPicker}
          >
            <TagIcon size={17} />
            <span>
              {tags.length
                ? `${tags.length} tag${tags.length === 1 ? '' : 's'} selected`
                : 'Add tags'}
            </span>
            <ChevronDown size={18} />
          </button>
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
            {NOTE_COLORS.map(option => (
              <button
                key={option.name}
                type="button"
                onClick={() => setColor(option.value)}
                className={`note-color-swatch ${color === option.value ? 'active' : ''}`}
                role="radio"
                aria-checked={color === option.value}
                style={
                  {
                    '--accent-color': option.value || 'var(--text-muted)'
                  } as React.CSSProperties
                }
                aria-label={`${option.name} accent`}
                title={`${option.name} accent`}
              >
                <span className="note-color-swatch-dot" />
                <span>{option.name}</span>
                {color === option.value && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
