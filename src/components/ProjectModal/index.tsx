import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalId, ModalSize, ColorSwatchGrid } from '../common';
import { useProjectModal } from './useProjectModal';
import { ProjectTemplates } from './ProjectTemplates';
import { ProjectPreview, ProjectDetailsFields } from './ProjectForm';
import { IconPicker } from './IconPicker';
import { ProjectModalActions } from './ProjectModalActions';
import styles from './ProjectModal.module.css';

export const ProjectModal: React.FC = () => {
  const {
    open,
    close,
    editingProject,
    isEditing,
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    icon,
    setIcon,
    defaultView,
    setDefaultView,
    iconFilter,
    setIconFilter,
    SelectedIcon,
    iconEntries,
    handleApplyTemplate,
    handleSubmit,
    handleDelete
  } = useProjectModal();

  return (
    <Modal
      open={open}
      onClose={close}
      size={ModalSize.Lg}
      themeComponent={ModalId.Project}
      className={`project-modal-card ${styles.card}`}
      style={{ padding: 0, overflow: 'hidden', maxHeight: '88vh' }}
    >
      <ModalHeader
        title={isEditing ? 'Edit Project' : 'Create New Project'}
        subtitle={
          isEditing
            ? 'Update project settings and branding'
            : 'Organize your tasks with custom colors, icons & views'
        }
        icon={
          <div
            className={styles.headerIcon}
            style={{
              backgroundColor: `${color}22`,
              color,
              boxShadow: `0 0 12px ${color}33`
            }}
          >
            <SelectedIcon size={20} />
          </div>
        }
        onClose={close}
      />

      <ModalBody as="form" onSubmit={handleSubmit}>
        {!isEditing && <ProjectTemplates onApply={handleApplyTemplate} />}

        <ProjectPreview
          name={name}
          description={description}
          color={color}
          defaultView={defaultView}
          Icon={SelectedIcon}
        />

        <ProjectDetailsFields
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
        />

        <div className="project-modal-section">
          <ColorSwatchGrid value={color} onChange={setColor} columns={12} swatchHeight={28} />
        </div>

        <IconPicker
          icon={icon}
          setIcon={setIcon}
          color={color}
          iconFilter={iconFilter}
          setIconFilter={setIconFilter}
          iconEntries={iconEntries}
        />

        <ProjectModalActions
          isEditing={isEditing}
          editingProject={editingProject}
          name={name}
          color={color}
          onClose={close}
          onDelete={handleDelete}
        />
      </ModalBody>
    </Modal>
  );
};

