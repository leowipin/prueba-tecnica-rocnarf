import { useState } from 'react';
import type { InputFieldProps } from './inputFieldProps';
import { Eye, EyeOff } from 'lucide-react';

const InputField = ({
    labelContent,
    id,
    name,
    type,
    srOnly = false,
    isPassword = false,
    ...rest
}: InputFieldProps) => {

    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="relative">
            <label htmlFor={id} className={srOnly ? 'sr-only' : ''}>
                {labelContent}
            </label>
            <input
                id={id}
                name={name}
                type={inputType}
                className={`w-full px-4 py-3 text-sm border border-primary rounded-lg text-fg 
                placeholder:text-fg-muted-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface 
                focus:ring-primary duration-200 ${isPassword ? 'pr-10' : ''}`}
                {...rest}
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-fg-2 hover:text-fg"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}
        </div>
    );
};

export default InputField;