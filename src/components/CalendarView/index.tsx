import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { getCalendarGrid, getTodayString } from '../../utils/dateUtils';
import { TaskItem } from '../TaskItem';
import type { Task } from '../../types/todo';
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

const formatScheduleHeading = (dateString: string) => {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
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
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

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

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(getTodayString());
  };

  const tasksForSelectedDate = tasks.filter(task => task.dueDate === selectedDate);
  const openCount = tasksForSelectedDate.filter(task => !task.completed).length;

  return (
    <div className={styles.calendarView}>
      <div className={styles.calendarHeader}>
        <h2 className={styles.monthTitle}>
          {monthNames[month]} {year}
        </h2>

        <div className={styles.calendarActions}>
          <button type="button" className="icon-button" onClick={handlePrevMonth} aria-label="Previous month">
            <ChevronLeft size={18} />
          </button>
          <button type="button" className={`btn-secondary ${styles.todayBtn}`} onClick={handleToday}>
            Today
          </button>
          <button type="button" className="icon-button" onClick={handleNextMonth} aria-label="Next month">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className={styles.calendarBody}>
        <div className={styles.calendarSurface}>
          <div className={styles.calendarGrid}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(dayName => (
              <div key={dayName} className={styles.weekday}>
                {dayName}
              </div>
            ))}

            {gridDays.map(cell => {
              const dayTasks = tasks.filter(task => task.dueDate === cell.dateString);
              const isSelected = selectedDate === cell.dateString;

              return (
                <button
                  key={cell.dateString}
                  type="button"
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
                    {dayTasks.length > 2 && (
                      <span className={styles.moreBadge}>+{dayTasks.length - 2} more</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside className={styles.scheduleSidebar} aria-label="Task schedule">
          <div className={styles.scheduleHeader}>
            <div className={styles.scheduleHeadingBlock}>
              <span className={styles.scheduleEyebrow}>
                <CalendarDays size={14} />
                Schedule
              </span>
              <h3 className={styles.scheduleTitle}>{formatScheduleHeading(selectedDate)}</h3>
              <p className={styles.scheduleMeta}>
                {tasksForSelectedDate.length === 0
                  ? 'No tasks on this day'
                  : `${openCount} open · ${tasksForSelectedDate.length} total`}
              </p>
            </div>
          </div>

          <div className={styles.scheduleBody}>
            {tasksForSelectedDate.length === 0 ? (
              <p className={styles.emptyState}>Select another day or add a due date to a task.</p>
            ) : (
              <div className={styles.detailsList}>
                {tasksForSelectedDate.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
