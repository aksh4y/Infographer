/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var bcrypt = require("bcrypt-nodejs");
    var q = require('q');
    var userSchema = require('./user.schema.server.js')();
    var userModel = mongoose.model('UserModel', userSchema);

    // CRUD ops

    var api = {
        "setModel": setModel,
        "createUser": createUser,
        "findUserById": findUserById,
        "findUserByUsername": findUserByUsername,
        "findUserByCredentials": findUserByCredentials,
        "updateUser": updateUser,
        "deleteUser": deleteUser,
        "findUserByGoogleId": findUserByGoogleId,
        "findUserByFacebookId": findUserByFacebookId,
        "findAllUsers": findAllUsers
    };

    return api;

    
    function findUserByGoogleId(googleId) {
        return userModel.findOne({'google.id': googleId});
    }

    function findUserByFacebookId(facebookId) {
        return userModel.findOne({'facebook.id': facebookId});
    }

    function findAllUsers() {
        return userModel.find();
    }


    function createUser(user) {
        var deferred = q.defer();
        user.password = bcrypt.hashSync(user.password);
        userModel.create(user, function(err, u) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(u);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var d = q.defer();
        userModel
            .findOneAndUpdate({"_id": userId}, {$set: user}, function (err, updatedUser) {
                if(err) {
                    d.reject();
                } else {
                    d.resolve(updatedUser);
                }
            });

        return d.promise;
    }


    function deleteUser(userId){
        var d = q.defer();
        findUserById(userId)
            .then(function(user) {
                if(user.infographics.length != 0) {
                    deleteUserInfographics(userId)
                        .then(function() {
                            userModel
                                .remove({_id: userId})
                                .then(function() {
                                    d.resolve();
                                }, function (err) {
                                    d.reject(err);
                                });
                        }, function(err) {
                            d.reject(err);
                        });
                } else {
                    userModel
                        .remove({_id: userId})
                        .then(function() {
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                }

            }, function(err) {
                d.reject(err);
            });


        return d.promise;
    }

    function deleteUserInfographics(userId) {
        var deferred = q.defer();

        model.infographicModel
            .findAllInfographicsForUser(userId)
            .then(function (infographics) {
                for(var i in infographics) {
                    model.infographicModel
                        .deleteInfographic(infographics[i]._id)
                        .then(function() {
                            deferred.resolve();
                        }, function(err) {
                            deferred.reject(err);
                        });
                }
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }


    function findUserById(userId) {
        var d = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }


    function findUserByUsername(username) {
        return userModel.findOne({username: username});
    }

    function findUserByCredentials(credentials) {
        return userModel.findOne({username: credentials.username, password: credentials.password});
    }

    function setModel(_model) {
        model = _model;
    }

};