import { useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import InputField from './input-fields/InputField';
import SubmitButton from '../buttons/submit-button/SubmitButton';
import { login } from '../../services/auth.service';
import { ApiError } from '../../errors/apiError';
import type { LoginDto } from '../../interfaces/auth.type';
import { useAuth } from '../../context/AuthContext';

interface FormState {
  error: string | null;
  success: boolean;
}

const LogInForm = () => {
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();
  
  const [state, formAction] = useActionState(loginAction, { error: null, success: false });

  async function loginAction(_previousState: FormState, formData: FormData): Promise<FormState> {
    const loginData: LoginDto = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const response = await login(loginData);
      console.log('Inicio de sesión exitoso:', response);

      authLogin(response.token);
      
      return { error: null, success: true };
    } catch (err) {
      if (err instanceof ApiError) {
        return { error: err.message, success: false };
      }
      return { error: 'Ocurrió un error inesperado.', success: false };
    }
  }

  useEffect(() => {
    if (state.success) {
      navigate('/', { replace: true });
    }
  }, [state.success, navigate]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
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
      
      {state.error && (
        <p className="text-destructive text-sm text-center">{state.error}</p>
      )}

      <SubmitButton>Acceder</SubmitButton>
    </form>
  );
};

export default LogInForm;