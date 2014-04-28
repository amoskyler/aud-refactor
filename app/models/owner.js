var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ownerSchema = mongoose.Schema({
    owner: {
        id: {
          type: String
        },
        token: {
          type: String
        },

        email: {
          type : String
        },
        name: {
          type: String
        }
    }
});

module.exports = mongoose.model('Owner', ownerSchema);
