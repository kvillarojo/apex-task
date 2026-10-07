import React from 'react';
import {
  Search,
  List,
  Kanban,
  Grid,
  Calendar as CalendarIcon,
  CalendarRange,
  BarChart3,
  StickyNote,
  Menu,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Users,
  Download,
  Upload,
  Command,
  Timer
} from 'lucide-react';
import { useTodo } from '../../context/TodoContext';
import { ThemeComponent } from '../../constants/enums';
import { getThemeComponentProps } from '../../theme';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const {
    filter,
    setFilter,
    viewMode,
    setViewMode,
    theme,
    setTheme,
    soundEnabled,
    toggleSound,
    openPeopleModal,
    setCommandPaletteOpen,
    exportData,
    importData,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    pomodoro,
    setPomodoroVisible,
    setPomodoroMaximized
  } = useTodo();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          alert('Backup restored successfully!');
        } else {
          alert('Invalid backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <header {...getThemeComponentProps(ThemeComponent.Header)} className="app-header">
      <div className="header-left">
        {/* Mobile Hamburger Drawer Button */}
        <button
          className="icon-button mobile-menu-btn"
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          title="Open Navigation Menu"
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        {/* Search Box */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, notes, tags..."
            value={filter.searchQuery}
            onChange={e => setFilter({ searchQuery: e.target.value })}
          />
        </div>

        {/* Command Palette Hotkey button */}
        <button
          className={`icon-button cmd-palette-btn ${styles.commandButton}`}
          onClick={() => setCommandPaletteOpen(true)}
          title="Command Palette (Cmd+K)"
        >
          <Command size={14} />
          <span>Cmd+K</span>
        </button>
      </div>

      <div className="header-right">
        {/* Sound Toggle */}
        <button
          className="icon-button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {soundEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>

        <button className="icon-button" onClick={openPeopleModal} title="Manage Users">
          <Users size={18} />
        </button>

        {/* Theme Toggle */}
        <button
          className="icon-button"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Export Backup */}
        <button className="icon-button" onClick={exportData} title="Export JSON Backup">
          <Download size={18} />
        </button>

        {/* Import Backup */}
        <label className={`icon-button ${styles.importLabel}`} title="Import JSON Backup">
          <Upload size={18} />
          <input className={styles.fileInput} type="file" accept=".json" onChange={handleImportFile} />
        </label>
      </div>
    </header>
  );
};
