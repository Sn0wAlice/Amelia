const fs = require('fs');


module.exports = async function () {
    // check if file config.json exists
    if (!fs.existsSync('./config.json')) {
        console.log('config.json not found, creating...');
        fs.writeFileSync('./config.json', JSON.stringify({
            lang: "fr",
            voice: "en_female_makeup",
            hostname: 'http://127.0.0.1:8099',
            token: 'your token here'
        }, null, 4));
        console.log('config.json created, please fill in the details');
        process.exit(0);
    }
}