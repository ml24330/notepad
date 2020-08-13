const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        "subject": {
            "type": String,
            "required": true
        },
        "duedate": {
            "type": String,
            "required": true
        },
        "description": {
            "type": String,
            "required": true
        },
        "sidenote": {
            "type": String
        },
        "is_done": {
            "type": Boolean,
            "default": false
        },
        "date_added": {
            "type": Date,
            "default": Date.now
        }
    }
)

module.exports = mongoose.model("Todo", todoSchema);
