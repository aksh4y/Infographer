/**
 * Created by Akshay on 4/15/2017.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("InfographNewController", InfographNewController)
        .controller("InfographEditController", InfographEditController)
        .controller("InfographViewController", InfographViewController);

    function InfographViewController(currentUser, UserService, $routeParams, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.infographId = $routeParams.inid;
        vm.logout = logout;
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

        function logout() {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        }
    }

    function InfographNewController(currentUser, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        function init() {
            InfographicService
                .createInfographic(vm.user._id)
                .success(function(i) {
                    $location.url("/editor/"+i._id);
                })
                .error(function () {
                    vm.error = "An error has occurred.";
                });
        }
        init();
    }

    function InfographEditController(currentUser, $routeParams, UserService, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.infographId = $routeParams.inid;
        vm.updateInfograph = updateInfograph;
        vm.deleteInfograph = deleteInfograph;
        vm.logout = logout;
        vm.infographic = {};
        function init() {
            InfographicService
                .findInfographicById(vm.infographId)
                .success(function (response) {
                    console.log(response);
                    vm.infographic = response[0];
                    $('#page-content-wrapper').css('background-image', 'url(' + vm.infographic.background_url + ')');
                    $('#page-content-wrapper').css('background-color', vm.infographic.background_color);
                })
                .error(function () {
                    vm.error("An error has occurred!");
                });


        }
        init();

        function deleteInfograph() {
            InfographicService
                .deleteInfographic(vm.infographId)
                .success(function () {
                    $location.url("/dashboard");
                })
                .error(function () {
                    vm.error = "An error has occurred";
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        };

        function updateInfograph (infograph) {

            var infoTitle = $('#infoTitle').text();
            if(infoTitle == null ||
            infoTitle == "") {
                vm.error = "Please do not leave infographic name blank";
                $('#infoTitle').text("Enter Infographic Title");
                return;
            }
            var background_Url = $('#page-content-wrapper').css('background-image');
            background_Url = background_Url.replace('url(','').replace(')','').replace(/\"/gi, "");
            var background_color = $('#page-content-wrapper').css('background-color');
            var newInfograph = {
             name: infoTitle,
             background_color: background_color,
             background_url: background_Url
             };
             InfographicService
             .updateInfographic(vm.infographId, newInfograph)
             .success(function(i) {
             //$location.url("/creator/"+vm.userId+"/infographic/"+vm.websiteId+"/page");
                 vm.message = "Successfully saved!";
             })
             .error(function () {
             vm.error = "An error has occurred.";
             });
        }
    }

})();