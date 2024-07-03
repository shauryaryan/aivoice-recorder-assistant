import React from 'react';
import Recorder from './Recorder';
import Notes from './Notes';

const App = () => {
    return (
        <div className="container">
            <h1>AI Voice Recorder Note Assistant</h1>
            <Recorder />
            <Notes />
        </div>
    );
};

export default App;


