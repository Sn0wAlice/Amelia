const fs = require('fs')

module.exports = function (req, res, next) {
    // Check if model exists
    if (!fs.existsSync(MODEL_PATH)) {
        console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")

        // Create the model folder
        fs.mkdirSync(MODEL_PATH)

        // Exit
        process.exit()
    }

    // check if directory "talks" exists
    if (!fs.existsSync('./talks')) {
        fs.mkdirSync('./talks')
    }
}