
import React from "react";

interface ButtonProps {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <button onClick={onClick}>
            {children}
        </button>
    )
}

export default Button;