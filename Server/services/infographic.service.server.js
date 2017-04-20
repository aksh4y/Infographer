/**
 * Created by Akshay on 2/26/2017.
 */

module.exports = function (app, infographicModel) {

    app.put("/api/infographic/:inid", updateInfographic);
    app.delete("/api/infographic/:inid", deleteInfographic);
    app.get("/api/infographics/:userId", findAllInfographicsForUser);
    app.get("/api/infographic/:inid", findInfographicById);
    app.post("/api/creator/:userId", createInfographic);


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