var mongoose = require('mongoose');
var Schema = mongoose.Schema

var requestSchema = mongoose.Schema({
    request:{
        time: {
            type: Date,
            default: Date.now
        },

        body: {
            type: Text,
        },

        played: {
            type: Boolean,
            default: false
        },

        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },

        explicit: {
            type: Boolean,
        }
    }
});

module.exports = mongoose.model('Request', requestSchema);
