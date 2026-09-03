import React from 'react';

interface NavBarProps {
    Logo: string;
    Profile: string;
    Decks: string[];
    NewDeck: string;
    Settings:string;
    Logout: string;
    onDeckClick: (deckName: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ Logo, Profile, Decks, NewDeck, Settings, Logout, onDeckClick }) => {
    return(
        <nav>
            <div className="logo">
                <img src={Logo} alt="Logo"/>
            </div>

            <div className="new-deck">
                <button onClick={() => onDeckClick(NewDeck)}>{NewDeck}</button>
            </div>

            <div className="profile">
                <img src={Profile} alt="Profile" />
            </div>

            <ul>
                {Decks.map((deck) => (
                    <li key={deck} onClick={() => onDeckClick(deck)}>
                        {deck}
                    </li>
                ))};
            </ul>
            <div className="action-links">
             <a href="/settings" className="action-link">{Settings}</a>
            <a href="/logout" className="action-link">{Logout}</a>
            </div>
        </nav>
    )
};

export default NavBar;