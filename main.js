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

const init = require('./utils/init')
init()

/**
 * All Local Imports
 */
const precheck = require('./utils/precheck')
const langparser = require('./utils/langparser')
const compromise = require('./text/text-compromise')

const fetchdata = require('./mods/fetchdata.js');
const saveandplay = require('./mods/saveandplay.js');
const asktoserver = require('./mods/asktoserver.js');
const translate = require('./mods/translate.js');

/**
 * All prechecks
 */
precheck()
const config = require('./config.json')


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
        let fulldata = compromise(text)

        fulldata.data = {
            timestamp: Date.now(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
        
        if(DEBUG) {
            console.log("[debug] - Full Data")
            console.log(fulldata)
        }

        let res = await asktoserver(fulldata);

        if(res == null) {
            return;
        }

        if(DEBUG) {
            console.log("[debug] - Response from server")
            console.log(res)
        }
        
        if(res.error) {
            return;
        }

        if(!res.talk && !res.talk.needtotalk) {
            return;
        }

        if(config.voicelang != 'english') {
            res.talk.message = await translate(res.talk.message, 'english', config.voicelang);
            if(res.talk.message == 'nok') {
                return;
            }
        }

        console.log(`[Amelia]: ${res.talk.message}`)
        const d = await fetchdata(res.talk.message, config.voicelang);

        // pose mic recording
        micInstance.pause();
        await saveandplay(d);
        // resume mic recording
        micInstance.resume();
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