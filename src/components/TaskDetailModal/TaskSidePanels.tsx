import React from 'react';
import {
  PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
  RECURRENCE_OPTIONS
} from '../../constants/enums';
import type { Priority, RecurrenceRule, TaskStatus, Project, Assignee } from '../../types/todo';

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
  dueDate: string;
  setDueDate: (value: string) => void;
  dueTime: string;
  setDueTime: (value: string) => void;
  recurring: RecurrenceRule;
  setRecurring: (value: RecurrenceRule) => void;
}

export const TaskPlanningPanel: React.FC<TaskPlanningPanelProps> = ({
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  recurring,
  setRecurring
}) => (
  <section className="planning-panel">
    <h3 className="panel-title">Planning</h3>
    <div className="panel-content">
      <div className="form-group">
        <label>DUE DATE</label>
        <input
          type="date"
          value={dueDate}
          onChange={event => setDueDate(event.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label>DUE TIME</label>
        <input
          type="time"
          value={dueTime}
          onChange={event => setDueTime(event.target.value)}
          className="form-input"
        />
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
    </div>
  </section>
);
