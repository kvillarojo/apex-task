import React from 'react';
import { useTodo } from '../../context/TodoContext';
import type { TaskStatus, Task } from '../../types/todo';
import { TaskItem } from '../TaskItem';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styles from './KanbanView.module.css';

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
    <div {...getThemeComponentProps(ThemeComponent.KanbanView)} className="kanban-grid">
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
              <div className={styles.columnTitle}>
                <span className={styles.columnDot} style={{ backgroundColor: col.color }} />
                <span>{col.label}</span>
              </div>
              <span className="nav-badge">{columnTasks.length}</span>
            </div>

            <div className={`kanban-task-list ${styles.taskList}`}>
              {columnTasks.map((task: Task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={e => e.dataTransfer.setData('text/plain', task.id)}
                  className={styles.draggableTask}
                >
                  <TaskItem task={task} variant="kanban" />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className={styles.emptyColumn}>
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
