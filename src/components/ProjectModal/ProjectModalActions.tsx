import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Project } from '../../types/todo';

interface ProjectModalFooterProps {
  isEditing: boolean;
  editingProject: Project | null;
  name: string;
  color: string;
  onClose: () => void;
  onDelete: () => void;
}

export const ProjectModalActions: React.FC<ProjectModalFooterProps> = ({
  isEditing,
  editingProject,
  name,
  color,
  onClose,
  onDelete
}) => (
  <div className="project-modal-footer">
    {isEditing && editingProject && editingProject.id !== 'inbox' ? (
      <button
        type="button"
        className="btn-secondary"
        style={{ color: 'var(--priority-p1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
        onClick={onDelete}
      >
        <Trash2 size={15} /> Delete
      </button>
    ) : (
      <div />
    )}

    <div style={{ display: 'flex', gap: '8px' }}>
      <button type="button" className="btn-secondary" onClick={onClose}>
        Cancel
      </button>
      <button
        type="submit"
        className="btn-primary"
        disabled={!name.trim()}
        style={{
          backgroundColor: color,
          boxShadow: `0 4px 14px ${color}44`
        }}
      >
        {isEditing ? 'Save Changes' : 'Create Project'}
      </button>
    </div>
  </div>
);
