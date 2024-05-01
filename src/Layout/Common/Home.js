import React, { useEffect, useState, useRef } from "react";
import ListDecks from "../Decks/DeckList";
import { Link } from "react-router-dom";
import { listDecks, deleteDeck } from "../../utils/api/index"; // Import listDecks and deleteDeck functions

function Home() {
    const mountedRef = useRef(false);
    const [decks, setDecks] = useState([]);

    useEffect(() => {
        mountedRef.current = true;
        const abortController = new AbortController();

        async function loadDecks() {
            try {
                const fetchedDecks = await listDecks();
                if (mountedRef.current) {
                    setDecks([...fetchedDecks]);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    throw error;
                }
            }
        }

        loadDecks();

        return () => {
            mountedRef.current = false;
            abortController.abort();
        };
    }, []);

    const handleDelete = async (deckId) => {
        const confirmDelete = window.confirm("Delete this deck? You will not be able to recover it.");
        if (confirmDelete) {
            try {
                await deleteDeck(deckId);
                // Remove the deleted deck from the decks state
                setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
            } catch (error) {
                console.error("Error deleting deck:", error);
            }
        }
    };

    return (
        <div>
            <div>
                <Link to="/decks/new">
                    <button className="btn btn-primary btn-large">
                        <i className="bi bi-plus"></i>Create Deck
                    </button>
                </Link>
            </div>
            <ListDecks decks={decks} handleDelete={handleDelete} />
        </div>
    );
}

export default Home;
