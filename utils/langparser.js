module.exports = function(text) {

    if(text == "") {
        return null
    }

    //first remove all the accents
    text = text.replace(/[áàâã]/g, 'a');
    text = text.replace(/[éèê]/g, 'e');
    text = text.replace(/[íìî]/g, 'i');
    text = text.replace(/[óòôõ]/g, 'o');

    return text
} 