import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
  anchorEl: HTMLElement | null;
  reminderDate: string;
  reminderTime: string;
  reminderSummary: string;
  notificationsEnabled: boolean;
  setReminderDate: (value: string) => void;
  setReminderTime: (value: string) => void;
  onApplyPreset: (preset: ReminderPresetType) => void;
  onEnableNotifications: () => void;
  onRequestClose: () => void;
}

interface FloatingCoords {
  top: number;
  left: number;
  width: number;
  placement: 'above' | 'below';
}

export const ReminderPopover: React.FC<ReminderPopoverProps> = ({
  anchorEl,
  reminderDate,
  reminderTime,
  reminderSummary,
  notificationsEnabled,
  setReminderDate,
  setReminderTime,
  onApplyPreset,
  onEnableNotifications,
  onRequestClose
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<FloatingCoords | null>(null);

  useLayoutEffect(() => {
    if (!anchorEl) return;

    const update = () => {
      const rect = anchorEl.getBoundingClientRect();
      const isCompact = window.innerWidth <= 900;
      const panelWidth = isCompact
        ? Math.max(0, window.innerWidth - 24)
        : Math.min(340, window.innerWidth - 24);
      const panelHeight = panelRef.current?.offsetHeight ?? 360;
      const gap = 10;
      const spaceAbove = rect.top;
      const placement: FloatingCoords['placement'] =
        !isCompact && spaceAbove >= panelHeight + gap + 12 ? 'above' : 'below';

      let left = isCompact ? 12 : rect.left;
      left = Math.max(12, Math.min(left, window.innerWidth - panelWidth - 12));

      const top =
        placement === 'above'
          ? Math.max(12, rect.top - gap)
          : Math.min(
              window.innerHeight - Math.min(panelHeight, window.innerHeight * 0.72) - 12,
              rect.bottom + gap
            );

      setCoords({ top, left, width: panelWidth, placement });
    };

    update();
    // Re-measure once the panel is in the DOM so placement uses real height.
    requestAnimationFrame(update);
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [anchorEl]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onRequestClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onRequestClose();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorEl, onRequestClose]);

  const panelVars = coords
    ? ({
        '--reminder-float-top': `${coords.top}px`,
        '--reminder-float-left': `${coords.left}px`,
        '--reminder-float-width': `${coords.width}px`
      } as React.CSSProperties)
    : ({
        '--reminder-float-top': '0px',
        '--reminder-float-left': '0px',
        '--reminder-float-width': '340px',
        visibility: 'hidden'
      } as React.CSSProperties);

  return createPortal(
    <div
      ref={panelRef}
      className={`${styles.floatingReminder} ${
        coords?.placement === 'below' ? styles.floatingReminderBelow : styles.floatingReminderAbove
      }`}
      style={panelVars}
      role="dialog"
      aria-label="Reminder"
    >
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
    </div>,
    document.body
  );
};
