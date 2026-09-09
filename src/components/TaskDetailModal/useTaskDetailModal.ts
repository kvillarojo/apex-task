import { useEffect, useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import type { Priority, RecurrenceRule, TaskStatus } from '../../types/todo';

export function useTaskDetailModal() {
  const {
    editingTask,
    setEditingTask,
    updateTask,
    deleteTask,
    projects,
    assignees,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    allTags,
    getTagColor
  } = useTodo();

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority || 'p4');
  const [status, setStatus] = useState<TaskStatus>(editingTask?.status || 'todo');
  const [projectId, setProjectId] = useState(editingTask?.projectId || '');
  const [assigneeId, setAssigneeId] = useState(editingTask?.assigneeId || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '');
  const [recurring, setRecurring] = useState<RecurrenceRule>(editingTask?.recurring || 'none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingTask?.tags || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (!editingTask) {
      setTitle('');
      setDescription('');
      setPriority('p4');
      setStatus('todo');
      setProjectId('');
      setAssigneeId('');
      setDueDate('');
      setDueTime('');
      setRecurring('none');
      setTags([]);
      setTagInput('');
      setNewSubtaskTitle('');
      return;
    }

    setTitle(editingTask.title);
    setDescription(editingTask.description || '');
    setPriority(editingTask.priority);
    setStatus(editingTask.status);
    setProjectId(editingTask.projectId);
    setAssigneeId(editingTask.assigneeId || '');
    setDueDate(editingTask.dueDate || '');
    setDueTime(editingTask.dueTime || '');
    setRecurring(editingTask.recurring);
    setTags([...editingTask.tags]);
    setTagInput('');
    setNewSubtaskTitle('');
  }, [editingTask]);

  const close = () => setEditingTask(null);

  const completedSubtasksCount = editingTask?.subtasks.filter(subtask => subtask.completed).length ?? 0;
  const totalSubtasksCount = editingTask?.subtasks.length ?? 0;
  const subtasksPercent =
    totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 0;

  const handleSave = () => {
    if (!editingTask || !title.trim()) return;
    updateTask(editingTask.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      completed: status === 'done',
      completedAt: status === 'done' ? editingTask.completedAt || new Date().toISOString() : undefined,
      projectId,
      assigneeId: assigneeId || undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      recurring,
      tags
    });
    close();
  };

  const handleDelete = () => {
    if (!editingTask) return;
    deleteTask(editingTask.id);
    close();
  };

  const handleAddSubtask = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingTask || !newSubtaskTitle.trim()) return;
    addSubtask(editingTask.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  return {
    open: Boolean(editingTask),
    editingTask,
    close,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    projectId,
    setProjectId,
    assigneeId,
    setAssigneeId,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime,
    recurring,
    setRecurring,
    tagInput,
    setTagInput,
    tags,
    setTags,
    newSubtaskTitle,
    setNewSubtaskTitle,
    projects,
    assignees,
    allTags,
    getTagColor,
    completedSubtasksCount,
    totalSubtasksCount,
    subtasksPercent,
    toggleSubtask,
    deleteSubtask,
    handleSave,
    handleDelete,
    handleAddSubtask
  };
}
