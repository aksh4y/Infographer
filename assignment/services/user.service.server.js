/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app, userModel) {
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserByUserId);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user", createUser);

    /*var users = [
     {_id: "123", username: "alice",    password: "alice", email: "alice@wonder.com",    firstName: "Alice",  lastName: "Wonder"  },
     {_id: "234", username: "bob",      password: "bob", email: "bob@marley.com",      firstName: "Bob",    lastName: "Marley"  },
     {_id: "345", username: "charly",   password: "charly", email: "charly@garcia.com",   firstName: "Charly", lastName: "Garcia"  },
     {_id: "456", username: "jannunzi", password: "jannunzi", email: "jose@annunzi.com", firstName: "Jose",   lastName: "Annunzi" }
     ];*/

    function findUserByUserId(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function (user) {
                res.json(user);
            }, function (err) {
                res.sendStatus(404).send(err);
            });
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if (username && password) {
            findUserByCredentials(req, res);
        }
        else if (username) {
            findUserByUsername(req, res);
        }
        else {
            return res.sendStatus(400);
        }
    }

    function findUserByCredentials(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        userModel
            .findUserByCredentials(username, password)
            .then(function (response) {
                if (response.length != 0) {
                    res.json(response[0]);
                }
                else {
                    res.sendStatus(404);
                }
            }, function () {
                res.sendStatus(404);
            });
    }

    function findUserByUsername(req, res) {
        var username = req.query['username'];
        userModel
            .findUserByUsername(username)
            .then(function (users) {
                if (users.length != 0) {
                    res.json(users[0]);
                }
                else {
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(function () {
                res.sendStatus(200);
            },function () {
                res.sendStatus(404);
            });
    }

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(function (user) {
                    res.json(user);
                },
                function () {
                    res.sendStatus(500);
                });


        /*newUser._id = (new Date()).getTime() + "";
         users.push(newUser);
         return res.json(newUser);*/
    }

    function updateUser(req, res) {
        var userId = req.params['userId'];
        userModel
            .findUserById(userId)
            .then(function (response) {
                var newUser = req.body;
                userModel
                    .updateUser(userId, newUser)
                    .then(function (response) {
                        res.sendStatus(200);
                    }, function () {
                        res.sendStatus(500);
                    });
            }, function () {
                res.sendStatus(404);
            });
    }
};