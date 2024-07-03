/* global webkitSpeechRecognition */


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }
    }, []);

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = event => {
            setAudioBlob(event.data);
            setAudioURL(URL.createObjectURL(event.data));
        };
        recorder.start();
        setMediaRecorder(recorder);

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = event => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    setTranscript(prevTranscript => prevTranscript + event.results[i][0].transcript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(prevTranscript => prevTranscript + interimTranscript);
            console.log('Transcript:', transcript); // Debugging line
        };

        recognition.onerror = event => {
            console.error('Speech recognition error:', event.error); // Debugging line
        };

        recognition.onend = () => {
            console.log('Speech recognition service disconnected'); // Debugging line
        };

        recognition.start();

        recorder.onstop = () => {
            recognition.stop();
        };
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorder.stop();
    };

    const uploadAudio = async () => {
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.wav');
        try {
            await axios.post('http://localhost:3000/upload', formData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && <audio src={audioURL} controls className="audio-controls" />}
            {audioBlob && <button onClick={uploadAudio}>Upload Audio</button>}
            <div className="transcription">
                <h2>Real-Time Transcription</h2>
                <p>{transcript}</p>
            </div>
        </div>
    );
};

export default Recorder;



