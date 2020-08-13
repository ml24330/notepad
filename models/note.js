const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        "title": {
            "type": String,
            "required": true
        },
        "content": {
            "type": String,
            "required": true
        },
        "resource": {
            "type": String
        },
        "sidenote": {
            "type": String
        },
        "date": {
            "type": Date,
            "default": Date.now
        },
    }
);

module.exports = mongoose.model("Note", noteSchema);
