/**
 * Created by Akshay on 4/4/2017.
 */
var app = require('../../../express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(localStrategy));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

app.post('/api/passport/login', passport.authenticate('local'), login);
app.post('/api/passport/loggedin', loggedin);
app.post('/api/passport/logout', logout);
app.post('/api/passport/register', register);
app.post('/api/passport/isAdmin', isAdmin);
app.get('/api/passport/admin/user', findAllUsers);
app.delete('/api/passport/admin/user/:userId', deleteUser);
app.delete('/api/passport/user/:userId', unregisterUser);
app.put('/api/passport/admin/user/:userId', checkAdmin, updateUser);
app.put('/api/passport/user/:userId', checkSameUser, updateProfile);

var userModel = require('../models/user.model.server');

function localStrategy(username, password, done) {
    userModel
        .findUserByCredentials(username, password)
        .then(
            function(user) {
                if (!user) {
                    return done(null, false);
                }
                return done(null, user);
            },
            function(err) {
                if (err) { return done(err); }
            }
        );
}

function checkSameUser(req, res, next) {
    if (req.user && req.user._id == req.params.userId) {
        next();
    } else {
        res.send(401);
    }
}

function checkAdmin(req, res, next) {
    if(req.user && req.user.role == 'ADMIN') {
        next();
    } else {
        res.send(401);
    }
}

function updateProfile(req, res) {
    userModel
        .updateUser(req.params.userId, req.body)
        .then(function (status) {
            res.send(status);
        });
}

function updateUser(req, res) {
    userModel
        .updateUser(req.params.userId, req.body)
        .then(function (status) {
            res.send(status);
        });
}

function unregisterUser(req, res) {
    if(req.user && req.user._id == req.params.userId) {
        userModel
            .deleteUser(req.params.userId)
            .then(function (status) {
                res.send(200);
            });
    } else {
        res.send(401);
    }
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

function findAllUsers(req, res) {
    if(req.user && req.user.role=='ADMIN') {
        userModel
            .findAllUsers()
            .then(function (users) {
                res.json(users);
            });
    } else {
        res.send(401);
    }
}

function register(req, res) {
    var user = req.body;
    userModel
        .createUser(user)
        .then(function (user) {
            req.login(user, function (err) {
                if(err) {
                    res.send(400)
                } else {
                    res.json(user);
                }
            });
        }, function (err) {
            console.log(err);
            res.sendStatus(400).send(err);
        });
}

function isAdmin(req, res) {
    res.send(req.isAuthenticated() && req.user.role == 'ADMIN' ? req.user : '0');
}

function login(req, res) {
    var user = req.user;
    res.json(user);
}

function loggedin(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
}

function logout(req, res) {
    req.logout();
    res.send(200);
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