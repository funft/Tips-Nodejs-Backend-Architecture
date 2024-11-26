const fs = require('fs');
const FILE_PATH = './notes.json';
function loadNotes(filePath) {
    const buffer = fs.readFileSync(filePath)
    console.log('buffer', buffer);
    const data = buffer.toString();
    console.log('data', data);
    return JSON.parse(data);
}

function addNotes(author, content) {
    const notes = loadNotes(FILE_PATH);
    const duplicateNotes = notes.filter(note => note.author === author);
    if (duplicateNotes.length == 0) {
        notes.push({ author, content });
    }
    saveNotes(notes);
}

function saveNotes(notes) {
    const data = JSON.stringify(notes);
    fs.writeFileSync(FILE_PATH, data);
}

module.exports = {
    addNotes
}