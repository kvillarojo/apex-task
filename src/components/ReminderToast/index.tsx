import React from 'react';
import { Bell, X, ExternalLink, Clock } from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styles from './ReminderToast.module.css';

export const ReminderToast: React.FC = () => {
  const {
    activeAlert,
    dismissActiveAlert,
    snoozeActiveAlert,
    notes,
    tasks,
    openEditNoteModal,
    setEditingTask,
    setViewMode
  } = useTodo();

  if (!activeAlert) return null;

  const handleOpenItem = () => {
    if (activeAlert.type === 'note') {
      const note = notes.find(n => n.id === activeAlert.itemId);
      if (note) {
        setViewMode('notes');
        openEditNoteModal(note);
      }
    } else {
      const task = tasks.find(t => t.id === activeAlert.itemId);
      if (task) {
        setEditingTask(task);
      }
    }
    dismissActiveAlert();
  };

  return (
    <div
      {...getThemeComponentProps(ThemeComponent.ReminderToast)}
      className={styles.container}
      role="status"
      aria-live="polite"
    >
      <div className={styles.card}>
        <div className={styles.left}>
          <div className={styles.bellBadge}>
            <Bell size={18} />
          </div>
          <div className={styles.content}>
            <div className={styles.header}>
              <span className={styles.tag}>
                {activeAlert.type === 'note' ? 'Note Reminder' : 'Task Reminder'}
              </span>
              <span className={styles.time}>{activeAlert.dueText}</span>
            </div>
            <h4 className={styles.title}>{activeAlert.title}</h4>
            <span className={styles.project}>
              Project: {activeAlert.projectName}
            </span>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`btn-primary ${styles.openBtn}`}
            onClick={handleOpenItem}
          >
            <ExternalLink size={13} />
            <span>Open</span>
          </button>
          <button
            type="button"
            className={`btn-secondary ${styles.snoozeBtn}`}
            onClick={() => snoozeActiveAlert(15)}
            title="Snooze for 15 minutes"
          >
            <Clock size={13} />
            <span>Snooze 15m</span>
          </button>
        </div>

        <button
          type="button"
          className={styles.dismissBtn}
          onClick={dismissActiveAlert}
          aria-label="Dismiss alert"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
