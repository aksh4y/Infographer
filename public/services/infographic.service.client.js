/**
 * Created by Akshay on 4/14/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("InfographicService", InfographicService);

    function InfographicService($http) {

        var api = {
            "createInfographic": createInfographic,
            "findInfographicById": findInfographicById,
            "deleteInfographic": deleteInfographic,
            "updateInfographic": updateInfographic,
            "findAllInfographicsForUser": findAllInfographicsForUser
        };
        return api;


        function findInfographicById(infographId) {
            return $http.get("/api/viewer/" + infographId);
        }


        function createInfographic(userId) {
            return $http.post("/api/creator/"+userId);
        }


        function deleteInfographic(infographicId) {
            return $http.delete("/api/infographic/" + infographicId);
        }

        function updateInfographic(infographicId, infographic) {
            console.log("In service client");
            return $http.put("/api/infographic/" + infographicId, infographic);
        }

        function findAllInfographicsForUser(userId) {
            return $http.get("/api/infographic/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();
