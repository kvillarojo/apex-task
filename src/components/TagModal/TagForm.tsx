import React from 'react';
import { Check, Plus, Hash } from 'lucide-react';
import { ColorSwatchGrid } from '../common';
import styles from './TagModal.module.css';

interface TagFormProps {
  tagName: string;
  setTagName: (value: string) => void;
  tagColor: string;
  setTagColor: (value: string) => void;
  isEditing: boolean;
  editingTagName: string | null;
  cleanPreviewName: string;
  onSubmit: (event: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export const TagForm: React.FC<TagFormProps> = ({
  tagName,
  setTagName,
  tagColor,
  setTagColor,
  isEditing,
  editingTagName,
  cleanPreviewName,
  onSubmit,
  onCancelEdit
}) => (
  <form onSubmit={onSubmit} className="tag-form-box">
    <div className={styles.formHeader}>
      <span className="project-section-label" style={{ marginBottom: 0 }}>
        {isEditing ? `Edit Tag: #${editingTagName}` : 'Create New Tag'}
      </span>

      <div
        className="tag-live-preview-pill"
        style={{ backgroundColor: `${tagColor}22`, borderColor: tagColor, color: tagColor }}
      >
        <Hash size={12} />
        <span>{cleanPreviewName}</span>
      </div>
    </div>

    <div className={styles.formRow}>
      <div className={styles.inputWrap}>
        <input
          type="text"
          placeholder="Tag name (e.g. backend, priority, client)..."
          value={tagName}
          onChange={event => setTagName(event.target.value)}
          className="project-text-input"
          style={{ paddingLeft: '28px' }}
          maxLength={30}
          autoFocus
          required
        />
        <div className={styles.hashIcon}>
          <Hash size={14} />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={!tagName.trim()}
        style={{ backgroundColor: tagColor, boxShadow: `0 4px 12px ${tagColor}44`, padding: '9px 16px', whiteSpace: 'nowrap' }}
      >
        {isEditing ? <Check size={16} /> : <Plus size={16} />}
        <span>{isEditing ? 'Update Tag' : 'Add Tag'}</span>
      </button>

      {isEditing && (
        <button type="button" className="btn-secondary" onClick={onCancelEdit} style={{ padding: '9px 12px' }}>
          Cancel
        </button>
      )}
    </div>

    <div className={styles.colorSection}>
      <ColorSwatchGrid
        value={tagColor}
        onChange={setTagColor}
        label="Tag Color Theme"
      />
    </div>
  </form>
);
