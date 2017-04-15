(function () {
    angular
        .module("WebAppMaker")
        .factory("FlickrService",FlickrService);

    function FlickrService($http) {
        var key = "8645dfaa21e09bd18389e2668cddf223";
        var secret = "c33d5a37988e56e5";
        var urlBase = "https://api.flickr.com/services/rest/?method=flickr.photos.search&format=json&api_key=API_KEY&text=TEXT&per_page=16";

        var api = {
            "searchPhotos": searchPhotos
        };
        return api;

        function searchPhotos(searchTerm) {
            var url = urlBase.replace("API_KEY", key).replace("TEXT", searchTerm);
            return $http.get(url);
        }
    }
})();