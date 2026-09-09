import { useEffect, useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { ReminderPreset, type ReminderPreset as ReminderPresetType } from '../../constants/enums';
import { getTodayString } from '../../utils/dateUtils';
import { normalizeTagName } from '../../utils/tagUtils';

function formatLocalDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function useNoteDetailModal() {
  const {
    editingNote,
    noteModalOpen,
    closeNoteModal,
    addNote,
    updateNote,
    deleteNote,
    projects,
    noteTags,
    getTagColor,
    requestNotificationPermission
  } = useTodo();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('inbox');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [color, setColor] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [mobilePicker, setMobilePicker] = useState<'project' | 'tags' | null>(null);
  const [tagSearch, setTagSearch] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  const isNew = !editingNote || !editingNote.id;

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setContent(editingNote.content || '');
      setProjectId(editingNote.projectId || 'inbox');
      setTags(editingNote.tags ? [...editingNote.tags] : []);
      setIsPinned(Boolean(editingNote.isPinned));
      setColor(editingNote.color || '');
      setReminderDate(editingNote.reminder?.date || '');
      setReminderTime(editingNote.reminder?.time || '');
    } else {
      setTitle('');
      setContent('');
      setProjectId('inbox');
      setTags([]);
      setIsPinned(false);
      setColor('');
      setReminderDate('');
      setReminderTime('');
    }
    setTagInput('');
    setMobilePicker(null);
    setTagSearch('');
  }, [editingNote, noteModalOpen]);

  const toggleMobileTag = (tag: string) => {
    setTags(currentTags =>
      currentTags.includes(tag)
        ? currentTags.filter(currentTag => currentTag !== tag)
        : [...currentTags, tag]
    );
  };

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
  };

  const applyPreset = (preset: ReminderPresetType) => {
    if (preset === ReminderPreset.Clear) {
      setReminderDate('');
      setReminderTime('');
      return;
    }

    const now = new Date();
    if (preset === ReminderPreset.Today) {
      setReminderDate(getTodayString());
      setReminderTime('18:00');
      return;
    }
    if (preset === ReminderPreset.Tomorrow) {
      setReminderDate(formatLocalDate(new Date(now.getTime() + 24 * 60 * 60 * 1000)));
      setReminderTime('09:00');
      return;
    }
    if (preset === ReminderPreset.Weekend) {
      const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
      setReminderDate(formatLocalDate(new Date(now.getTime() + daysUntilSaturday * 24 * 60 * 60 * 1000)));
      setReminderTime('10:00');
      return;
    }
    if (preset === ReminderPreset.NextWeek) {
      const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
      setReminderDate(formatLocalDate(new Date(now.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000)));
      setReminderTime('09:00');
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle && !content.trim()) {
      closeNoteModal();
      return;
    }

    const reminder = reminderDate
      ? {
          date: reminderDate,
          time: reminderTime || '09:00',
          notified: false
        }
      : undefined;

    const payload = {
      title: trimmedTitle || 'Untitled Note',
      content,
      projectId: projectId || 'inbox',
      tags,
      isPinned,
      color: color || undefined,
      reminder
    };

    if (isNew) {
      addNote(payload);
    } else if (editingNote) {
      updateNote(editingNote.id, payload);
    }

    closeNoteModal();
  };

  const handleDelete = () => {
    if (!editingNote) return;
    deleteNote(editingNote.id);
  };

  const createTagFromSearch = () => {
    const clean = normalizeTagName(tagSearch);
    if (!clean) return;
    toggleMobileTag(clean);
    setTagSearch('');
  };

  const selectedProject = projects.find(project => project.id === projectId);
  const reminderSummary = reminderDate
    ? `${reminderDate}${reminderTime ? ` · ${reminderTime}` : ''}`
    : 'No reminder set';
  const mobileTagResults = noteTags.filter(tag =>
    tag.toLowerCase().includes(tagSearch.trim().toLowerCase())
  );

  return {
    open: noteModalOpen,
    close: closeNoteModal,
    isNew,
    editingNote,
    title,
    setTitle,
    content,
    setContent,
    projectId,
    setProjectId,
    tags,
    setTags,
    tagInput,
    setTagInput,
    isPinned,
    setIsPinned,
    color,
    setColor,
    reminderDate,
    setReminderDate,
    reminderTime,
    setReminderTime,
    mobilePicker,
    setMobilePicker,
    tagSearch,
    setTagSearch,
    notificationsEnabled,
    projects,
    noteTags,
    getTagColor,
    selectedProject,
    reminderSummary,
    mobileTagResults,
    toggleMobileTag,
    handleEnableNotifications,
    applyPreset,
    handleSave,
    handleDelete,
    createTagFromSearch
  };
}
