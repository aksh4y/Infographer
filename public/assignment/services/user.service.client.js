(function(){
    angular
        .module("WebAppMaker")
        .factory('UserService', UserService);
    
    function UserService($http) {

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser

        };
        return api;

        function createUser(user) {
            return $http.post("/api/user", user);
        }

        function updateUser(userId, user) {
            return $http.put("/api/user/"+userId, user);
        }

        function findUserById(uid) {

            return $http.get("/api/user/"+ uid);
        }

        function findUserByUsername(username) {
            return $http.get("/api/user?username="+username);

        }

        function findUserByCredentials(username, password) {
           return $http.get("/api/user?username="+username+"&password="+password);

        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }
    }
})();