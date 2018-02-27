const LocalStrategy = require('passport-local').Strategy,
    env = require('../lib/env')
    ;
let User = require('../models/user');

module.exports = passport => {
    passport.serializeUser(function (req, user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (req, id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}
