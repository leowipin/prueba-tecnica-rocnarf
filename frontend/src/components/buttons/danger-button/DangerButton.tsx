import type { BaseButtonProps } from "../baseButtonProps"

const DangerButton = ({...rest}: BaseButtonProps) => {

    return(
        <button 
        className="font-semibold text-white text-sm bg-destructive rounded-lg px-4 py-3
        cursor-pointer hover:bg-red-600 focus:ring-2 focus:ring-offset-2
      focus:ring-offset-surface focus:ring-red-600 duration-200 ease-in-out"
        {...rest} />
    )

}

export default DangerButton;
