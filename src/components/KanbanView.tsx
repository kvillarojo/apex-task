import React from 'react';
import { useTodo } from '../context/TodoContext';
import type { TaskStatus, Task } from '../types/todo';
import { TaskItem } from './TaskItem';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: '#3b82f6' },
  { status: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { status: 'done', label: 'Done', color: '#10b981' },
  { status: 'archived', label: 'Archived', color: '#64748b' }
];

export const KanbanView: React.FC = () => {
  const { filteredTasks, moveTaskStatus } = useTodo();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, status);
    }
  };

  return (
    <div className="kanban-grid">
      {COLUMNS.map(col => {
        const columnTasks = filteredTasks.filter(t => t.status === col.status);
        return (
          <div
            key={col.status}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, col.status)}
          >
            <div className="kanban-column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: col.color }} />
                <span>{col.label}</span>
              </div>
              <span className="nav-badge">{columnTasks.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
              {columnTasks.map((task: Task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', task.id)}
                  style={{ cursor: 'grab' }}
                >
                  <TaskItem task={task} />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                  }}
                >
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
