import { useEffect, useRef, useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import type { Priority, RecurrenceRule, Task, TaskStatus } from '../../types/todo';

const AUTOSAVE_DELAY_MS = 650;

type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved';

interface TaskFormState {
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  startDate: string;
  startTime: string;
  dueDate: string;
  dueTime: string;
  recurring: RecurrenceRule;
  tags: string[];
}

function formFromTask(task: Task): TaskFormState {
  return {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    projectId: task.projectId,
    assigneeId: task.assigneeId || '',
    startDate: task.startDate || '',
    startTime: task.startTime || '',
    dueDate: task.dueDate || '',
    dueTime: task.dueTime || '',
    recurring: task.recurring,
    tags: [...task.tags]
  };
}

function emptyForm(): TaskFormState {
  return {
    title: '',
    description: '',
    priority: 'p4',
    status: 'todo',
    projectId: '',
    assigneeId: '',
    startDate: '',
    startTime: '',
    dueDate: '',
    dueTime: '',
    recurring: 'none',
    tags: []
  };
}

function buildUpdates(form: TaskFormState, existingCompletedAt?: string): Partial<Task> | null {
  if (!form.title.trim()) return null;
  return {
    title: form.title.trim(),
    description: form.description.trim() || undefined,
    priority: form.priority,
    status: form.status,
    completed: form.status === 'done',
    completedAt: form.status === 'done' ? existingCompletedAt || new Date().toISOString() : undefined,
    projectId: form.projectId,
    assigneeId: form.assigneeId || undefined,
    startDate: form.startDate || undefined,
    startTime: form.startTime || undefined,
    dueDate: form.dueDate || undefined,
    dueTime: form.dueTime || undefined,
    recurring: form.recurring,
    tags: form.tags
  };
}

function serializeForm(form: TaskFormState): string {
  return JSON.stringify({
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
    status: form.status,
    projectId: form.projectId,
    assigneeId: form.assigneeId,
    startDate: form.startDate,
    startTime: form.startTime,
    dueDate: form.dueDate,
    dueTime: form.dueTime,
    recurring: form.recurring,
    tags: form.tags
  });
}

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
    addComment,
    updateComment,
    deleteComment,
    allTags,
    getTagColor,
    requestNotificationPermission
  } = useTodo();

  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [priority, setPriority] = useState<Priority>(editingTask?.priority || 'p4');
  const [status, setStatus] = useState<TaskStatus>(editingTask?.status || 'todo');
  const [projectId, setProjectId] = useState(editingTask?.projectId || '');
  const [assigneeId, setAssigneeId] = useState(editingTask?.assigneeId || '');
  const [startDate, setStartDate] = useState(editingTask?.startDate || '');
  const [startTime, setStartTime] = useState(editingTask?.startTime || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate || '');
  const [dueTime, setDueTime] = useState(editingTask?.dueTime || '');
  const [recurring, setRecurring] = useState<RecurrenceRule>(editingTask?.recurring || 'none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingTask?.tags || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const taskId = editingTask?.id ?? null;
  const formRef = useRef<TaskFormState>(emptyForm());
  const lastSavedRef = useRef('');
  const skipAutosaveRef = useRef(true);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedAtRef = useRef<string | undefined>(editingTask?.completedAt);
  const taskIdRef = useRef<string | null>(taskId);
  const updateTaskRef = useRef(updateTask);

  formRef.current = {
    title,
    description,
    priority,
    status,
    projectId,
    assigneeId,
    startDate,
    startTime,
    dueDate,
    dueTime,
    recurring,
    tags
  };
  taskIdRef.current = taskId;
  completedAtRef.current = editingTask?.completedAt;
  updateTaskRef.current = updateTask;

  // Hydrate local form only when switching tickets — not after each autosave write.
  useEffect(() => {
    if (!editingTask) {
      const blank = emptyForm();
      setTitle(blank.title);
      setDescription(blank.description);
      setPriority(blank.priority);
      setStatus(blank.status);
      setProjectId(blank.projectId);
      setAssigneeId(blank.assigneeId);
      setStartDate(blank.startDate);
      setStartTime(blank.startTime);
      setDueDate(blank.dueDate);
      setDueTime(blank.dueTime);
      setRecurring(blank.recurring);
      setTags(blank.tags);
      setTagInput('');
      setNewSubtaskTitle('');
      setSaveStatus('idle');
      lastSavedRef.current = '';
      skipAutosaveRef.current = true;
      return;
    }

    const form = formFromTask(editingTask);
    setTitle(form.title);
    setDescription(form.description);
    setPriority(form.priority);
    setStatus(form.status);
    setProjectId(form.projectId);
    setAssigneeId(form.assigneeId);
    setStartDate(form.startDate);
    setStartTime(form.startTime);
    setDueDate(form.dueDate);
    setDueTime(form.dueTime);
    setRecurring(form.recurring);
    setTags(form.tags);
    setTagInput('');
    setNewSubtaskTitle('');
    setSaveStatus('idle');
    lastSavedRef.current = serializeForm(form);
    skipAutosaveRef.current = true;
    // Intentionally depend on id only so context updates from autosave don't reset the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const persistForm = (form: TaskFormState): boolean => {
    const id = taskIdRef.current;
    if (!id) return false;
    const updates = buildUpdates(form, completedAtRef.current);
    if (!updates) return false;
    const snapshot = serializeForm(form);
    if (snapshot === lastSavedRef.current) return false;
    updateTaskRef.current(id, updates);
    lastSavedRef.current = snapshot;
    return true;
  };

  const flushSave = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (persistForm(formRef.current)) {
      setSaveStatus('saved');
    }
  };

  // Debounced autosave while the ticket is open.
  useEffect(() => {
    if (!taskId) return;

    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    const snapshot = serializeForm(formRef.current);
    if (snapshot === lastSavedRef.current) {
      setSaveStatus(prev => (prev === 'pending' ? 'saved' : prev));
      return;
    }

    if (!formRef.current.title.trim()) {
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('pending');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      setSaveStatus('saving');
      if (persistForm(formRef.current)) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('idle');
      }
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [
    taskId,
    title,
    description,
    priority,
    status,
    projectId,
    assigneeId,
    dueDate,
    dueTime,
    recurring,
    tags
  ]);

  // Flush any pending debounce if the modal unmounts unexpectedly.
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
        persistForm(formRef.current);
      }
    };
  }, []);

  const close = () => {
    flushSave();
    setEditingTask(null);
  };

  const completedSubtasksCount = editingTask?.subtasks.filter(subtask => subtask.completed).length ?? 0;
  const totalSubtasksCount = editingTask?.subtasks.length ?? 0;
  const subtasksPercent =
    totalSubtasksCount > 0 ? Math.round((completedSubtasksCount / totalSubtasksCount) * 100) : 0;

  const handleSave = () => {
    close();
  };

  const handleDelete = () => {
    if (!editingTask) return;
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    deleteTask(editingTask.id);
    setEditingTask(null);
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
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
    addComment,
    updateComment,
    deleteComment,
    handleSave,
    handleDelete,
    handleAddSubtask,
    notificationsEnabled,
    handleEnableNotifications,
    saveStatus
  };
}
