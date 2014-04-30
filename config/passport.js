var flash = require('connect-flash');
var RdioStrategy = require('passport-rdio').Strategy;
var Owner = require('../app/models/owner.js')
var configAuth = require('./auth');

module.exports = function(passport) {

    passport.serializeUser(function(owner, done) {
        done(null, owner.id);
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Owner.findById(id, function(err, owner) {
            done(err, owner);
        });
    });
  passport.use(new RdioStrategy({
        // pull in our app id and secret from our auth.js file
        consumerKey: configAuth.rdioAuth.clientID,
        consumerSecret: configAuth.rdioAuth.clientSecret,
        callbackURL: configAuth.rdioAuth.callbackURL
    },
    // rdio will send back the token and profile
    function(token, refreshToken, profile, done) {
        //console.log(profile);
    // find the user in the database based on their rdio id
      Owner.findOne({ 'ownerId' : profile.id }, function(err, owner) {
                if (err)
                    return done(err);
                // if the user is found, then log them in
                if (owner) {
                  console.log("user exists");
                    return done(null, owner); // user found, return that user
                } else {
                    // if there is no user found with that rdio id, create them
                    var newOwner = new Owner();

                    // set all of the rdio information in our user model
                    newOwner.ownerId = profile.id;
                    newOwner.token = token; // we will save the token that rdio provides to the user
                    newOwner.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newOwner.email = profile._json.url;

                    // save our user to the database
                    newOwner.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newOwner);
                    });
                }
        });

    }));

};
