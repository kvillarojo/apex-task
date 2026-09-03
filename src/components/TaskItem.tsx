import React, { useState } from 'react';
import {
  Check,
  Calendar,
  Tag as TagIcon,
  Flag,
  Play,
  Edit2,
  Trash2,
  ChevronDown,
  Repeat,
  Plus,
  User
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { Task } from '../types/todo';
import { formatFriendlyDate, isOverdue } from '../utils/dateUtils';

export const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const {
    toggleTaskComplete,
    deleteTask,
    setEditingTask,
    projects,
    assignees,
    startPomodoro,
    addSubtask,
    toggleSubtask,
    getTagColor
  } = useTodo();

  const [expandedSubtasks, setExpandedSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const project = projects.find(p => p.id === task.projectId) || projects[0];
  const assignee = assignees.find(person => person.id === task.assigneeId);
  const dateFormatted = formatFriendlyDate(task.dueDate, task.dueTime);
  const overdue = isOverdue(task.dueDate) && !task.completed;

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox */}
      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => toggleTaskComplete(task.id)}
      >
        {task.completed && <Check size={14} />}
      </div>

      {/* Task Content */}
      <div className="task-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="task-title">{task.title}</span>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {!task.completed && (
              <button
                className="icon-button"
                style={{ width: '28px', height: '28px' }}
                onClick={() => startPomodoro(task.id)}
                title="Start Focus Timer on this task"
              >
                <Play size={12} color="var(--primary)" />
              </button>
            )}

            <button
              className="icon-button"
              style={{ width: '28px', height: '28px' }}
              onClick={() => setEditingTask(task)}
              title="Edit Task"
            >
              <Edit2 size={12} />
            </button>

            <button
              className="icon-button"
              style={{ width: '28px', height: '28px', color: 'var(--priority-p1)' }}
              onClick={() => deleteTask(task.id)}
              title="Delete Task"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && <p className="task-desc">{task.description}</p>}

        {/* Metadata Badges */}
        <div className="task-meta">
          {/* Priority */}
          <span className={`badge badge-priority ${task.priority}`}>
            <Flag size={11} />
            {task.priority.toUpperCase()}
          </span>

          {/* Project */}
          <span className="badge" style={{ color: project.color, backgroundColor: 'var(--bg-input)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: project.color }} />
            {project.name}
          </span>

          {/* Due Date */}
          {dateFormatted && (
            <span className="badge" style={{ color: overdue ? 'var(--priority-p1)' : 'var(--text-secondary)' }}>
              <Calendar size={11} />
              {dateFormatted}
            </span>
          )}

          {/* Recurring */}
          {task.recurring !== 'none' && (
            <span className="badge">
              <Repeat size={11} />
              {task.recurring}
            </span>
          )}

          {assignee && (
            <span className="badge" title={`Assigned to ${assignee.name}`}>
              <User size={11} />
              {assignee.name}
            </span>
          )}

          {/* Tags */}
          {task.tags.map(tag => {
            const color = getTagColor(tag);
            return (
              <span
                key={tag}
                className="badge"
                style={{
                  color,
                  backgroundColor: `${color}18`,
                  borderColor: `${color}40`
                }}
              >
                <TagIcon size={11} />#{tag}
              </span>
            );
          })}

          {/* Subtasks Progress Pill */}
          {totalSubtasksCount > 0 && (
            <button
              onClick={() => setExpandedSubtasks(!expandedSubtasks)}
              className="badge"
              style={{ cursor: 'pointer', border: '1px solid var(--border-color)' }}
            >
              <span>
                {completedSubtasksCount}/{totalSubtasksCount} subtasks
              </span>
              <ChevronDown
                size={12}
                style={{ transform: expandedSubtasks ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
              />
            </button>
          )}
        </div>

        {/* Subtasks Expanded List */}
        {(expandedSubtasks || totalSubtasksCount > 0) && (
          <div style={{ marginTop: '8px', paddingLeft: '12px', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {task.subtasks.map(st => (
              <div key={st.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.825rem' }}>
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => toggleSubtask(task.id, st.id)}
                  style={{ cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span style={{ textDecoration: st.completed ? 'line-through' : 'none', color: st.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                  {st.title}
                </span>
              </div>
            ))}

            {/* Quick add subtask */}
            <form onSubmit={handleAddSubtaskSubmit} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                style={{
                  flex: 1,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.775rem'
                }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}>
                <Plus size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
