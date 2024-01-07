const config = require('../config')
const compromise = getGoodModule()

function getGoodModule() {
    if(config.lang == 'en') {
        return require('compromise')
    } else if(config.lang == 'fr') {
        return require('fr-compromise')
    }
}



/**
 * Extract command from text
 */
function extractCommand(text) {
    const doc = compromise(text);

    // what is action
    let action = doc.verbs().out('array');
    // change the action to infinitive
    for(let i = 0; i < action.length; i++) {
        try {
            action[i] = compromise(action[i]).verbs().conjugate()[0].Infinitive
        } catch (error) {
            console.log(error)
        }
    }

    // for what entity
    const entity = doc.nouns().out('array')

    return { action, entity };
}

function generateCommand(action, entity) {
    if (action && entity) {
        let new_a = [];
        let max = action.length > entity.length ? action.length : entity.length;

        for (let i = 0; i < max; i++) {
            if (action[i]) {
                new_a.push(action[i]);
            }
            if (entity[i]) {
                new_a.push(entity[i]);
            }
        }

        return new_a
    } 
    return null;
}

module.exports = function (text) {
    let { action, entity } = extractCommand(text);
    const command = generateCommand(action, entity);
    return {
        initial: text,
        action,
        command
    }
}