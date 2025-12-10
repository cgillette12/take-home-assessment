import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, title, children, onClose, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', showCancel = true }) => {
	const overlayRef = useRef(null);
	const confirmRef = useRef(null);

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === 'Escape') onClose && onClose();
		};
		if (isOpen) {
			document.addEventListener('keydown', onKey);
			// focus confirm button for quick keyboard action
			setTimeout(() => confirmRef.current && confirmRef.current.focus(), 0);
			// prevent background scrolling
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.removeEventListener('keydown', onKey);
			document.body.style.overflow = '';
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const onOverlayClick = (e) => {
		if (e.target === overlayRef.current) {
			onClose && onClose();
		}
	};

	return (
		<div className="modal-overlay" ref={overlayRef} onMouseDown={onOverlayClick} role="dialog" aria-modal="true">
			<div className="modal-window" onMouseDown={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h3 className="modal-title">{title}</h3>
					<button className="modal-close" onClick={onClose} aria-label="Close">×</button>
				</div>

				<div className="modal-body">{children}</div>

				<div className="modal-actions">
					{showCancel && (
						<button className="action-btn" onClick={onClose}>{cancelText}</button>
					)}
					<button className="action-btn primary" ref={confirmRef} onClick={onConfirm}>{confirmText}</button>
				</div>
			</div>
		</div>
	);
};

export default Modal;
