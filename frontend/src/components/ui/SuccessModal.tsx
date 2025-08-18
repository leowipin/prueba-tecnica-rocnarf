import Modal from './Modal';
import BaseButton from '../buttons/BaseButton';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
}

const SuccessModal = ({ 
  isOpen, 
  onClose, 
  title = "Operación Exitosa",
  message = "La operación se completó correctamente.",
  buttonText = "Continuar"
}: SuccessModalProps) => {
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <BaseButton onClick={onClose}>
          {buttonText}
        </BaseButton>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-fg">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SuccessModal;
