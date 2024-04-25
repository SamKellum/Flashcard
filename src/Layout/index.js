import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom"; // Import Routes from react-router-dom
import Header from "./Header";
import Home from "./Common/Home";
import NewDeck from "./Decks/CreateDeck";
import EditDeck from "./Decks/EditDeck";
import StudyDeck from "./Decks/StudyDeck";
import Deck from "./Decks/Deck"
import EditCard from "./Cards/EditCard";
import NewCard from "./Cards/CreateCard";
import StudyCard from "./Decks/StudyCard";
import NotFound from "./NotFound";
import { listDecks } from "../utils/api/index";

function Layout() {
  const [decks, setDecks] = useState([]);

  //load decks
  useEffect(() => {
    //declare abort Controller
    setDecks([]);
    const abortController = new AbortController();
    //loading of decks from API
    async function loadDecks() {
      try {
        const loadedDecks = await listDecks();
        setDecks(loadedDecks);
      } catch (error) {
        if (error.name !== "AbortError") {
          throw error;
        }
      }
    }
    loadDecks();
    return () => abortController.abort();
  }, []);

  return (
    <div>
      <Header />
      <div className="container">
        <Routes> {/* Use Routes instead of Router */}
          <Route exact path="/" element={<Home decks={decks} />} />
          <Route path="/decks/new" element={<NewDeck />} />
          <Route path="/decks/:deckId/cards/:cardId/edit" element={<EditCard />} />
          <Route path="/decks/:deckId/cards/:cardId/study" element={<StudyCard />} />
          <Route path="/decks/:deckId/cards/new" element={<NewCard />} />
          <Route path="/decks/:deckId/edit" element={<EditDeck />} />
          <Route path="/decks/:deckId/study" element={<StudyDeck />} />
          <Route path="/decks/:deckId" element={<Deck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default Layout;
