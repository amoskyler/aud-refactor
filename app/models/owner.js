var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ownerSchema = mongoose.Schema({
    owner: {
        ownerId: {
          type: String
        },
        token: {
          type: String
        },

        email: {
          type : String
        },
        names: {
          type: String
        }
    }
});

module.exports = mongoose.model('Owner', ownerSchema);
