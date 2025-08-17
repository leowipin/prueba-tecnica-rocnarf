import { useActionState } from 'react';
import InputField from './input-fields/InputField';
import SubmitButton from '../buttons/submit-button/SubmitButton';
import { register } from '../../services/auth.service';
import { ApiError } from '../../errors/apiError';
import type { RegisterDto } from '../../interfaces/auth.type';

interface FormState {
  message: string | null;
  type: 'success' | 'error' | null;
}

const RegisterForm = () => {
  const [state, formAction] = useActionState(registerAction, { message: null, type: null });

  async function registerAction(_previousState: FormState, formData: FormData): Promise<FormState> {
    const registerData: RegisterDto = {
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    
    if (registerData.password.length < 6) {
        return { message: 'La contraseña debe tener al menos 6 caracteres.', type: 'error' };
    }

    try {
      await register(registerData);
      return { 
        message: '¡Cuenta creada exitosamente! Por favor, inicia sesión.',
        type: 'success' 
      };
    } catch (err) {
      if (err instanceof ApiError) {
        return { message: err.message, type: 'error' };
      }
      return { message: 'Ocurrió un error inesperado.', type: 'error' };
    }
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <InputField
        labelContent="Correo electrónico"
        name="email"
        type="email"
        id="email"
        placeholder="tu@correo.com"
        autoComplete="email"
        srOnly={true}
        required
      />
      <InputField
        labelContent="Nombre de usuario"
        name="username"
        type="text"
        id="username"
        placeholder="Nombre de usuario"
        autoComplete="username"
        srOnly={true}
        required
      />
      <InputField
        labelContent="Contraseña"
        name="password"
        type="password"
        id="password"
        placeholder="Contraseña"
        autoComplete="new-password"
        srOnly={true}
        required
        isPassword={true}
      />
      
      {state.message && (
        <p className={`text-sm text-center ${state.type === 'success' ? 'text-success' : 'text-destructive'}`}>
          {state.message}
        </p>
      )}

      <SubmitButton>Crear Cuenta</SubmitButton>
    </form>
  );
};

export default RegisterForm;