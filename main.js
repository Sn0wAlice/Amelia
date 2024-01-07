/**
 * Amelia - Let's see how far we can get with this.
 */



/**
 * Imports
 */
const vosk = require('vosk') // Vosk STT
const mic = require("mic"); // Microphone
const fs = require("fs"); // Filesystem

MODEL_PATH = "model";
SAMPLE_RATE = 16000; // 16KHz
DEBUG = process.argv[2] == '--debug' ? true : false

/**
 * All Local Imports
 */
const precheck = require('./utils/precheck')
const langparser = require('./utils/langparser')
const compromise = require('./text/text-compromise')

const fetchdata = require('./mods/fetchdata.js');
const saveandplay = require('./mods/saveandplay.js');

/**
 * All prechecks
 */
precheck()




/**
 * Let's get started
 */
vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({
    model: model,
    sampleRate: SAMPLE_RATE
});

let micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    debug: false,
    device: 'default',
});


let micInputStream = micInstance.getAudioStream();
micInstance.start();

console.clear()
console.log(fs.readFileSync('./utils/ascii.art', 'utf8'))

/**
 * The master function of the program
 */
micInputStream.on('data', async (data) => {
    if (rec.acceptWaveform(data)) {

        // Get the text
        let text = langparser(rec.result().text);
        
        // check if the text is null
        if(text == null) { return ;}

        console.log(`[You]: ${text}`)
        const fulldata = compromise(text)
        
        if(DEBUG) {
            console.log("[debug] - Full Data")
            console.log(fulldata)
        }

        // TODO : FETCH THE RESPONSE FROM THE DATABASE

        let res = {
            "response": true,
            "message": fulldata.initial == "amelia" ? "Yes ? How can i help you ?" : "I don't know what you're talking about."
        }

        // END TODO

        if(!res.response) {
            console.log(`[Amelia]: no response for this query`)
            return;
        }

        console.log(`[Amelia]: ${res.message}`)
        const d = await fetchdata(res.message);
        saveandplay(d);

    }
});









/**
 * If the user exits the program, stop recording
 */
process.on('SIGINT', function () {
    console.log(rec.finalResult());
    console.log("\nDone");
    rec.free();
    model.free();
});