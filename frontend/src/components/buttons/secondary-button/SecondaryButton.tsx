import type { BaseButtonProps } from "../baseButtonProps"

const SecondaryButton = ({...rest}: BaseButtonProps) => {

    return(
        <button 
        className="font-semibold text-white text-sm bg-gray-500 rounded-lg px-4 py-3
        cursor-pointer hover:bg-gray-600 focus:ring-2 focus:ring-offset-2
      focus:ring-offset-surface focus:ring-gray-600 duration-200 ease-in-out"
        {...rest} />
    )

}

export default SecondaryButton;
