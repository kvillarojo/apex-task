import type React from 'react';
import {
  Sparkles,
  Briefcase,
  Code,
  Terminal,
  Rocket,
  Target,
  Book,
  GraduationCap,
  Heart,
  Activity,
  Dumbbell,
  Compass,
  Plane,
  ShoppingBag,
  DollarSign,
  Palette,
  Folder,
  Star,
  Zap,
  Cpu,
  Coffee,
  Home,
  Music,
  Film,
  CheckCircle2,
  Inbox,
  Flame,
  Bookmark,
  Smile,
  Sun,
  Trophy,
  Wrench,
  Shield,
  Globe,
  Clock,
  MessageSquare
} from 'lucide-react';
import { IconFilter } from './enums';

export type ProjectIconComponent = React.ComponentType<{
  size?: number;
  color?: string;
  className?: string;
}>;

export const PROJECT_ICONS: Record<string, ProjectIconComponent> = {
  Folder,
  Inbox,
  Star,
  CheckCircle2,
  Bookmark,
  Clock,
  Sparkles,
  Briefcase,
  Target,
  Rocket,
  DollarSign,
  Trophy,
  Shield,
  MessageSquare,
  Code,
  Terminal,
  Cpu,
  Zap,
  Globe,
  Wrench,
  Book,
  GraduationCap,
  Coffee,
  Home,
  Heart,
  Smile,
  Activity,
  Dumbbell,
  Flame,
  Sun,
  Plane,
  Compass,
  ShoppingBag,
  Palette,
  Music,
  Film
};

export const PROJECT_ICON_CATEGORIES: Record<Exclude<IconFilter, 'all'>, string[]> = {
  [IconFilter.Work]: ['Briefcase', 'Target', 'Rocket', 'DollarSign', 'Trophy', 'Shield', 'MessageSquare'],
  [IconFilter.Tech]: ['Code', 'Terminal', 'Cpu', 'Zap', 'Globe', 'Wrench'],
  [IconFilter.Life]: [
    'Book',
    'GraduationCap',
    'Coffee',
    'Home',
    'Heart',
    'Smile',
    'Activity',
    'Dumbbell',
    'Flame',
    'Sun',
    'Plane',
    'Compass',
    'ShoppingBag',
    'Palette',
    'Music',
    'Film'
  ]
};

export function getProjectIcon(iconKey?: string): ProjectIconComponent {
  return (iconKey && PROJECT_ICONS[iconKey]) || Folder;
}

export function filterProjectIcons(filter: IconFilter): [string, ProjectIconComponent][] {
  return Object.entries(PROJECT_ICONS).filter(([iconName]) => {
    if (filter === IconFilter.All) return true;
    return PROJECT_ICON_CATEGORIES[filter].includes(iconName);
  });
}
