import React from "react";
import Header from "./Header";
import Button from "./Button";

interface NewDeckProps {
  appName: string;
  onNewDeckClick: () => void;
}

const NewDeck: React.FC<NewDeckProps> = ({ appName, onNewDeckClick }) => {
  return (
    <div>
      <Header AppName={appName} />
      <Button onClick={onNewDeckClick}>
        New Deck
      </Button>
    </div>
  );
};

export default NewDeck;
