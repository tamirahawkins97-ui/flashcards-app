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
        appName="Flashcard App"
        onNewDeckClick={handleNewDeckClick}
      />
    </div>
  );
};

export default App;
