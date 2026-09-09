import React from 'react';
import {
  CheckSquare,
  List,
  Kanban,
  Grid,
  Calendar,
  BarChart3,
  Sun,
  Moon,
  Plus,
  Tag
} from 'lucide-react';
import { getProjectIcon } from '../../constants/projectIcons';
import type { Project, Task, ViewMode } from '../../types/todo';
import styles from './CommandPaletteModal.module.css';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div>
    <div className={styles.sectionTitle}>{title}</div>
    <div className={styles.sectionList}>{children}</div>
  </div>
);

interface CommandResultsProps {
  matchedTasks: Task[];
  matchedProjects: Project[];
  theme: 'dark' | 'light';
  onSelectView: (mode: ViewMode) => void;
  onSelectTask: (task: Task) => void;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
  onManageTags: () => void;
  onToggleTheme: () => void;
}

export const CommandResults: React.FC<CommandResultsProps> = ({
  matchedTasks,
  matchedProjects,
  theme,
  onSelectView,
  onSelectTask,
  onSelectProject,
  onCreateProject,
  onManageTags,
  onToggleTheme
}) => (
  <div className={styles.results}>
    <Section title="ACTIONS">
      <button type="button" className="nav-item" onClick={onCreateProject}>
        <div className="nav-item-left">
          <Plus size={16} color="var(--primary)" />
          <span>Create New Project</span>
        </div>
      </button>
      <button type="button" className="nav-item" onClick={onManageTags}>
        <div className="nav-item-left">
          <Tag size={16} color="var(--primary)" />
          <span>Manage & Create Tags</span>
        </div>
      </button>
    </Section>

    <Section title="NAVIGATION">
      <button type="button" className="nav-item" onClick={() => onSelectView('list')}>
        <div className="nav-item-left"><List size={16} /> Switch to List View</div>
      </button>
      <button type="button" className="nav-item" onClick={() => onSelectView('kanban')}>
        <div className="nav-item-left"><Kanban size={16} /> Switch to Kanban Board</div>
      </button>
      <button type="button" className="nav-item" onClick={() => onSelectView('eisenhower')}>
        <div className="nav-item-left"><Grid size={16} /> Switch to Eisenhower Matrix</div>
      </button>
      <button type="button" className="nav-item" onClick={() => onSelectView('calendar')}>
        <div className="nav-item-left"><Calendar size={16} /> Switch to Calendar View</div>
      </button>
      <button type="button" className="nav-item" onClick={() => onSelectView('analytics')}>
        <div className="nav-item-left"><BarChart3 size={16} /> Switch to Analytics</div>
      </button>
      <button type="button" className="nav-item" onClick={onToggleTheme}>
        <div className="nav-item-left">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
        </div>
      </button>
    </Section>

    {matchedTasks.length > 0 && (
      <Section title="TASKS">
        {matchedTasks.map(task => (
          <button key={task.id} type="button" className="nav-item" onClick={() => onSelectTask(task)}>
            <div className="nav-item-left">
              <CheckSquare size={16} color="var(--primary)" />
              <span>{task.title}</span>
            </div>
            <span className="badge">{task.priority.toUpperCase()}</span>
          </button>
        ))}
      </Section>
    )}

    {matchedProjects.length > 0 && (
      <Section title="PROJECTS">
        {matchedProjects.map(project => {
          const IconComp = getProjectIcon(project.icon);
          return (
            <button
              key={project.id}
              type="button"
              className="nav-item"
              onClick={() => onSelectProject(project.id)}
            >
              <div className="nav-item-left">
                <span style={{ color: project.color, display: 'flex', alignItems: 'center' }}>
                  <IconComp size={16} />
                </span>
                <span>{project.name}</span>
              </div>
              {project.description && (
                <span className={styles.projectDesc}>{project.description}</span>
              )}
            </button>
          );
        })}
      </Section>
    )}
  </div>
);
