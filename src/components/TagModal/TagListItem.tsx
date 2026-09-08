import React from 'react';
import { Edit2, Trash2, Hash } from 'lucide-react';
import styles from './TagModal.module.css';

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
}) => {
  // Combine native global classes with structural module classes cleanly
  const containerClass = `tag-manager-item ${styles.itemContainer} ${
    isCurrentlyEditing ? `active-edit ${styles.itemContainerActive}` : ''
  }`;

  // Keep dynamic database hex codes cleanly scoped to a style constant
  const dynamicBadgeStyle = {
    backgroundColor: `${color}20`,
    borderColor: `${color}55`,
    color
  };

  return (
    <div className={containerClass}>
      <div className={styles.leftSection}>
        <span className="tag-pill-badge" style={dynamicBadgeStyle}>
          <Hash size={12} />
          <span>{tag}</span>
        </span>
        <span className={styles.usageCounter}>
          {usageCount} {usageCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div className={styles.rightSection}>
        <button 
          type="button" 
          className="tag-action-btn" 
          onClick={() => onEdit(tag)} 
          title={`Edit #${tag}`}
        >
          <Edit2 size={13} />
        </button>
        <button 
          type="button" 
          className="tag-action-btn delete-btn" 
          onClick={() => onDelete(tag)} 
          title={`Delete #${tag}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
};
