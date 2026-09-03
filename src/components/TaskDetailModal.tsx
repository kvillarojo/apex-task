import React, { useEffect, useState } from 'react';
import { X, Trash2, Plus, Tag as TagIcon } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { Priority, RecurrenceRule, TaskStatus } from '../types/todo';

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
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Edit Task Details</h2>
          <button
            onClick={() => setEditingTask(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
          {/* Title */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TITLE</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                marginTop: '4px'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DESCRIPTION</label>
            <textarea
              rows={6}
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                marginTop: '4px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Row 1: Priority, Status, Project & Assignee */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PRIORITY</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                <option value="p1">P1 - Urgent</option>
                <option value="p2">P2 - High</option>
                <option value="p3">P3 - Medium</option>
                <option value="p4">P4 - Low</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>STATUS</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as TaskStatus)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROJECT</label>
              <select
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ASSIGNEE</label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                <option value="">Unassigned</option>
                {assignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Due Date & Time & Recurrence */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DUE DATE</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DUE TIME</label>
              <input
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>RECURRING</label>
              <select
                value={recurring}
                onChange={e => setRecurring(e.target.value as RecurrenceRule)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>SUBTASKS</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              {editingTask.subtasks.map(st => (
                <div key={st.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '6px', backgroundColor: 'var(--bg-input)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => toggleSubtask(editingTask.id, st.id)}
                    />
                    <span style={{ fontSize: '0.85rem', textDecoration: st.completed ? 'line-through' : 'none' }}>{st.title}</span>
                  </div>
                  <button
                    onClick={() => deleteSubtask(editingTask.id, st.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--priority-p1)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <form onSubmit={handleAddSubtask} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="New subtask title..."
                  value={newSubtaskTitle}
                  onChange={e => setNewSubtaskTitle(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.8rem'
                  }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                  <Plus size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Tags */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>TAGS</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {tags.map(t => {
                const color = getTagColor(t);
                return (
                  <span
                    key={t}
                    className="badge"
                    style={{
                      padding: '4px 8px',
                      fontSize: '0.8rem',
                      color,
                      backgroundColor: `${color}18`,
                      borderColor: `${color}40`
                    }}
                  >
                    <TagIcon size={12} /> #{t}
                    <button
                      onClick={() => handleRemoveTag(t)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'inherit',
                        cursor: 'pointer',
                        marginLeft: '4px',
                        fontWeight: 700
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                marginTop: '6px'
              }}
            />

            {/* Auto-suggest Dropdown */}
            {tagSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'var(--bg-modal)',
                  border: '1px solid var(--border-highlight)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 20,
                  maxHeight: '140px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '4px'
                }}
              >
                {tagSuggestions.map(suggestion => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => selectSuggestion(suggestion)}
                    className="suggestion-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <TagIcon size={12} color="var(--primary)" />
                    <span>#{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <button
            className="btn-secondary"
            style={{ color: 'var(--priority-p1)' }}
            onClick={() => {
              deleteTask(editingTask.id);
              setEditingTask(null);
            }}
          >
            Delete Task
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" onClick={() => setEditingTask(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
