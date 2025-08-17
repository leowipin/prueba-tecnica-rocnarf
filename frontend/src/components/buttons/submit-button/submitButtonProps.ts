import type { BaseButtonProps } from "../baseButtonProps";

export interface SubmitButtonProps extends Omit<BaseButtonProps, 'type' | 'disabled'> {}