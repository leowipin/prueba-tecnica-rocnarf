import { useAuth } from "../context/AuthContext";

const HomePage = () => {
    const { logout } = useAuth();

    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <main className="flex flex-col gap-8 bg-surface-2 sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl text-center font-bold text-fg">
                    Página de Inicio
                </h1>
                <p className="text-center text-fg-2">
                    ¡Has iniciado sesión correctamente!
                </p>
                <button
                    onClick={logout}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    Cerrar Sesión
                </button>
            </main>
        </div>
    );
};

export default HomePage;