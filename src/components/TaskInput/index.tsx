import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  Clock,
  Tag as TagIcon,
  Flag,
  Folder,
  ChevronDown,
  Sparkles,
  Repeat,
  User
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import { parseNaturalLanguageTask } from '../../utils/naturalLanguageParser';
import type { Priority, RecurrenceRule } from '../../types/todo';
import styles from './TaskInput.module.css';

export const TaskInput: React.FC = () => {
  const { addTask, projects, assignees, filter } = useTodo();

  const [rawText, setRawText] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority>('p4');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(filter.projectId || 'inbox');
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string>('');
  const [selectedDueDate, setSelectedDueDate] = useState<string>('');
  const [selectedDueTime, setSelectedDueTime] = useState<string>('');
  const [selectedRecurring, setSelectedRecurring] = useState<RecurrenceRule>('none');
  const [showDetails, setShowDetails] = useState(false);

  // Live Natural Language Parsing
  const parsed = useMemo(() => {
    return parseNaturalLanguageTask(rawText);
  }, [rawText]);

  // Combined values (overrides from manual selectors if set, otherwise from NLP)
  const finalPriority = selectedPriority !== 'p4' ? selectedPriority : (parsed.priority || 'p4');
  const finalDueDate = selectedDueDate || parsed.dueDate || '';
  const finalDueTime = selectedDueTime || parsed.dueTime || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleToUse = parsed.cleanTitle || rawText.trim();
    if (!titleToUse) return;

    // Resolve project hint if present
    let targetProjectId = selectedProjectId;
    if (parsed.projectHint) {
      const match = projects.find(p => p.name.toLowerCase() === parsed.projectHint?.toLowerCase());
      if (match) targetProjectId = match.id;
    }

    addTask({
      title: titleToUse,
      description: description.trim() || undefined,
      completed: false,
      status: 'todo',
      priority: finalPriority,
      dueDate: finalDueDate || undefined,
      dueTime: finalDueTime || undefined,
      recurring: selectedRecurring,
      projectId: targetProjectId,
      assigneeId: selectedAssigneeId || undefined,
      tags: parsed.tags,
      subtasks: []
    });

    // Reset input
    setRawText('');
    setDescription('');
    setSelectedPriority('p4');
    setSelectedAssigneeId('');
    setSelectedDueDate('');
    setSelectedDueTime('');
    setSelectedRecurring('none');
    setShowDetails(false);
  };

  return (
    <form {...getThemeComponentProps(ThemeComponent.TaskInput)} className="task-input-card" onSubmit={handleSubmit}>
      <div className="task-input-main">
        <button type="submit" className={`btn-primary ${styles.submitButton}`}>
          <Plus size={20} />
        </button>

        <input
          type="text"
          placeholder="Add task... try 'Buy groceries tomorrow at 5pm p1 #shopping @personal'"
          value={rawText}
          onChange={e => setRawText(e.target.value)}
        />

        <button
          type="button"
          className={`btn-secondary ${styles.optionsButton}`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <span>Options</span>
          <ChevronDown size={14} className={`${styles.optionsChevron} ${showDetails ? styles.optionsChevronOpen : ''}`} />
        </button>
      </div>

      {/* Live Natural Language Parsing Indicators */}
      {(parsed.dueDate || parsed.dueTime || parsed.priority || parsed.tags.length > 0 || parsed.projectHint) && (
        <div className="nlp-badges">
          <span className={styles.parsedLabel}>
            <Sparkles size={12} color="var(--primary)" /> Parsed:
          </span>

          {parsed.dueDate && (
            <span className="nlp-chip">
              <Calendar size={12} />
              {parsed.dueDate}
            </span>
          )}

          {parsed.dueTime && (
            <span className="nlp-chip">
              <Clock size={12} />
              {parsed.dueTime}
            </span>
          )}

          {parsed.priority && (
            <span className={`nlp-chip priority-${parsed.priority}`}>
              <Flag size={12} />
              {parsed.priority.toUpperCase()}
            </span>
          )}

          {parsed.tags.map(tag => (
            <span key={tag} className={`nlp-chip ${styles.neutralChip}`}>
              <TagIcon size={12} />#{tag}
            </span>
          ))}

          {parsed.projectHint && (
            <span className={`nlp-chip ${styles.neutralChip}`}>
              <Folder size={12} />@{parsed.projectHint}
            </span>
          )}
        </div>
      )}

      {/* Expanded Details Bar */}
      {showDetails && (
        <div className={styles.details}>
          <input
            type="text"
            placeholder="Add detailed description or notes..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className={styles.descriptionInput}
          />

          <div className={styles.fieldList}>
            {/* Priority Selector */}
            <div className={styles.field}>
              <Flag size={14} color="var(--text-muted)" />
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value as Priority)}
                className={styles.fieldControl}
              >
                <option value="p1">P1 - Urgent (Red)</option>
                <option value="p2">P2 - High (Orange)</option>
                <option value="p3">P3 - Medium (Blue)</option>
                <option value="p4">P4 - Low (Gray)</option>
              </select>
            </div>

            {/* Project Selector */}
            <div className={styles.field}>
              <Folder size={14} color="var(--text-muted)" />
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className={styles.fieldControl}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Assignee Selector */}
            <div className={styles.field}>
              <User size={14} color="var(--text-muted)" />
              <select
                value={selectedAssigneeId}
                onChange={e => setSelectedAssigneeId(e.target.value)}
                className={styles.fieldControl}
              >
                <option value="">Unassigned</option>
                {assignees.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.initials})
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date & Time */}
            <div className={styles.field}>
              <Calendar size={14} color="var(--text-muted)" />
              <input
                type="date"
                value={selectedDueDate}
                onChange={e => setSelectedDueDate(e.target.value)}
                className={styles.fieldControl}
              />
              <input
                type="time"
                value={selectedDueTime}
                onChange={e => setSelectedDueTime(e.target.value)}
                className={styles.fieldControl}
              />
            </div>

            {/* Recurrence Selector */}
            <div className={styles.field}>
              <Repeat size={14} color="var(--text-muted)" />
              <select
                value={selectedRecurring}
                onChange={e => setSelectedRecurring(e.target.value as RecurrenceRule)}
                className={styles.fieldControl}
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

          </div>
        </div>
      )}
    </form>
  );
};
