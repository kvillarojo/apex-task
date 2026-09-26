import React from 'react';
import { ArrowUpDown, CheckCircle, CheckCircle2, Circle } from 'lucide-react';
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

  const currentStatusFilter = filter.statusFilter || 'all';

  return (
    <div {...getThemeComponentProps(ThemeComponent.ListView)} className={styles.view}>
      {/* Quick Add Bar */}
      <TaskInput />

      {/* Sort & Controls Header */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.taskCount}>
            Showing <span className={styles.taskCountValue}>{filteredTasks.length}</span> tasks
          </div>

          {/* Status Filter (All / Not Done / Done) */}
          <div className={styles.statusFilter} role="group" aria-label="Task completion filter">
            <button
              type="button"
              onClick={() => setFilter({ statusFilter: 'all' })}
              className={`${styles.filterButton} ${currentStatusFilter === 'all' ? styles.filterActive : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter({ statusFilter: 'active' })}
              className={`${styles.filterButton} ${currentStatusFilter === 'active' ? styles.filterActive : ''}`}
              title="Show active tasks only"
            >
              <Circle size={12} className={styles.btnIcon} />
              <span>Active</span>
            </button>
            <button
              type="button"
              onClick={() => setFilter({ statusFilter: 'completed' })}
              className={`${styles.filterButton} ${currentStatusFilter === 'completed' ? styles.filterActive : ''}`}
              title="Show Done tasks only"
            >
              <CheckCircle2 size={12} className={styles.btnIcon} />
              <span>Done</span>
            </button>
          </div>
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
