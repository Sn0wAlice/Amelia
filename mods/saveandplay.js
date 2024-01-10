const fs = require('fs');
const player = require('play-sound')(opts = {})

module.exports = async function(d) {
    // d.data is base64 encoded audio, you can save it to a file
    fs.writeFileSync('./talks/audio.mp3', Buffer.from(d.data, 'base64'));
    
    // play the audio
    return new Promise((resolve, reject) => {
        player.play('./talks/audio.mp3', function(err){
            if (err) throw err
            resolve();
        })
    })
}