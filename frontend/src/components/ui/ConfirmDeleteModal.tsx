import Modal from './Modal';
import DangerButton from '../buttons/danger-button/DangerButton';
import SecondaryButton from '../buttons/secondary-button/SecondaryButton';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  message?: string;
}

const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false,
  title = "Confirmar Eliminación",
  message = "¿Estás seguro de que quieres eliminar esta tarea?"
}: ConfirmDeleteModalProps) => {
  
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <SecondaryButton 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </SecondaryButton>
          <DangerButton 
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </DangerButton>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-fg">
              {message}
            </p>
            <p className="text-sm text-fg-muted mt-1">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
