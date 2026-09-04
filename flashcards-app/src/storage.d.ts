export interface StoredDeck {
  id: string;
  name: string;
}

export interface StoredFlashcard {
  id: string;
  deckId: string;
  question: string;
  answer: string;
}

export interface StoredState {
  decks: StoredDeck[];
  cards: StoredFlashcard[];
}

export function loadState(): StoredState;
export function saveState(state: StoredState): void;
