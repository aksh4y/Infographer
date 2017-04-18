/**
 * Created by Akshay on 4/14/2017.
 */

(function() {
    angular
        .module("Infographer")
        .controller("DashboardController", DashboardController);


    function DashboardController(currentUser, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;

        function init(){
            InfographicService
                .findAllInfographicsForUser(vm.user._id)
                .then(function (response) {
                    vm.infographics = response;
                });
        }
        init();
        /*
        vm.logout = function() {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        };


        vm.update = function (newUser) {
            console.log("controller update");
            UserService
                .updateUser(newUser)
                .success(function () {
                    vm.message = "User successfully updated"
                })
                .error(function() {
                    vm.error = "Unable to update user";
                })

        };

        vm.delete = function (userId) {
            var answer = confirm("Are you sure?");
            if(answer) {
                UserService
                    .deleteUser(userId)
                    .success(function() {
                        $location.url("/login");
                    })
                    .error(function() {
                        vm.error = "Some error occurred.";
                    });
            }
        };*/
    }
})();