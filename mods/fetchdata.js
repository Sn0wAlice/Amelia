const fetch = require('node-fetch');
const config = require('../config.json');
const getvoice = require('./getvoice.js');

module.exports = async function(text, lang) {
    try {
        const response = await fetch('https://tiktok-tts.weilnet.workers.dev/api/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "text": text,
                "voice": getvoice(lang)
            })
        });
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
    return null;
}