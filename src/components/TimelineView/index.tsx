import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Filter
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import type { Task, Priority } from '../../types/todo';
import {
  getTodayString,
  parseISODate,
  addDays,
  diffInDays,
  isToday
} from '../../utils/dateUtils';
import styles from './TimelineView.module.css';

type TimelineScale = 'day' | 'week' | 'month';

interface ProcessedTimelineTask {
  task: Task;
  start: string;
  end: string;
  durationDays: number;
}

export const TimelineView: React.FC = () => {
  const {
    tasks,
    projects,
    assignees,
    setEditingTask,
    toggleTaskComplete,
    addTask
  } = useTodo();

  // Only display projects whose default view mode is set to 'timeline'
  const timelineProjects = useMemo(() => {
    return projects.filter(p => p.defaultView === 'timeline');
  }, [projects]);

  const [scale, setScale] = useState<TimelineScale>('day');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [hoveredTask, setHoveredTask] = useState<ProcessedTimelineTask | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  // Quick add form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickProjectId, setQuickProjectId] = useState(timelineProjects[0]?.id || '');
  const [quickStartDate, setQuickStartDate] = useState(getTodayString());
  const [quickDueDate, setQuickDueDate] = useState(addDays(getTodayString(), 6));
  const [quickPriority, setQuickPriority] = useState<Priority>('p2');

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineProjects.length > 0 && !timelineProjects.some(p => p.id === quickProjectId)) {
      setQuickProjectId(timelineProjects[0].id);
    }
  }, [timelineProjects, quickProjectId]);

  // Filter tasks belonging ONLY to timeline projects and with dates
  const timelineTasks = useMemo(() => {
    const timelineProjectIds = new Set(timelineProjects.map(p => p.id));
    return tasks
      .filter(t => timelineProjectIds.has(t.projectId) && (t.startDate || t.dueDate))
      .map(t => {
        const start = t.startDate || t.dueDate || getTodayString();
        const end = t.dueDate || t.startDate || getTodayString();
        const finalStart = start <= end ? start : end;
        const finalEnd = start <= end ? end : start;
        const durationDays = diffInDays(finalStart, finalEnd) + 1;
        return {
          task: t,
          start: finalStart,
          end: finalEnd,
          durationDays: Math.max(durationDays, 1)
        };
      });
  }, [tasks, timelineProjects]);

  // Determine timeline window bounds
  const { windowStart, totalDays } = useMemo(() => {
    const today = getTodayString();
    let minDate = addDays(today, -7);
    let maxDate = addDays(today, 30);

    timelineTasks.forEach(pt => {
      if (pt.start < minDate) minDate = pt.start;
      if (pt.end > maxDate) maxDate = pt.end;
    });

    // Add padding around min and max
    const windowStart = addDays(minDate, -7);
    const windowEnd = addDays(maxDate, 14);
    const totalDays = diffInDays(windowStart, windowEnd) + 1;

    return { windowStart, windowEnd, totalDays };
  }, [timelineTasks]);

  // Column width by scale
  const colWidth = useMemo(() => {
    switch (scale) {
      case 'week':
        return 28; // each day is 28px in week view
      case 'month':
        return 16; // each day is 16px in month view
      case 'day':
      default:
        return 48; // each day is 48px in day view
    }
  }, [scale]);

  const totalCanvasWidth = totalDays * colWidth;

  // Day columns
  const dayColumns = useMemo(() => {
    const cols = [];
    const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < totalDays; i++) {
      const dateStr = addDays(windowStart, i);
      const dateObj = parseISODate(dateStr);
      const dayOfWeek = dateObj.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      cols.push({
        dateStr,
        dayOfMonth: dateObj.getDate(),
        month: dateObj.toLocaleDateString(undefined, { month: 'short' }),
        weekday: weekdayNames[dayOfWeek],
        isWeekend,
        isToday: isToday(dateStr),
        index: i
      });
    }
    return cols;
  }, [windowStart, totalDays]);

  // Group tasks by project (only timeline projects)
  const projectGroups = useMemo(() => {
    const filteredProjects = selectedProjectId === 'all'
      ? timelineProjects
      : timelineProjects.filter(p => p.id === selectedProjectId);

    return filteredProjects.map(project => {
      const projectTasks = timelineTasks.filter(pt => pt.task.projectId === project.id);
      
      // Calculate project overall span
      let minStart: string | null = null;
      let maxEnd: string | null = null;
      projectTasks.forEach(pt => {
        if (!minStart || pt.start < minStart) minStart = pt.start;
        if (!maxEnd || pt.end > maxEnd) maxEnd = pt.end;
      });

      // Compute sub-lanes for overlapping tasks
      const sorted = [...projectTasks].sort(
        (a, b) => a.start.localeCompare(b.start) || a.end.localeCompare(b.end)
      );
      const lanes: ProcessedTimelineTask[][] = [];

      sorted.forEach(pt => {
        let placed = false;
        for (const lane of lanes) {
          const lastInLane = lane[lane.length - 1];
          if (lastInLane.end < pt.start) {
            lane.push(pt);
            placed = true;
            break;
          }
        }
        if (!placed) {
          lanes.push([pt]);
        }
      });

      return {
        project,
        tasks: projectTasks,
        lanes,
        minStart,
        maxEnd,
        spanDuration: minStart && maxEnd ? diffInDays(minStart, maxEnd) + 1 : 0
      };
    });
  }, [timelineProjects, selectedProjectId, timelineTasks]);

  // Scroll to Today on initial load or on button click
  const scrollToToday = () => {
    if (!canvasWrapperRef.current) return;
    const todayIndex = diffInDays(windowStart, getTodayString());
    if (todayIndex >= 0) {
      const targetLeft = todayIndex * colWidth - canvasWrapperRef.current.clientWidth / 2 + 100;
      canvasWrapperRef.current.scrollTo({ left: Math.max(targetLeft, 0), behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Delay slightly for initial render measurement
    const timer = setTimeout(scrollToToday, 100);
    return () => clearTimeout(timer);
  }, [scale]);

  const handlePan = (direction: 'left' | 'right') => {
    if (!canvasWrapperRef.current) return;
    const shift = direction === 'left' ? -300 : 300;
    canvasWrapperRef.current.scrollBy({ left: shift, behavior: 'smooth' });
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addTask({
      title: quickTitle.trim(),
      completed: false,
      status: 'todo',
      priority: quickPriority,
      startDate: quickStartDate,
      dueDate: quickDueDate,
      recurring: 'none',
      projectId: quickProjectId,
      tags: ['timeline'],
      subtasks: [],
      comments: []
    });

    setQuickTitle('');
    setShowQuickAdd(false);
  };

  // Today line position
  const todayOffsetDays = diffInDays(windowStart, getTodayString());
  const todayLeftPx = todayOffsetDays * colWidth;

  const totalTasksCount = timelineTasks.length;

  return (
    <div
      {...getThemeComponentProps(ThemeComponent.TimelineView)}
      className={styles.timelineContainer}
    >
      {/* Timeline Toolbar Header */}
      <div className={styles.timelineToolbar}>
        <div className={styles.toolbarLeft}>
          <div className={styles.titleArea}>
            <CalendarRange size={22} color="var(--primary)" />
            <h2 className={styles.viewTitle}>Multi-Project Timeline</h2>
          </div>

          <div className={styles.navControls}>
            <button
              type="button"
              className="icon-button"
              onClick={() => handlePan('left')}
              title="Pan Left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className={`btn-secondary ${styles.todayBtn}`}
              onClick={scrollToToday}
            >
              Today
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => handlePan('right')}
              title="Pan Right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className={styles.toolbarRight}>
          {/* Project Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--text-muted)" />
            <select
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              className={styles.projectFilterSelect}
            >
              <option value="all">All Timeline Projects ({timelineProjects.length})</option>
              {timelineProjects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Scale Switcher */}
          <div className={styles.scaleSwitcher}>
            <button
              type="button"
              className={`${styles.scaleBtn} ${scale === 'day' ? styles.active : ''}`}
              onClick={() => setScale('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={`${styles.scaleBtn} ${scale === 'week' ? styles.active : ''}`}
              onClick={() => setScale('week')}
            >
              Week
            </button>
            <button
              type="button"
              className={`${styles.scaleBtn} ${scale === 'month' ? styles.active : ''}`}
              onClick={() => setScale('month')}
            >
              Month
            </button>
          </div>

          {/* Add Timeline Task Button */}
          <button
            type="button"
            className={`btn-primary ${styles.addTaskBtn}`}
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            disabled={timelineProjects.length === 0}
          >
            <Plus size={16} />
            <span>Add Timeline Task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Bar */}
      {showQuickAdd && timelineProjects.length > 0 && (
        <form onSubmit={handleQuickAddSubmit} className={styles.quickAddBar}>
          <input
            type="text"
            placeholder="e.g. Dev and QA, Regression testing, CAB, Go Live..."
            value={quickTitle}
            onChange={e => setQuickTitle(e.target.value)}
            className={styles.quickAddInput}
            autoFocus
          />
          <select
            value={quickProjectId}
            onChange={e => setQuickProjectId(e.target.value)}
            className={styles.quickAddSelect}
          >
            {timelineProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={quickStartDate}
            onChange={e => setQuickStartDate(e.target.value)}
            className={styles.quickAddDate}
            title="Start Date"
          />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>&rarr;</span>
          <input
            type="date"
            value={quickDueDate}
            onChange={e => setQuickDueDate(e.target.value)}
            className={styles.quickAddDate}
            title="End Date"
          />
          <select
            value={quickPriority}
            onChange={e => setQuickPriority(e.target.value as Priority)}
            className={styles.quickAddSelect}
          >
            <option value="p1">P1 Urgent</option>
            <option value="p2">P2 High</option>
            <option value="p3">P3 Medium</option>
            <option value="p4">P4 Low</option>
          </select>
          <button type="submit" className="btn-primary" disabled={!quickTitle.trim()}>
            Create Task
          </button>
        </form>
      )}

      {/* Main Timeline Board Area */}
      <div className={styles.timelineBoard}>
        {/* Left Sidebar: Projects & Task Hierarchy */}
        <div className={styles.leftSidebar}>
          <div className={styles.sidebarHeader}>
            <span>Project & Task List</span>
            <span>{totalTasksCount} tasks</span>
          </div>

          <div className={styles.sidebarContent}>
            {projectGroups.map(group => {
              if (group.tasks.length === 0 && selectedProjectId !== 'all') return null;

              return (
                <div key={group.project.id} className={styles.projectSidebarSection}>
                  <div className={styles.projectSidebarHeader}>
                    <div className={styles.projectTitleGroup}>
                      <span
                        className={styles.projectDot}
                        style={{ backgroundColor: group.project.color }}
                      />
                      <span className={styles.projectName}>{group.project.name}</span>
                    </div>
                    <span className={styles.projectTaskCount}>{group.tasks.length}</span>
                  </div>

                  <div className={styles.taskSidebarList}>
                    {group.tasks.map(pt => (
                      <div
                        key={pt.task.id}
                        className={styles.taskSidebarItem}
                        onClick={() => setEditingTask(pt.task)}
                      >
                        <span className={styles.taskSidebarTitle} title={pt.task.title}>
                          {pt.task.title}
                        </span>
                        <span className={styles.taskDurationBadge}>
                          {pt.durationDays}d
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Canvas: Gantt Chart Grid */}
        <div ref={canvasWrapperRef} className={styles.timelineCanvasWrapper}>
          <div className={styles.timelineCanvas} style={{ width: `${totalCanvasWidth}px` }}>
            {/* Header Row of Days/Dates */}
            <div className={styles.timeHeaderRow}>
              {dayColumns.map(col => (
                <div
                  key={col.dateStr}
                  className={`${styles.timeColumnHeader} ${col.isWeekend ? styles.isWeekend : ''} ${
                    col.isToday ? styles.isToday : ''
                  }`}
                  style={{ width: `${colWidth}px` }}
                >
                  <span className={styles.colDayName}>{scale === 'month' ? '' : col.weekday}</span>
                  <span className={styles.colDayNumber}>{col.dayOfMonth}</span>
                </div>
              ))}
            </div>

            {/* Vertical Background Grid Lines */}
            <div className={styles.gridLinesContainer}>
              {dayColumns.map(col => (
                <div
                  key={`line-${col.dateStr}`}
                  className={`${styles.gridLineColumn} ${col.isWeekend ? styles.isWeekend : ''}`}
                  style={{ width: `${colWidth}px` }}
                />
              ))}
            </div>

            {/* Today Marker Vertical Line */}
            {todayOffsetDays >= 0 && todayOffsetDays < totalDays && (
              <div
                className={styles.todayMarkerLine}
                style={{ left: `${todayLeftPx + colWidth / 2}px` }}
              >
                <span className={styles.todayMarkerBadge}>Today</span>
              </div>
            )}

            {/* Swimlane Groups for each Project */}
            {projectGroups.map(group => {
              if (group.tasks.length === 0 && selectedProjectId !== 'all') return null;

              // Project overall span bar calculation
              const spanStartDiff = group.minStart ? diffInDays(windowStart, group.minStart) : 0;
              const spanLeftPx = spanStartDiff * colWidth;
              const spanWidthPx = Math.max(group.spanDuration * colWidth - 4, 32);

              return (
                <div
                  key={`swimlane-${group.project.id}`}
                  className={styles.swimlaneGroup}
                  style={{ '--project-color': group.project.color } as React.CSSProperties}
                >
                  {/* Project Swimlane Header with Milestone Span Bar */}
                  <div className={styles.swimlaneProjectHeader}>
                    {group.minStart && group.maxEnd && (
                      <div
                        className={styles.projectSpanBar}
                        style={{
                          left: `${spanLeftPx}px`,
                          width: `${spanWidthPx}px`
                        }}
                        title={`${group.project.name} Span: ${group.minStart} to ${group.maxEnd} (${group.spanDuration} days)`}
                      >
                        <span>{group.project.name} Roadmap ({group.spanDuration} days)</span>
                      </div>
                    )}
                  </div>

                  {/* Lanes Area */}
                  <div className={styles.swimlaneLanesArea}>
                    {group.lanes.length === 0 ? (
                      <div style={{ height: '40px' }} />
                    ) : (
                      group.lanes.map((lane, laneIdx) => (
                        <div key={`lane-${laneIdx}`} className={styles.laneRow}>
                          {lane.map(pt => {
                            const taskStartDiff = diffInDays(windowStart, pt.start);
                            const taskLeftPx = taskStartDiff * colWidth;
                            const taskWidthPx = Math.max(pt.durationDays * colWidth - 4, 38);
                            const assignee = assignees.find(a => a.id === pt.task.assigneeId);

                            return (
                              <div
                                key={pt.task.id}
                                className={`${styles.taskBar} ${
                                  pt.task.completed ? styles.completed : ''
                                }`}
                                style={{
                                  left: `${taskLeftPx}px`,
                                  width: `${taskWidthPx}px`
                                }}
                                onClick={() => setEditingTask(pt.task)}
                                onMouseEnter={() => setHoveredTask(pt)}
                                onMouseLeave={() => setHoveredTask(null)}
                              >
                                <span
                                  className={`${styles.taskBarCheckbox} ${
                                    pt.task.completed ? styles.checked : ''
                                  }`}
                                  onClick={e => {
                                    e.stopPropagation();
                                    toggleTaskComplete(pt.task.id);
                                  }}
                                  title={pt.task.completed ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  {pt.task.completed && <Check size={10} />}
                                </span>

                                <span className={styles.taskBarTitle}>{pt.task.title}</span>

                                <span className={styles.taskBarPriorityBadge}>
                                  {pt.task.priority.toUpperCase()}
                                </span>

                                {/* Tooltip on hover */}
                                {hoveredTask?.task.id === pt.task.id && (
                                  <div className={styles.taskTooltip}>
                                    <div className={styles.tooltipTitle}>{pt.task.title}</div>
                                    <div className={styles.tooltipRow}>
                                      <span>Project:</span>
                                      <span className={styles.tooltipValue} style={{ color: group.project.color }}>
                                        {group.project.name}
                                      </span>
                                    </div>
                                    <div className={styles.tooltipRow}>
                                      <span>Timeline:</span>
                                      <span className={styles.tooltipValue}>
                                        {pt.start} &rarr; {pt.end}
                                      </span>
                                    </div>
                                    <div className={styles.tooltipRow}>
                                      <span>Duration:</span>
                                      <span className={styles.tooltipValue}>{pt.durationDays} days</span>
                                    </div>
                                    <div className={styles.tooltipRow}>
                                      <span>Priority:</span>
                                      <span className={styles.tooltipValue}>{pt.task.priority.toUpperCase()}</span>
                                    </div>
                                    {assignee && (
                                      <div className={styles.tooltipRow}>
                                        <span>Assignee:</span>
                                        <span className={styles.tooltipValue}>{assignee.name}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}

            {totalTasksCount === 0 && (
              <div className={styles.emptyTimeline}>
                <div className={styles.emptyIcon}>
                  <CalendarRange size={28} />
                </div>
                <h3 className={styles.emptyTitle}>No Timeline Tasks Yet</h3>
                <p className={styles.emptyText}>
                  Define date ranges (Dev and QA, Regression testing, CAB, Go Live) across projects to view overlapping project timelines.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setShowQuickAdd(true)}
                >
                  <Plus size={16} />
                  <span>Create Timeline Task</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
