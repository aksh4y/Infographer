/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app, userModel) {

    require('../../express');
    var twilio = require('twilio');

    var passport = require('passport');
    var bcrypt = require("bcrypt-nodejs");

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    var auth = authorized;
    var client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    var LocalStrategy = require('passport-local').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    var FacebookStrategy = require('passport-facebook');

    app.post('/api/admin/user', auth, createUser);
    app.get('/api/admin/user', auth, findAllUsers);
    app.put('/api/admin/user/:userId', auth, updateUser);
    app.delete('/api/admin/user/:userId', auth, deleteUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserByUserId);
    app.get('/api/user/:username', findUserByUsername);
    app.post('/api/isAdmin', isAdmin);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", unregisterUser);
    app.post("/api/register", register);
    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.get('/api/loggedIn', loggedIn);
    app.post('/api/recover', recover);
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
    app.get('/google/oauth/callback',
        passport.authenticate('google', {
            successRedirect: '/index.html#/profile',
            failureRedirect: '/index.html#/login'
        }));

    function recover (req, res) {
        if(req.body) {
            var user = req.body;
            userModel.findUserByUsername(user.username)
                .then(function (response) {
                    var newUser = response;
                    if (!newUser.facebook.id && !newUser.google.id && newUser.phone == user.phone) {
                        var pass = randomString(12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                        newUser.password = bcrypt.hashSync(pass);
                        userModel
                            .updateUser(newUser._id, newUser)
                            .then(function (res) {
                                client.messages.create({
                                    body: 'OTP for Infographer is: ' + pass,
                                    to: newUser.phone,  // Text this number
                                    from: process.env.TWILIO_NUMBER // From a valid Twilio number
                                }).then(function (message) {
                                    res.sendStatus(200).send(message);
                                }, function (err) {
                                    res.sendStatus(500).send(err);
                                });
                            }, function () {
                                res.sendStatus(500);
                            });
                    }
                    else res.sendStatus(404);
                }, function () {
                    res.sendStatus(404);
                });
        }

    }

    function randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '#/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/index.html#/profile');
        });



    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "/auth/facebook/callback",
            profileFields: ['id', 'displayName', 'email'],
            enableProof: true
        }, facebookStrategy));

    function facebookStrategy(token, refreshToken, profile, cb) {
       // console.log(profile);
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return cb(null, user);
                    } else {
                        var newFacebookUser = {
                            username:  profile.displayName.replace(' ', '.').toLowerCase(),
                            firstName: profile.displayName.substring(0, profile.displayName.indexOf(' ')),
                            lastName:  profile.displayName.substring(profile.displayName.indexOf(' ')+1),
                            email:     profile.emails[0].value,
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return cb(err); }
                }
            )
            .then(
                function(user){
                    return cb(null, user);
                },
                function(err){
                    if (err) { return cb(err); }
                }
            );
        }

    var googleConfig = {
        clientID     : process.env.GOOGLE_CLIENT_ID,
        clientSecret : process.env.GOOGLE_CLIENT_SECRET,
        callbackURL  : "/google/oauth/callback"
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );

    }

    passport.use(new LocalStrategy(localStrategy));

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    // if the user exists, compare passwords with bcrypt.compareSync
                    if(user && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, "bad pwd");
                    }
                });
    }

    function unregisterUser(req, res) {
        if(req.user && req.user._id == req.params.userId) {
            userModel
                .deleteUser(req.params.userId)
                .then(function (status) {
                    res.sendStatus(200);
                });
        } else {
            res.sendStatus(401);
        }
    }

    function register(req, res) {
        var newUser = req.body;
        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.status(500).send(user);
                    } else {
                        return userModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(500).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            user.password = '';
                            if(err) {
                                res.status(500).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(500).send(err);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function findAllUsers(req, res) {
        if(req.user && req.user.role=='ADMIN') {
            userModel
                .findAllUsers()
                .then(function (users) {
                    res.json(users);
                });
        } else {
            res.json({});
        }
    }

    function loggedIn(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function findUserByUserId(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if (username && password) {
            findUserByCredentials(req, res);
        }
        else if (username) {
            findUserByUsername(req, res);
        }
        else {
            return res.sendStatus(400);
        }
    }

    /*function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        userModel
            .findUserByCredentials(username, password)
            .then(function (response) {
                if (response.length != 0) {
                    res.json(response[0]);
                }
                else {
                    res.sendStatus(404);
                }
            }, function () {
                res.sendStatus(404);
            });
    }*/

    function findUserByUsername(req, res) {
        userModel
            .findUserByUsername(req.params.username)
            .then(function (user) {
                if(err) {
                    res.sendStatus(500);
                } else {
                    res.json(user);
                }
            });
    }

    function deleteUser(req, res) {
        if (req.user && req.user.role == 'ADMIN') {
            userModel
                .deleteUser(req.params.userId)
                .then(function (status) {
                    res.send(200);
                });
        } else {
            res.send(401);
        }
    }

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(function (user) {
                    res.json(user);
                },
                function () {
                    res.sendStatus(500);
                });


        /*newUser._id = (new Date()).getTime() + "";
         users.push(newUser);
         return res.json(newUser);*/
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    function isAdmin(req, res) {
        res.send(req.isAuthenticated() && req.user.role && req.user.role.indexOf('ADMIN') > -1 ? req.user : '0');
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function (response) {
                var newUser = req.body;
                userModel
                    .updateUser(userId, newUser)
                    .then(function (response) {
                        res.sendStatus(200);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    }
};