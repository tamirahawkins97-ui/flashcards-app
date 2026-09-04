import React from 'react';
import { useDraggable } from '@dnd-kit/react';

interface NavBarProps {
    Logo: string;
    Profile: string;
    Decks: Deck[];
    NewDeck: string;
    Settings:string;
    Logout: string;
    onNewDeckClick: (opener: HTMLElement) => void;
    onStudyDeck: (deckId: string) => void;
    onEditDeck: (deck: Deck, opener: HTMLElement) => void;
    onDeleteDeck: (deckId: string) => void;
}

interface Deck {
    id: string;
    name: string;
}

interface DraggableDeckProps {
    deck: Deck;
    onStudyDeck: (deckId: string) => void;
    onEditDeck: (deck: Deck, opener: HTMLElement) => void;
    onDeleteDeck: (deckId: string) => void;
}

const DraggableDeck: React.FC<DraggableDeckProps> = ({ deck, onStudyDeck, onEditDeck, onDeleteDeck }) => {
    const { ref, isDragging } = useDraggable({ id: `deck-${deck.id}` });

    return (
        <li className={isDragging ? 'is-dragging' : undefined}>
            <button className="deck-drag-button" ref={ref} type="button">
                {deck.name}
            </button>
            <span className="deck-actions">
                <button type="button" onClick={() => onStudyDeck(deck.id)}>Study</button>
                <button type="button" onClick={(event) => onEditDeck(deck, event.currentTarget)}>Edit</button>
                <button type="button" onClick={() => onDeleteDeck(deck.id)}>Delete</button>
            </span>
        </li>
    );
};

const NavBar: React.FC<NavBarProps> = ({ Logo, Profile, Decks, NewDeck, Settings, Logout, onNewDeckClick, onStudyDeck, onEditDeck, onDeleteDeck }) => {
    return(
        <nav aria-label="Deck navigation">
            <div className="logo">
                <img src={Logo} alt="Flashcards"/>
            </div>

            <div className="new-deck">
                <button onClick={(event) => onNewDeckClick(event.currentTarget)}>{NewDeck}</button>
            </div>

            <div className="profile">
                <img src={Profile} alt="Profile" />
            </div>

            <ul>
                {Decks.map((deck) => (
                    <DraggableDeck key={deck.id} deck={deck} onStudyDeck={onStudyDeck} onEditDeck={onEditDeck} onDeleteDeck={onDeleteDeck} />
                ))}
                {Decks.length === 0 && (
                    <li className="empty-state empty-state-sidebar">
                        <span className="empty-state-icon" aria-hidden="true">+</span>
                        <strong>No decks yet</strong>
                        <span>Create a deck to get started.</span>
                    </li>
                )}
            </ul>
            <div className="action-links">
             <a href="/settings" className="action-link">{Settings}</a>
            <a href="/logout" className="action-link">{Logout}</a>
            </div>
        </nav>
    )
};

export default NavBar;