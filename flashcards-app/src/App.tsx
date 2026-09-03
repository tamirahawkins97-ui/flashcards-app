import React from "react";
import NewDeck from "./components/NewDeck";
import NavBar from "./components/NavBar";
import "./App.css";


const App: React.FC = () => {
  const handleNewDeckClick = () => {
    console.log("New Deck button clicked!");
       
    const newDeckName = prompt("Enter the name of the new deck:");
    if (newDeckName) {
      console.log(`New deck created: ${newDeckName}`);
    } else {
      console.log("No deck name provided.");
    }
  };

  return (
    <div className="app-shell">
      <div className="sidebar">
        <NavBar
          Logo="/logo.png"
          Profile="/profile.png"
          Decks={["Deck 1", "Deck 2", "Deck 3"]}
          NewDeck="Create New Deck"
          Settings="Settings"
          Logout="Logout"
          onDeckClick={handleNewDeckClick}
        />
      </div>
      <main className="main-content">
        <NewDeck
          appName="Flashcard App aria-label"
          onNewDeckClick={handleNewDeckClick}
        />
      </main>
    </div>
  );
};

export default App;
