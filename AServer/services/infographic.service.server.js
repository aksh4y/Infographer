/**
 * Created by Akshay on 2/26/2017.
 */

module.exports = function (app, infographicModel) {

    var multer = require('multer'); // npm install multer --save
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    var fs = require('fs');

    app.put("/api/infographic/:inid", updateInfographic);
    app.delete("/api/infographic/:inid", deleteInfographic);
    app.get("/api/infographic/:userId", findAllInfographicsForUser);
    app.get("/api/viewer/:inid", findInfographicById);
    app.post("/api/creator/:userId", createInfographic);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);


    function uploadImage(req, res) {
        var infographicId      = req.body.inid;
        var myFile        = req.file;

        if(myFile) {
            infographicModel
                .findInfographicById(infographicId)
                .then(function(infographic) {
                    console.log("found infograph");
                    infographic.url = req.protocol + '://' + req.get('host') + "/uploads/" + myFile.filename;
                   /* res.redirect("/assignment/#/user/" + uid + "/website/" + websiteId + "/page/"
                        + imageWidget._page + "/widget");*/
                   console.log(infographic.url);
                    infographicModel
                        .updateInfographic(infographicId, infographic)
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


    function findInfographicById(req, res) {
        var infographId = req.params['inid'];
        infographicModel
            .findInfographicById(infographId)
            .then(function (infograph) {
                res.json(infograph);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findAllInfographicsForUser(req, res){
        var userId = req.params['userId'];
        infographicModel
            .findAllInfographicsForUser(userId)
            .then(function (infographics) {
                res.json(infographics);
            }, function(err) {
                res.sendStatus(404).send(err);
            });
    }

    function createInfographic(req, res) {
        var userId = req.params.userId;
        infographicModel
            .createInfographicForUser(userId)
            .then(function (infographic) {
                    res.json(infographic);
                },
                function () {
                    res.sendStatus(500);
                });
    }

    function deleteInfographic(req, res) {
        var infographicId = req.params.inid;
        infographicModel
            .deleteInfographic(infographicId)
            .then(function () {
                res.sendStatus(200);
            },function () {
                res.sendStatus(404);
            });
    }



   function updateInfographic(req, res) {
       var infographicId = req.params['inid'];
       infographicModel
            .findInfographicById(infographicId)
            .then(function (response) {
                var newInfographic = req.body;
                infographicModel
                    .updateInfographic(infographicId, newInfographic)
                    .then(function (response) {
                            res.json(response);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }
};