import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { getCalendarGrid } from '../utils/dateUtils';
import { TaskItem } from './TaskItem';

export const CalendarView: React.FC = () => {
  const { tasks } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const gridDays = getCalendarGrid(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const tasksForSelectedDate = selectedDate
    ? tasks.filter(t => t.dueDate === selectedDate)
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Calendar Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
          {monthNames[month]} {year}
        </h2>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="icon-button" onClick={handlePrevMonth}>
            <ChevronLeft size={18} />
          </button>
          <button
            className="btn-secondary"
            onClick={() => setCurrentDate(new Date())}
            style={{ fontSize: '0.8rem', padding: '4px 10px' }}
          >
            Today
          </button>
          <button className="icon-button" onClick={handleNextMonth}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Calendar Grid Table */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          backgroundColor: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid var(--border-color)'
        }}
      >
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
          <div
            key={dayName}
            style={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              paddingBottom: '8px'
            }}
          >
            {dayName}
          </div>
        ))}

        {gridDays.map(cell => {
          const dayTasks = tasks.filter(t => t.dueDate === cell.dateString);
          const isSelected = selectedDate === cell.dateString;

          return (
            <div
              key={cell.dateString}
              onClick={() => setSelectedDate(cell.dateString)}
              style={{
                minHeight: '80px',
                padding: '6px',
                borderRadius: '8px',
                border: isSelected
                  ? '2px solid var(--primary)'
                  : cell.isToday
                  ? '1px solid var(--border-highlight)'
                  : '1px solid var(--border-color)',
                backgroundColor: cell.isCurrentMonth
                  ? isSelected
                    ? 'var(--primary-light)'
                    : 'var(--bg-sidebar)'
                  : 'rgba(0, 0, 0, 0.2)',
                opacity: cell.isCurrentMonth ? 1 : 0.4,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: cell.isToday ? 800 : 600,
                    color: cell.isToday ? 'var(--primary)' : 'var(--text-primary)'
                  }}
                >
                  {cell.dayOfMonth}
                </span>

                {dayTasks.length > 0 && (
                  <span
                    style={{
                      fontSize: '0.65rem',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      fontWeight: 700
                    }}
                  >
                    {dayTasks.length}
                  </span>
                )}
              </div>

              {/* Task Title Pills preview */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                {dayTasks.slice(0, 2).map(t => (
                  <div
                    key={t.id}
                    style={{
                      fontSize: '0.65rem',
                      padding: '2px 4px',
                      borderRadius: '4px',
                      backgroundColor: t.completed ? 'var(--bg-input)' : 'var(--primary-light)',
                      color: t.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {t.title}
                  </div>
                ))}
                {dayTasks.length > 2 && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{dayTasks.length - 2} more</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Details drawer for selected calendar date */}
      {selectedDate && (
        <div style={{ backgroundColor: 'var(--bg-card)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>
            Tasks scheduled for {selectedDate}
          </h3>
          {tasksForSelectedDate.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No tasks scheduled on this day.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasksForSelectedDate.map(t => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
