import React from 'react';
import { Search } from 'lucide-react';
import { TagListItem } from './TagListItem';

interface TagListProps {
  allTagsCount: number;
  filteredTagsList: string[];
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  editingTagName: string | null;
  getTagColor: (tag: string) => string;
  tagUsageCount: (tag: string) => number;
  onEdit: (tag: string) => void;
  onDelete: (tag: string) => void;
}

export const TagList: React.FC<TagListProps> = ({
  allTagsCount,
  filteredTagsList,
  searchQuery,
  setSearchQuery,
  editingTagName,
  getTagColor,
  tagUsageCount,
  onEdit,
  onDelete
}) => (
  <div className="project-modal-section">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span className="project-section-label">All Tags ({allTagsCount})</span>

      <div style={{ position: 'relative', width: '180px' }}>
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 8px 4px 26px',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-primary)',
            fontSize: '0.75rem',
            outline: 'none'
          }}
        />
        <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
      </div>
    </div>

    <div className="tag-manager-list">
      {filteredTagsList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          {allTagsCount === 0 ? 'No tags created yet. Use the presets or form above to add tags!' : 'No matching tags found.'}
        </div>
      ) : (
        filteredTagsList.map(tag => (
          <TagListItem
            key={tag}
            tag={tag}
            color={getTagColor(tag)}
            usageCount={tagUsageCount(tag)}
            isCurrentlyEditing={editingTagName === tag}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  </div>
);