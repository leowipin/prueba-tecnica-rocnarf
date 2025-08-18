import type { Task } from '../../interfaces/task.type';

interface TaskItemProps {
  task: Task;
  showCreatedBy?: boolean;
  showAssignedTo?: boolean;
  onClick?: (taskId: string) => void;
}

const TaskItem = ({ task, showCreatedBy = false, showAssignedTo = false, onClick }: TaskItemProps) => {
  // Convertir fecha UTC a fecha local para mostrar
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

  const handleClick = () => {
    if (onClick) {
      onClick(task.id);
    }
  };

  return (
    <div 
      className={`bg-surface p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-primary' : ''
      }`}
      onClick={handleClick}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="text-lg font-semibold text-fg line-clamp-2">{task.title}</h4>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
        </div>

        <div className="text-sm text-fg-muted">
          <span className="font-medium">Vence:</span> {formatDueDate(task.dueDate)}
        </div>

        {showAssignedTo && task.assignedTo && (
          <div className="text-sm text-fg-muted">
            <span className="font-medium">Asignado a:</span> {task.assignedTo.username}
          </div>
        )}

        {showCreatedBy && task.createdBy && (
          <div className="text-sm text-fg-muted">
            <span className="font-medium">Creado por:</span> {task.createdBy.username}
          </div>
        )}

        {onClick && (
          <div className="text-xs text-primary font-medium pt-2">
            Click para ver detalles →
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
