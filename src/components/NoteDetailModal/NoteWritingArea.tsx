import React from 'react';
import { DescriptionEditor } from '../DescriptionEditor';
import styles from './NoteDetailModal.module.css';

interface NoteWritingAreaProps {
  title: string;
  setTitle: (value: string) => void;
  content: string;
  setContent: (value: string) => void;
  autoFocusTitle: boolean;
}

export const NoteWritingArea: React.FC<NoteWritingAreaProps> = ({
  title,
  setTitle,
  content,
  setContent,
  autoFocusTitle
}) => (
  <div className={styles.writing}>
    <input
      type="text"
      value={title}
      placeholder="Title"
      onChange={event => setTitle(event.target.value)}
      className={styles.titleInput}
      autoFocus={autoFocusTitle}
      aria-label="Note title"
    />
    <div className={styles.editorWrap}>
      <DescriptionEditor value={content} onChange={setContent} />
    </div>
  </div>
);
