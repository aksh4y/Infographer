/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function () {
    var model;
    var mongoose = require("mongoose");
    var q = require('q');

    var widgetSchema = require('./widget.schema.server')();
    var widgetModel = mongoose.model('widgetModel', widgetSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForInfographic":findAllWidgetsForInfographic,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;


    function createWidget(infographicId, newWidget) {
        var d = q.defer();
        newWidget._infographic = infographicId;
        widgetModel
            .create(newWidget, function (err, w) {
                if (err) {
                    d.reject(err);
                } else {
                    model.infographicModel
                        .findInfographicById(infographicId)
                        .then(function (infographic) {
                            infographic[0].widgets.push(w._id);
                            infographic[0].save();
                            d.resolve(w);
                        }, function (err) {
                            d.reject(err);
                        });
                }
            });
        return d.promise;
    }

    function findAllWidgetsForInfographic(infographicId){
        return model.infographicModel
            .findInfographicById(infographicId)
            .then(function (infographic) {
                //console.log(infographic);
                var widgetsOfInfographic = infographic[0].widgets;
                var numberOfWidgets = widgetsOfInfographic.length;
                var widgetCollectionForInfographic = [];

                return getWidgetsRecursively(numberOfWidgets, widgetsOfInfographic, widgetCollectionForInfographic);
            }, function (error) {
                return error;
            });
    }

    function getWidgetsRecursively(count, widgetsOfInfographic, widgetCollectionForInfographic) {
        if(count == 0){
            return widgetCollectionForInfographic;
        }

        return widgetModel.findById(widgetsOfInfographic.shift()).select('-__v')
            .then(function (widget) {
                widgetCollectionForInfographic.push(widget);
                return getWidgetsRecursively(--count, widgetsOfInfographic, widgetCollectionForInfographic);
            }, function (error) {
                return error;
            });
    }

    function findWidgetById(widgetId){
        var d = q.defer();
        widgetModel
            .findById(widgetId)
            .then(function(widget) {
                d.resolve(widget);
            }, function(err) {
                d.reject(err);
            });
        return d.promise;
    }

    function updateWidget(widgetId, updatedWidget){
        var d = q.defer();
        widgetModel
            .findOneAndUpdate({_id: widgetId}, {$set: updatedWidget}, function (err, updatedWidget) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedWidget);
                }
            });
        return d.promise;
    }
    function deleteWidget(widgetId){
        var d = q.defer();
        widgetModel
            .findById(widgetId).populate('_infographic')
            .then(function (widget) {
                widget._infographic.widgets.splice(widget._infographic.widgets.indexOf(widgetId),1);
                widget._infographic.save();
                if(widget.type == "IMAGE"){
                    deleteUploadedImage(widget.url);
                }
                widgetModel
                    .remove({_id:widgetId})
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

    function reorderWidget(infographicId, start, end) {
        var d = q.defer();
        model.infographicModel
            .findInfographicById(infographicId)
            .then(function (infographic) {
                infographic[0].widgets.splice(end, 0, infographic[0].widgets.splice(start, 1)[0]);
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