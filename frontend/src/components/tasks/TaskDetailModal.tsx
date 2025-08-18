import { useState, useEffect } from 'react';
import type { TaskDetail, Comment } from '../../interfaces/task.type';
import { TaskService } from '../../services/task.service';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import Modal from '../ui/Modal';
import ConfirmDeleteModal from '../ui/ConfirmDeleteModal';
import SuccessModal from '../ui/SuccessModal';
import CommentsList from './CommentsList';
import SecondaryButton from '../buttons/secondary-button/SecondaryButton';
import DangerButton from '../buttons/danger-button/DangerButton';
import { ApiError } from '../../errors/apiError';

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskDeleted?: () => void;
}

const TaskDetailModal = ({ taskId, isOpen, onClose, onTaskDeleted }: TaskDetailModalProps) => {
  const [taskDetail, setTaskDetail] = useState<TaskDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskData();
    }
  }, [isOpen, taskId]);

  const fetchTaskData = async () => {
    if (!taskId) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Obtener detalle de la tarea y comentarios en paralelo
      const [taskData, commentsData] = await Promise.all([
        TaskService.getTaskDetail(taskId),
        TaskService.getTaskComments(taskId)
      ]);
      
      setTaskDetail(taskData);
      setComments(commentsData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.title}: ${err.description}`);
      } else {
        setError('Error al cargar los detalles de la tarea');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId || !taskDetail) return;
    
    setIsDeleting(true);
    try {
      await TaskService.deleteTask(taskId);
      setShowDeleteConfirm(false);
      onClose();
      setShowSuccessModal(true);
      if (onTaskDeleted) {
        onTaskDeleted();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Error al eliminar: ${err.title} - ${err.description}`);
      } else {
        setError('Error al eliminar la tarea');
      }
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDueDate = (utcDate: string) => {
    const date = new Date(utcDate);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'en progreso':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canDeleteTask = () => {
    if (!currentUser || !taskDetail) return false;
    
    // Admin puede eliminar cualquier tarea
    if (currentUser.role === 'admin') return true;
    
    // Usuario solo puede eliminar tareas que él creó
    if (currentUser.role === 'user') {
      // Debug logging
      console.log('Debug - canDeleteTask:', {
        currentUserId: currentUser.id,
        currentUserIdType: typeof currentUser.id,
        taskCreatedById: taskDetail.createdBy.id,
        taskCreatedByIdType: typeof taskDetail.createdBy.id,
        isEqual: taskDetail.createdBy.id === currentUser.id,
        taskDetail: taskDetail
      });
      
      // Comparación más robusta convirtiendo ambos a string
      return String(taskDetail.createdBy.id) === String(currentUser.id);
    }
    
    return false;
  };

  const handleClose = () => {
    setTaskDetail(null);
    setComments([]);
    setError('');
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Detalle de Tarea"
        footer={
          <>
            <SecondaryButton onClick={handleClose}>
              Cerrar
            </SecondaryButton>
            {canDeleteTask() && (
              <DangerButton 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                Eliminar Tarea
              </DangerButton>
            )}
          </>
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-8 w-3/4 rounded mb-4"></div>
              <div className="bg-gray-200 h-6 w-1/2 rounded mb-2"></div>
              <div className="bg-gray-200 h-20 w-full rounded mb-4"></div>
              <div className="bg-gray-200 h-6 w-1/3 rounded"></div>
            </div>
          </div>
        ) : taskDetail ? (
          <div className="space-y-6">
            {/* Información básica de la tarea */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h4 className="text-2xl font-bold text-fg">{taskDetail.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(taskDetail.status)}`}>
                  {taskDetail.status.charAt(0).toUpperCase() + taskDetail.status.slice(1)}
                </span>
              </div>

              <div className="bg-surface-2 p-4 rounded-lg space-y-3">
                <div>
                  <span className="font-medium text-fg">Descripción:</span>
                  <p className="text-fg-muted mt-1">{taskDetail.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-fg">Fecha de Vencimiento:</span>
                    <p className="text-fg-muted">{formatDueDate(taskDetail.dueDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-fg">Fecha de Creación:</span>
                    <p className="text-fg-muted">{formatDate(taskDetail.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comentarios */}
            <div>
              <h5 className="text-lg font-semibold text-fg mb-4">Comentarios</h5>
              <CommentsList comments={comments} isLoading={isLoading} />
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
        isDeleting={isDeleting}
        message="¿Estás seguro de que quieres eliminar esta tarea?"
      />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Tarea Eliminada"
        message="La tarea se ha eliminado exitosamente."
        buttonText="Entendido"
      />
    </>
  );
};

export default TaskDetailModal;
