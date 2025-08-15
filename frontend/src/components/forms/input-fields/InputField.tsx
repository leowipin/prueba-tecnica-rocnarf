import type { InputFieldProps } from "./inputFieldProps";

const InputField = ({labelContent, name, srOnly, ...rest}: InputFieldProps) => {

    return(
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className={`text-fg-muted ${srOnly ? "sr-only" : ""}`}>{labelContent}</label>
            <input name={name} className="px-4 py-3 text-sm border border-primary rounded-lg text-fg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary
                duration-200" 
            {...rest} />
        </div>
    )

}

export default InputField;