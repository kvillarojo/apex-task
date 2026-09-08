import React from 'react';
import { Edit2, Trash2, Hash } from 'lucide-react';

interface TagListItemProps {
  tag: string;
  color: string;
  usageCount: number;
  isCurrentlyEditing: boolean;
  onEdit: (tag: string) => void;
  onDelete: (tag: string) => void;
}

export const TagListItem: React.FC<TagListItemProps> = ({
  tag,
  color,
  usageCount,
  isCurrentlyEditing,
  onEdit,
  onDelete
}) => (
  <div className={`tag-manager-item ${isCurrentlyEditing ? 'active-edit' : ''}`}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className="tag-pill-badge" style={{ backgroundColor: `${color}20`, borderColor: `${color}55`, color }}>
        <Hash size={12} />
        <span>{tag}</span>
      </span>
      <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
        {usageCount} {usageCount === 1 ? 'task' : 'tasks'}
      </span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <button type="button" className="tag-action-btn" onClick={() => onEdit(tag)} title={`Edit #${tag}`}>
        <Edit2 size={13} />
      </button>
      <button type="button" className="tag-action-btn delete-btn" onClick={() => onDelete(tag)} title={`Delete #${tag}`}>
        <Trash2 size={13} />
      </button>
    </div>
  </div>
);