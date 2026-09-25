import React from 'react';
import { Bell } from 'lucide-react';
import {
  PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  RECURRENCE_OPTIONS
} from '../../constants/enums';
import type { Priority, RecurrenceRule, TaskStatus, Project, Assignee } from '../../types/todo';
import { TagChipInput, DatePicker } from '../common';

interface TaskDetailsPanelProps {
  priority: Priority;
  setPriority: (value: Priority) => void;
  status: TaskStatus;
  setStatus: (value: TaskStatus) => void;
  projectId: string;
  setProjectId: (value: string) => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  projects: Project[];
  assignees: Assignee[];
}

export const TaskDetailsPanel: React.FC<TaskDetailsPanelProps> = ({
  priority,
  setPriority,
  status,
  setStatus,
  projectId,
  setProjectId,
  assigneeId,
  setAssigneeId,
  projects,
  assignees
}) => (
  <section className="details-panel">
    <h3 className="panel-title">Details</h3>
    <div className="panel-content">
      <div className="form-row">
        <div className="form-group form-group-half">
          <label>PRIORITY</label>
          <select
            value={priority}
            onChange={event => setPriority(event.target.value as Priority)}
            className="form-input"
          >
            {PRIORITY_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-half">
          <label>STATUS</label>
          <select
            value={status}
            onChange={event => setStatus(event.target.value as TaskStatus)}
            className="form-input"
          >
            {TASK_STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-half">
          <label>PROJECT</label>
          <select
            value={projectId}
            onChange={event => setProjectId(event.target.value)}
            className="form-input"
          >
            <option value="">Select project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-half">
          <label>ASSIGNEE</label>
          <select
            value={assigneeId}
            onChange={event => setAssigneeId(event.target.value)}
            className="form-input"
          >
            <option value="">Unassigned</option>
            {assignees.map(assignee => (
              <option key={assignee.id} value={assignee.id}>
                {assignee.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  </section>
);

interface TaskPlanningPanelProps {
  isTimelineProject?: boolean;
  startDate: string;
  setStartDate: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  dueTime: string;
  setDueTime: (value: string) => void;
  recurring: RecurrenceRule;
  setRecurring: (value: RecurrenceRule) => void;
  notificationsEnabled: boolean;
  onEnableNotifications: () => void;
  // Tags
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  setTags: (tags: string[]) => void;
  allTags: string[];
  getTagColor: (tag: string) => string;
}

export const TaskPlanningPanel: React.FC<TaskPlanningPanelProps> = ({
  isTimelineProject = false,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  recurring,
  setRecurring,
  notificationsEnabled,
  onEnableNotifications,
  tags,
  tagInput,
  setTagInput,
  setTags,
  allTags,
  getTagColor
}) => {
  const getDurationText = () => {
    if (!startDate || !dueDate) return null;
    const d1 = new Date(startDate + 'T00:00:00');
    const d2 = new Date(dueDate + 'T00:00:00');
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays <= 0) return 'End date before start date';
    if (diffDays === 1) return '1 day duration';
    return `${diffDays} days duration`;
  };

  const handleQuickDuration = (days: number) => {
    const baseStr = startDate || new Date().toISOString().slice(0, 10);
    if (!startDate) {
      setStartDate(baseStr);
    }
    const d = new Date(baseStr + 'T00:00:00');
    d.setDate(d.getDate() + (days - 1));
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    setDueDate(`${year}-${month}-${day}`);
  };

  const durationText = getDurationText();

  return (
    <section className="planning-panel">
      <h3 className="panel-title">{isTimelineProject ? 'Planning & Timeline' : 'Planning'}</h3>
      <div className="panel-content">
        {isTimelineProject && (
          <div className="form-group">
            <label>START DATE</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              timeValue={startTime}
              onTimeChange={setStartTime}
            />
          </div>
        )}

        <div className="form-group">
          <label>{isTimelineProject ? 'END / DUE DATE' : 'DUE DATE'}</label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            timeValue={dueTime}
            onTimeChange={setDueTime}
          />
          {isTimelineProject && durationText && (
            <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
              ⏱️ {durationText}
            </div>
          )}
          {isTimelineProject && (
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
              <button
                type="button"
                className="badge"
                style={{ cursor: 'pointer', background: 'var(--bg-input)' }}
                onClick={() => handleQuickDuration(3)}
                title="Set 3 days span from start date"
              >
                +3d
              </button>
              <button
                type="button"
                className="badge"
                style={{ cursor: 'pointer', background: 'var(--bg-input)' }}
                onClick={() => handleQuickDuration(7)}
                title="Set 1 week span from start date"
              >
                +1w
              </button>
              <button
                type="button"
                className="badge"
                style={{ cursor: 'pointer', background: 'var(--bg-input)' }}
                onClick={() => handleQuickDuration(14)}
                title="Set 2 weeks span from start date"
              >
                +2w
              </button>
              <button
                type="button"
                className="badge"
                style={{ cursor: 'pointer', background: 'var(--bg-input)' }}
                onClick={() => handleQuickDuration(30)}
                title="Set 1 month span from start date"
              >
                +1m
              </button>
            </div>
          )}
          {dueDate && !notificationsEnabled && typeof Notification !== 'undefined' && (
            <button
              type="button"
              className="task-notify-btn"
              onClick={onEnableNotifications}
            >
              <Bell size={14} />
              Enable device alerts
            </button>
          )}
        </div>

        <div className="form-group">
          <label>RECURRING</label>
          <select
            value={recurring}
            onChange={event => setRecurring(event.target.value as RecurrenceRule)}
            className="form-input"
          >
            {RECURRENCE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>TAGS</label>
          <TagChipInput
            tags={tags}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onTagsChange={setTags}
            availableTags={allTags}
            getTagColor={getTagColor}
          />
        </div>
      </div>
    </section>
  );
};
