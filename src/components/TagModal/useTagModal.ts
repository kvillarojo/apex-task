import { useState } from 'react';
import { useTodo } from '../../context/TodoContext';
import { DEFAULT_ACCENT } from '../../constants/colors';
import { normalizeTagName } from '../../utils/tagUtils';
import { type TagPreset } from './tagPresets.data';

export function useTagModal() {
  const {
    allTags,
    addCustomTag,
    updateTag,
    removeCustomTag,
    getTagColor,
    tasks
  } = useTodo();

  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(DEFAULT_ACCENT);
  const [editingTagName, setEditingTagName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isEditing = editingTagName !== null;

  const handleStartEdit = (tagToEdit: string) => {
    setEditingTagName(tagToEdit);
    setTagName(tagToEdit);
    setTagColor(getTagColor(tagToEdit));
  };

  const handleCancelEdit = () => {
    setEditingTagName(null);
    setTagName('');
    setTagColor(DEFAULT_ACCENT);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const clean = normalizeTagName(tagName);
    if (!clean) return;

    if (isEditing && editingTagName) {
      updateTag(editingTagName, clean, tagColor);
    } else {
      addCustomTag(clean, tagColor);
    }
    handleCancelEdit();
  };

  const handleApplyPreset = (preset: TagPreset) => {
    if (allTags.includes(preset.name)) {
      handleStartEdit(preset.name);
      setTagColor(preset.color);
    } else {
      setTagName(preset.name);
      setTagColor(preset.color);
      setEditingTagName(null);
    }
  };

  const handleDeleteTag = (tagToDelete: string) => {
    if (confirm(`Delete tag "#${tagToDelete}"? It will be removed from all associated tasks.`)) {
      removeCustomTag(tagToDelete);
      if (editingTagName === tagToDelete) handleCancelEdit();
    }
  };

  const filteredTagsList = allTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const cleanPreviewName = normalizeTagName(tagName) || 'example-tag';

  const tagUsageCount = (tag: string) => tasks.filter(task => task.tags.includes(tag)).length;

  return {
    allTags,
    getTagColor,
    tagName,
    setTagName,
    tagColor,
    setTagColor,
    editingTagName,
    isEditing,
    searchQuery,
    setSearchQuery,
    filteredTagsList,
    cleanPreviewName,
    tagUsageCount,
    handleStartEdit,
    handleCancelEdit,
    handleSubmit,
    handleApplyPreset,
    handleDeleteTag
  };
}
