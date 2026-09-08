import React from 'react';
import { Sparkles, Hash, CheckCircle2 } from 'lucide-react';
import { TAG_PRESETS, type TagPreset } from './tagPresets.data';

interface TagPresetsProps {
  allTags: string[];
  onApplyPreset: (preset: TagPreset) => void;
}

export const TagPresets: React.FC<TagPresetsProps> = ({ allTags, onApplyPreset }) => (
  <div className="project-modal-section">
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
      <Sparkles size={14} color="var(--primary)" /> 
      <span className="project-section-label">Popular Presets</span>
    </div>
    <div className="project-templates-scroll">
      {TAG_PRESETS.map(preset => {
        const isExisting = allTags.includes(preset.name);
        return (
          <button
            key={preset.name}
            type="button"
            className="tag-preset-chip"
            onClick={() => onApplyPreset(preset)}
            style={{
              borderColor: `${preset.color}44`,
              backgroundColor: `${preset.color}15`,
              color: preset.color
            }}
          >
            <Hash size={12} />
            <span>{preset.name}</span>
            {isExisting && <CheckCircle2 size={11} style={{ opacity: 0.7 }} />}
          </button>
        );
      })}
    </div>
  </div>
);