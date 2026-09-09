import React from 'react';
import { Pin, X } from 'lucide-react';
import styles from './NoteDetailModal.module.css';

interface NoteChromeProps {
  isNew: boolean;
  isPinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
}

export const NoteChrome: React.FC<NoteChromeProps> = ({
  isNew,
  isPinned,
  onTogglePin,
  onClose
}) => (
  <header className={styles.chrome}>
    <span className={styles.chromeLabel}>{isNew ? 'New note' : 'Note'}</span>
    <div className={styles.chromeActions}>
      <button
        type="button"
        className={`${styles.pinBtn} ${isPinned ? styles.pinBtnActive : ''}`}
        onClick={onTogglePin}
        title={isPinned ? 'Pinned to top' : 'Pin note'}
        aria-pressed={isPinned}
      >
        <Pin size={15} />
        <span>{isPinned ? 'Pinned' : 'Pin'}</span>
      </button>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close note"
      >
        <X size={18} />
      </button>
    </div>
  </header>
);
