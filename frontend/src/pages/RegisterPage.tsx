import RegisterForm from "../components/forms/RegisterForm";
import { Link } from "react-router";

const RegisterPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen p-4">
            <main className="flex flex-col gap-8 bg-surface-2 sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl text-center font-bold text-fg">
                    Crear Cuenta
                </h1>
                <RegisterForm />
                <p className="text-center text-sm text-fg-2">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-semibold text-primary hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>
            </main>
        </div>
    );
};

export default RegisterPage;