import React, { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import CardForm from "./CardForm";
import BreadCrumb from "../Common/BreadCrumb";
import { readDeck, createCard } from "../../utils/api/index";

function NewCard() {
    const { deckId } = useParams();

    const initialFormState = {
        front: "",
        back: "",
        deckId: deckId,
        id: 0,
    };

    const [deck, setDeck] = useState([]);
    const [formData, setFormData] = useState({...initialFormState});
    const [redirect, setRedirect] = useState(false);

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createCard(deckId, formData);
            setFormData({...initialFormState});
            setRedirect(true); // Set redirect state to true after successful card creation
            console.log("Redirecting...");
        } catch (error) {
            if (error.name !== "AbortError") {
                throw error;
            }
        }
    };

    useEffect(() => {
        async function loadDeck() {
            const loadedDeck = await readDeck(deckId);
            setDeck(loadedDeck);
        }
        loadDeck();
    }, [deckId]);

    console.log("Redirect:", redirect);
    if (redirect) {
        return <Navigate to={`/decks/${deckId}`} />;
    }

    return (
        <div>
            <BreadCrumb link={`/decks/${deck.id}`} linkName={deck.name} pageName={"Add Card"} />
            <div className="row">
                <h2>{deck.name}: Add Card</h2>
                <br />
                <br />
            </div>
            <div className="row">
                <CardForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                <br />
            </div>
            <div className="row">
                <Link to={`/decks/${deckId}`} className="btn btn-secondary mr-1">Done</Link>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
}

export default NewCard;
