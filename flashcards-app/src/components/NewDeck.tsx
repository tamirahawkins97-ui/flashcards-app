import React from "react";
import Header from "./Header";
import Button from "./Button";

interface NewDeckProps {
  appName: string;
  onNewDeckClick: (opener: HTMLElement) => void;
  cards: Flashcard[];
  onCardAction: (action: string, cardId: string, opener: HTMLElement) => void;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const EmptyState: React.FC<{ title: string; message: string; action?: React.ReactNode }> = ({ title, message, action }) => (
  <div className="empty-state">
    <span className="empty-state-icon" aria-hidden="true">+</span>
    <h3>{title}</h3>
    <p>{message}</p>
    {action}
  </div>
);

const NewDeck: React.FC<NewDeckProps> = ({ appName, onNewDeckClick, cards, onCardAction }) => {
  const [flippedCards, setFlippedCards] = React.useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  React.useEffect(() => {
    setFlippedCards((current) => {
      const cardIds = new Set(cards.map((card) => card.id));
      const next = new Set([...current].filter((cardId) => cardIds.has(cardId)));
      return next.size === current.size ? current : next;
    });
  }, [cards]);

  const normalizedSearchTerm = debouncedSearchTerm.trim().toLowerCase();
  const filteredCards = normalizedSearchTerm
    ? cards.filter((card) => `${card.question} ${card.answer}`.toLowerCase().includes(normalizedSearchTerm))
    : cards;

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    const cardId = target.dataset.cardId;
    if (!action) return;

    if (action === "create-card") {
      onCardAction(action, "", target);
      return;
    }

    if (!cardId) return;

    if (action === "flip") {
      setFlippedCards((current) => {
        const next = new Set(current);
        if (next.has(cardId)) next.delete(cardId);
        else next.add(cardId);
        return next;
      });
      return;
    }

    onCardAction(action, cardId, target);
  };

  return (
    <div>
      <Header AppName={appName} />
      <Button onClick={(event) => onNewDeckClick(event.currentTarget)}>
        New Deck
      </Button>
      <section className="cards-section" aria-labelledby="cards-title" onClick={handleCardClick}>
        <div className="cards-heading">
          <h2 id="cards-title">Cards</h2>
          <button type="button" data-action="create-card">Add card</button>
        </div>
        <label className="card-search-label" htmlFor="card-search">Search cards</label>
        <input
          id="card-search"
          className="card-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search this deck"
        />
        <p className="card-match-count" aria-live="polite">
          {filteredCards.length} {filteredCards.length === 1 ? "match" : "matches"}
        </p>
        {filteredCards.length === 0 ? (
          <EmptyState
            title={normalizedSearchTerm ? "No cards found" : "No cards yet"}
            message={normalizedSearchTerm ? "Try a different question or answer." : "Add your first card to start building this deck."}
            action={!normalizedSearchTerm ? <button type="button" data-action="create-card">Add card</button> : undefined}
          />
        ) : (
          <div className="cards-grid">
            {filteredCards.map((card) => (
            <article className={`card ${flippedCards.has(card.id) ? "is-flipped" : ""}`} key={card.id}>
              <div className="card-inner">
                <div className="card-face card-front">
                  <button type="button" className="card-content" data-action="flip" data-card-id={card.id} aria-label={`Show answer for ${card.question}`}>
                    {card.question}
                  </button>
                  <div className="card-actions">
                    <button type="button" data-action="edit-card" data-card-id={card.id} aria-label={`Edit ${card.question}`}>Edit</button>
                    <button type="button" data-action="delete-card" data-card-id={card.id} aria-label={`Delete ${card.question}`}>Delete</button>
                  </div>
                </div>
                <div className="card-face card-back">
                  <button type="button" className="card-content" data-action="flip" data-card-id={card.id} aria-label={`Show question for ${card.answer}`}>
                    {card.answer}
                  </button>
                </div>
              </div>
            </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default NewDeck;
