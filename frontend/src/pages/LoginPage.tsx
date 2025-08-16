import LogInForm from "../components/forms/LogInForm";

const LoginPage = () => {

    return(
        <div className="flex justify-center items-center min-h-screen p-4">
            <main className="flex flex-col gap-8 bg-surface-2 sm:w-2/3 md:w-1/2 lg:w-1/3 rounded-2xl p-8 shadow-2xl">
                <h1 className="text-3xl text-center font-bold text-fg">
                    Iniciar Sesión
                </h1>
                <LogInForm/>
            </main>
        </div>
    )

}

export default LoginPage;
