import React from 'react';
import { Modal, ModalId, ModalSize } from '../common';
import { useNoteDetailModal } from './useNoteDetailModal';
import { NoteChrome } from './NoteChrome';
import { NoteWritingArea } from './NoteWritingArea';
import { NoteMetaRail } from './NoteMetaRail';
import { MobilePickerSheet } from './MobilePickerSheet';
import styles from './NoteDetailModal.module.css';

export const NoteDetailModal: React.FC = () => {
  const {
    open,
    close,
    isNew,
    editingNote,
    title,
    setTitle,
    content,
    setContent,
    projectId,
    setProjectId,
    tags,
    setTags,
    tagInput,
    setTagInput,
    isPinned,
    setIsPinned,
    color,
    setColor,
    reminderDate,
    setReminderDate,
    reminderTime,
    setReminderTime,
    mobilePicker,
    setMobilePicker,
    tagSearch,
    setTagSearch,
    notificationsEnabled,
    projects,
    noteTags,
    getTagColor,
    selectedProject,
    reminderSummary,
    mobileTagResults,
    toggleMobileTag,
    handleEnableNotifications,
    applyPreset,
    handleSave,
    handleDelete,
    createTagFromSearch
  } = useNoteDetailModal();

  const sheetStyle = {
    '--note-accent': color || 'var(--primary)',
    borderTopColor: color || 'transparent'
  } as React.CSSProperties;

  return (
    <Modal
      open={open}
      onClose={close}
      size={ModalSize.Auto}
      themeComponent={ModalId.NoteDetail}
      className={styles.sheet}
      style={sheetStyle}
    >
      <NoteChrome
        isNew={isNew}
        isPinned={isPinned}
        onTogglePin={() => setIsPinned(!isPinned)}
        onClose={close}
      />

      <NoteWritingArea
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        autoFocusTitle={isNew}
      />

      <NoteMetaRail
        isNew={isNew}
        projectId={projectId}
        setProjectId={setProjectId}
        projects={projects}
        selectedProject={selectedProject}
        tags={tags}
        setTags={setTags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        noteTags={noteTags}
        getTagColor={getTagColor}
        color={color}
        setColor={setColor}
        reminderDate={reminderDate}
        reminderTime={reminderTime}
        reminderSummary={reminderSummary}
        notificationsEnabled={notificationsEnabled}
        setReminderDate={setReminderDate}
        setReminderTime={setReminderTime}
        onApplyPreset={applyPreset}
        onEnableNotifications={handleEnableNotifications}
        onOpenProjectPicker={() => setMobilePicker('project')}
        onOpenTagsPicker={() => setMobilePicker('tags')}
        onDelete={!isNew && editingNote ? handleDelete : undefined}
        onClose={close}
        onSave={handleSave}
      />

      {mobilePicker && (
        <MobilePickerSheet
          mode={mobilePicker}
          projects={projects}
          projectId={projectId}
          setProjectId={setProjectId}
          tags={tags}
          noteTags={noteTags}
          tagSearch={tagSearch}
          setTagSearch={setTagSearch}
          mobileTagResults={mobileTagResults}
          getTagColor={getTagColor}
          onToggleTag={toggleMobileTag}
          onCreateTag={createTagFromSearch}
          onClose={() => setMobilePicker(null)}
        />
      )}
    </Modal>
  );
};
