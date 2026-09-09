import React from 'react';
import { Sparkles } from 'lucide-react';
import { getProjectIcon } from '../../constants/projectIcons';
import { PROJECT_TEMPLATES, type ProjectTemplate } from './projectTemplates.data';

interface ProjectTemplatesProps {
  onApply: (template: ProjectTemplate) => void;
}

export const ProjectTemplates: React.FC<ProjectTemplatesProps> = ({ onApply }) => (
  <div className="project-modal-section">
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
      <Sparkles size={14} color="var(--primary)" />
      <span className="project-section-label">Quick Starter Templates</span>
    </div>
    <div className="project-templates-scroll">
      {PROJECT_TEMPLATES.map(tmpl => {
        const TmplIcon = getProjectIcon(tmpl.icon);
        return (
          <button
            key={tmpl.name}
            type="button"
            className="project-template-pill"
            onClick={() => onApply(tmpl)}
          >
            <span style={{ color: tmpl.color, display: 'flex' }}>
              <TmplIcon size={14} />
            </span>
            <span>{tmpl.name}</span>
          </button>
        );
      })}
    </div>
  </div>
);
