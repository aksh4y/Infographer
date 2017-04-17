/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');

    var infographicSchema = require('./infographic.schema.server')();
    var infographicModel = mongoose.model('InfographicModel', infographicSchema);

    var api = {
        "setModel": setModel,
        "createInfographicForUser": createInfographicForUser,
        "findAllInfographicsForUser": findAllInfographicsForUser,
        "findInfographicById": findInfographicById,
        "updateInfographic": updateInfographic,
        "deleteInfographic": deleteInfographic,
        "deleteInfographicWidgets": deleteInfographicWidgets,
        "removeWidget": removeWidget
    };

    return api;

    function createInfographicForUser(userId) {
        var deferred = q.defer();
        var infographic = {
            _user: userId,
            name: "<Enter a title>"
        };

        infographicModel.create(infographic, function (err, i) {
            if (err) {
                console.log("Error:"+err);
                deferred.reject(err);
            } else {
                addInfographic(userId, i);
                deferred.resolve(i);
            }
        });

        return deferred.promise;
    }

    function addInfographic(userId, infographic) {
        var deferred = q.defer();
        model.userModel
            .findUserById(userId)
            .then(function(user) {
                user.infographics.push(infographic);
                user.save();
                deferred.resolve(user);
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function findAllInfographicsForUser(userId) {
        var d = q.defer();
        infographicModel
            .find({"_user": userId}, function (err, infographics) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(infographics);
                }
            });
        return d.promise;
    }

    function findInfographicById(infographicId) {
        var d = q.defer();
        infographicModel
            .find({"_id": infographicId}, function (err, infographic) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(infographic);
                }
            });
        return d.promise;
    }

    function updateInfographic(infographicId, infographic) {
        var d = q.defer();
        infographicModel
            .findOneAndUpdate({"_id": infographicId}, {$set: infographic}, function (err, updatedInfographic) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedInfographic);
                }
            });
        return d.promise;
    }


    function deleteInfographic(infographicId){
        var d = q.defer();
        infographicModel
            .findById(infographicId).populate('_user')
            .then(function (infographic) {
                infographic._user.infographics.splice(infographic._user.infographics.indexOf(infographicId),1);
                infographic._user.save();
                if(infographic.widgets.length !=0) {
                    deleteinfographicWidgets(infographicId)
                        .then(function () {
                            infographicModel
                                .remove({_id: infographicId})
                                .then(function () {
                                    d.resolve();
                                }, function (err) {
                                    d.reject(err);
                                });
                        }, function (err) {
                            d.reject(err);
                        });
                }
                else {
                    infographicModel
                        .remove({_id: infographicId})
                        .then(function () {
                            d.resolve();
                        }, function (err) {
                            d.reject(err);
                        });
                }

            }, function (err) {
                d.reject(err);
            });
        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }


    function deleteInfographicWidgets(infographicId) {
        var deferred = q.defer();

        model.widgetModel
            .findAllWidgetsForInfographic(infographicId)
            .then(function (widgets) {
                for(var w in widgets) {
                    model.widgetModel
                        .deleteWidget(widgets[w]._id)
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

    function removeWidget(widget) {
        var deferred = q.defer();
        findInfographicById(widget[0]._infographic)
            .then(function(infographic) {
                infographic[0].widgets.pull(widget[0]);
                infographic[0].save();
                deferred.resolve();
            },function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
};