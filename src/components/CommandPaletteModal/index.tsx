import React from 'react';
import { Modal, ModalId, ModalSize } from '../common';
import { useCommandPalette } from './useCommandPalette';
import { CommandSearch } from './CommandSearch';
import { CommandResults } from './CommandResults';
import styles from './CommandPaletteModal.module.css';

export const CommandPaletteModal: React.FC = () => {
  const {
    open,
    close,
    query,
    setQuery,
    matchedTasks,
    matchedProjects,
    theme,
    handleSelectTask,
    handleSelectView,
    handleSelectProject,
    handleCreateProject,
    handleManageTags,
    handleToggleTheme
  } = useCommandPalette();

  return (
    <Modal
      open={open}
      onClose={close}
      size={ModalSize.Lg}
      themeComponent={ModalId.CommandPalette}
      className={styles.card}
      style={{ width: '600px', padding: '16px', gap: '12px' }}
    >
      <CommandSearch query={query} onQueryChange={setQuery} />
      <CommandResults
        matchedTasks={matchedTasks}
        matchedProjects={matchedProjects}
        theme={theme}
        onSelectView={handleSelectView}
        onSelectTask={handleSelectTask}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onManageTags={handleManageTags}
        onToggleTheme={handleToggleTheme}
      />
    </Modal>
  );
};
