import React from 'react';
import { Trash2, Pin } from 'lucide-react';
import { Modal, ModalHeader, ModalFooter, ModalId, ModalSize } from '../common';
import { DescriptionEditor } from '../DescriptionEditor';
import { useNoteDetailModal } from './useNoteDetailModal';
import { NoteOrganizationPanel } from './NoteOrganizationPanel';
import { ReminderPanel } from './ReminderPanel';
import { MobilePickerSheet } from './MobilePickerSheet';

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

  return (
    <Modal
      open={open}
      onClose={close}
      size={ModalSize.Ticket}
      themeComponent={ModalId.NoteDetail}
      className="ticket-modal-card note-modal-card"
      style={{ borderLeft: color ? `6px solid ${color}` : undefined }}
    >
      <ModalHeader
        variant="ticket"
        title={isNew ? 'New Note' : 'Edit Note'}
        onClose={close}
      >
        <button
          type="button"
          className={`note-pin-pill-btn ${isPinned ? 'active' : ''}`}
          onClick={() => setIsPinned(!isPinned)}
          title={isPinned ? 'Pinned to top' : 'Click to pin note'}
        >
          <Pin size={13} />
          <span>{isPinned ? 'Pinned' : 'Pin note'}</span>
        </button>
      </ModalHeader>

      <div className="ticket-modal-body">
        <div className="ticket-modal-column-left">
          <div className="form-group">
            <label>TITLE</label>
            <input
              type="text"
              value={title}
              placeholder="Note title..."
              onChange={event => setTitle(event.target.value)}
              className="form-input form-input-title"
              autoFocus={isNew}
            />
          </div>

          <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label>CONTENT</label>
            <div style={{ flex: 1, minHeight: '260px' }}>
              <DescriptionEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>

        <aside className="ticket-modal-column-right">
          <NoteOrganizationPanel
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
            onOpenProjectPicker={() => setMobilePicker('project')}
            onOpenTagsPicker={() => setMobilePicker('tags')}
          />
          <ReminderPanel
            reminderDate={reminderDate}
            reminderTime={reminderTime}
            reminderSummary={reminderSummary}
            notificationsEnabled={notificationsEnabled}
            setReminderDate={setReminderDate}
            setReminderTime={setReminderTime}
            onApplyPreset={applyPreset}
            onEnableNotifications={handleEnableNotifications}
          />
        </aside>
      </div>

      <ModalFooter variant="ticket">
        {!isNew && editingNote ? (
          <button type="button" className="btn-secondary btn-danger" onClick={handleDelete}>
            <Trash2 size={14} style={{ marginRight: '4px' }} />
            Delete Note
          </button>
        ) : (
          <div />
        )}

        <div className="footer-actions">
          <button type="button" className="btn-secondary" onClick={close}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            {isNew ? 'Create Note' : 'Save Changes'}
          </button>
        </div>
      </ModalFooter>

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
