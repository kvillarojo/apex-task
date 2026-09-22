import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { getCalendarGrid, getTodayString } from '../../../utils/dateUtils';
import styles from './DatePicker.module.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/** Format a YYYY-MM-DD string to a readable label for the trigger button. */
function formatTriggerLabel(dateStr: string, timeStr?: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  const dateLabel = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  if (!timeStr) return dateLabel;
  return `${dateLabel} · ${timeStr}`;
}

export interface DatePickerProps {
  /** Currently selected date as YYYY-MM-DD, or empty string for none. */
  value: string;
  onChange: (date: string) => void;
  /** Currently selected time as HH:mm, or empty string for none. */
  timeValue?: string;
  onTimeChange?: (time: string) => void;
  placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  timeValue = '',
  onTimeChange,
  placeholder = 'Set due date…'
}) => {
  const today = getTodayString();

  const initialDate = value ? new Date(`${value}T12:00:00`) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [open, setOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({ visibility: 'hidden' });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const d = new Date(`${value}T12:00:00`);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [value]);

  // Position against the viewport. Must portal out of the ticket modal —
  // its overflow:hidden + retained animation transform clip/misplace fixed children.
  const positionDropdown = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropW = Math.min(Math.max(rect.width, 280), window.innerWidth - 16);
    const dropH = dropdownRef.current?.offsetHeight ?? 360;

    let left = rect.left;
    if (left + dropW > window.innerWidth - 8) {
      left = Math.max(8, rect.right - dropW);
    }

    let top = rect.bottom + 8;
    if (top + dropH > window.innerHeight - 8) {
      top = Math.max(8, rect.top - dropH - 8);
    }

    setDropdownStyle({ top, left, width: dropW, visibility: 'visible' });
  };

  useLayoutEffect(() => {
    if (!open) return;
    positionDropdown();
    requestAnimationFrame(positionDropdown);
    window.addEventListener('resize', positionDropdown);
    window.addEventListener('scroll', positionDropdown, true);
    return () => {
      window.removeEventListener('resize', positionDropdown);
      window.removeEventListener('scroll', positionDropdown, true);
    };
  }, [open, viewYear, viewMonth, onTimeChange]);

  const handleTrigger = () => {
    setOpen(prev => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      // Native time popups keep focus on the input while the UI is outside the panel
      if (dropdownRef.current?.contains(document.activeElement)) return;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener('keydown', handleKey, true);
    return () => document.removeEventListener('keydown', handleKey, true);
  }, [open]);

  const gridDays = getCalendarGrid(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    onChange(today);
  };

  const handleSelectDay = (dateStr: string) => {
    onChange(dateStr);
    // Keep open when time input is present so user can set time too
    if (!onTimeChange) setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    onTimeChange?.('');
  };

  const hasValue = Boolean(value);

  return (
    <div className={styles.wrapper}>
      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ''} ${hasValue ? styles.hasValue : ''}`}
        onClick={handleTrigger}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CalendarDays size={15} className={styles.triggerIcon} strokeWidth={2} />
        <span className={`${styles.triggerLabel} ${!hasValue ? styles.placeholder : ''}`}>
          {hasValue ? formatTriggerLabel(value, timeValue) : placeholder}
        </span>
        {hasValue && (
          <span
            role="button"
            aria-label="Clear date"
            className={styles.clearBtn}
            onClick={handleClear}
            onKeyDown={e => e.key === 'Enter' && handleClear(e as unknown as React.MouseEvent)}
            tabIndex={0}
          >
            <X size={14} strokeWidth={2} />
          </span>
        )}
      </button>

      {open && createPortal(
        <div
          ref={dropdownRef}
          role="dialog"
          aria-label="Date picker"
          className={styles.dropdown}
          style={dropdownStyle}
        >
          <div className={styles.calHeader}>
            <button type="button" className={styles.navBtn} onClick={handlePrevMonth} aria-label="Previous month">
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <div className={styles.monthBlock}>
              <span className={styles.monthLabel}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button type="button" className={styles.todayBtn} onClick={handleToday}>
                Today
              </button>
            </div>
            <button type="button" className={styles.navBtn} onClick={handleNextMonth} aria-label="Next month">
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          <div className={styles.weekdayRow}>
            {WEEKDAY_LABELS.map(d => (
              <div key={d} className={styles.weekday}>{d}</div>
            ))}
          </div>

          <div className={styles.grid}>
            {gridDays.map(cell => {
              const isSelected = value === cell.dateString;
              const cellClasses = [
                styles.dayCell,
                !cell.isCurrentMonth ? styles.outsideMonth : '',
                cell.isToday && !isSelected ? styles.today : '',
                isSelected ? styles.selected : ''
              ].filter(Boolean).join(' ');

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  className={cellClasses}
                  onClick={() => handleSelectDay(cell.dateString)}
                  aria-label={cell.dateString}
                  aria-pressed={isSelected}
                >
                  {cell.dayOfMonth}
                </button>
              );
            })}
          </div>

          {onTimeChange && (
            <div className={styles.timeFooter}>
              <label className={styles.timeLabel} htmlFor="datepicker-time">
                <Clock size={13} strokeWidth={2} />
                Time
              </label>
              <input
                id="datepicker-time"
                className={styles.timeInput}
                type="time"
                value={timeValue}
                onChange={e => onTimeChange(e.target.value)}
                aria-label="Due time"
              />
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
