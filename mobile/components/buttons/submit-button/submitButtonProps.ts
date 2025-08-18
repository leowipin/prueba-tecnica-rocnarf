import { BaseButtonProps } from '../baseButtonProps';

export interface SubmitButtonProps extends Omit<BaseButtonProps, 'type'> {
  isLoading?: boolean;
  loadingText?: string;
}
