import React from 'react';
import { Check, Plus, Hash } from 'lucide-react';
import { COLOR_PALETTE } from '../ProjectModal';

interface TagFormProps {
  tagName: string;
  setTagName: (v: string) => void;
  tagColor: string;
  setTagColor: (v: string) => void;
  isEditing: boolean;
  editingTagName: string | null;
  cleanPreviewName: string;
  onSubmit: (e: React.FormEvent) => void;
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
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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

    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <div style={{ position: 'relative', flex: 1 }}>
        <input
          type="text"
          placeholder="Tag name (e.g. backend, priority, client)..."
          value={tagName}
          onChange={e => setTagName(e.target.value)}
          className="project-text-input"
          style={{ paddingLeft: '28px' }}
          maxLength={30}
          autoFocus
          required
        />
        <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
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

    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tag Color Theme</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custom:</span>
          <input
            type="color"
            value={tagColor}
            onChange={e => setTagColor(e.target.value)}
            style={{ width: '20px', height: '20px', border: 'none', borderRadius: '50%', cursor: 'pointer', background: 'transparent' }}
            title="Pick custom hex color"
          />
        </div>
      </div>

      <div className="project-color-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
        {COLOR_PALETTE.map(c => {
          const isSelected = tagColor.toLowerCase() === c.value.toLowerCase();
          return (
            <button
              key={c.name}
              type="button"
              className={`project-color-swatch ${isSelected ? 'selected' : ''}`}
              style={{ backgroundColor: c.value, width: '100%', height: '26px' }}
              onClick={() => setTagColor(c.value)}
              title={c.name}
            >
              {isSelected && <Check size={12} color="#ffffff" />}
            </button>
          );
        })}
      </div>
    </div>
  </form>
);