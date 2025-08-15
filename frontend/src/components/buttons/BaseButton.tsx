import type { BaseButtonProps } from "./baseButtonProps"

const BaseButton = ({...rest}: BaseButtonProps) => {

    return(
        <button 
        className="font-semibold text-fg text-sm bg-primary rounded-lg px-4 py-3"
        {...rest} />
    )

}

export default BaseButton;