/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app) {
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

    var widgets = [
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
    ];

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
            var imageWidget = widgets.find(function (widget) {
                return widget._id == widgetId;
            });
            imageWidget.width = width;
            imageWidget.url = req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename;
            res.redirect("/assignment/#/user/" + uid + "/website/" + websiteId + "/page/"
                + imageWidget.pageId + "/widget");
            return;
        }
        res.sendStatus(404);
    }

    function updateWidgetIndex(req, res) {
        var pageId = req.params.pageId;
        var initialIndex = parseInt(req.query.initial);
        var finalIndex = parseInt(req.query.final);
        var page_widgets = widgets.filter(function (widget) {
            return widget.pageId === pageId;
        });

        var fromWidget = page_widgets.find(function (widget) {
            return widget.index == initialIndex;
        });

        var toWidget = page_widgets.find(function (widget) {
            return widget.index == finalIndex;
        });

        fromWidget.index = finalIndex;

        if(initialIndex < finalIndex){
            page_widgets.filter(function (widget) {
                return widget.index > initialIndex && widget.index < finalIndex;
            }).map(function (w) {
                w.index -= 1;
            });
            toWidget.index -=1;
        }
        else {
            page_widgets.filter(function (widget) {
                return widget.index < initialIndex && widget.index > finalIndex;
            }).map(function (w) {
                w.index += 1;
            });
            toWidget.index +=1;
        }
        res.sendStatus(200);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                res.json(widget);
                return;
            }
        }
        return res.sendStatus(404);
    }

    function findAllWidgetsForPage(req, res){
        sortWidgets(widgets, 'index');  //Sort the widgets based on index
        var pageId = req.params['pageId'];
        var page_widgets = widgets.filter(function (widget) {
            return widget.pageId === pageId;
        });
        res.json(page_widgets);
    }


    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for (var w in widgets) {
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
        }
        res.sendStatus(404);
    }


    function createWidget(req, res) {
        var newWidget= req.body;
        newWidget._id = (new Date()).getTime()+ "";
        // get new index for new widget. Adding as last widget
        var newIndex = widgets.filter(function (widget) {
            return widget.pageId === newWidget.pageId;
        }).length;
        newWidget.index = newIndex;
        widgets.push(newWidget);
        res.json(newWidget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params['widgetId'];
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
        }
        res.sendStatus(404);
    }
};