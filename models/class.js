const mongoose = require('mongoose');
const noteSchema = require('./note.js').schema;

const classSchema = new mongoose.Schema(
    {
        "name": {
            "type": String,
            "required": true
        },
        "prof": {
            "type": String
        },
        "start_date": {
            "type": String,
            "required": true
        },
        "end_date": {
            "type": String,
            "required": true
        },
        "notes": [noteSchema]
    }
);

module.exports = mongoose.model("Class", classSchema);
