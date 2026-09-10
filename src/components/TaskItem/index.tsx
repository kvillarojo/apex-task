import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Check,
  Calendar,
  Tag as TagIcon,
  Flag,
  Play,
  ChevronDown,
  Repeat,
  Plus,
  User
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import type { Task } from '../../types/todo';
import { formatFriendlyDate, isOverdue } from '../../utils/dateUtils';
import styles from './TaskItem.module.css';

const ProjectBadge = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
`;

const ProjectDot = styled.span<{ $color: string }>`
  background-color: ${({ $color }) => $color};
`;

const TagBadge = styled.span<{ $color: string }>`
  color: ${({ $color }) => $color};
  background-color: ${({ $color }) => `${$color}18`};
  border-color: ${({ $color }) => `${$color}40`};
`;

const getDescriptionPreview = (description: string) => {
  if (!/<\/?[a-z][\s\S]*>/i.test(description)) return description;
  const container = document.createElement('div');
  container.innerHTML = description;
  return container.textContent || '';
};

interface TaskItemProps {
  task: Task;
  variant?: 'default' | 'kanban';
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, variant = 'default' }) => {
  const {
    toggleTaskComplete,
    setEditingTask,
    projects,
    assignees,
    startPomodoro,
    addSubtask,
    toggleSubtask,
    getTagColor
  } = useTodo();

  const [expandedSubtasks, setExpandedSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const project = projects.find(p => p.id === task.projectId) || projects[0];
  const assignee = assignees.find(person => person.id === task.assigneeId);
  const dateFormatted = formatFriendlyDate(task.dueDate, task.dueTime);
  const overdue = isOverdue(task.dueDate) && !task.completed;

  const completedSubtasksCount = task.subtasks.filter(s => s.completed).length;
  const totalSubtasksCount = task.subtasks.length;

  const actionButtons = (
    <>
      {!task.completed && (
        <button
          className={`icon-button ${styles.focusButton}`}
          onClick={(e) => {
            e.stopPropagation();
            startPomodoro(task.id);
          }}
          title="Start Focus Timer on this task"
        >
          <Play size={12} color="var(--primary)" />
        </button>
      )}
    </>
  );

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    addSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return (
    <div {...getThemeComponentProps(ThemeComponent.TaskItem)} className={`task-card ${task.completed ? 'completed' : ''} ${variant === 'kanban' ? 'kanban-card' : ''}`}
      onClick={(e) => {
          e.stopPropagation();
          setEditingTask(task);
        }}
    >
      {/* Checkbox */}
      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleTaskComplete(task.id)}
        }
      >
        {task.completed && <Check size={14} />}
      </div>

      {/* Task Content */}
      <div className="task-content">
        <div className="task-header-row">
          <span className="task-title" title={task.title}>{task.title}</span>

          {/* Quick Action Buttons */}
          {variant === 'default' && <div className="task-action-buttons">{actionButtons}</div>}
        </div>

        {variant === 'kanban' && <div className="task-action-row task-action-buttons">{actionButtons}</div>}

        {/* Description */}
        {task.description && <p className="task-desc">{getDescriptionPreview(task.description)}</p>}

        {/* Metadata Badges */}
        <div className="task-meta">
          {/* Priority */}
          <span className={`badge badge-priority ${task.priority}`}>
            <Flag size={11} />
            {task.priority.toUpperCase()}
          </span>

          {/* Project */}
          <ProjectBadge className={`badge ${styles.projectBadge}`} $color={project.color}>
            <ProjectDot className={styles.projectDot} $color={project.color} />
            {project.name}
          </ProjectBadge>

          {/* Due Date */}
          {dateFormatted && (
            <span className={`badge ${overdue ? styles.overdueBadge : styles.dueBadge}`}>
              <Calendar size={11} />
              {dateFormatted}
            </span>
          )}

          {/* Recurring */}
          {task.recurring !== 'none' && (
            <span className="badge">
              <Repeat size={11} />
              {task.recurring}
            </span>
          )}

          {assignee && (
            <span className="badge" title={`Assigned to ${assignee.name}`}>
              <User size={11} />
              {assignee.name}
            </span>
          )}

          {/* Tags */}
          {task.tags.map(tag => {
            const color = getTagColor(tag);
            return (
              <TagBadge
                key={tag}
                className="badge"
                $color={color}
              >
                <TagIcon size={11} />#{tag}
              </TagBadge>
            );
          })}

          {/* Subtasks Progress Pill */}
          {totalSubtasksCount > 0 && (
            <button
              onClick={() => setExpandedSubtasks(!expandedSubtasks)}
              className={`badge ${styles.subtaskToggle}`}
            >
              <span>
                {completedSubtasksCount}/{totalSubtasksCount} subtasks
              </span>
              <ChevronDown
                size={12}
                className={`${styles.subtaskChevron} ${expandedSubtasks ? styles.subtaskChevronOpen : ''}`}
              />
            </button>
          )}
        </div>

        {/* Subtasks Expanded List */}
        {expandedSubtasks && totalSubtasksCount > 0 && (
          <div className="task-subtasks-container">
            {task.subtasks.map(st => (
              <div key={st.id} className="task-subtask-row">
                <input
                  type="checkbox"
                  checked={st.completed}
                  onChange={() => toggleSubtask(task.id, st.id)}
                  className={styles.subtaskCheckbox}
                />
                <span className={`task-subtask-title ${st.completed ? styles.completedSubtask : ''}`}>
                  {st.title}
                </span>
              </div>
            ))}

            {/* Quick add subtask */}
            <form onSubmit={handleAddSubtaskSubmit} className={styles.addSubtaskForm}>
              <input
                type="text"
                placeholder="Add subtask..."
                value={newSubtaskTitle}
                onChange={e => setNewSubtaskTitle(e.target.value)}
                className={styles.addSubtaskInput}
              />
              <button type="submit" className={styles.addSubtaskButton}>
                <Plus size={14} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
