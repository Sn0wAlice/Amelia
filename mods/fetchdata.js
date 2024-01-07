const fetch = require('node-fetch');
const config = require('../config.json');

module.exports = async function(text) {
    try {
        const response = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": text,
                "voice": config.voice,
            })
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
    return null;
}