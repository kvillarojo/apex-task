import React, { useState, useEffect } from 'react';
import { Plus, X, Maximize2 } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import type { TaskStatus, Task } from '../../types/todo';
import { TaskItem } from '../TaskItem';
import { TaskInput } from '../TaskInput';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps, mergeThemeStyles } from '../../theme';
import styles from './KanbanView.module.css';

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To Do', color: '#3b82f6' },
  { status: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { status: 'done', label: 'Done', color: '#10b981' },
  { status: 'archived', label: 'Archived', color: '#64748b' }
];

export const KanbanView: React.FC = () => {
  const { filteredTasks, moveTaskStatus, openCreateTaskModal, pomodoro, filter } = useTodo();
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickCreateStatus, setQuickCreateStatus] = useState<TaskStatus>('todo');

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

  const handleOpenQuickCreate = (status: TaskStatus = 'todo') => {
    setQuickCreateStatus(status);
    setShowQuickCreate(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showQuickCreate) {
        setShowQuickCreate(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQuickCreate]);

  const isPomodoroOpen = pomodoro.isVisible && !pomodoro.isMaximized;

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
              <div className={styles.columnHeaderRight}>
                <span className="nav-badge">{columnTasks.length}</span>
                <button
                  type="button"
                  className={styles.columnAddBtn}
                  onClick={() => handleOpenQuickCreate(col.status)}
                  title={`Add task to ${col.label}`}
                  aria-label={`Add task to ${col.label}`}
                >
                  <Plus size={14} />
                </button>
              </div>
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

      {/* Quick Create Task Popover Card (Same TaskInput feature as ListView) */}
      {showQuickCreate && (
        <>
          <div className={styles.quickCreateBackdrop} onClick={() => setShowQuickCreate(false)} />
          <div
            data-theme-component={ThemeComponent.KanbanView}
            className={`${styles.quickCreateCard} ${isPomodoroOpen ? styles.pomodoroOpen : ''}`}
            style={mergeThemeStyles(ThemeComponent.KanbanView, {})}
          >
            <div className={styles.quickCreateCardHeader}>
              <div className={styles.quickCreateCardTitle}>
                <Plus size={16} color="var(--primary)" />
                <span>Quick Create Task</span>
                <select
                  value={quickCreateStatus}
                  onChange={e => setQuickCreateStatus(e.target.value as TaskStatus)}
                  className={styles.statusSelect}
                >
                  {COLUMNS.map(col => (
                    <option key={col.status} value={col.status}>
                      {col.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.quickCreateHeaderActions}>
                <button
                  type="button"
                  className={styles.headerActionBtn}
                  onClick={() => {
                    setShowQuickCreate(false);
                    openCreateTaskModal({ status: quickCreateStatus, projectId: filter.projectId || 'inbox' });
                  }}
                  title="Open full ticket details modal"
                  aria-label="Open full ticket details modal"
                >
                  <Maximize2 size={14} />
                </button>
                <button
                  type="button"
                  className={styles.headerActionBtn}
                  onClick={() => setShowQuickCreate(false)}
                  title="Close quick create"
                  aria-label="Close quick create"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <TaskInput
              autoFocus
              defaultStatus={quickCreateStatus}
              defaultProjectId={filter.projectId || 'inbox'}
              onCreated={() => setShowQuickCreate(false)}
            />
          </div>
        </>
      )}

      {/* Quick Create Task Ticket Button (Floating on top of Pomodoro) */}
      <button
        type="button"
        onClick={() => handleOpenQuickCreate('todo')}
        data-theme-component={ThemeComponent.KanbanView}
        className={`${styles.quickCreateBtn} ${isPomodoroOpen ? styles.pomodoroOpen : ''}`}
        style={mergeThemeStyles(ThemeComponent.KanbanView, {})}
        title="Quick Create Task"
        aria-label="Quick Create Task"
      >
        <Plus size={24} className={styles.quickCreateIcon} />
      </button>
    </div>
  );
};
