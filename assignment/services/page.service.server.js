/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app, pageModel) {
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    /*var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem", created: new Date() },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem", created: new Date() },
        { "_id": "543", "name": "Post 3", "websiteId": "678", "description": "Lorem", created: new Date() }
    ];*/

    function findPageById(req, res) {
        var pageId = req.params['pageId'];
        pageModel
            .findPageById(pageId)
            .then(function (page) {
                res.json(page);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findAllPagesForWebsite(req, res){
        var websiteId = req.params['websiteId'];
        pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                res.json(pages);
            }, function(err) {
                res.sendStatus(404).send(err);
            });
    }


    function deletePage(req, res) {
        var pageId = req.params.pageId;
        pageModel
            .deletePage(pageId)
            .then(function () {
                res.sendStatus(200);
            },function () {
                res.sendStatus(404);
            });
    }

    function createPage(req, res) {
        var websiteId = req.params['websiteId'];
        var newPage= req.body;
        pageModel
            .createPage(websiteId, newPage)
            .then(function (page) {
                    res.json(page);
                },
                function () {
                    res.sendStatus(500);
                });
    }

    function updatePage(req, res) {
        var pageId = req.params['pageId'];
        pageModel
            .findPageById(pageId)
            .then(function (response) {
                var newPage = req.body;
                pageModel
                    .updatePage(pageId, newPage)
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