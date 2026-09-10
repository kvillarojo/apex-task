import React from 'react';
import { ArrowUpDown, CheckCircle } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { TaskItem } from '../TaskItem';
import { TaskInput } from '../TaskInput';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styles from './ListView.module.css';

export const ListView: React.FC = () => {
  const { filteredTasks, filter, setFilter } = useTodo();

  const handleSortToggle = (sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt') => {
    if (filter.sortBy === sortBy) {
      setFilter({ sortOrder: filter.sortOrder === 'asc' ? 'desc' : 'asc' });
    } else {
      setFilter({ sortBy, sortOrder: 'asc' });
    }
  };

  return (
    <div {...getThemeComponentProps(ThemeComponent.ListView)} className={styles.view}>
      {/* Quick Add Bar */}
      <TaskInput />

      {/* Sort & Controls Header */}
      <div className={styles.toolbar}>
        <div className={styles.taskCount}>
          Showing <span className={styles.taskCountValue}>{filteredTasks.length}</span> tasks
        </div>

        <div className={styles.sortControls}>
          <span className={styles.sortLabel}>Sort by:</span>
          <button
            onClick={() => handleSortToggle('dueDate')}
            className={`${styles.sortButton} btn-secondary ${filter.sortBy === 'dueDate' ? 'active' : ''}`}
          >
            Due Date {filter.sortBy === 'dueDate' && <ArrowUpDown size={12} className={styles.sortIcon} />}
          </button>

          <button
            className={`${styles.sortButton} btn-secondary ${filter.sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => handleSortToggle('priority')}
          >
            Priority {filter.sortBy === 'priority' && <ArrowUpDown size={12} className={styles.sortIcon} />}
          </button>

          <button
            className={`${styles.sortButton} btn-secondary ${filter.sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSortToggle('title')}
          >
            Title {filter.sortBy === 'title' && <ArrowUpDown size={12} className={styles.sortIcon} />}
          </button>
        </div>
      </div>

      {/* Task List items */}
      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <CheckCircle size={48} color="var(--primary)" className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>All Clear! No tasks found.</h3>
          <p className={styles.emptyDescription}>
            Add a new task using the input bar above or select a different filter from the sidebar.
          </p>
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};
