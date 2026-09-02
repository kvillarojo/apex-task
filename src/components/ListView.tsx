import React from 'react';
import { ArrowUpDown, CheckCircle } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { TaskItem } from './TaskItem';
import { TaskInput } from './TaskInput';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Quick Add Bar */}
      <TaskInput />

      {/* Sort & Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Showing <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{filteredTasks.length}</span> tasks
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Sort by:</span>
          <button
            className={`btn-secondary ${filter.sortBy === 'dueDate' ? 'active' : ''}`}
            onClick={() => handleSortToggle('dueDate')}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            Due Date {filter.sortBy === 'dueDate' && <ArrowUpDown size={12} style={{ marginLeft: '4px' }} />}
          </button>

          <button
            className={`btn-secondary ${filter.sortBy === 'priority' ? 'active' : ''}`}
            onClick={() => handleSortToggle('priority')}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            Priority {filter.sortBy === 'priority' && <ArrowUpDown size={12} style={{ marginLeft: '4px' }} />}
          </button>

          <button
            className={`btn-secondary ${filter.sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSortToggle('title')}
            style={{ padding: '4px 8px', fontSize: '0.75rem' }}
          >
            Title {filter.sortBy === 'title' && <ArrowUpDown size={12} style={{ marginLeft: '4px' }} />}
          </button>
        </div>
      </div>

      {/* Task List items */}
      {filteredTasks.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px border var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle size={48} color="var(--primary)" style={{ opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>All Clear! No tasks found.</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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
