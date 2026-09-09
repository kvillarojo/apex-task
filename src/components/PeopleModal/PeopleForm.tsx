import React from 'react';
import { UserPlus } from 'lucide-react';
import { AVATAR_COLORS } from '../../constants/colors';
import styles from './PeopleModal.module.css';

interface PeopleFormProps {
  name: string;
  setName: (value: string) => void;
  role: string;
  setRole: (value: string) => void;
  avatarColor: string;
  setAvatarColor: (value: string) => void;
  editingId: string | null;
  onSubmit: (event: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export const PeopleForm: React.FC<PeopleFormProps> = ({
  name,
  setName,
  role,
  setRole,
  avatarColor,
  setAvatarColor,
  editingId,
  onSubmit,
  onCancelEdit
}) => (
  <>
    <form onSubmit={onSubmit} className={styles.form}>
      <label className={styles.label}>
        NAME
        <input
          className="project-text-input"
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="Full name"
          style={{ marginTop: '4px' }}
        />
      </label>
      <label className={styles.label}>
        ROLE (OPTIONAL)
        <input
          className="project-text-input"
          value={role}
          onChange={event => setRole(event.target.value)}
          placeholder="Role"
          style={{ marginTop: '4px' }}
        />
      </label>
      <button className="btn-primary" type="submit" style={{ marginBottom: '5px' }}>
        <UserPlus size={15} /> {editingId ? 'Update' : 'Add'}
      </button>
    </form>

    <div className={styles.colorRow}>
      <span className={styles.label}>COLOR</span>
      {AVATAR_COLORS.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => setAvatarColor(color)}
          title={`Select ${color}`}
          className={styles.avatarSwatch}
          style={{
            border: avatarColor === color ? '2px solid var(--text-primary)' : '2px solid transparent',
            backgroundColor: color
          }}
        />
      ))}
      {editingId && (
        <button className="btn-secondary" type="button" onClick={onCancelEdit}>
          Cancel
        </button>
      )}
    </div>
  </>
);
