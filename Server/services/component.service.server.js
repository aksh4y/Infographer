/**
 * Created by Akshay on 4/17/2017.
 */
/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app, componentModel) {
    app.post("/api/infographic/:inid/component", createComponent);
    app.get("/api/infographic/:inid/components", findAllComponentsForInfographic);
    app.get("/api/component/:cid", findComponentById);
    app.put("/api/component/:cid", updateComponent);
    app.delete("/api/component/:cid", deleteComponent);

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');

    app.post ("/api/upload", upload.single('myFile'), uploadImage);


    function uploadImage(req, res) {
        var infographId   = req.body.inid;
        var width         = req.body.width;
        var height        = req.body.height;
        var myFile        = req.file;

        if(myFile) {

            var newComponent = {
                _infograph: infographId,
                type: "IMAGE",
                width: width,
                height: height,
                url: req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename
            };

            componentModel
                .createComponent(infographId, newComponent)
                .then(function (response) {
                    res.redirect("/#/editor/" + infographId);
                }, function (err) {
                    res.sendStatus(404);
                });
            return;
        }
        res.sendStatus(404);
    }

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
        var infographicId = req.params['inid'];
        componentModel
            .findAllComponentsForInfographic(infographicId)
            .then(function (components) {
                res.json(components);
            }, function(err) {
                res.sendStatus(404).send(err);
            });
    }


    function deleteComponent(req, res) {
        var componentId = req.params.cid;
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
                componentModel
                    .deleteComponent(componentId)
                    .then(function () {
                        res.sendStatus(200);

                        componentModel
                            .findAllComponentsForInfographic(infographicId)
                            .then(function(allComponents) {
                                for (var cmp in allComponents) {
                                    if (allComponents[cmp].index > delIndex)
                                        componentModel
                                            .updateComponent(allComponents[cmp]._id, allComponents[cmp].index--);
                                }
                            }, function(err) {
                                res.sendStatus(err);
                            });

                    }, function(err) {
                        res.sendStatus(err);
                    });

                res.sendStatus(200);
            });
    }


    function createComponent(req, res) {
        var newComponent= req.body;
        var infographicId = req.params.inid;
        componentModel
            .createComponent(infographicId, newComponent)
            .then(function (component) {
                res.json(component);
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateComponent(req, res) {
        var componentId = req.params['cid'];
        componentModel
            .findComponentById(componentId)
            .then(function(component) {
                var newComponent = req.body;
                componentModel
                    .updateComponent(componentId, newComponent)
                    .then(function(w){
                        res.json(w);
                    }, function(err) {
                        res.send(err);
                    });
            }, function(err) {
                res.sendStatus(404);
            });
    }
};