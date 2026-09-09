import React from 'react';
import { Modal, ModalHeader, ModalFooter, ModalId, ModalSize, TagChipInput } from '../common';
import { DescriptionEditor } from '../DescriptionEditor';
import { useTaskDetailModal } from './useTaskDetailModal';
import { SubtasksSection } from './SubtasksSection';
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
    handleSave,
    handleDelete,
    handleAddSubtask
  } = useTaskDetailModal();

  if (!editingTask) return null;

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

          <div className="form-group form-group-tags">
            <label>TAGS</label>
            <TagChipInput
              tags={tags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onTagsChange={setTags}
              availableTags={allTags}
              getTagColor={getTagColor}
            />
          </div>
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
          />
        </aside>
      </div>

      <ModalFooter variant="ticket">
        <button type="button" className="btn-secondary btn-danger" onClick={handleDelete}>
          Delete Task
        </button>
        <div className="footer-actions">
          <button type="button" className="btn-secondary" onClick={close}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};
