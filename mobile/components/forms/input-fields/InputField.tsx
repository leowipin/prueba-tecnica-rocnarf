import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Controller, FieldValues } from 'react-hook-form';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { AppColors } from '../../../constants/Colors';
import { InputFieldProps } from './inputFieldProps';

const InputField = <T extends FieldValues>({
  label,
  name,
  control,
  isPassword = false,
  error,
  required = false,
  placeholder,
  ...rest
}: InputFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {label && !rest.secureTextEntry && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value }, fieldState: { error: fieldError } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                (error || fieldError) && styles.inputError,
                isPassword && styles.inputWithIcon,
              ]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={placeholder || label}
              placeholderTextColor={AppColors.fgMuted2}
              secureTextEntry={isPassword && !showPassword}
              {...rest}
            />
            
            {isPassword && (
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={AppColors.fgMuted}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.fg,
    marginBottom: 8,
  },
  required: {
    color: AppColors.destructive,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: AppColors.fg,
    backgroundColor: AppColors.surface,
    minHeight: 48,
  },
  inputWithIcon: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: AppColors.destructive,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 14,
    padding: 5,
  },
  errorText: {
    color: AppColors.destructive,
    fontSize: 14,
    marginTop: 4,
  },
});

export default InputField;
