/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function () {
    var model;
    var mongoose = require("mongoose");
    var q = require('q');

    var componentSchema = require('./component.schema.server')();
    var componentModel = mongoose.model('componentModel', componentSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createComponent": createComponent,
        "findAllComponentsForInfographic": findAllComponentsForInfographic,
        "findComponentById": findComponentById,
        "updateComponent": updateComponent,
        "deleteComponent": deleteComponent,
        "reorderComponent": reorderComponent,
        "setModel": setModel
    };

    return api;


    function createComponent(infographicId, newComponent) {
        var d = q.defer();
        newComponent._infographic = infographicId;
        componentModel
            .create(newComponent, function (err, c) {
                if (err) {
                    d.reject(err);
                } else {
                    model.infographicModel
                        .findInfographicById(infographicId)
                        .then(function (infographic) {
                            infographic[0].components.push(c._id);
                            infographic[0].save();
                            d.resolve(c);
                        }, function (err) {
                            d.reject(err);
                        });
                }
            });
        return d.promise;
    }

    function findAllComponentsForInfographic(infographicId){
        return model.infographicModel
            .findInfographicById(infographicId)
            .then(function (infographic) {
                //console.log(infographic);
                var componentsOfInfographic = infographic[0].components;
                var numberOfComponents = componentsOfInfographic.length;
                var componentCollectionForInfographic = [];

                return getComponentsRecursively(numberOfComponents, componentsOfInfographic, componentCollectionForInfographic);
            }, function (error) {
                return error;
            });
    }

    function getComponentsRecursively(count, componentsOfInfographic, componentCollectionForInfographic) {
        if(count == 0){
            return componentCollectionForInfographic;
        }

        return componentModel.findById(componentsOfInfographic.shift()).select('-__v')
            .then(function (component) {
                componentCollectionForInfographic.push(component);
                return getComponentsRecursively(--count, componentsOfInfographic, componentCollectionForInfographic);
            }, function (error) {
                return error;
            });
    }

    function findComponentById(componentId){
        var d = q.defer();
        componentModel
            .findById(componentId)
            .then(function(component) {
                d.resolve(component);
            }, function(err) {
                d.reject(err);
            });
        return d.promise;
    }

    function updateComponent(componentId, updatedComponent){
        var d = q.defer();
        componentModel
            .findOneAndUpdate({_id: componentId}, {$set: updatedComponent}, function (err, updatedComponent) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedComponent);
                }
            });
        return d.promise;
    }
    function deleteComponent(componentId){
        var d = q.defer();
        componentModel
            .findById(componentId).populate('_infographic')
            .then(function (component) {
                component._infographic.components.splice(component._infographic.components.indexOf(componentId),1);
                component._infographic.save();
                if(component.type == "IMAGE"){
                    deleteUploadedImage(component.url);
                }
                componentModel
                    .remove({_id:componentId})
                    .then(function() {
                        d.resolve();
                    }, function (err) {
                        d.reject(err);
                    });
        }, function (err) {
            d.reject(err);
        });
        return d.promise;
    }

    function deleteUploadedImage(imageUrl) {
        // Local helper function
        if(imageUrl && imageUrl.search('http') == -1){
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
            });
        }
    }

    function reorderComponent(infographicId, start, end) {
        var d = q.defer();
        model.infographicModel
            .findInfographicById(infographicId)
            .then(function (infographic) {
                infographic[0].components.splice(end, 0, infographic[0].components.splice(start, 1)[0]);
                infographic[0].save();
                //d.resolve();
                return 200;
            }, function (err) {
                d.reject(err);
            });
        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }
};