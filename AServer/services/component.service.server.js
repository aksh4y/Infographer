/**
 * Created by Akshay on 4/17/2017.
 */
/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app, componentModel) {
    app.post("/api/infographic/:inid/component", createComponent);
    app.get("/api/infographic/:inid/component", findAllComponentsForInfographic);
    app.get("/api/component/:cid", findComponentById);
    app.put("/api/component/:cid", updateComponent);
    app.delete("/api/component/:cid", deleteComponent);
    app.put("/infographic/:inid/component", updateComponentIndex);

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');

    app.post ("/api/upload", upload.single('myFile'), uploadImage);
    

    function sortComponents(json_object, key_to_sort_by) {
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
        var componentId      = req.body.componentId;
        var width         = req.body.width;
        var myFile        = req.file;

        if(myFile) {
            var originalname = myFile.originalname; // file name on user's computer
            var filename = myFile.filename;     // new file name in upload folder
            var path = myFile.path;         // full path of uploaded file
            var destination = myFile.destination;  // folder where file is saved to
            var size = myFile.size;
            var mimetype = myFile.mimetype;
            componentModel
                .findComponentById(componentId)
                .then(function(imageComponent) {
                    imageComponent.width = width;
                    imageComponent.url = req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename;
                    res.redirect("/AServer/#/user/" + uid + "/infographic/" + websiteId + "/infographic/"
                        + imageComponent._infographic + "/component");
                    componentModel
                        .updateComponent(componentId, imageComponent)
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

    function updateComponentIndex(req, res) {
        var infographicId = req.params.infographicId;
        var initialIndex = parseInt(req.query.initial);
        var finalIndex = parseInt(req.query.final);

        componentModel
            .reorderComponent(infographicId, initialIndex, finalIndex)
            .then(function (response) {
                res.sendStatus(response);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    /*function updateComponentIndex(req, res) {
     var infographicId = req.params.infographicId;
     var initialIndex = parseInt(req.query.initial);
     var finalIndex = parseInt(req.query.final);
     componentModel
     .findAllComponentsForInfographic(infographicId)
     .then(function(infographic_components) {
     var fromComponent = infographic_components.find(function (component) {
     return component.index == initialIndex;
     });

     var toComponent = infographic_components.find(function (component) {
     return component.index == finalIndex;
     });

     componentModel
     .reorderComponent(infographicId, fromComponent.index, finalIndex);
     //fromComponent.index = finalIndex;

     if(initialIndex < finalIndex){
     infographic_components.filter(function (component) {
     return component.index > initialIndex && component.index < finalIndex;
     }).map(function (w) {
     componentModel
     .reorderComponent(infographicId, w.index, w.index--);
     //w.index -= 1;
     });
     componentModel
     .reorderComponent(infographicId, toComponent.index, toComponent.index--);
     //toComponent.index -=1;
     }
     else {
     infographic_components.filter(function (component) {
     return component.index < initialIndex && component.index > finalIndex;
     }).map(function (w) {
     componentModel
     .reorderComponent(infographicId, w.index, w.index++);
     //w.index += 1;
     });
     componentModel
     .reorderComponent(infographicId, toComponent.index, toComponent.index++);
     //toComponent.index +=1;
     res.sendStatus(200);
     }
     }, function (err) {
     res.sendStatus(404);
     });

     res.sendStatus(200);
     }*/

    function findComponentById(req, res) {
        var componentId = req.params['componentId'];
        componentModel
            .findComponentById(componentId)
            .then(function (component) {
                res.json(component);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findAllComponentsForInfographic(req, res){
        var infographicId = req.params['infographicId'];
        componentModel
            .findAllComponentsForInfographic(infographicId)
            .then(function (components) {
                sortComponents(components, 'index');  //Sort the components based on index
                res.json(components);
            }, function(err) {
                res.sendStatus(404).send(err);
            });
    }


    function deleteComponent(req, res) {
        var componentId = req.params.componentId;
        var infographicId = req.params.infographicId;
        componentModel
            .findComponentById(componentId)
            .then(function(component) {
                if(component.type == "IMAGE") {  //delete image
                    var fileName = component.url.split('//').pop().split("/").pop();
                    if(fileName) {
                        var path = __dirname + '/../../public/uploads/' + fileName;
                        if (fs.existsSync(path)) {  //delete if uploaded file
                            fs.unlinkSync(path);
                        }
                    }
                }
                var delIndex = component.index;
                componentModel
                    .deleteComponent(componentId)
                    .then(function () {
                        res.sendStatus(200);

                        /*componentModel
                         .findAllComponentsForInfographic(infographicId)
                         .then(function(allComponents) {
                         for (var wig in allComponents) {
                         if (allComponents[wig].index > delIndex)
                         componentModel
                         .updateComponent(allComponents[wig]._id, allComponents[wig].index--);
                         }
                         }, function(err) {
                         res.sendStatus(err);
                         });*/

                    }, function(err) {
                        res.sendStatus(err);
                    });

                res.sendStatus(200);
            });
        /*for (var w in components) {
         var component = components[w];
         if (component._id === componentId) {
         if(component.componentType == "IMAGE") {  //delete image
         var fileName = component.url.split('//').pop().split("/").pop();
         if(fileName) {
         var path = __dirname + '/../../public/uploads/' + fileName;
         if (fs.existsSync(path)) {  //delete if uploaded file
         fs.unlinkSync(path);
         }
         }
         }
         var delIndex = component.index;
         components.splice(w, 1);
         for (var wig in components) {
         if (components[wig].index > delIndex)
         components[wig].index--;
         }
         res.sendStatus(200);
         return;
         }
         }*/

    }


    function createComponent(req, res) {
        var newComponent= req.body;
        var infographicId = req.params.infographicId;
        componentModel
            .createComponent(infographicId, newComponent)
            .then(function (component) {
                res.json(component);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateComponent(req, res) {
        var componentId = req.params['componentId'];

        componentModel
            .findComponentById(componentId)
            .then(function(component) {
                var newComponent = req.body;
                switch(newComponent.type){
                    case "HEADING":
                    case "YOUTUBE":
                    case "HTML":
                    case "TEXT":
                        componentModel
                            .updateComponent(componentId, newComponent)
                            .then(function(w){
                                res.json(w);
                            }, function(err) {
                                res.send(err);
                            });
                        break;
                    case "IMAGE":
                        var fileName = component.url.split('//').pop().split("/").pop();
                        if(fileName) {
                            var path = __dirname + '/../../public/uploads/' + fileName;
                            if (fs.existsSync(path)) {  //delete if uploaded file
                                fs.unlinkSync(path);
                            }
                        }
                        componentModel
                            .updateComponent(componentId, newComponent)
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
         for (var w in components) {
         var component = components[w];
         if (component._id === componentId) {
         var newComponent = req.body;
         switch(newComponent.componentType){
         case "HEADING":
         components[w].text = newComponent.text;
         components[w].size = newComponent.size;
         break;
         case "YOUTUBE":
         case "IMAGE":
         var fileName = component.url.split('//').pop().split("/").pop();
         if(fileName) {
         var path = __dirname + '/../../public/uploads/' + fileName;
         if (fs.existsSync(path)) {  //delete if uploaded file
         fs.unlinkSync(path);
         }
         }
         components[w].url = newComponent.url;
         components[w].width = newComponent.width;
         break;
         case "HTML":
         components[w].text = newComponent.text;
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