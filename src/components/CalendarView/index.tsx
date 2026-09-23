import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Plus } from 'lucide-react';
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
  const { tasks, addTask, filter } = useTodo();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [draftTitle, setDraftTitle] = useState('');
  const [draftTime, setDraftTime] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const gridDays = getCalendarGrid(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    setDraftTitle('');
    setDraftTime('');
  }, [selectedDate]);

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

  const handleAddTask = (event: React.FormEvent) => {
    event.preventDefault();
    const title = draftTitle.trim();
    if (!title) return;

    addTask({
      title,
      completed: false,
      status: 'todo',
      priority: 'p4',
      dueDate: selectedDate,
      dueTime: draftTime || undefined,
      recurring: 'none',
      projectId: filter.projectId || 'inbox',
      tags: [],
      subtasks: [],
      comments: []
    });

    setDraftTitle('');
    setDraftTime('');
  };

  const tasksForSelectedDate = [...tasks.filter(task => task.dueDate === selectedDate)].sort((a, b) => {
    // 1. Timed tasks first (chronological by dueTime)
    if (a.dueTime && !b.dueTime) return -1;
    if (!a.dueTime && b.dueTime) return 1;
    if (a.dueTime && b.dueTime) {
      const timeCompare = a.dueTime.localeCompare(b.dueTime);
      if (timeCompare !== 0) return timeCompare;
    }
    // 2. Priority order
    const priorityRank = { p1: 1, p2: 2, p3: 3, p4: 4 };
    const priorityDiff = (priorityRank[a.priority] || 4) - (priorityRank[b.priority] || 4);
    if (priorityDiff !== 0) return priorityDiff;
    // 3. Fallback to title
    return a.title.localeCompare(b.title);
  });

  const totalCount = tasksForSelectedDate.length;
  const completedCount = tasksForSelectedDate.filter(task => task.completed).length;
  const openCount = totalCount - completedCount;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
              <div className={styles.scheduleEyebrowRow}>
                <span className={styles.scheduleEyebrow}>
                  <CalendarDays size={14} />
                  Schedule
                </span>
                {totalCount > 0 && (
                  <span className={styles.progressPill}>
                    {completedCount}/{totalCount} completed
                  </span>
                )}
              </div>
              <h3 className={styles.scheduleTitle}>{formatScheduleHeading(selectedDate)}</h3>
              <p className={styles.scheduleMeta}>
                {totalCount === 0
                  ? 'No tasks on this day'
                  : `${openCount} open · ${totalCount} total`}
              </p>
              {totalCount > 0 && (
                <div className={styles.progressBarTrack} title={`${completionPercentage}% completed`}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          <form className={styles.quickAdd} onSubmit={handleAddTask}>
            <label className={styles.quickAddLabel} htmlFor="calendar-quick-add-title">
              Add task for {formatScheduleHeading(selectedDate)}
            </label>
            <div className={styles.quickAddRow}>
              <input
                id="calendar-quick-add-title"
                className={styles.quickAddInput}
                type="text"
                value={draftTitle}
                onChange={event => setDraftTitle(event.target.value)}
                placeholder="Task title…"
                autoComplete="off"
              />
              <input
                className={styles.quickAddTime}
                type="time"
                value={draftTime}
                onChange={event => setDraftTime(event.target.value)}
                aria-label="Due time"
              />
              <button
                type="submit"
                className={`btn-primary ${styles.quickAddSubmit}`}
                disabled={!draftTitle.trim()}
                aria-label="Add task"
              >
                <Plus size={16} />
              </button>
            </div>
          </form>

          <div className={styles.scheduleBody}>
            {totalCount === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>
                  <CalendarDays size={26} />
                </div>
                <p className={styles.emptyStateTitle}>No tasks scheduled</p>
                <p className={styles.emptyStateText}>Plan your day by adding a task with an optional time above.</p>
              </div>
            ) : (
              <div className={styles.detailsList}>
                {tasksForSelectedDate.map(task => (
                  <TaskItem key={task.id} task={task} variant="calendar" />
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};
