var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
    user: {
        phone: String,
        active: Boolean,
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
    }
});

module.exports = mongoose.model('User', userSchema);
