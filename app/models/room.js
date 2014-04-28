var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = mongoose.Schema({
        active: {
            type: Boolean,
            default : true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Owner',
            required : true
        },
        code: {
            type: String,
            required : true
            //no default, generate code on _id timestamp when creating room
        }
});

module.exports = mongoose.model('Room', roomSchema);
