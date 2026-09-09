import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { getCalendarGrid } from '../utils/dateUtils';
import { TaskItem } from './TaskItem';
import type { Task } from '../types/todo';
import styles from './CalendarView.module.css';

type EventCategory = 'deployment' | 'training' | 'goLive' | 'priority' | 'default';

const categoryForTask = (task: Task): EventCategory => {
  const searchableText = `${task.title} ${task.tags.join(' ')}`.toLowerCase();

  if (/deploy|release|ship/.test(searchableText)) return 'deployment';
  if (/training|workshop|onboarding|learn/.test(searchableText)) return 'training';
  if (/go[ -]?live|launch|rollout/.test(searchableText)) return 'goLive';
  if (task.priority === 'p1') return 'priority';
  return 'default';
};

const renderEventTitle = (title: string) => {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const pieces = title.split(urlPattern);

  return pieces.map((piece, index) =>
    urlPattern.test(piece) ? (
      <a
        key={`${piece}-${index}`}
        className={styles.eventLink}
        href={piece}
        target="_blank"
        rel="noreferrer"
        onClick={event => event.stopPropagation()}
      >
        {piece}
      </a>
    ) : (
      piece
    )
  );
};

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
    <div className={styles.calendarView}>
      {/* Calendar Navigation Header */}
      <div className={styles.calendarHeader}>
        <h2 className={styles.monthTitle}>
          {monthNames[month]} {year}
        </h2>

        <div className={styles.calendarActions}>
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
      <div className={styles.calendarSurface}>
        <div className={styles.calendarGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
            <div key={dayName} className={styles.weekday}>
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
                className={`${styles.dayCell} ${cell.isCurrentMonth ? '' : styles.outsideMonth} ${
                  cell.isToday ? styles.today : ''
                } ${isSelected ? styles.selected : ''}`}
              >
                <span className={styles.dayHeader}>
                  {cell.isToday && <span className={styles.todayLabel}>Today</span>}
                  <span className={styles.dayNumber}>{cell.dayOfMonth}</span>

                  {dayTasks.length > 0 && <span className={styles.taskCount}>{dayTasks.length}</span>}
                </span>

                <span className={styles.eventList}>
                  {dayTasks.slice(0, 2).map(task => (
                    <span
                      key={task.id}
                      className={`${styles.eventChip} ${styles[categoryForTask(task)]} ${
                        task.completed ? styles.completed : ''
                      }`}
                      title={task.title}
                    >
                      {renderEventTitle(task.title)}
                    </span>
                  ))}
                  {dayTasks.length > 2 && <span className={styles.moreBadge}>+{dayTasks.length - 2} more</span>}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details drawer for selected calendar date */}
      {selectedDate && (
        <div className={styles.detailsDrawer}>
          <h3 className={styles.detailsTitle}>
            Tasks scheduled for {selectedDate}
          </h3>
          {tasksForSelectedDate.length === 0 ? (
            <p className={styles.emptyState}>No tasks scheduled on this day.</p>
          ) : (
            <div className={styles.detailsList}>
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
