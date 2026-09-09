import { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { AVATAR_COLORS } from '../../constants/colors';
import { getInitials } from '../../utils/stringUtils';
import type { Assignee } from '../../types/todo';

export function usePeopleModal() {
  const {
    peopleModalOpen,
    closePeopleModal,
    assignees,
    addAssignee,
    updateAssignee,
    deleteAssignee
  } = useTodo();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [avatarColor, setAvatarColor] = useState<string>(AVATAR_COLORS[0]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setRole('');
    setAvatarColor(AVATAR_COLORS[0]);
  };

  const startEdit = (person: Assignee) => {
    setEditingId(person.id);
    setName(person.name);
    setRole(person.role || '');
    setAvatarColor(person.avatarColor);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const initials = getInitials(trimmedName);
    const payload = {
      name: trimmedName,
      role: role.trim() || undefined,
      initials,
      avatarColor
    };

    if (editingId) {
      updateAssignee(editingId, payload);
    } else {
      addAssignee(payload);
    }
    resetForm();
  };

  const handleDelete = (person: Assignee) => {
    if (confirm(`Delete ${person.name}? Their tickets will become unassigned.`)) {
      deleteAssignee(person.id);
      if (editingId === person.id) resetForm();
    }
  };

  return {
    open: peopleModalOpen,
    close: closePeopleModal,
    assignees,
    editingId,
    name,
    setName,
    role,
    setRole,
    avatarColor,
    setAvatarColor,
    resetForm,
    startEdit,
    handleSubmit,
    handleDelete
  };
}
