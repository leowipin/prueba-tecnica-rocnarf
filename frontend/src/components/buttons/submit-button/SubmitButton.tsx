import { useFormStatus } from 'react-dom';
import BaseButton from '../BaseButton';
import type { SubmitButtonProps } from './submitButtonProps';

const SubmitButton = ({ children, ...rest }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <BaseButton type="submit" disabled={pending} {...rest}>
      {pending ? 'Accediendo...' : children}
    </BaseButton>
  );
};

export default SubmitButton;