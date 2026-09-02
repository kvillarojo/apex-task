import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Tag as TagIcon,
  Sparkles,
  Search,
  Check,
  CheckCircle2,
  Hash
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { COLOR_PALETTE } from './ProjectModal';

interface TagPreset {
  name: string;
  color: string;
}

const TAG_PRESETS: TagPreset[] = [
  { name: 'urgent', color: '#ef4444' },
  { name: 'bug', color: '#f59e0b' },
  { name: 'feature', color: '#3b82f6' },
  { name: 'review', color: '#8b5cf6' },
  { name: 'quick-win', color: '#10b981' },
  { name: 'meeting', color: '#06b6d4' },
  { name: 'idea', color: '#ec4899' },
  { name: 'blocked', color: '#f43f5e' },
  { name: 'design', color: '#d946ef' },
  { name: 'docs', color: '#64748b' }
];

export const TagModal: React.FC = () => {
  const {
    tagModalOpen,
    closeTagModal,
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

  if (!tagModalOpen) return null;

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
      if (editingTagName === tagToDelete) {
        handleCancelEdit();
      }
    }
  };

  const filteredTagsList = allTags.filter(t =>
    t.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const cleanPreviewName = tagName.trim().toLowerCase().replace(/^#/, '') || 'example-tag';

  return (
    <div className="modal-overlay" onClick={closeTagModal}>
      <div
        className="modal-card tag-modal-card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '580px',
          maxWidth: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div className="project-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: `${tagColor}22`,
                color: tagColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 0 12px ${tagColor}33`
              }}
            >
              <TagIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Manage & Create Tags</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Customize tag colors, organize labels, and manage task tags
              </p>
            </div>
          </div>
          <button className="icon-button" onClick={closeTagModal} title="Close Modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="project-modal-body" style={{ gap: '16px' }}>
          {/* Quick Tag Presets */}
          <div className="project-modal-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Sparkles size={14} color="var(--primary)" />
              <span className="project-section-label">Popular Presets</span>
            </div>
            <div className="project-templates-scroll">
              {TAG_PRESETS.map(preset => {
                const isExisting = allTags.includes(preset.name);
                return (
                  <button
                    key={preset.name}
                    type="button"
                    className="tag-preset-chip"
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      borderColor: `${preset.color}44`,
                      backgroundColor: `${preset.color}15`,
                      color: preset.color
                    }}
                  >
                    <Hash size={12} />
                    <span>{preset.name}</span>
                    {isExisting && <CheckCircle2 size={11} style={{ opacity: 0.7 }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form: Create or Edit Tag */}
          <form onSubmit={handleSubmit} className="tag-form-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="project-section-label" style={{ marginBottom: 0 }}>
                {isEditing ? `Edit Tag: #${editingTagName}` : 'Create New Tag'}
              </span>

              {/* Live Preview Pill */}
              <div
                className="tag-live-preview-pill"
                style={{
                  backgroundColor: `${tagColor}22`,
                  borderColor: tagColor,
                  color: tagColor
                }}
              >
                <Hash size={12} />
                <span>{cleanPreviewName}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <input
                  type="text"
                  placeholder="Tag name (e.g. backend, priority, client)..."
                  value={tagName}
                  onChange={e => setTagName(e.target.value)}
                  className="project-text-input"
                  style={{ paddingLeft: '28px' }}
                  maxLength={30}
                  autoFocus
                  required
                />
                <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <Hash size={14} />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={!tagName.trim()}
                style={{
                  backgroundColor: tagColor,
                  boxShadow: `0 4px 12px ${tagColor}44`,
                  padding: '9px 16px',
                  whiteSpace: 'nowrap'
                }}
              >
                {isEditing ? <Check size={16} /> : <Plus size={16} />}
                <span>{isEditing ? 'Update Tag' : 'Add Tag'}</span>
              </button>

              {isEditing && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelEdit}
                  style={{ padding: '9px 12px' }}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Color Swatches Grid */}
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>Tag Color Theme</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Custom:</span>
                  <input
                    type="color"
                    value={tagColor}
                    onChange={e => setTagColor(e.target.value)}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      background: 'transparent'
                    }}
                    title="Pick custom hex color"
                  />
                </div>
              </div>

              <div className="project-color-grid" style={{ gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
                {COLOR_PALETTE.map(c => {
                  const isSelected = tagColor.toLowerCase() === c.value.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      className={`project-color-swatch ${isSelected ? 'selected' : ''}`}
                      style={{ backgroundColor: c.value, width: '100%', height: '26px' }}
                      onClick={() => setTagColor(c.value)}
                      title={c.name}
                    >
                      {isSelected && <Check size={12} color="#ffffff" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </form>

          {/* Existing Tags Management List */}
          <div className="project-modal-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="project-section-label">
                All Tags ({allTags.length})
              </span>

              {/* Tag Search */}
              <div style={{ position: 'relative', width: '180px' }}>
                <input
                  type="text"
                  placeholder="Search tags..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '4px 8px 4px 26px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '0.75rem',
                    outline: 'none'
                  }}
                />
                <Search size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <div className="tag-manager-list">
              {filteredTagsList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  {allTags.length === 0 ? 'No tags created yet. Use the presets or form above to add tags!' : 'No matching tags found.'}
                </div>
              ) : (
                filteredTagsList.map(tag => {
                  const color = getTagColor(tag);
                  const usageCount = tasks.filter(t => t.tags.includes(tag)).length;
                  const isCurrentlyEditing = editingTagName === tag;

                  return (
                    <div
                      key={tag}
                      className={`tag-manager-item ${isCurrentlyEditing ? 'active-edit' : ''}`}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          className="tag-pill-badge"
                          style={{
                            backgroundColor: `${color}20`,
                            borderColor: `${color}55`,
                            color: color
                          }}
                        >
                          <Hash size={12} />
                          <span>{tag}</span>
                        </span>
                        <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                          {usageCount} {usageCount === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          className="tag-action-btn"
                          onClick={() => handleStartEdit(tag)}
                          title={`Edit #${tag}`}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="tag-action-btn delete-btn"
                          onClick={() => handleDeleteTag(tag)}
                          title={`Delete #${tag}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="project-modal-footer">
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Tip: You can also create tags quickly while typing task titles with <code>#tag</code>
          </div>
          <button type="button" className="btn-primary" onClick={closeTagModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
