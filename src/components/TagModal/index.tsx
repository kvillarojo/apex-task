import React from 'react';
import { X, TagIcon } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { useTagModal } from '../../hooks/useTagModal';
import { TagPresets } from './TagPresets';
import { TagForm } from './TagForm';
import { TagList } from './TagList';

export const TagModal: React.FC = () => {
  const { tagModalOpen, closeTagModal } = useTodo();
  const {
    allTags,
    getTagColor,
    tagName,
    setTagName,
    tagColor,
    setTagColor,
    editingTagName,
    isEditing,
    searchQuery,
    setSearchQuery,
    filteredTagsList,
    cleanPreviewName,
    tagUsageCount,
    handleStartEdit,
    handleCancelEdit,
    handleSubmit,
    handleApplyPreset,
    handleDeleteTag
  } = useTagModal();

  if (!tagModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeTagModal}>
      <div
        className="modal-card tag-modal-card"
        onClick={e => e.stopPropagation()}
        style={{ width: '580px', maxWidth: '92vw', maxHeight: '88vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}
      >
        <div className="project-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                backgroundColor: `${tagColor}22`, color: tagColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 12px ${tagColor}33`
              }}
            >
              <TagIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Manage & Create Tags</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Customize tag colors, organize labels, and manage task tags
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={closeTagModal} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        <div className="project-modal-body" style={{ gap: '16px' }}>
          <TagPresets allTags={allTags} onApplyPreset={handleApplyPreset} />

          <TagForm
            tagName={tagName}
            setTagName={setTagName}
            tagColor={tagColor}
            setTagColor={setTagColor}
            isEditing={isEditing}
            editingTagName={editingTagName}
            cleanPreviewName={cleanPreviewName}
            onSubmit={handleSubmit}
            onCancelEdit={handleCancelEdit}
          />

          <TagList
            allTagsCount={allTags.length}
            filteredTagsList={filteredTagsList}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            editingTagName={editingTagName}
            getTagColor={getTagColor}
            tagUsageCount={tagUsageCount}
            onEdit={handleStartEdit}
            onDelete={handleDeleteTag}
          />
        </div>

        <div className="project-modal-footer">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Tip: You can also create tags quickly while typing task titles with <code>#tag</code>
          </div>
          <button type="button" className="btn-primary" onClick={closeTagModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};