import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
  title: string;
}

export function Sidebar({ children, onClose, title }: Props) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return createPortal(
    <div className="sidebar-overlay" onClick={onClose}>
      <aside
        className="sidebar-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="sidebar-panel-header">
          <h2>{title}</h2>
          <button className="sidebar-panel-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="sidebar-panel-body">{children}</div>
      </aside>
    </div>,
    document.body
  );
}
