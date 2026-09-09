import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import type { Subtask } from '../../types/todo';

interface SubtasksSectionProps {
  taskId: string;
  subtasks: Subtask[];
  completedCount: number;
  totalCount: number;
  percent: number;
  newSubtaskTitle: string;
  setNewSubtaskTitle: (value: string) => void;
  onToggle: (taskId: string, subtaskId: string) => void;
  onDelete: (taskId: string, subtaskId: string) => void;
  onAdd: (event: React.FormEvent) => void;
}

export const SubtasksSection: React.FC<SubtasksSectionProps> = ({
  taskId,
  subtasks,
  completedCount,
  totalCount,
  percent,
  newSubtaskTitle,
  setNewSubtaskTitle,
  onToggle,
  onDelete,
  onAdd
}) => (
  <div className="form-group">
    <div className="subtasks-section-header">
      <label>SUBTASKS</label>
      {totalCount > 0 && (
        <span className="subtasks-count-pill">
          {completedCount}/{totalCount} completed ({percent}%)
        </span>
      )}
    </div>
    {totalCount > 0 && (
      <div className="subtasks-progress-track">
        <div className="subtasks-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    )}
    <div className="subtasks-list">
      {subtasks.map(subtask => (
        <div key={subtask.id} className="subtask-item">
          <div className="subtask-content">
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={() => onToggle(taskId, subtask.id)}
              className="subtask-checkbox"
            />
            <span className={subtask.completed ? 'subtask-text completed' : 'subtask-text'}>
              {subtask.title}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onDelete(taskId, subtask.id)}
            className="subtask-delete-btn"
            aria-label="Delete subtask"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <form onSubmit={onAdd} className="subtask-input-form">
        <input
          type="text"
          placeholder="New subtask title..."
          value={newSubtaskTitle}
          onChange={event => setNewSubtaskTitle(event.target.value)}
          className="form-input form-input-subtask"
        />
        <button type="submit" className="btn-secondary btn-icon">
          <Plus size={14} />
        </button>
      </form>
    </div>
  </div>
);
