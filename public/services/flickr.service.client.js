(function () {
    angular
        .module("Infographer")
        .factory("FlickrService",FlickrService);

    function FlickrService($http) {
        var key = "9e8968ef3deb5fbd39e2245e9b0482ab";
        var secret = "fc1e0d03f6af734c";
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