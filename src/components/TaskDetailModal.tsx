import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { Priority, RecurrenceRule, TaskStatus } from '../types/todo';
import { DescriptionEditor } from './DescriptionEditor';

export const TaskDetailModal: React.FC = () => {
  const {
    editingTask,
    setEditingTask,
    updateTask,
    deleteTask,
    projects,
    assignees,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    allTags,
    getTagColor
  } = useTodo();

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority || 'p4');
  const [status, setStatus] = useState<TaskStatus>(editingTask?.status || 'todo');
  const [projectId, setProjectId] = useState(editingTask?.projectId || '');
  const [assigneeId, setAssigneeId] = useState(editingTask?.assigneeId || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '');
  const [recurring, setRecurring] = useState<RecurrenceRule>(editingTask?.recurring || 'none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingTask?.tags || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (!editingTask) {
      setTitle('');
      setDescription('');
      setPriority('p4');
      setStatus('todo');
      setProjectId('');
      setAssigneeId('');
      setDueDate('');
      setDueTime('');
      setRecurring('none');
      setTags([]);
      setTagInput('');
      setNewSubtaskTitle('');
      return;
    }

    setTitle(editingTask.title);
    setDescription(editingTask.description || '');
    setPriority(editingTask.priority);
    setStatus(editingTask.status);
    setProjectId(editingTask.projectId);
    setAssigneeId(editingTask.assigneeId || '');
    setDueDate(editingTask.dueDate || '');
    setDueTime(editingTask.dueTime || '');
    setRecurring(editingTask.recurring);
    setTags([...editingTask.tags]);
    setTagInput('');
    setNewSubtaskTitle('');
  }, [editingTask]);

  if (!editingTask) return null;

  // Auto-suggest tags
  const cleanInput = tagInput.trim().toLowerCase().replace(/^#/, '');
  const tagSuggestions = cleanInput
    ? allTags.filter(t => t.toLowerCase().includes(cleanInput) && !tags.includes(t))
    : [];

  const selectSuggestion = (tagToSelect: string) => {
    if (!tags.includes(tagToSelect)) {
      setTags([...tags, tagToSelect]);
    }
    setTagInput('');
  };

  const handleSave = () => {
    if (!title.trim()) return;
    updateTask(editingTask.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      completed: status === 'done',
      completedAt: status === 'done' ? (editingTask.completedAt || new Date().toISOString()) : undefined,
      projectId,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      recurring,
      tags
    });
    setEditingTask(null);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (tagSuggestions.length > 0) {
        selectSuggestion(tagSuggestions[0]);
      } else if (cleanInput) {
        if (!tags.includes(cleanInput)) {
          setTags([...tags, cleanInput]);
        }
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(editingTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className="modal-overlay" onClick={() => setEditingTask(null)}>
      <div className="modal-card ticket-modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <header className="ticket-modal-header">
          <div>
            <span className="ticket-modal-eyebrow">Ticket details</span>
          </div>
          <button
            onClick={() => setEditingTask(null)}
            className="ticket-modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </header>

        {/* Main Body: Two-Column Layout */}
        <div className="ticket-modal-body">
          {/* Left Column: Main Content */}
          <div className="ticket-modal-column-left">
            {/* Title Section */}
            <div className="form-group">
              <label>TITLE</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="form-input form-input-title"
              />
            </div>

            {/* Description Section */}
            <div className="form-group">
              <label>DESCRIPTION</label>
              <DescriptionEditor value={description} onChange={setDescription} />
            </div>

            {/* Subtasks Section */}
            <div className="form-group">
              <label>SUBTASKS</label>
              <div className="subtasks-list">
                {editingTask.subtasks.map(st => (
                  <div key={st.id} className="subtask-item">
                    <div className="subtask-content">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(editingTask.id, st.id)}
                        className="subtask-checkbox"
                      />
                      <span className={st.completed ? 'subtask-text completed' : 'subtask-text'}>
                        {st.title}
                      </span>
                    </div>
                    <button
                      onClick={() => deleteSubtask(editingTask.id, st.id)}
                      className="subtask-delete-btn"
                      aria-label="Delete subtask"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                <form onSubmit={handleAddSubtask} className="subtask-input-form">
                  <input
                    type="text"
                    placeholder="New subtask title..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    className="form-input form-input-subtask"
                  />
                  <button type="submit" className="btn-secondary btn-icon">
                    <Plus size={14} />
                  </button>
                </form>
              </div>
            </div>

            {/* Tags Section */}
            <div className="form-group form-group-tags">
              <label>TAGS</label>
              <div className="tags-container">
                <div className="tags-list">
                  {tags.map(t => {
                    const color = getTagColor(t);
                    return (
                      <span
                        key={t}
                        className="badge"
                        style={{
                          color,
                          backgroundColor: `${color}18`,
                          borderColor: `${color}40`
                        }}
                      >
                        <TagIcon size={12} /> #{t}
                        <button
                          onClick={() => handleRemoveTag(t)}
                          className="badge-close-btn"
                          aria-label={`Remove tag ${t}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Type tag and press Enter..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="form-input form-input-tag"
                  />

                  {/* Auto-suggest Dropdown */}
                  {tagSuggestions.length > 0 && (
                    <div className="tag-suggestions">
                      {tagSuggestions.map(suggestion => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => selectSuggestion(suggestion)}
                          className="suggestion-item"
                        >
                          <TagIcon size={12} />
                          <span>#{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Panels */}
          <aside className="ticket-modal-column-right">
            {/* Details Panel */}
            <section className="details-panel">
              <h3 className="panel-title">Details</h3>
              <div className="panel-content">
                {/* Priority & Status Row */}
                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label>PRIORITY</label>
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as Priority)}
                      className="form-input"
                    >
                      <option value="p1">P1 - Urgent</option>
                      <option value="p2">P2 - High</option>
                      <option value="p3">P3 - Medium</option>
                      <option value="p4">P4 - Low</option>
                    </select>
                  </div>

                  <div className="form-group form-group-half">
                    <label>STATUS</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as TaskStatus)}
                      className="form-input"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Project & Assignee Row */}
                <div className="form-row">
                  <div className="form-group form-group-half">
                    <label>PROJECT</label>
                    <select
                      value={projectId}
                      onChange={e => setProjectId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Select project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-group-half">
                    <label>ASSIGNEE</label>
                    <select
                      value={assigneeId}
                      onChange={e => setAssigneeId(e.target.value)}
                      className="form-input"
                    >
                      <option value="">Unassigned</option>
                      {assignees.map(assignee => (
                        <option key={assignee.id} value={assignee.id}>
                          {assignee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Planning Panel */}
            <section className="planning-panel">
              <h3 className="panel-title">Planning</h3>
              <div className="panel-content">
                {/* Due Date & Time & Recurrence */}
                <div className="form-group">
                  <label>DUE DATE</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>DUE TIME</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={e => setDueTime(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>RECURRING</label>
                  <select
                    value={recurring}
                    onChange={e => setRecurring(e.target.value as RecurrenceRule)}
                    className="form-input"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <footer className="ticket-modal-footer">
          <button
            className="btn-secondary btn-danger"
            onClick={() => {
              deleteTask(editingTask.id);
              setEditingTask(null);
            }}
          >
            Delete Task
          </button>
          <div className="footer-actions">
            <button className="btn-secondary" onClick={() => setEditingTask(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
