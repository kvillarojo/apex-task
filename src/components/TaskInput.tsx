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
import { useTodo } from '../context/TodoContext';
import { parseNaturalLanguageTask } from '../utils/naturalLanguageParser';
import type { Priority, RecurrenceRule } from '../types/todo';

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
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>(undefined);
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
      subtasks: [],
      estimatedMinutes: estimatedMinutes || undefined,
      actualMinutes: 0
    });

    // Reset input
    setRawText('');
    setDescription('');
    setSelectedPriority('p4');
    setSelectedAssigneeId('');
    setSelectedDueDate('');
    setSelectedDueTime('');
    setSelectedRecurring('none');
    setEstimatedMinutes(undefined);
    setShowDetails(false);
  };

  return (
    <form className="task-input-card" onSubmit={handleSubmit}>
      <div className="task-input-main">
        <button type="submit" className="btn-primary" style={{ padding: '8px', borderRadius: '10px' }}>
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
          className="btn-secondary"
          style={{ fontSize: '0.75rem', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
          onClick={() => setShowDetails(!showDetails)}
        >
          <span>Options</span>
          <ChevronDown size={14} style={{ transform: showDetails ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
        </button>
      </div>

      {/* Live Natural Language Parsing Indicators */}
      {(parsed.dueDate || parsed.dueTime || parsed.priority || parsed.tags.length > 0 || parsed.projectHint) && (
        <div className="nlp-badges">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
            <span key={tag} className="nlp-chip" style={{ backgroundColor: 'var(--bg-input)' }}>
              <TagIcon size={12} />#{tag}
            </span>
          ))}

          {parsed.projectHint && (
            <span className="nlp-chip" style={{ backgroundColor: 'var(--bg-input)' }}>
              <Folder size={12} />@{parsed.projectHint}
            </span>
          )}
        </div>
      )}

      {/* Expanded Details Bar */}
      {showDetails && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
          <input
            type="text"
            placeholder="Add detailed description or notes..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-input)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem'
            }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
            {/* Priority Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flag size={14} color="var(--text-muted)" />
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value as Priority)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              >
                <option value="p1">P1 - Urgent (Red)</option>
                <option value="p2">P2 - High (Orange)</option>
                <option value="p3">P3 - Medium (Blue)</option>
                <option value="p4">P4 - Low (Gray)</option>
              </select>
            </div>

            {/* Project Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Folder size={14} color="var(--text-muted)" />
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Assignee Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--text-muted)" />
              <select
                value={selectedAssigneeId}
                onChange={e => setSelectedAssigneeId(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="var(--text-muted)" />
              <input
                type="date"
                value={selectedDueDate}
                onChange={e => setSelectedDueDate(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
              <input
                type="time"
                value={selectedDueTime}
                onChange={e => setSelectedDueTime(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
            </div>

            {/* Recurrence Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Repeat size={14} color="var(--text-muted)" />
              <select
                value={selectedRecurring}
                onChange={e => setSelectedRecurring(e.target.value as RecurrenceRule)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              >
                <option value="none">No Recurrence</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Estimated Minutes */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--text-muted)" />
              <input
                type="number"
                placeholder="Est. mins"
                value={estimatedMinutes || ''}
                onChange={e => setEstimatedMinutes(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                style={{
                  width: '90px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem'
                }}
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
