import React, { useEffect, useRef, useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import NewDeck from "./components/NewDeck";
import NavBar from "./components/NavBar";
import { loadState, saveState } from "./storage.js";
import "./App.css";

interface Deck {
  id: string;
  name: string;
}

interface Flashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
}

interface StudyModeState {
  deckId: string;
  cardIndex: number;
  isFlipped: boolean;
}

type DeckModalState =
  | { mode: "create"; opener: HTMLElement | null }
  | { mode: "edit"; deck: Deck; opener: HTMLElement | null };

interface DeckModalProps {
  deck?: Deck;
  onClose: () => void;
  onSave: (name: string) => void;
}

const DeckModal: React.FC<DeckModalProps> = ({ deck, onClose, onSave }) => {
  const [name, setName] = useState(deck?.name ?? "");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        "button, input"
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) onSave(trimmedName);
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="deck-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="deck-modal-title">{deck ? "Edit deck" : "Create a deck"}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close deck dialog">Close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="deck-name">Deck name</label>
          <input
            ref={inputRef}
            id="deck-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{deck ? "Save changes" : "Create deck"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CardModalProps {
  card?: Flashcard;
  onClose: () => void;
  onSave: (question: string, answer: string) => void;
}

const CardModal: React.FC<CardModalProps> = ({ card, onClose, onSave }) => {
  const [question, setQuestion] = useState(card?.question ?? "");
  const [answer, setAnswer] = useState(card?.answer ?? "");
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button, input");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (question.trim() && answer.trim()) onSave(question.trim(), answer.trim());
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="card-modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="card-modal-title">{card ? "Edit card" : "Create a card"}</h2>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close card dialog">Close</button>
        <form onSubmit={handleSubmit}>
          <label htmlFor="card-question">Question</label>
          <input ref={firstInputRef} id="card-question" value={question} onChange={(event) => setQuestion(event.target.value)} required />
          <label htmlFor="card-answer">Answer</label>
          <input id="card-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} required />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">{card ? "Save changes" : "Create card"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface StudyModeProps {
  deckName: string;
  card: Flashcard;
  cardIndex: number;
  cardCount: number;
  isFlipped: boolean;
  onFlip: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onExit: () => void;
}

const StudyMode: React.FC<StudyModeProps> = ({ deckName, card, cardIndex, cardCount, isFlipped, onFlip, onPrevious, onNext, onExit }) => (
  <section className="study-mode" aria-labelledby="study-title">
    <div className="study-header">
      <div>
        <p className="study-kicker">Study mode</p>
        <h1 id="study-title">{deckName}</h1>
      </div>
      <button type="button" onClick={onExit}>Exit study mode</button>
    </div>
    <p className="study-progress">Card {cardIndex + 1} of {cardCount}</p>
    <div className={`study-card ${isFlipped ? "is-flipped" : ""}`}>
      <button type="button" className="study-card-inner" onClick={onFlip} aria-label={isFlipped ? "Show question" : "Show answer"}>
        <span className="study-card-face study-card-front">{card.question}</span>
        <span className="study-card-face study-card-back">{card.answer}</span>
      </button>
    </div>
    <div className="study-controls">
      <button type="button" onClick={onPrevious} disabled={cardIndex === 0}>Previous</button>
      <button type="button" onClick={onFlip}>Flip card</button>
      <button type="button" onClick={onNext} disabled={cardIndex === cardCount - 1}>Next</button>
    </div>
  </section>
);

const App: React.FC = () => {
  const initialState = loadState();
  const [decks, setDecks] = useState<Deck[]>(initialState.decks.length > 0 ? initialState.decks : [
    { id: "1", name: "Deck 1" },
    { id: "2", name: "Deck 2" },
    { id: "3", name: "Deck 3" },
  ]);
  const [cards, setCards] = useState<Flashcard[]>(initialState.cards.length > 0 ? initialState.cards : [
    { id: "card-1", deckId: "1", question: "What is React?", answer: "A UI library for building interfaces." },
    { id: "card-2", deckId: "1", question: "What is CSS?", answer: "A language for styling web pages." },
  ]);
  const [modal, setModal] = useState<DeckModalState | null>(null);
  const [cardModal, setCardModal] = useState<{ card?: Flashcard } | null>(null);
  const [studyMode, setStudyMode] = useState<StudyModeState | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const cardOpenerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    saveState({ decks, cards });
  }, [decks, cards]);

  const closeModal = () => {
    setModal(null);
    openerRef.current?.focus();
  };

  const openCreateModal = (opener: HTMLElement) => {
    openerRef.current = opener;
    setModal({ mode: "create", opener });
  };

  const openEditModal = (deck: Deck, opener: HTMLElement) => {
    openerRef.current = opener;
    setModal({ mode: "edit", deck, opener });
  };

  const saveDeck = (name: string) => {
    if (modal?.mode === "edit") {
      setDecks((currentDecks) => currentDecks.map((item) =>
        item.id === modal.deck.id ? { ...item, name } : item
      ));
    } else {
      setDecks((currentDecks) => [
        ...currentDecks,
        { id: crypto.randomUUID(), name },
      ]);
    }
    closeModal();
  };

  const deleteDeck = (deckId: string) => {
    setDecks((currentDecks) => currentDecks.filter((deck) => deck.id !== deckId));
    setCards((currentCards) => currentCards.filter((card) => card.deckId !== deckId));
    setStudyMode((current) => current?.deckId === deckId ? null : current);
  };

  const enterStudyMode = (deckId: string) => {
    const deckCards = cards.filter((card) => card.deckId === deckId);
    if (deckCards.length > 0) {
      setStudyMode({ deckId, cardIndex: 0, isFlipped: false });
    }
  };

  const exitStudyMode = () => setStudyMode(null);
  const studyCards = studyMode
    ? cards.filter((card) => card.deckId === studyMode.deckId)
    : [];
  const currentStudyCard = studyMode ? studyCards[studyMode.cardIndex] : undefined;

  useEffect(() => {
    if (!studyMode) return;

    const handleStudyKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        exitStudyMode();
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        setStudyMode((current) => current && { ...current, isFlipped: !current.isFlipped });
      } else if (event.key === "ArrowRight") {
        setStudyMode((current) => current && current.cardIndex < studyCards.length - 1
          ? { ...current, cardIndex: current.cardIndex + 1, isFlipped: false }
          : current);
      } else if (event.key === "ArrowLeft") {
        setStudyMode((current) => current && current.cardIndex > 0
          ? { ...current, cardIndex: current.cardIndex - 1, isFlipped: false }
          : current);
      }
    };

    document.addEventListener("keydown", handleStudyKeyDown);
    return () => document.removeEventListener("keydown", handleStudyKeyDown);
  }, [studyMode, studyCards.length]);

  const openCardModal = (card: Flashcard | undefined, opener: HTMLElement) => {
    cardOpenerRef.current = opener;
    setCardModal({ card });
  };

  const closeCardModal = () => {
    setCardModal(null);
    cardOpenerRef.current?.focus();
  };

  const saveCard = (question: string, answer: string) => {
    if (cardModal?.card) {
      setCards((currentCards) => currentCards.map((card) =>
        card.id === cardModal.card?.id ? { ...card, question, answer } : card
      ));
    } else {
      setCards((currentCards) => [...currentCards, { id: crypto.randomUUID(), deckId: "1", question, answer }]);
    }
    closeCardModal();
  };

  const handleCardAction = (action: string, cardId: string, opener: HTMLElement) => {
    if (action === "create-card") openCardModal(undefined, opener);
    if (action === "edit-card") openCardModal(cards.find((card) => card.id === cardId), opener);
    if (action === "delete-card") setCards((currentCards) => currentCards.filter((card) => card.id !== cardId));
  };

  return (
    <DragDropProvider>
      <div className="app-shell">
        <div className="sidebar">
          <NavBar
            Logo="/logo.svg"
            Profile="https://i.etsystatic.com/44435940/r/il/fa62b0/5822049381/il_800x800.5822049381_t6qu.jpg"
            Decks={decks}
            NewDeck="Create New Deck"
            Settings="Settings"
            Logout="Logout"
            onNewDeckClick={openCreateModal}
            onStudyDeck={enterStudyMode}
            onEditDeck={openEditModal}
            onDeleteDeck={deleteDeck}
          />
        </div>
        <main className="main-content">
          {studyMode && currentStudyCard ? (
            <StudyMode
              deckName={decks.find((deck) => deck.id === studyMode.deckId)?.name ?? "Deck"}
              card={currentStudyCard}
              cardIndex={studyMode.cardIndex}
              cardCount={studyCards.length}
              isFlipped={studyMode.isFlipped}
              onFlip={() => setStudyMode((current) => current && { ...current, isFlipped: !current.isFlipped })}
              onPrevious={() => setStudyMode((current) => current && current.cardIndex > 0 ? { ...current, cardIndex: current.cardIndex - 1, isFlipped: false } : current)}
              onNext={() => setStudyMode((current) => current && current.cardIndex < studyCards.length - 1 ? { ...current, cardIndex: current.cardIndex + 1, isFlipped: false } : current)}
              onExit={exitStudyMode}
            />
          ) : (
            <NewDeck
              appName="Flashcard App"
              onNewDeckClick={openCreateModal}
              cards={cards}
              onCardAction={handleCardAction}
            />
          )}
        </main>
      </div>
      {modal && (
        <DeckModal
          deck={modal.mode === "edit" ? modal.deck : undefined}
          onClose={closeModal}
          onSave={saveDeck}
        />
      )}
      {cardModal && (
        <CardModal card={cardModal.card} onClose={closeCardModal} onSave={saveCard} />
      )}
    </DragDropProvider>
  );
};

export default App;
