/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app, widgetModel) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.put("/page/:pageId/widget", updateWidgetIndex);

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');

    app.post ("/api/upload", upload.single('myFile'), uploadImage);

    /*var widgets = [
        { "_id": "123", "index": 0 , "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
        { "_id": "234", "index": 1 , "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "345", "index": 2 , "widgetType": "IMAGE", "pageId": "321", "width": "100%",
            "url": "https://images.unsplash.com/photo-1469573054742-64da3f2527fc?" +
            "dpr=1.25&auto=format&fit=crop&w=1500&h=1199&q=80&cs=tinysrgb&crop="},
        { "_id": "456", "index": 3 , "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum para</p>"},
        { "_id": "567", "index": 4 , "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
        { "_id": "678", "index": 5 , "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
            "url": "https://youtu.be/7HBux5Ke13M" },
        { "_id": "789", "index": 6 , "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
    ];*/

    function sortWidgets(json_object, key_to_sort_by) {
        function sortByKey(a, b) {
            var x = a[key_to_sort_by];
            var y = b[key_to_sort_by];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        json_object.sort(sortByKey);
    }

    function uploadImage(req, res) {

        var uid           = req.body.uid;
        var websiteId     = req.body.wid;
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var myFile        = req.file;

        if(myFile) {
            var originalname = myFile.originalname; // file name on user's computer
            var filename = myFile.filename;     // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            widgetModel
                .findWidgetById(widgetId)
                .then(function(imageWidget) {
                    imageWidget.width = width;
                    imageWidget.url = req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename;
                    res.redirect("/assignment/#/user/" + uid + "/website/" + websiteId + "/page/"
                        + imageWidget._page + "/widget");
                    widgetModel
                        .updateWidget(widgetId, imageWidget)
                        .then(function() {
                            res.sendStatus(200);
                        }, function() {
                            res.sendStatus(404);
                        });
                }, function() {
                    res.sendStatus(404);
                });
            return;
        }
        res.sendStatus(404);
    }

    function updateWidgetIndex(req, res) {
        var pageId = req.params.pageId;
        var initialIndex = parseInt(req.query.initial);
        var finalIndex = parseInt(req.query.final);

        widgetModel
            .reorderWidget(pageId, initialIndex, finalIndex)
            .then(function (response) {
                res.sendStatus(response);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    /*function updateWidgetIndex(req, res) {
        var pageId = req.params.pageId;
        var initialIndex = parseInt(req.query.initial);
        var finalIndex = parseInt(req.query.final);
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function(page_widgets) {
                var fromWidget = page_widgets.find(function (widget) {
                    return widget.index == initialIndex;
                });

                var toWidget = page_widgets.find(function (widget) {
                    return widget.index == finalIndex;
                });

                widgetModel
                    .reorderWidget(pageId, fromWidget.index, finalIndex);
                //fromWidget.index = finalIndex;

                if(initialIndex < finalIndex){
                    page_widgets.filter(function (widget) {
                        return widget.index > initialIndex && widget.index < finalIndex;
                    }).map(function (w) {
                        widgetModel
                            .reorderWidget(pageId, w.index, w.index--);
                        //w.index -= 1;
                    });
                    widgetModel
                        .reorderWidget(pageId, toWidget.index, toWidget.index--);
                    //toWidget.index -=1;
                }
                else {
                    page_widgets.filter(function (widget) {
                        return widget.index < initialIndex && widget.index > finalIndex;
                    }).map(function (w) {
                        widgetModel
                            .reorderWidget(pageId, w.index, w.index++);
                        //w.index += 1;
                    });
                    widgetModel
                        .reorderWidget(pageId, toWidget.index, toWidget.index++);
                    //toWidget.index +=1;
                    res.sendStatus(200);
                }
            }, function (err) {
                res.sendStatus(404);
            });

        res.sendStatus(200);
    }*/

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];
        widgetModel
            .findWidgetById(widgetId)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findAllWidgetsForPage(req, res){
        var pageId = req.params['pageId'];
        widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                sortWidgets(widgets, 'index');  //Sort the widgets based on index
                res.json(widgets);
            }, function(err) {
                res.sendStatus(404).send(err);
            });
    }


    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        var pageId = req.params.pageId;
        widgetModel
            .findWidgetById(widgetId)
            .then(function(widget) {
                if(widget.type == "IMAGE") {  //delete image
                    var fileName = widget.url.split('//').pop().split("/").pop();
                    if(fileName) {
                        var path = __dirname + '/../../public/uploads/' + fileName;
                        if (fs.existsSync(path)) {  //delete if uploaded file
                            fs.unlinkSync(path);
                        }
                    }
                }
                var delIndex = widget.index;
                widgetModel
                    .deleteWidget(widgetId)
                    .then(function () {
                        res.sendStatus(200);

                        /*widgetModel
                            .findAllWidgetsForPage(pageId)
                            .then(function(allWidgets) {
                                for (var wig in allWidgets) {
                                    if (allWidgets[wig].index > delIndex)
                                        widgetModel
                                            .updateWidget(allWidgets[wig]._id, allWidgets[wig].index--);
                                }
                            }, function(err) {
                                res.sendStatus(err);
                            });*/

                    }, function(err) {
                        res.sendStatus(err);
                    });

                res.sendStatus(200);
            });
        /*for (var w in widgets) {
            var widget = widgets[w];
            if (widget._id === widgetId) {
                if(widget.widgetType == "IMAGE") {  //delete image
                    var fileName = widget.url.split('//').pop().split("/").pop();
                    if(fileName) {
                        var path = __dirname + '/../../public/uploads/' + fileName;
                        if (fs.existsSync(path)) {  //delete if uploaded file
                            fs.unlinkSync(path);
                        }
                    }
                }
                var delIndex = widget.index;
                widgets.splice(w, 1);
                for (var wig in widgets) {
                    if (widgets[wig].index > delIndex)
                        widgets[wig].index--;
                }
                res.sendStatus(200);
                return;
            }
        }*/

    }


    function createWidget(req, res) {
        var newWidget= req.body;
        var pageId = req.params.pageId;
        /*var newIndex = 0;
       widgetModel
            .findAllWidgetsForPage(pageId)
            .then(function (widgets) {
                newIndex = widgets.filter(function (widget) {
                    return widget._page === newWidget._page;
                }).length;
                console.log("index = "+newIndex);
                newWidget.index = newIndex;
            }, function(err) {
               res.sendStatus(404);
            });*/
        widgetModel
            .createWidget(pageId, newWidget)
            .then(function (widget) {
                res.json(widget);
            }, function (err) {
                res.sendStatus(404);
            });
        // get new index for new widget. Adding as last widget
        /*
        widgets.push(newWidget);
        res.json(newWidget);*/
    }

    function updateWidget(req, res) {
        var widgetId = req.params['widgetId'];

        widgetModel
            .findWidgetById(widgetId)
            .then(function(widget) {
                var newWidget = req.body;
                switch(newWidget.type){
                    case "HEADING":
                    case "YOUTUBE":
                    case "HTML":
                    case "TEXT":
                        widgetModel
                            .updateWidget(widgetId, newWidget)
                            .then(function(w){
                                res.json(w);
                            }, function(err) {
                                res.send(err);
                            });
                        break;
                    case "IMAGE":
                        var fileName = widget.url.split('//').pop().split("/").pop();
                        if(fileName) {
                            var path = __dirname + '/../../public/uploads/' + fileName;
                            if (fs.existsSync(path)) {  //delete if uploaded file
                                fs.unlinkSync(path);
                            }
                        }
                        widgetModel
                            .updateWidget(widgetId, newWidget)
                            .then(function(w){
                                res.json(w);
                            }, function(err) {
                                res.sendStatus(404);
                            });
                        break;
                    default:
                        return res.sendStatus(404);
                }
            }, function(err) {
                res.sendStatus(404);
            });

/*
        for (var w in widgets) {
            var widget = widgets[w];
            if (widget._id === widgetId) {
                var newWidget = req.body;
                switch(newWidget.widgetType){
                    case "HEADING":
                        widgets[w].text = newWidget.text;
                        widgets[w].size = newWidget.size;
                        break;
                    case "YOUTUBE":
                    case "IMAGE":
                        var fileName = widget.url.split('//').pop().split("/").pop();
                        if(fileName) {
                            var path = __dirname + '/../../public/uploads/' + fileName;
                            if (fs.existsSync(path)) {  //delete if uploaded file
                                fs.unlinkSync(path);
                            }
                        }
                        widgets[w].url = newWidget.url;
                        widgets[w].width = newWidget.width;
                        break;
                    case "HTML":
                        widgets[w].text = newWidget.text;
                        break;
                    default:
                        return res.sendStatus(404);
                }
                res.sendStatus(200);
                return;
            }
        }*/
    }
};