import React, { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import CardForm from "./CardForm";
import BreadCrumb from "../Common/BreadCrumb";
import { readDeck, readCard, updateCard } from "../../utils/api/index";

function EditCard() {
    const { deckId, cardId } = useParams();
    const [deck, setDeck] = useState({});
    const [card, setCard] = useState({});
    const [shouldRedirect, setShouldRedirect] = useState(false);

    // Load deck and card
    useEffect(() => {
        const loadDeck = async () => setDeck(await readDeck(deckId));
        loadDeck();
        const loadCard = async () => setCard(await readCard(cardId));
        loadCard();
    }, [deckId, cardId]);

    // Create change handler for form
    const handleChange = ({ target }) => {
        setCard({
            ...card,
            [target.name]: target.value
        });
    };

    // Create submit handler to save edits
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await updateCard(card);
            setShouldRedirect(true);
        } catch (error) {
            if (error.name !== "AbortError") {
                throw error;
            }
        }
    };

    // Log deckId and shouldRedirect for debugging
    console.log("deckId:", deckId);
    console.log("shouldRedirect:", shouldRedirect);

    // Navigate to deck page if shouldRedirect is true
    if (shouldRedirect) {
        return <Navigate to={`/decks/${deckId}`} />;
    }

    return (
        <div>
            <BreadCrumb link={`/decks/${deckId}`} linkName={`Deck ${deck.name}`} pageName={`Edit Card ${cardId}`} />
            <div className="row w-100">
                <CardForm formData={card} handleChange={handleChange} handleSubmit={handleSubmit} />
            </div>
            <div className="row w-100">
                <Link to={`/decks/${deckId}`} className="btn btn-secondary mr-1">Cancel</Link>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
}

export default EditCard;
