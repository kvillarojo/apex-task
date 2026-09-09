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

interface ReminderPanelProps {
  reminderDate: string;
  reminderTime: string;
  reminderSummary: string;
  notificationsEnabled: boolean;
  setReminderDate: (value: string) => void;
  setReminderTime: (value: string) => void;
  onApplyPreset: (preset: ReminderPresetType) => void;
  onEnableNotifications: () => void;
}

export const ReminderPanel: React.FC<ReminderPanelProps> = ({
  reminderDate,
  reminderTime,
  reminderSummary,
  notificationsEnabled,
  setReminderDate,
  setReminderTime,
  onApplyPreset,
  onEnableNotifications
}) => (
  <section className="planning-panel">
    <h3 className="panel-title">
      <Clock size={14} style={{ marginRight: '6px' }} />
      Reminder
    </h3>
    <div className="panel-content">
      <div className={`reminder-status ${reminderDate ? 'is-set' : ''}`}>
        <div className="reminder-status-icon">
          {reminderDate ? <AlarmClock size={17} /> : <CalendarDays size={17} />}
        </div>
        <div>
          <strong>{reminderDate ? 'Reminder scheduled' : 'Set a reminder'}</strong>
          <span>{reminderSummary}</span>
        </div>
        {reminderDate && (
          <button
            type="button"
            className="reminder-clear-btn"
            onClick={() => onApplyPreset(ReminderPreset.Clear)}
          >
            Clear
          </button>
        )}
      </div>

      <div className="reminder-section-label">Quick schedule</div>
      <div className="reminder-presets">
        <button type="button" className="reminder-preset" onClick={() => onApplyPreset(ReminderPreset.Today)}>
          <Clock size={15} />
          <span>Later today<small>6:00 PM</small></span>
        </button>
        <button type="button" className="reminder-preset" onClick={() => onApplyPreset(ReminderPreset.Tomorrow)}>
          <Sunrise size={15} />
          <span>Tomorrow<small>9:00 AM</small></span>
        </button>
        <button type="button" className="reminder-preset" onClick={() => onApplyPreset(ReminderPreset.Weekend)}>
          <CalendarDays size={15} />
          <span>This weekend<small>Saturday 10:00 AM</small></span>
        </button>
        <button type="button" className="reminder-preset" onClick={() => onApplyPreset(ReminderPreset.NextWeek)}>
          <CalendarClock size={15} />
          <span>Next Monday<small>9:00 AM</small></span>
        </button>
      </div>

      <div className="reminder-section-label">Custom schedule</div>
      <div className="reminder-custom-fields">
        <label className="form-group">
          <span>DATE</span>
          <input
            type="date"
            value={reminderDate}
            onChange={event => setReminderDate(event.target.value)}
            className="form-input"
          />
        </label>
        <label className="form-group">
          <span>TIME</span>
          <input
            type="time"
            value={reminderTime}
            onChange={event => setReminderTime(event.target.value)}
            className="form-input"
          />
        </label>
      </div>
      {reminderDate && !notificationsEnabled && typeof Notification !== 'undefined' && (
        <button type="button" className="notification-permission-btn" onClick={onEnableNotifications}>
          <Bell size={14} /> Enable device alerts
        </button>
      )}
    </div>
  </section>
);
