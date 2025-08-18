import { router } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { AppColors } from '../../constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '../../services/auth';
import { LoginDto } from '../../types/auth';
import { ApiError } from '../../types/errors';
import SubmitButton from '../buttons/submit-button/SubmitButton';
import InputField from './input-fields/InputField';

const LoginForm: React.FC = () => {
  const { login: authLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginService(data);
      console.log('Inicio de sesión exitoso:', response);
      
      await authLogin(response.token);
      
      // Redirigir al home
      router.replace('/(tabs)');
    } catch (err) {
      console.error('Error en login:', err);
      
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Correo electrónico"
        name="email"
        control={control}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        required
        error={errors.email?.message}
      />
      
      <InputField
        label="Contraseña"
        name="password"
        control={control}
        placeholder="Contraseña"
        isPassword={true}
        autoComplete="password"
        required
        error={errors.password?.message}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <SubmitButton
        onPress={handleSubmit(onSubmit)}
        isLoading={isLoading}
        loadingText="Accediendo..."
        style={styles.submitButton}
      >
        Acceder
      </SubmitButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  errorText: {
    color: AppColors.destructive,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});

export default LoginForm;
