/**
 * Created by Akshay on 4/14/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("InfographicService", InfographicService);

    function InfographicService($http) {

        console.log("inside client side service");

        var api = {
            /*"createWebsite": createWebsite,
            "findWebsiteById": findWebsiteById,
            "findAllWebsitesForUser": findAllWebsitesForUser,
            "deleteWebsite": deleteWebsite,
            "updateWebsite": updateWebsite*/
            "findAllInfographicsForUser": findAllInfographicsForUser
        };
        return api;

        /*function findAllWebsitesForUser(userId) {
            return $http.get("/api/user/" + userId + "/infographic");
        }

        function findWebsiteById(websiteId) {
            return $http.get("/api/infographic/" + websiteId);
        }
        function deleteWebsite(websiteId) {
            return $http.delete("/api/infographic/" + websiteId);
        }

        function createWebsite(userId, website) {
            return $http.post("/api/user/" + userId + "/infographic", website);
        }

        function updateWebsite(websiteId, website) {
            return $http.put("/api/infographic/" + websiteId, website);
        }*/
        function findAllInfographicsForUser(userId) {
            return $http.get("/api/infographic/" + userId)
                .then(function (response) {
                    return response.data;
                });
        }
    }
})();
