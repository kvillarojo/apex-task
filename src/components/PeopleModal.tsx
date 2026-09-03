import React, { useState } from 'react';
import { Edit2, Trash2, UserPlus, Users, X } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { Assignee } from '../types/todo';

const AVATAR_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

const getInitials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');

export const PeopleModal: React.FC = () => {
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
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

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
    if (editingId) {
      updateAssignee(editingId, { name: trimmedName, role: role.trim() || undefined, initials, avatarColor });
    } else {
      addAssignee({ name: trimmedName, role: role.trim() || undefined, initials, avatarColor });
    }
    resetForm();
  };

  const handleDelete = (person: Assignee) => {
    if (confirm(`Delete ${person.name}? Their tickets will become unassigned.`)) {
      deleteAssignee(person.id);
      if (editingId === person.id) resetForm();
    }
  };

  if (!peopleModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closePeopleModal}>
      <div className="modal-card" onClick={event => event.stopPropagation()} style={{ width: '620px', maxWidth: '92vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={20} color="var(--primary)" />
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manage People</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Add people to assign them to tickets.</p>
            </div>
          </div>
          <button className="icon-button" onClick={closePeopleModal} title="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '8px', alignItems: 'end' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            NAME
            <input className="project-text-input" value={name} onChange={event => setName(event.target.value)} placeholder="Full name" style={{ marginTop: '4px' }} />
          </label>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            ROLE (OPTIONAL)
            <input className="project-text-input" value={role} onChange={event => setRole(event.target.value)} placeholder="Role" style={{ marginTop: '4px' }} />
          </label>
          <button className="btn-primary" type="submit" style={{marginBottom: '5px'}}>
            <UserPlus size={15} /> {editingId ? 'Update' : 'Add'}
          </button>
        </form>

        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>COLOR</span>
          {AVATAR_COLORS.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => setAvatarColor(color)}
              title={`Select ${color}`}
              style={{ width: '22px', height: '22px', borderRadius: '50%', border: avatarColor === color ? '2px solid var(--text-primary)' : '2px solid transparent', backgroundColor: color, cursor: 'pointer' }}
            />
          ))}
          {editingId && <button className="btn-secondary" type="button" onClick={resetForm}>Cancel</button>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '40vh', overflowY: 'auto' }}>
          {assignees.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No people added yet.</p>}
          {assignees.map(person => (
            <div key={person.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-input)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'grid', placeItems: 'center', backgroundColor: person.avatarColor, color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{person.initials}</span>
                <div>
                  <div style={{ fontWeight: 600 }}>{person.name}</div>
                  {person.role && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{person.role}</div>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="icon-button" onClick={() => startEdit(person)} title={`Edit ${person.name}`}><Edit2 size={15} /></button>
                <button className="icon-button" onClick={() => handleDelete(person)} title={`Delete ${person.name}`}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
