const fetch = require('node-fetch');
const config = require('../config.json');

module.exports = async function (body) {
    try {

        const req = await fetch(`${config.hostname}/api/io`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': config.token
            },
            body: JSON.stringify(body)
        })
        return  await req.json();
    } catch(err) {
        return null;
    }
}