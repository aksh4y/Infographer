/**
 * Created by Akshay on 2/26/2017.
 */

module.exports = function (app) {
    app.post("/api/user/:userId/website", createWebsite);
    app.get("/api/user/:userId/website", findAllWebsitesForUser);
    app.get("/api/website/:websiteId", findWebsiteById);
    app.put("/api/website/:websiteId", updateWebsite);
    app.delete("/api/website/:websiteId", deleteWebsite);

    var websites = [
        { "_id": "123", "name": "Facebook", "developerId": "456", "description": "Lorem", created: new Date()} ,
        { "_id": "234", "name": "Twitter",  "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "456", "name": "Gizmodo", "developerId": "456", "description": "Lorem", created: new Date() },
        { "_id": "567", "name": "Tic Tac Toe", "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "678", "name": "Checkers", "developerId": "123", "description": "Lorem", created: new Date() },
        { "_id": "789", "name": "Chess", "developerId": "234", "description": "Lorem", created: new Date() }
    ];

    function findWebsiteById(req, res) {
        var websiteId = req.params['websiteId'];
        for(var w in websites) {
            var website = websites[w];
            if( website._id === websiteId ) {
                res.json(website);
                return;
            }
        }
        res.sendStatus(404).send({});
    }

    function findAllWebsitesForUser(req, res){
        var userId = req.params['userId'];
        var user_websites = websites.filter(function (website) {
            return website.developerId === userId;
        });
        res.json(user_websites);
    }


    function deleteWebsite(req, res) {
        var websiteId = req.params.websiteId;
        for (var w in websites) {
            var website = websites[w];
            if (website._id === websiteId) {
                websites.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }


    function createWebsite(req, res) {
        var newWebsite = req.body;
        newWebsite._id = (new Date()).getTime()+ "";
        websites.push(newWebsite);
        res.json(newWebsite);
    }

    function updateWebsite(req, res) {
        var websiteId = req.params['websiteId'];
        for (var w in websites) {
            var website = websites[w];
            if (website._id === websiteId) {
                var newWebsite = req.body;
                websites[w].name = newWebsite.name;
                websites[w].description= newWebsite.description;
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
};