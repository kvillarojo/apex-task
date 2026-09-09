import React from 'react';
import { Users } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalId, ModalSize } from '../common';
import { usePeopleModal } from './usePeopleModal';
import { PeopleForm } from './PeopleForm';
import { PeopleList } from './PeopleList';
import styles from './PeopleModal.module.css';

export const PeopleModal: React.FC = () => {
  const {
    open,
    close,
    assignees,
    editingId,
    name,
    setName,
    role,
    setRole,
    avatarColor,
    setAvatarColor,
    resetForm,
    startEdit,
    handleSubmit,
    handleDelete
  } = usePeopleModal();

  return (
    <Modal
      open={open}
      onClose={close}
      size={ModalSize.Lg}
      themeComponent={ModalId.People}
      className={styles.card}
    >
      <ModalHeader
        title={<span className={styles.compactTitle}>Manage Users</span>}
        subtitle="Add users to assign them to tickets."
        icon={<Users size={20} color="var(--primary)" />}
        onClose={close}
      />

      <ModalBody className={styles.body}>
        <PeopleForm
          name={name}
          setName={setName}
          role={role}
          setRole={setRole}
          avatarColor={avatarColor}
          setAvatarColor={setAvatarColor}
          editingId={editingId}
          onSubmit={handleSubmit}
          onCancelEdit={resetForm}
        />
        <PeopleList assignees={assignees} onEdit={startEdit} onDelete={handleDelete} />
      </ModalBody>
    </Modal>
  );
};
