import React from 'react';
import { Bell, X, ExternalLink, Clock } from 'lucide-react';
import { useTodo } from '../context/TodoContext';

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
    <div className="reminder-toast-container">
      <div className="reminder-toast-card">
        <div className="reminder-toast-left">
          <div className="reminder-bell-badge">
            <Bell size={18} />
          </div>
          <div className="reminder-toast-content">
            <div className="reminder-toast-header">
              <span className="reminder-toast-tag">
                {activeAlert.type === 'note' ? 'Note Reminder' : 'Task Reminder'}
              </span>
              <span className="reminder-toast-time">{activeAlert.dueText}</span>
            </div>
            <h4 className="reminder-toast-title">{activeAlert.title}</h4>
            <span className="reminder-toast-project">
              Project: {activeAlert.projectName}
            </span>
          </div>
        </div>

        <div className="reminder-toast-actions">
          <button
            type="button"
            className="btn-primary reminder-open-btn"
            onClick={handleOpenItem}
          >
            <ExternalLink size={13} />
            <span>Open</span>
          </button>
          <button
            type="button"
            className="btn-secondary reminder-snooze-btn"
            onClick={() => snoozeActiveAlert(15)}
            title="Snooze for 15 minutes"
          >
            <Clock size={13} />
            <span>Snooze 15m</span>
          </button>
          <button
            type="button"
            className="reminder-dismiss-btn"
            onClick={dismissActiveAlert}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
