/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app, userModel) {
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserByUserId);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);
    app.post("/api/user", createUser);

    var users = [
        {_id: "123", username: "alice",    password: "alice", email: "alice@wonder.com",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob", email: "bob@marley.com",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly", email: "charly@garcia.com",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", email: "jose@annunzi.com", firstName: "Jose",   lastName: "Annunzi" }
    ];

    function findUserByUserId(req, res) {
        var userId = req.params['userId'];
        for(var u in users) {
            var user = users[u];
            if( user._id === userId ) {
                return res.json(user);
            }
        }
        return res.sendStatus(404);
    }

    function findUser(req, res) {
        var username = req.query['username'];
        var password = req.query['password'];
        if(username && password) {
            findUserByCredentials(req,res);
        }
        else if (username) {
            findUserByUsername(req,res);
        }
        else {
            return res.sendStatus(400);
        }
    }

    function findUserByCredentials(req, res){
        var username = req.query['username'];
        var password = req.query['password'];
        var user = users.find(function(u){
            return u.username == username && u.password == password;
        });
        if(user) {
            return res.json(user);
        }
        else {
            return res.sendStatus(503);
        }
    }

    function findUserByUsername(req, res){
        var username = req.query['username'];
        var user = users.find(function(u){
            return u.username == username;
        });
        if(user) {
            return res.json(user);
        }
        else {
            return res.sendStatus(503);
        }
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        for (var u in users) {
            var user = users[u];
            if (user._id === userId) {
                users.splice(u, 1);
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(404);
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
        for (var u in users) {
            var user = users[u];
            if (user._id === userId) {
                var newUser = req.body;
                users[u].firstName = newUser.firstName;
                users[u].lastName = newUser.lastName;
                users[u].email = newUser.email;
                return res.sendStatus(200);
            }
        }
        return res.sendStatus(404);
    }
};