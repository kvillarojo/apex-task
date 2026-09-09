import React from 'react';
import { Check } from 'lucide-react';
import { COLOR_PALETTE, type NamedColor } from '../../constants/colors';
import styles from './ColorSwatchGrid.module.css';

export interface ColorSwatchGridProps {
  value: string;
  onChange: (color: string) => void;
  colors?: NamedColor[];
  showCustomPicker?: boolean;
  label?: string;
  columns?: number;
  swatchHeight?: number;
}

export const ColorSwatchGrid: React.FC<ColorSwatchGridProps> = ({
  value,
  onChange,
  colors = COLOR_PALETTE,
  showCustomPicker = true,
  label = 'Color Theme',
  columns = 12,
  swatchHeight = 26
}) => (
  <div>
    <div className={styles.header}>
      <span className="project-section-label" style={{ marginBottom: 0 }}>
        {label}
      </span>
      {showCustomPicker && (
        <div className={styles.customRow}>
          <span className={styles.customLabel}>Custom:</span>
          <input
            type="color"
            value={value || '#6366f1'}
            onChange={event => onChange(event.target.value)}
            className={styles.customInput}
            title="Pick custom hex color"
          />
        </div>
      )}
    </div>

    <div
      className={`project-color-grid ${styles.grid}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {colors.map(color => {
        const isSelected = value.toLowerCase() === color.value.toLowerCase();
        return (
          <button
            key={color.name}
            type="button"
            className={`project-color-swatch ${isSelected ? 'selected' : ''}`}
            style={{ backgroundColor: color.value || 'var(--text-muted)', height: swatchHeight }}
            onClick={() => onChange(color.value)}
            title={color.name}
          >
            {isSelected && <Check size={12} color="#ffffff" />}
          </button>
        );
      })}
    </div>
  </div>
);
