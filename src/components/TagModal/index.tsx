import React from 'react';
import { TagIcon } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalId, ModalSize } from '../common';
import { useTagModal } from './useTagModal';
import { TagPresets } from './TagPresets';
import { TagForm } from './TagForm';
import { TagList } from './TagList';
import styles from './TagModal.module.css';

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

  return (
    <Modal
      open={tagModalOpen}
      onClose={closeTagModal}
      size={ModalSize.Md}
      themeComponent={ModalId.Tag}
      className={`tag-modal-card ${styles.card}`}
      style={{ padding: 0, overflow: 'hidden', maxHeight: '88vh' }}
    >
      <ModalHeader
        title="Manage & Create Tags"
        subtitle="Customize tag colors, organize labels, and manage task tags"
        icon={
          <div
            className={styles.headerIcon}
            style={{ backgroundColor: `${tagColor}22`, color: tagColor, boxShadow: `0 0 12px ${tagColor}33` }}
          >
            <TagIcon size={20} />
          </div>
        }
        onClose={closeTagModal}
      />

      <ModalBody style={{ gap: '16px' }}>
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
      </ModalBody>

      <ModalFooter>
        <div className={styles.footerTip}>
          Tip: You can also create tags quickly while typing task titles with <code>#tag</code>
        </div>
        <button type="button" className="btn-primary" onClick={closeTagModal}>
          Done
        </button>
      </ModalFooter>
    </Modal>
  );
};
