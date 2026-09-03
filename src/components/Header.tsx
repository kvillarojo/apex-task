import React from 'react';
import {
  Search,
  List,
  Kanban,
  Grid,
  Calendar as CalendarIcon,
  BarChart3,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Users,
  Download,
  Upload,
  Command
} from 'lucide-react';
import { useTodo } from '../context/TodoContext';

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
    importData
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
    <header className="app-header">
      <div className="header-left">
        {/* Search Box */}
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks, tags, or description..."
            value={filter.searchQuery}
            onChange={e => setFilter({ searchQuery: e.target.value })}
          />
        </div>

        {/* Command Palette Hotkey button */}
        <button
          className="icon-button"
          onClick={() => setCommandPaletteOpen(true)}
          title="Command Palette (Cmd+K)"
          style={{ width: 'auto', padding: '0 10px', gap: '6px', fontSize: '0.8rem' }}
        >
          <Command size={14} />
          <span>Cmd+K</span>
        </button>
      </div>

      <div className="header-right">
        {/* View Mode Switcher */}
        <div className="view-switcher">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={16} />
            <span>List</span>
          </button>

          <button
            className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
            onClick={() => setViewMode('kanban')}
            title="Kanban Board View"
          >
            <Kanban size={16} />
            <span>Kanban</span>
          </button>

          <button
            className={`view-btn ${viewMode === 'eisenhower' ? 'active' : ''}`}
            onClick={() => setViewMode('eisenhower')}
            title="Eisenhower Matrix View"
          >
            <Grid size={16} />
            <span>Matrix</span>
          </button>

          <button
            className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setViewMode('calendar')}
            title="Calendar View"
          >
            <CalendarIcon size={16} />
            <span>Calendar</span>
          </button>

          <button
            className={`view-btn ${viewMode === 'analytics' ? 'active' : ''}`}
            onClick={() => setViewMode('analytics')}
            title="Analytics View"
          >
            <BarChart3 size={16} />
            <span>Analytics</span>
          </button>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)', margin: '0 4px' }} />

        {/* Sound Toggle */}
        <button
          className="icon-button"
          onClick={toggleSound}
          title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
        >
          {soundEnabled ? <Volume2 size={18} color="#10b981" /> : <VolumeX size={18} color="var(--text-muted)" />}
        </button>

        <button className="icon-button" onClick={openPeopleModal} title="Manage People">
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
        <label className="icon-button" title="Import JSON Backup" style={{ cursor: 'pointer' }}>
          <Upload size={18} />
          <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
        </label>
      </div>
    </header>
  );
};
