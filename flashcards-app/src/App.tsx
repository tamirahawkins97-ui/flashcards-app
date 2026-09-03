import React from "react";
import NewDeck from "./components/NewDeck";


const App: React.FC = () => {
  const handleNewDeckClick = () => {
    console.log("New Deck button clicked!");
    // Add logic here, e.g., creating a new deck or navigating to a new route.
  };

  return (
    <div>
      <NewDeck
        appName="Flashcard App aria-label"
        onNewDeckClick={handleNewDeckClick} aria-label="Create New Deck"
      />
    </div>
  );
};

export default App;
