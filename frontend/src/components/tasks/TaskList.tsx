import { useState, useEffect } from 'react';
import type { Task, TaskFilters } from '../../interfaces/task.type';
import { TaskService } from '../../services/task.service';
import TaskFiltersComponent from '../forms/TaskFilters';
import TaskItem from './TaskItem';
import TaskDetailModal from './TaskDetailModal';
import { ApiError } from '../../errors/apiError';

interface TaskListProps {
  taskType: 'created-by-me' | 'assigned-to-me' | 'all';
  showCreatedBy?: boolean;
  showAssignedTo?: boolean;
}

const TaskList = ({ taskType, showCreatedBy = false, showAssignedTo = false }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<TaskFilters>();

  const fetchTasks = async (filters?: TaskFilters) => {
    setIsLoading(true);
    setError('');
    
    try {
      let tasksData: Task[];
      
      switch (taskType) {
        case 'created-by-me':
          tasksData = await TaskService.getCreatedByMe(filters);
          break;
        case 'assigned-to-me':
          tasksData = await TaskService.getAssignedToMe(filters);
          break;
        case 'all':
          tasksData = await TaskService.getAllTasks(filters);
          break;
        default:
          throw new Error('Tipo de tarea no válido');
      }
      
      setTasks(tasksData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`${err.title}: ${err.description}`);
      } else {
        setError('Error al cargar las tareas');
      }
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [taskType]);

  const handleApplyFilters = (filters: TaskFilters) => {
    setCurrentFilters(filters);
    fetchTasks(filters);
  };

  const handleClearFilters = () => {
    setCurrentFilters(undefined);
    fetchTasks();
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTaskId(null);
    setIsDetailModalOpen(false);
  };

  const handleTaskDeleted = () => {
    // Recargar la lista después de eliminar una tarea
    fetchTasks(currentFilters);
  };

  return (
    <div className="space-y-6">
      <TaskFiltersComponent
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-fg-muted">Cargando tareas...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8 text-fg-muted">
          {error ? 'No se pudieron cargar las tareas' : 'No hay tareas disponibles'}
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showCreatedBy={showCreatedBy}
              showAssignedTo={showAssignedTo}
              onClick={handleTaskClick}
            />
          ))}
        </div>
      )}

      {!isLoading && tasks.length > 0 && (
        <div className="text-center text-sm text-fg-muted">
          Mostrando {tasks.length} tarea{tasks.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Modal de detalle de tarea */}
      <TaskDetailModal
        taskId={selectedTaskId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onTaskDeleted={handleTaskDeleted}
      />
    </div>
  );
};

export default TaskList;
