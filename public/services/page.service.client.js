/**
 * Created by Akshay on 2/14/2017.
 */
(function () {
    angular
        .module("Infographer")
        .factory("PageService", PageService);

    function PageService($http) {

        var api = {
            "createPage": createPage,
            "findAllPagesForWebsite": findAllPagesForWebsite,
            "findPageById": findPageById,
            "deletePage": deletePage,
            "updatePage": updatePage
        };
        return api;

        function findAllPagesForWebsite(websiteId) {
            return $http.get("/api/infographic/" + websiteId + "/page");
        }


        function findPageById(pageId) {
            return $http.get("/api/page/" + pageId);
        }
        function deletePage(pageId) {
            return $http.delete("/api/page/" + pageId);
        }

        function createPage(websiteId, page) {
            return $http.post("/api/infographic/" + websiteId + "/page", page);
        }

        function updatePage(pageId, page) {
            return $http.put("/api/page/"+pageId, page);
        }
    }
})();