import { useState } from 'react';
import { useTodo } from '../context/TodoContext';
import { type TagPreset } from '../components/TagModal/tagPresets.data';

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
  const [tagColor, setTagColor] = useState('#6366f1');
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
    setTagColor('#6366f1');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tagName.trim().toLowerCase().replace(/^#/, '');
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

  const filteredTagsList = allTags.filter(t =>
    t.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const cleanPreviewName = tagName.trim().toLowerCase().replace(/^#/, '') || 'example-tag';

  const tagUsageCount = (tag: string) => tasks.filter(t => t.tags.includes(tag)).length;

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