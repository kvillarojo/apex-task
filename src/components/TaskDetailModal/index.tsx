import React from 'react';
import { Modal, ModalHeader, ModalFooter, ModalId, ModalSize } from '../common';
import { formatISODateTime } from '../../utils/dateUtils';
import { DescriptionEditor } from '../DescriptionEditor';
import { useTaskDetailModal } from './useTaskDetailModal';
import { SubtasksSection } from './SubtasksSection';
import { CommentsSection } from './CommentsSection';
import { TaskDetailsPanel, TaskPlanningPanel } from './TaskSidePanels';

export const TaskDetailModal: React.FC = () => {
  const {
    editingTask,
    close,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    projectId,
    setProjectId,
    assigneeId,
    setAssigneeId,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime,
    recurring,
    setRecurring,
    tagInput,
    setTagInput,
    tags,
    setTags,
    newSubtaskTitle,
    setNewSubtaskTitle,
    projects,
    assignees,
    allTags,
    getTagColor,
    completedSubtasksCount,
    totalSubtasksCount,
    subtasksPercent,
    toggleSubtask,
    deleteSubtask,
    addComment,
    updateComment,
    deleteComment,
    handleSave,
    handleDelete,
    handleAddSubtask,
    notificationsEnabled,
    handleEnableNotifications,
    saveStatus
  } = useTaskDetailModal();

  if (!editingTask) return null;

  const saveStatusLabel =
    saveStatus === 'pending' || saveStatus === 'saving'
      ? 'Saving…'
      : saveStatus === 'saved'
        ? 'Saved'
        : 'Autosave on';

  return (
    <Modal
      open
      onClose={close}
      size={ModalSize.Ticket}
      themeComponent={ModalId.TaskDetail}
      className="ticket-modal-card"
    >
      <ModalHeader variant="ticket" title="Task details" onClose={close}>
        <span className={`badge badge-priority ${priority}`}>{priority.toUpperCase()}</span>
      </ModalHeader>

      <div className="ticket-modal-body">
        <div className="ticket-modal-column-left">
          <div className="form-group">
            <label>TITLE</label>
            <input
              type="text"
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="form-input form-input-title"
            />
          </div>

          <div className="form-group">
            <label>DESCRIPTION</label>
            <DescriptionEditor value={description} onChange={setDescription} />
          </div>

          <SubtasksSection
            taskId={editingTask.id}
            subtasks={editingTask.subtasks}
            completedCount={completedSubtasksCount}
            totalCount={totalSubtasksCount}
            percent={subtasksPercent}
            newSubtaskTitle={newSubtaskTitle}
            setNewSubtaskTitle={setNewSubtaskTitle}
            onToggle={toggleSubtask}
            onDelete={deleteSubtask}
            onAdd={handleAddSubtask}
          />

          <CommentsSection
            taskId={editingTask.id}
            comments={editingTask.comments}
            onAdd={addComment}
            onUpdate={updateComment}
            onDelete={deleteComment}
          />
        </div>

        <aside className="ticket-modal-column-right">
          <TaskDetailsPanel
            priority={priority}
            setPriority={setPriority}
            status={status}
            setStatus={setStatus}
            projectId={projectId}
            setProjectId={setProjectId}
            assigneeId={assigneeId}
            setAssigneeId={setAssigneeId}
            projects={projects}
            assignees={assignees}
          />
          <TaskPlanningPanel
            dueDate={dueDate}
            setDueDate={setDueDate}
            dueTime={dueTime}
            setDueTime={setDueTime}
            recurring={recurring}
            setRecurring={setRecurring}
            notificationsEnabled={notificationsEnabled}
            onEnableNotifications={handleEnableNotifications}
            tags={tags}
            tagInput={tagInput}
            setTagInput={setTagInput}
            setTags={setTags}
            allTags={allTags}
            getTagColor={getTagColor}
          />
        </aside>
      </div>

      <ModalFooter variant="ticket">
        <div className="footer-left">
          <button type="button" className="btn-secondary btn-danger" onClick={handleDelete}>
            Delete Task
          </button>
          {editingTask.createdAt && (
            <span className="ticket-created-at">
              Created {formatISODateTime(editingTask.createdAt)}
            </span>
          )}
        </div>
        <div className="footer-actions">
          <span
            className={`ticket-save-status${
              saveStatus === 'pending' || saveStatus === 'saving' ? ' is-saving' : ''
            }${saveStatus === 'saved' ? ' is-saved' : ''}`}
            aria-live="polite"
          >
            {saveStatusLabel}
          </span>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Done
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
