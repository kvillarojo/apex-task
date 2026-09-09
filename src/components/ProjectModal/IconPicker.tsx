import React from 'react';
import { IconFilter, type IconFilter as IconFilterType } from '../../constants/enums';
import type { ProjectIconComponent } from '../../constants/projectIcons';

interface IconPickerProps {
  icon: string;
  setIcon: (value: string) => void;
  color: string;
  iconFilter: IconFilterType;
  setIconFilter: (value: IconFilterType) => void;
  iconEntries: [string, ProjectIconComponent][];
}

const FILTER_TABS: { id: IconFilterType; label: string }[] = [
  { id: IconFilter.All, label: 'All' },
  { id: IconFilter.Work, label: 'Work' },
  { id: IconFilter.Tech, label: 'Tech' },
  { id: IconFilter.Life, label: 'Life' }
];

export const IconPicker: React.FC<IconPickerProps> = ({
  icon,
  setIcon,
  color,
  iconFilter,
  setIconFilter,
  iconEntries
}) => (
  <div className="project-modal-section">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
      <span className="project-section-label">Project Icon</span>
      <div className="project-icon-tabs">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`project-icon-tab ${iconFilter === tab.id ? 'active' : ''}`}
            onClick={() => setIconFilter(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>

    <div className="project-icon-grid">
      {iconEntries.map(([iconKey, IconComponent]) => {
        const isSelected = icon === iconKey;
        return (
          <button
            key={iconKey}
            type="button"
            className={`project-icon-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => setIcon(iconKey)}
            style={{
              borderColor: isSelected ? color : undefined,
              backgroundColor: isSelected ? `${color}18` : undefined,
              color: isSelected ? color : 'var(--text-secondary)'
            }}
            title={iconKey}
          >
            <IconComponent size={18} />
          </button>
        );
      })}
    </div>
  </div>
);
