import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Assignee } from '../../types/todo';
import styles from './PeopleModal.module.css';

interface PeopleListProps {
  assignees: Assignee[];
  onEdit: (person: Assignee) => void;
  onDelete: (person: Assignee) => void;
}

export const PeopleList: React.FC<PeopleListProps> = ({ assignees, onEdit, onDelete }) => (
  <div className={styles.list}>
    {assignees.length === 0 && (
      <p className={styles.empty}>No people added yet.</p>
    )}
    {assignees.map(person => (
      <div key={person.id} className={styles.listItem}>
        <div className={styles.personInfo}>
          <span
            className={styles.avatar}
            style={{ backgroundColor: person.avatarColor }}
          >
            {person.initials}
          </span>
          <div>
            <div className={styles.personName}>{person.name}</div>
            {person.role && <div className={styles.personRole}>{person.role}</div>}
          </div>
        </div>
        <div className={styles.actions}>
          <button className="icon-button" onClick={() => onEdit(person)} title={`Edit ${person.name}`}>
            <Edit2 size={15} />
          </button>
          <button className="icon-button" onClick={() => onDelete(person)} title={`Delete ${person.name}`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    ))}
  </div>
);
