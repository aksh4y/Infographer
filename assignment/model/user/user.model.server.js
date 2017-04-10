/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');
    var userSchema = require('./user.schema.server.js')();
    var userModel = mongoose.model('UserModel', userSchema);

    var api = {
        "setModel": setModel,
        "createUser": createUser,
        "findUserById": findUserById,
        "findUserByUsername": findUserByUsername,
        "findUserByCredentials": findUserByCredentials,
        "updateUser": updateUser,
        "deleteUser": deleteUser
    };

    return api;



    function createUser(user) {
        var deferred = q.defer();
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
                if(user.websites.length != 0) {
                    deleteUserWebsites(userId)
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

    function deleteUserWebsites(userId) {
        var deferred = q.defer();

        model.websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                for(var w in websites) {
                    model.websiteModel
                        .deleteWebsite(websites[w]._id)
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
        var d = q.defer();

        userModel
            .find({"username": username}, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function findUserByCredentials(username, password) {
        var d = q.defer();

        userModel
            .find({"username": username, "password": password}, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }

};