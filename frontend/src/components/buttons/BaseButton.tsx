import type { BaseButtonProps } from "./baseButtonProps"

const BaseButton = ({...rest}: BaseButtonProps) => {

    return(
        <button 
        className="font-semibold text-white text-sm bg-primary rounded-lg px-4 py-3
        cursor-pointer hover:bg-primary-hover focus:ring-2 focus:ring-offset-2
      focus:ring-offset-surface focus:ring-primary-hover duration-200 ease-in-out"
        {...rest} />
    )

}

export default BaseButton;