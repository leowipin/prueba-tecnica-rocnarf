import { useState } from 'react';
import type { CreateTaskRequest } from '../../interfaces/task.type';
import { TaskService } from '../../services/task.service';
import Modal from '../ui/Modal';
import SuccessModal from '../ui/SuccessModal';
import CreateTaskForm from '../forms/CreateTaskForm';
import { ApiError } from '../../errors/apiError';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated?: () => void;
}

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (taskData: CreateTaskRequest) => {
    setIsSubmitting(true);
    setError('');

    try {
      await TaskService.createTask(taskData);
      onClose();
      setShowSuccessModal(true);
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.title}: ${err.description}`);
      } else {
        setError('Error al crear la tarea');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError('');
      onClose();
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Crear Nueva Tarea"
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <CreateTaskForm
          onSubmit={handleSubmit}
          onCancel={handleClose}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        title="Tarea Creada"
        message="La tarea se ha creado exitosamente."
        buttonText="Entendido"
      />
    </>
  );
};

export default CreateTaskModal;
