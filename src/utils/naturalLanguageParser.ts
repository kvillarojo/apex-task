import type { Priority } from '../types/todo';

export interface ParsedTaskInput {
  cleanTitle: string;
  priority?: Priority;
  tags: string[];
  projectHint?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
}

export function parseNaturalLanguageTask(input: string): ParsedTaskInput {
  let text = input.trim();
  if (!text) {
    return { cleanTitle: '', tags: [] };
  }

  let priority: Priority | undefined;
  const tags: string[] = [];
  let projectHint: Priority | string | undefined;
  let dueDate: string | undefined;
  let dueTime: string | undefined;

  // 1. Parse Priority (p1, p2, p3, p4 or !1, !2, !3, !4)
  const priorityMatch = text.match(/(?:^|\s)(?:p([1-4])|!([1-4]))(?:\s|$)/i);
  if (priorityMatch) {
    const num = priorityMatch[1] || priorityMatch[2];
    priority = `p${num}` as Priority;
    text = text.replace(priorityMatch[0], ' ');
  }

  // 2. Parse Tags (#tag)
  const tagMatches = Array.from(text.matchAll(/(?:^|\s)#([a-zA-Z0-9_-]+)/g));
  tagMatches.forEach(match => {
    tags.push(match[1].toLowerCase());
  });
  if (tagMatches.length > 0) {
    text = text.replace(/(?:^|\s)#([a-zA-Z0-9_-]+)/g, ' ');
  }

  // 3. Parse Project (@project)
  const projectMatch = text.match(/(?:^|\s)@([a-zA-Z0-9_-]+)/);
  if (projectMatch) {
    projectHint = projectMatch[1].toLowerCase();
    text = text.replace(projectMatch[0], ' ');
  }

  // 4. Parse Dates & Times
  const now = new Date();

  // Time match (e.g. 5pm, 17:00, 10:30am, at 4pm)
  const timeMatch = text.match(/(?:at\s+)?\b([0-1]?[0-9]|2[0-3])(?::([0-5][0-9]))?\s*(am|pm)?\b/i);
  if (timeMatch && (timeMatch[3] || text.toLowerCase().includes('at '))) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    const meridian = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

    if (meridian === 'pm' && hours < 12) hours += 12;
    if (meridian === 'am' && hours === 12) hours = 0;

    dueTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    text = text.replace(timeMatch[0], ' ');
  }

  // Date phrases
  if (/\b(today|tonight)\b/i.test(text)) {

    dueDate = formatDateISO(now);
    text = text.replace(/\b(today|tonight)\b/gi, ' ');
  } else if (/\btomorrow\b/i.test(text)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    dueDate = formatDateISO(tomorrow);
    text = text.replace(/\btomorrow\b/gi, ' ');
  } else if (/\bin (\d+) days?\b/i.test(text)) {
    const daysMatch = text.match(/\bin (\d+) days?\b/i);
    if (daysMatch) {
      const days = parseInt(daysMatch[1], 10);
      const target = new Date(now);
      target.setDate(now.getDate() + days);
      dueDate = formatDateISO(target);
      text = text.replace(daysMatch[0], ' ');
    }
  } else if (/\bnext (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i.test(text)) {
    const dayMatch = text.match(/\bnext (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    if (dayMatch) {
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDayIndex = daysOfWeek.indexOf(dayMatch[1].toLowerCase());
      const currentDayIndex = now.getDay();
      let diff = targetDayIndex - currentDayIndex;
      if (diff <= 0) diff += 7;
      const target = new Date(now);
      target.setDate(now.getDate() + diff);
      dueDate = formatDateISO(target);
      text = text.replace(dayMatch[0], ' ');
    }
  }

  // Clean up extra spaces
  const cleanTitle = text.replace(/\s+/g, ' ').trim();

  return {
    cleanTitle,
    priority,
    tags,
    projectHint,
    dueDate,
    dueTime
  };
}

function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
