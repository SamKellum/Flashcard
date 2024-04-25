import React, { useState } from "react";
import { Link, redirect } from "react-router-dom";
import DeckForm from "./DeckForm";
import BreadCrumb from "../Common/BreadCrumb";
import { createDeck } from "../../utils/api/index";

function NewDeck() {
    const initialFormState = {
        name: "",
        description: ""
    };

    const [formData, setFormData] = useState({ ...initialFormState });
    const [createdDeckId, setCreatedDeckId] = useState(null);

    // Set form data with change handler
    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value
        });
    };

    // Create new deck with submit handler
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const newDeck = await createDeck(formData);
            setCreatedDeckId(newDeck.id);
        } catch (error) {
            if (error.name !== "AbortError") {
                throw error;
            }
        }
    };

    // Redirect to the new deck page if created
    if (createdDeckId) {
        return <redirect to={`/decks/${createdDeckId}`} />;
    }

    return (
        <div>
            <BreadCrumb link={`/decks/new`} pageName={"Create Deck"} />
            <div>
                <h1>Create Deck</h1>
                <br />
                <DeckForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
                <br />
                <br />
                <Link to="/"><button className="btn btn-secondary mr-1">Cancel</button></Link>
                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default NewDeck;
