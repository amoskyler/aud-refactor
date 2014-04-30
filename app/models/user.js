var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = mongoose.Schema({
        phone: {
          type: String,
        },
        active: {
          type: Boolean,
          default: false
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room'
        }
});

module.exports = mongoose.model('User', userSchema);
