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

    passport.use('local-login', new LocalStrategy({
        usernameField: username,
        passwordField: password,
        passReqToCallback: true
    }, async (req, username, password, done) => {
        let user;
        try {
            user = await User.findOne({ email: req.body.username.toLowerCase() }) || await User.findOne({ username: req.body.username.toLowerCase() });
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'No user found'));
            } else {
                let isMatch;
                try {
                    isMatch = user.comparePassword(req.body.password);
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, req.flash('loginMessage', 'Email or Password incorrect'));
                    }
                } catch (error) {
                    console.error(error)
                    return done(null, false, req.flash('loginMessage', 'Email or Password incorrect'));

                }
            }
        } catch (err) {
            console.error(err);
            return done(err);
        }
    }))
}
