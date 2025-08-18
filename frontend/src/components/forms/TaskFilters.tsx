import { useState } from 'react';
import type { TaskFilters, TaskStatus } from '../../interfaces/task.type';
import { TASK_STATUS } from '../../interfaces/task.type';
import BaseButton from '../buttons/BaseButton';
import SecondaryButton from '../buttons/secondary-button/SecondaryButton';
import InputField from './input-fields/InputField';

interface TaskFiltersProps {
  onApplyFilters: (filters: TaskFilters) => void;
  onClearFilters: () => void;
  isLoading?: boolean;
}

const TaskFiltersComponent = ({ onApplyFilters, onClearFilters, isLoading = false }: TaskFiltersProps) => {
  const [status, setStatus] = useState<TaskStatus | 'todos'>('todos');
  const [dueDate, setDueDate] = useState<string>('');

  const handleApplyFilters = () => {
    onApplyFilters({
      status,
      dueDate: dueDate || 'cualquier-fecha'
    });
  };

  const handleClearFilters = () => {
    setStatus('todos');
    setDueDate('');
    onClearFilters();
  };

  return (
    <div className="bg-surface-2 p-4 rounded-lg mb-6 space-y-4">
      <h3 className="text-lg font-semibold text-fg mb-4">Filtros</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-fg mb-2">
            Estado
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus | 'todos')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-surface"
            disabled={isLoading}
          >
            <option value="todos">Todos los estados</option>
            <option value={TASK_STATUS.PENDIENTE}>Pendiente</option>
            <option value={TASK_STATUS.EN_PROGRESO}>En Progreso</option>
            <option value={TASK_STATUS.COMPLETADA}>Completada</option>
          </select>
        </div>

        <div>
          <label htmlFor="date-filter" className="block text-sm font-medium text-fg mb-2">
            Fecha de Vencimiento
          </label>
          <InputField
            id="date-filter"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            placeholder="Selecciona una fecha"
            disabled={isLoading}
            labelContent="Fecha de Vencimiento"
            srOnly={true}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <SecondaryButton
          onClick={handleClearFilters}
          disabled={isLoading}
        >
          Limpiar Filtros
        </SecondaryButton>
        <BaseButton
          onClick={handleApplyFilters}
          disabled={isLoading}
        >
          {isLoading ? 'Aplicando...' : 'Aplicar Filtros'}
        </BaseButton>
      </div>
    </div>
  );
};

export default TaskFiltersComponent;
