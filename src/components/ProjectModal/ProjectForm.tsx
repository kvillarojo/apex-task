import React from 'react';
import { Layout } from 'lucide-react';
import { VIEW_MODE_OPTIONS } from '../../constants/enums';
import type { ViewMode } from '../../types/todo';
import type { ProjectIconComponent } from '../../constants/projectIcons';
import styles from './ProjectModal.module.css';

interface ProjectPreviewProps {
  name: string;
  description: string;
  color: string;
  defaultView: ViewMode;
  Icon: ProjectIconComponent;
}

export const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  name,
  description,
  color,
  defaultView,
  Icon
}) => (
  <div className="project-modal-section">
    <span className="project-section-label">Live Preview</span>
    <div className="project-live-preview-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className={styles.previewRow}>
        <div
          className="project-preview-icon-box"
          style={{ backgroundColor: `${color}25`, color }}
        >
          <Icon size={20} />
        </div>
        <div className={styles.previewText}>
          <div className={styles.previewTitleRow}>
            <span className={styles.previewName}>{name.trim() || 'Untitled Project'}</span>
            <span
              className={styles.viewBadge}
              style={{ backgroundColor: `${color}20`, color }}
            >
              {defaultView.toUpperCase()} VIEW
            </span>
          </div>
          <span className={styles.previewDesc}>
            {description.trim() || 'No description provided'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

interface ProjectDetailsFieldsProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  defaultView: ViewMode;
  setDefaultView: (value: ViewMode) => void;
}

export const ProjectDetailsFields: React.FC<ProjectDetailsFieldsProps> = ({
  name,
  setName,
  description,
  setDescription,
  defaultView,
  setDefaultView
}) => (
  <div className="project-modal-section">
    <div className={styles.fieldsStack}>
      <div>
        <label className="project-input-label">PROJECT NAME *</label>
        <input
          type="text"
          placeholder="e.g., Marketing Campaign, Product Launch..."
          value={name}
          onChange={event => setName(event.target.value)}
          className="project-text-input"
          maxLength={50}
          autoFocus
          required
        />
      </div>

      <div className={styles.twoCol}>
        <div>
          <label className="project-input-label">DESCRIPTION / OBJECTIVE</label>
          <input
            type="text"
            placeholder="Short goal or summary..."
            value={description}
            onChange={event => setDescription(event.target.value)}
            className="project-text-input"
            maxLength={100}
          />
        </div>

        <div>
          <label className="project-input-label">DEFAULT VIEW MODE</label>
          <div className={styles.selectWrap}>
            <select
              value={defaultView}
              onChange={event => setDefaultView(event.target.value as ViewMode)}
              className="project-text-input"
              style={{ cursor: 'pointer', appearance: 'none', paddingRight: '28px' }}
            >
              {VIEW_MODE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className={styles.selectIcon}>
              <Layout size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
