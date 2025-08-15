import BaseButton from "../buttons/BaseButton";
import InputField from "./input-fields/InputField";

const LogInForm = () => {

    const logIn = async (formData: FormData): Promise<void> => {
        console.log(formData.get("email"))
        console.log(formData.get("password"))
    }

    return(
        <form 
            action={logIn}
            className="flex flex-col gap-6"
        >
            <InputField 
                labelContent="Correo electrónico"
                name="email"
                type="email"
                id="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                srOnly={true}
                required
            />
            <InputField
                labelContent="Contraseña"
                name="password"
                type="password"
                id="password"
                placeholder="Contraseña"
                autoComplete="current-password"
                srOnly={true}
                required
            />
            <BaseButton type="submit">Acceder</BaseButton>
        </form>
    )

}

export default LogInForm;