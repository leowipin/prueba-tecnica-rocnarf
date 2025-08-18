import { useState, useEffect } from 'react';
import type { CreateTaskRequest, User } from '../../interfaces/task.type';
import { UserService } from '../../services/user.service';
import InputField from './input-fields/InputField';
import BaseButton from '../buttons/BaseButton';
import SecondaryButton from '../buttons/secondary-button/SecondaryButton';
import { ApiError } from '../../errors/apiError';

interface CreateTaskFormProps {
  onSubmit: (taskData: CreateTaskRequest) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CreateTaskForm = ({ onSubmit, onCancel, isSubmitting = false }: CreateTaskFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    setError('');
    
    try {
      const usersData = await UserService.getUsernames();
      setUsers(usersData);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Error al cargar usuarios: ${err.title} - ${err.description}`);
      } else {
        setError('Error al cargar la lista de usuarios');
      }
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!assignedToId) {
      setError('Debe asignar la tarea a un usuario');
      return;
    }

    const taskData: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      assignedToId: assignedToId
    };

    onSubmit(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Título */}
      <div>
        <InputField
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ingresa el título de la tarea"
          disabled={isSubmitting}
          labelContent="Título *"
          required
        />
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-fg mb-2">
          Descripción (opcional)
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe los detalles de la tarea..."
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface resize-none"
          rows={4}
        />
      </div>

      {/* Fecha de vencimiento */}
      <div>
        <InputField
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
          labelContent="Fecha de Vencimiento (opcional)"
        />
      </div>

      {/* Usuario asignado */}
      <div>
        <label htmlFor="task-assigned-to" className="block text-sm font-medium text-fg mb-2">
          Asignar a *
        </label>
        <select
          id="task-assigned-to"
          value={assignedToId}
          onChange={(e) => setAssignedToId(e.target.value)}
          disabled={isSubmitting || isLoadingUsers}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
          required
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {isLoadingUsers && (
          <p className="text-sm text-fg-muted mt-1">Cargando usuarios...</p>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <SecondaryButton
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </SecondaryButton>
        <BaseButton
          type="submit"
          disabled={isSubmitting || !title.trim() || !assignedToId}
        >
          {isSubmitting ? 'Creando...' : 'Crear Tarea'}
        </BaseButton>
      </div>
    </form>
  );
};

export default CreateTaskForm;
