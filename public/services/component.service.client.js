/**
 * Created by Akshay on 4/17/2017.
 */
(function () {
    angular
        .module("Infographer")
        .service("ComponentService", ComponentService);

    function ComponentService($http) {
        var api = {
            "createComponent": createComponent,
            "findAllComponentsForInfographic": findAllComponentsForInfographic,
            "findComponentById": findComponentById,
            "updateComponent": updateComponent,
            "deleteComponent": deleteComponent,
            "updateOrderForComponent": updateOrderForComponent
        };

        return api;

        function findAllComponentsForInfographic(infographicId) {
            return $http.get("/api/infographic/" + infographicId + "/components");
        }

        function deleteComponent(componentId) {
            return $http.delete("/api/component/" + componentId);
        }

        function createComponent(infographicId, component) {
            return $http.post("/api/infographic/" + infographicId + "/component", component);
        }

        function updateComponent(componentId, component) {
            return $http.put("/api/component/" + componentId, component);
        }

        function findComponentById(componentId) {
            return $http.get("/api/component/" + componentId);
        }

        function updateOrderForComponent(infographicId, initialIndex, finalIndex) {
            return $http.put("/infographic/" + infographicId + "/component?initial=" + initialIndex + "&final=" + finalIndex);
        }
    }
})();