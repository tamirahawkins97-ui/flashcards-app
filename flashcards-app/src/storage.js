const STORAGE_KEY = "flashcards-app-state";
const STORAGE_VERSION = 1;

const emptyState = () => ({ decks: [], cards: [] });

const isValidDeck = (deck) => (
  deck && typeof deck.id === "string" && typeof deck.name === "string"
);

const isValidCard = (card) => (
  card &&
  typeof card.id === "string" &&
  typeof card.deckId === "string" &&
  typeof card.question === "string" &&
  typeof card.answer === "string"
);

export function loadState() {
  try {
    const rawState = window.localStorage.getItem(STORAGE_KEY);
    if (!rawState) return emptyState();

    const stored = JSON.parse(rawState);
    if (stored?.version !== STORAGE_VERSION || !stored.data) return emptyState();
    if (
      !Array.isArray(stored.data.decks) ||
      !Array.isArray(stored.data.cards) ||
      !stored.data.decks.every(isValidDeck) ||
      !stored.data.cards.every(isValidCard)
    ) return emptyState();

    return stored.data;
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      data: state,
    }));
  } catch {
    // Storage can be unavailable in private browsing or restricted environments.
  }
}
