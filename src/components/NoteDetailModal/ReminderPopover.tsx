import React from 'react';
import {
  Clock,
  Bell,
  CalendarDays,
  Sunrise,
  CalendarClock,
  AlarmClock
} from 'lucide-react';
import { ReminderPreset, type ReminderPreset as ReminderPresetType } from '../../constants/enums';
import styles from './NoteDetailModal.module.css';

interface ReminderPopoverProps {
  reminderDate: string;
  reminderTime: string;
  reminderSummary: string;
  notificationsEnabled: boolean;
  setReminderDate: (value: string) => void;
  setReminderTime: (value: string) => void;
  onApplyPreset: (preset: ReminderPresetType) => void;
  onEnableNotifications: () => void;
}

export const ReminderPopover: React.FC<ReminderPopoverProps> = ({
  reminderDate,
  reminderTime,
  reminderSummary,
  notificationsEnabled,
  setReminderDate,
  setReminderTime,
  onApplyPreset,
  onEnableNotifications
}) => (
  <div className={styles.popover} role="dialog" aria-label="Reminder">
    <div className={`${styles.reminderStatus} ${reminderDate ? styles.reminderStatusSet : ''}`}>
      <div className={styles.reminderStatusIcon}>
        {reminderDate ? <AlarmClock size={16} /> : <CalendarDays size={16} />}
      </div>
      <div className={styles.reminderStatusText}>
        <strong>{reminderDate ? 'Scheduled' : 'No reminder'}</strong>
        <span>{reminderSummary}</span>
      </div>
      {reminderDate && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => onApplyPreset(ReminderPreset.Clear)}
        >
          Clear
        </button>
      )}
    </div>

    <p className={styles.popoverSectionLabel}>Quick</p>
    <div className={styles.reminderPresets}>
      <button type="button" className={styles.reminderPreset} onClick={() => onApplyPreset(ReminderPreset.Today)}>
        <Clock size={14} />
        <span>Later today<small>6:00 PM</small></span>
      </button>
      <button type="button" className={styles.reminderPreset} onClick={() => onApplyPreset(ReminderPreset.Tomorrow)}>
        <Sunrise size={14} />
        <span>Tomorrow<small>9:00 AM</small></span>
      </button>
      <button type="button" className={styles.reminderPreset} onClick={() => onApplyPreset(ReminderPreset.Weekend)}>
        <CalendarDays size={14} />
        <span>Weekend<small>Sat 10:00 AM</small></span>
      </button>
      <button type="button" className={styles.reminderPreset} onClick={() => onApplyPreset(ReminderPreset.NextWeek)}>
        <CalendarClock size={14} />
        <span>Next Monday<small>9:00 AM</small></span>
      </button>
    </div>

    <p className={styles.popoverSectionLabel}>Custom</p>
    <div className={styles.reminderFields}>
      <label>
        <span>Date</span>
        <input
          type="date"
          value={reminderDate}
          onChange={event => setReminderDate(event.target.value)}
          className={styles.fieldInput}
        />
      </label>
      <label>
        <span>Time</span>
        <input
          type="time"
          value={reminderTime}
          onChange={event => setReminderTime(event.target.value)}
          className={styles.fieldInput}
        />
      </label>
    </div>

    {reminderDate && !notificationsEnabled && typeof Notification !== 'undefined' && (
      <button type="button" className={styles.notifyBtn} onClick={onEnableNotifications}>
        <Bell size={14} /> Enable device alerts
      </button>
    )}
  </div>
);
