import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { TextInputProps } from 'react-native';

export interface InputFieldProps<T extends FieldValues = FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  name: FieldPath<T>;
  control: Control<T>;
  isPassword?: boolean;
  error?: string;
  required?: boolean;
}
