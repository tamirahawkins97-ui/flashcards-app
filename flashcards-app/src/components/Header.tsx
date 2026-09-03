import React from 'react';

interface HeaderProps {
    AppName: string;
}

const Header: React.FC<HeaderProps> = ({ AppName }) => {
    return (
        <header>
            <h1>{AppName}</h1>
        </header>
    )
}

export default Header;