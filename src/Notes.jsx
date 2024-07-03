import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notes = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const response = await axios.get('http://localhost:3000/notes');
            setNotes(response.data);
        };
        fetchNotes();
    }, []);

    return (
        <div>
            <h2>Notes</h2>
            <ul>
                {notes.map(note => (
                    <li key={note._id}>{note.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
