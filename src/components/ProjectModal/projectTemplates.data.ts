import type { ViewMode } from '../../types/todo';

export interface ProjectTemplate {
  name: string;
  color: string;
  icon: string;
  description: string;
  defaultView: ViewMode;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    name: 'Work Sprint',
    color: '#3b82f6',
    icon: 'Briefcase',
    description: 'Weekly goals, team syncs & sprint deliverables',
    defaultView: 'kanban'
  },
  {
    name: 'Dev Project',
    color: '#06b6d4',
    icon: 'Code',
    description: 'Software features, code reviews & releases',
    defaultView: 'kanban'
  },
  {
    name: 'Goals & Habits',
    color: '#f59e0b',
    icon: 'Target',
    description: 'High-impact milestones & personal aspirations',
    defaultView: 'eisenhower'
  },
  {
    name: 'Fitness & Health',
    color: '#10b981',
    icon: 'Activity',
    description: 'Workouts, nutrition & healthy habits',
    defaultView: 'calendar'
  },
  {
    name: 'Study & Notes',
    color: '#8b5cf6',
    icon: 'GraduationCap',
    description: 'Coursework, readings & research topics',
    defaultView: 'list'
  },
  {
    name: 'Trip Planner',
    color: '#f97316',
    icon: 'Plane',
    description: 'Itineraries, bookings & packing checklists',
    defaultView: 'calendar'
  },
  {
    name: 'Design Lab',
    color: '#ec4899',
    icon: 'Palette',
    description: 'UI/UX mockups, brand assets & creative ideas',
    defaultView: 'kanban'
  },
  {
    name: 'Personal & Errands',
    color: '#64748b',
    icon: 'ShoppingBag',
    description: 'Daily errands, groceries & home maintenance',
    defaultView: 'list'
  }
];
