export interface TagPreset {
  name: string;
  color: string;
}

export const TAG_PRESETS: TagPreset[] = [
  { name: 'urgent', color: '#ef4444' },
  { name: 'bug', color: '#f59e0b' },
  { name: 'feature', color: '#3b82f6' },
  { name: 'review', color: '#8b5cf6' },
  { name: 'quick-win', color: '#10b981' },
  { name: 'meeting', color: '#06b6d4' },
  { name: 'idea', color: '#ec4899' },
  { name: 'blocked', color: '#f43f5e' },
  { name: 'design', color: '#d946ef' },
  { name: 'docs', color: '#64748b' }
];