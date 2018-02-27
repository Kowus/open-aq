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

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        let userEmail,
            userUsname
            ;
        try {
            userEmail = await User.findOne({ email: req.body.email });
            userUsname = await User.findOne({ username: username })
            if (userEmail) return done(null, false, req.flash('Sorry, that email has already been used with an account.'));
            else if (userUsname) return done(null, false, req.flash('Sorry, that username has already been used with an account.'));
            else {
                let newUser = new User({
                    username: username,
                    given_name: req.body.given_name,
                    family_name: req.body.family_name,
                    email: req.body.email,
                    password: req.body.password
                });
                let user;
                try {
                    user = await newUser.save();
                    // res.json(user)
                    let token;
                    try {
                        token = await jwt.sign({
                            user: user
                        }, env.jwt.key, { audience: env.jwt.audience, issuer: env.jwt.issuer });
                        // Use token to send mail confirmation
                        // res.json(token);
                        return done(null, user);
                    } catch (error) {
                        console.error(error);
                        return done(error);
                    }

                } catch (err) {
                    console.error(error);
                    return done(error);
                }
            }
        } catch (error) {
            console.error(error);
            return done(error);
        }
    }))

    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, username, password, done) => {
        let user;
        try {
            user = await User.findOne({ email: username.toLowerCase() }) || await User.findOne({ username: username.toLowerCase() });
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
