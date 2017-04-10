(function () {
    angular.module('passportApp', [])
        .controller('loginController', loginController);

    function loginController($http) {
        var model = this;
        model.login = function(user) {
            $http.post('/api/login', user)
                .then(function (response) {
                    model.message = "Welcome";
                }, function(err) {
                    model.error = err;
                })
        }
    }
})();