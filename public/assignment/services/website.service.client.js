(function() {
    angular
        .module("WebAppMaker")
        .factory("WebsiteService", WebsiteService);
    
    function WebsiteService($http) {

        var api = {
            "createWebsite": createWebsite,
            "findWebsiteById": findWebsiteById,
            "findAllWebsitesForUser": findAllWebsitesForUser,
            "deleteWebsite": deleteWebsite,
            "updateWebsite": updateWebsite
        };
        return api;

        function findAllWebsitesForUser(userId) {
            return $http.get("/api/user/" + userId + "/website");
        }

        function findWebsiteById(websiteId) {
            return $http.get("/api/website/" + websiteId);
        }
        function deleteWebsite(websiteId) {
            return $http.delete("/api/website/" + websiteId);
        }

        function createWebsite(userId, website) {
            return $http.post("/api/user/" + userId + "/website", website);
        }

        function updateWebsite(websiteId, website) {
            return $http.put("/api/website/" + websiteId, website);
        }
    }
})();