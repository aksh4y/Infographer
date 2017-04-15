/**
 * Created by Akshay on 2/26/2017.
 */

module.exports = function (app, infographicModel) {
    /*app.post("/api/user/:userId/infographic", createInfographic);

    app.get("/api/infographic/:infographicId", findInfographicById);
    app.put("/api/infographic/:websiteId", updateInfographic);
    app.delete("/api/infographic/:websiteId", deleteInfographic);*/

    app.get("/api/infographic/:userId", findAllInfographicsForUser);


    /*var websites = [
        { "_id": "123", "name": "Facebook", "developerId": "456", "description": "Lorem", created: new Date()} ,
        { "_id": "234", "name": "Twitter",  "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "678", "name": "Checkers", "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "789", "name": "Chess", "developerId": "234", "description": "Lorem", created: new Date() }
    ];*/

    /*function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        websiteModel
            .findWebsiteById(websiteId)
            .then(function (website) {
                res.json(website);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }*/

    function findAllInfographicsForUser(req, res){
        console.log("reached service");
        var userId = req.params['userId'];
        console.log("got the userid:"+userId);
        infographicModel
            .findAllInfographicsForUser(userId)
            .then(function (infographics) {
                res.json(infographics);
            }, function(err) {
                console.log("dammit");
                res.sendStatus(404).send(err);
            });
    }


   /* function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        websiteModel
            .deleteWebsite(websiteId)
            .then(function () {
                res.sendStatus(200);
            },function () {
                res.sendStatus(404);
            });
    }

    function createWebsite(req, res) {
        var userId = req.params.userId;
        var newWebsite = req.body;
        websiteModel
            .createWebsiteForUser(userId, newWebsite)
            .then(function (website) {
                    res.json(website);
                },
                function () {
                    res.sendStatus(500);
                });
    }

    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        websiteModel
            .findWebsiteById(websiteId)
            .then(function (response) {
                var newWebsite = req.body;
                websiteModel
                    .updateWebsite(websiteId, newWebsite)
                    .then(function (response) {
                            res.json(response);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }*/
};