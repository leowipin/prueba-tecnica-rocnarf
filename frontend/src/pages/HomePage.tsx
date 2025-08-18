import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useCurrentUser } from "../hooks/useCurrentUser";
import Tabs from "../components/ui/Tabs";
import TaskList from "../components/tasks/TaskList";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DangerButton from "../components/buttons/danger-button/DangerButton";
import BaseButton from "../components/buttons/BaseButton";

const HomePage = () => {
    const { logout } = useAuth();
    const currentUser = useCurrentUser();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-fg-muted">Cargando...</span>
            </div>
        );
    }

    const isAdmin = currentUser.role === 'admin';
    const isUser = currentUser.role === 'user';

    const handleTaskCreated = () => {
        // Forzar re-render de las listas de tareas
        setRefreshKey(prev => prev + 1);
    };

    // Configurar pestañas según el rol
    const tabs = [];

    if (isUser) {
        tabs.push(
            {
                id: 'created-by-me',
                label: 'Tareas Creadas por Mí',
                content: (
                    <TaskList
                        key={`created-${refreshKey}`}
                        taskType="created-by-me"
                        showAssignedTo={true}
                        showCreatedBy={false}
                    />
                )
            },
            {
                id: 'assigned-to-me',
                label: 'Tareas Asignadas a Mí',
                content: (
                    <TaskList
                        key={`assigned-${refreshKey}`}
                        taskType="assigned-to-me"
                        showCreatedBy={true}
                        showAssignedTo={false}
                    />
                )
            }
        );
    }

    if (isAdmin) {
        tabs.push({
            id: 'all-tasks',
            label: 'Todas las Tareas',
            content: (
                <TaskList
                    key={`all-${refreshKey}`}
                    taskType="all"
                    showCreatedBy={true}
                    showAssignedTo={true}
                />
            )
        });
    }

    return (
        <div className="min-h-screen bg-surface p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="bg-surface-2 rounded-lg p-6 mb-6 shadow-sm">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-fg">
                                Gestión de Tareas
                            </h1>
                            <p className="text-fg-muted mt-2">
                                Bienvenido, <span className="font-semibold">{currentUser.username}</span>
                                {isAdmin && <span className="ml-2 px-2 py-1 bg-primary text-fg-inverted text-xs rounded-full">Admin</span>}
                            </p>
                        </div>
                        <div className="flex space-x-3">
                            <DangerButton
                                onClick={logout}
                            >
                                Cerrar Sesión
                            </DangerButton>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="bg-surface-2 rounded-lg p-6 shadow-sm">
                    {/* Botón para crear tarea */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-light">
                        <h2 className="text-xl font-semibold text-fg">Mis Tareas</h2>
                        <BaseButton
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            + Crear Nueva Tarea
                        </BaseButton>
                    </div>

                    {tabs.length > 0 ? (
                        <Tabs tabs={tabs} />
                    ) : (
                        <div className="text-center py-8 text-fg-muted">
                            <p>No tienes acceso a ninguna sección de tareas.</p>
                            <p className="text-sm mt-2">Contacta al administrador si esto es un error.</p>
                        </div>
                    )}
                </main>

                {/* Modal para crear tarea */}
                <CreateTaskModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                />
            </div>
        </div>
    );
};

export default HomePage;