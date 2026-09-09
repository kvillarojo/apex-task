import React from 'react';
import { Search } from 'lucide-react';
import styles from './CommandPaletteModal.module.css';

interface CommandSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
}

export const CommandSearch: React.FC<CommandSearchProps> = ({ query, onQueryChange }) => (
  <div className={styles.searchBar}>
    <Search size={18} color="var(--text-muted)" />
    <input
      type="text"
      placeholder="Type a command or search tasks & projects..."
      value={query}
      onChange={event => onQueryChange(event.target.value)}
      className={styles.searchInput}
      autoFocus
    />
    <span className={styles.escHint}>ESC to close</span>
  </div>
);
