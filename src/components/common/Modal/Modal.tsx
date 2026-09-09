import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ModalId, ModalSize, type ModalSize as ModalSizeType } from '../../../constants/enums';
import { mergeThemeStyles, type ThemeComponentKey } from '../../../theme';
import styles from './Modal.module.css';

const SIZE_CLASS: Record<ModalSizeType, string> = {
  [ModalSize.Sm]: styles.sizeSm,
  [ModalSize.Md]: styles.sizeMd,
  [ModalSize.Lg]: styles.sizeLg,
  [ModalSize.Xl]: styles.sizeXl,
  [ModalSize.Ticket]: styles.sizeTicket
};

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSizeType;
  /** Extra classes on the card (e.g. ticket-modal-card, note-modal-card). */
  className?: string;
  /** Extra classes on the overlay. */
  overlayClassName?: string;
  style?: React.CSSProperties;
  /** Enables per-component theme overrides via data-theme-component. */
  themeComponent?: ThemeComponentKey;
  /** Close when Escape is pressed (default true). */
  closeOnEscape?: boolean;
  /** Close when overlay is clicked (default true). */
  closeOnOverlay?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size = ModalSize.Md,
  className = '',
  overlayClassName = '',
  style,
  themeComponent,
  closeOnEscape = true,
  closeOnOverlay = true
}) => {
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const cardClass = [
    'modal-card',
    styles.card,
    SIZE_CLASS[size],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={['modal-overlay', styles.overlay, overlayClassName].filter(Boolean).join(' ')}
      onClick={closeOnOverlay ? onClose : undefined}
      role="presentation"
    >
      <div
        className={cardClass}
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        data-theme-component={themeComponent}
        style={themeComponent ? mergeThemeStyles(themeComponent, style) : style}
      >
        {children}
      </div>
    </div>
  );
};

export interface ModalHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  /** Use ticket header chrome instead of project/manage header. */
  variant?: 'default' | 'ticket';
  children?: React.ReactNode;
  className?: string;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  title,
  subtitle,
  icon,
  onClose,
  variant = 'default',
  children,
  className = ''
}) => {
  if (variant === 'ticket') {
    return (
      <header className={['ticket-modal-header', className].filter(Boolean).join(' ')}>
        <div className={styles.headerLeft}>
          {typeof title === 'string' ? (
            <span className="ticket-modal-eyebrow">{title}</span>
          ) : (
            title
          )}
          {children}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="ticket-modal-close-btn"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}
      </header>
    );
  }

  return (
    <div className={['project-modal-header', className].filter(Boolean).join(' ')}>
      <div className={styles.headerLeft}>
        {icon}
        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>
      {children}
      {onClose && (
        <button type="button" className="icon-button" onClick={onClose} title="Close Modal">
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'form';
  onSubmit?: React.FormEventHandler;
  style?: React.CSSProperties;
}

export const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className = '',
  as = 'div',
  onSubmit,
  style
}) => {
  const classes = ['project-modal-body', className].filter(Boolean).join(' ');
  if (as === 'form') {
    return (
      <form className={classes} onSubmit={onSubmit} style={style}>
        {children}
      </form>
    );
  }
  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ticket';
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const base = variant === 'ticket' ? 'ticket-modal-footer' : 'project-modal-footer';
  return <div className={[base, className].filter(Boolean).join(' ')}>{children}</div>;
};

export { ModalId, ModalSize };
