(function() {
    angular
        .module("Infographer")
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
        }
    }
})();