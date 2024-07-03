const speech = require('@google-cloud/speech');
const fs = require('fs');

const client = new speech.SpeechClient();

async function transcribeAudio(filePath) {
    const file = fs.readFileSync(filePath);
    const audioBytes = file.toString('base64');

    const request = {
        audio: { content: audioBytes },
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        },
    };

    const [response] = await client.recognize(request);
    const transcript = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
    return transcript;
}

module.exports = { transcribeAudio };
