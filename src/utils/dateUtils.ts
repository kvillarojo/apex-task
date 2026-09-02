export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr < getTodayString();
}

export function isUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getTodayString();
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = formatDateISO(nextWeek);
  return dateStr > today && dateStr <= nextWeekStr;
}

export function formatFriendlyDate(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  const today = getTodayString();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = formatDateISO(tomorrowDate);

  let label = '';
  if (dateStr === today) {
    label = 'Today';
  } else if (dateStr === tomorrowStr) {
    label = 'Tomorrow';
  } else if (isOverdue(dateStr)) {
    const parts = dateStr.split('-');
    label = `Overdue (${parts[1]}/${parts[2]})`;
  } else {
    const dateObj = new Date(dateStr + 'T00:00:00');
    label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  if (timeStr) {
    label += ` at ${formatTime12h(timeStr)}`;
  }

  return label;
}

export function formatTime12h(timeStr: string): string {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface CalendarDay {
  dateString: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarGrid(year: number, month: number): CalendarDay[] {
  const grid: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun
  const totalDays = lastDayOfMonth.getDate();

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    grid.push({
      dateString: formatDateISO(prevDate),
      dayOfMonth: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: formatDateISO(prevDate) === getTodayString()
    });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    const currDate = new Date(year, month, day);
    grid.push({
      dateString: formatDateISO(currDate),
      dayOfMonth: day,
      isCurrentMonth: true,
      isToday: formatDateISO(currDate) === getTodayString()
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remaining = (7 - (grid.length % 7)) % 7;
  for (let day = 1; day <= remaining; day++) {
    const nextDate = new Date(year, month + 1, day);
    grid.push({
      dateString: formatDateISO(nextDate),
      dayOfMonth: day,
      isCurrentMonth: false,
      isToday: formatDateISO(nextDate) === getTodayString()
    });
  }

  return grid;
}
