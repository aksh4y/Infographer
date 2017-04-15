/**
 * Created by Akshay on 4/15/2017.
 */

/**
 * Created by Akshay on 4/14/2017.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("InfographViewController", InfographViewController);

    function InfographViewController(currentUser, $routeParams, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.infographId = $routeParams.inid;

        function init() {
            InfographicService
                .findInfographicById(vm.infographId)
                .success(function (response) {
                    console.log(response);
                    vm.infographic = response[0];
                })
                .error(function () {
                    vm.error("An error has occurred!");
                });
        }
        init();
    }
})();