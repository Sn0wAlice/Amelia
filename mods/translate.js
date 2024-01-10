const Reverso = require('reverso-api')
const reverso = new Reverso()

module.exports =  function (text, from, to) {
    return new Promise((resolve, reject) => {
        reverso.getTranslation(
            text,
            from,
            to,
        ).then((result) => {
            if(!result.ok) {
                resolve("nok")
                return
            }
            console.log(`[Bot]: ${result.translations[0]}`)
            resolve(result.translations[0])
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}