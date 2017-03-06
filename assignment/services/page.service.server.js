/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app) {
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findAllPagesForWebsite);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    var pages = [
        { "_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem", created: new Date() },
        { "_id": "432", "name": "Post 2", "websiteId": "456", "description": "Lorem", created: new Date() },
        { "_id": "543", "name": "Post 3", "websiteId": "678", "description": "Lorem", created: new Date() }
    ];

    function findPageById(req, res) {
        var pageId = req.params['pageId'];
        for(var p in pages) {
            var page = pages[p];
            if( page._id === pageId ) {
                res.send(page);
                return;
            }
        }
        res.sendStatus(404).send({});
    }

    function findAllPagesForWebsite(req, res){
        var websiteId = req.params['websiteId'];
        var website_pages = pages.filter(function (page) {
            return page.websiteId === websiteId;
        });
        res.json(website_pages);
    }


    function deletePage(req, res) {
        var pageId = req.params.pageId;
        for (var p in pages) {
            var page = pages[p];
            if (page._id === pageId) {
                pages.splice(p, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }


    function createPage(req, res) {
        var newPage= req.body;
        newPage._id = (new Date()).getTime()+ "";
        pages.push(newPage);
        res.json(newPage);
    }

    function updatePage(req, res) {
        var pageId = req.params['pageId'];
        for (var p in pages) {
            var page = pages[p];
            if (page._id === pageId) {
                var newPage = req.body;
                pages[p].name = newPage.name;
                pages[p].description= newPage.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
};