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
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;


    function createWidget(pageId, newWidget) {
        var d = q.defer();
        newWidget._page = pageId;
        widgetModel
            .create(newWidget, function (err, w) {
                if (err) {
                    d.reject(err);
                } else {
                    model.pageModel
                        .findPageById(pageId)
                        .then(function (page) {
                            page[0].widgets.push(w._id);
                            page[0].save();
                            d.resolve(w);
                        }, function (err) {
                            d.reject(err);
                        });
                }
            });
        return d.promise;
    }

    /*function findAllWidgetsForPage(pageId){
        var d = q.defer();
        var widgets = [];
        /!*widgetModel
            .find({"_page": pageId}, function (err, widgets) {
                if (err) {
                    d.reject(err);
                } else {
                    console.log(widgets);
                    d.resolve(widgets);
                }
            });*!/
        model.pageModel
            .findPageById(pageId)
            .then(function(page) {
                console.log(page[0].widgets);
                for(var w in page[0].widgets) {
                    console.log(page[0].widgets[w]);
                    widgetModel
                        .findById(page[0].widgets[w])
                        .then(function (wgt) {
                            //console.log(wgt);
                            widgets.push(wgt);
                        }, function (err) {
                            d.reject(err);
                        });
                }
               // console.log("widgets: "+widgets);
                d.resolve(widgets);
            }, function(err) {
                d.reject(err);
            });
        return d.promise;
    }*/
    function findAllWidgetsForPage(pageId){
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                //console.log(page);
                var widgetsOfPage = page[0].widgets;
                var numberOfWidgets = widgetsOfPage.length;
                var widgetCollectionForPage = [];

                return getWidgetsRecursively(numberOfWidgets, widgetsOfPage, widgetCollectionForPage);
            }, function (error) {
                return error;
            });
    }

    function getWidgetsRecursively(count, widgetsOfPage, widgetCollectionForPage) {
        if(count == 0){
            return widgetCollectionForPage;
        }

        return widgetModel.findById(widgetsOfPage.shift()).select('-__v')
            .then(function (widget) {
                widgetCollectionForPage.push(widget);
                return getWidgetsRecursively(--count, widgetsOfPage, widgetCollectionForPage);
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
            .findById(widgetId).populate('_page')
            .then(function (widget) {
                widget._page.widgets.splice(widget._page.widgets.indexOf(widgetId),1);
                widget._page.save();
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

    function reorderWidget(pageId, start, end) {
        var d = q.defer();
        model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page[0].widgets.splice(end, 0, page[0].widgets.splice(start, 1)[0]);
                page[0].save();
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