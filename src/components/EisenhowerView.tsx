import React from 'react';
import { useTodo } from '../context/TodoContext';
import { TaskItem } from './TaskItem';
import type { Priority } from '../types/todo';

const QUADRANTS: { priority: Priority; title: string; subtitle: string; class: string }[] = [
  { priority: 'p1', title: 'Quadrant 1: Do First', subtitle: 'Urgent & High Priority', class: 'matrix-q1' },
  { priority: 'p2', title: 'Quadrant 2: Schedule', subtitle: 'Important, Long-term Value', class: 'matrix-q3' },
  { priority: 'p3', title: 'Quadrant 3: Delegate', subtitle: 'Urgent, Low Complexity', class: 'matrix-q2' },
  { priority: 'p4', title: 'Quadrant 4: Eliminate', subtitle: 'Low Priority / Backlog', class: 'matrix-q4' }
];

export const EisenhowerView: React.FC = () => {
  const { filteredTasks } = useTodo();

  return (
    <div className="matrix-grid">
      {QUADRANTS.map(q => {
        const qTasks = filteredTasks.filter(t => t.priority === q.priority && !t.completed);
        return (
          <div key={q.priority} className={`matrix-quadrant ${q.class}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{q.title}</h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.subtitle}</span>
              </div>
              <span className="nav-badge">{qTasks.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
              {qTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}

              {qTasks.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No tasks in this quadrant
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
