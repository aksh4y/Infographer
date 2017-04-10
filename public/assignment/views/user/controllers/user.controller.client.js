/**
 * Created by Akshay on 2/15/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController(UserService, $location) {
        var vm = this;
        vm.login = login;

        function login(user) {
            if (user == null          ||
                user.username == ""   ||
                user.password == null ||
                user.password == ""){
                    vm.error = "Please enter your credentials!";
                    return;
            }
            var promise = UserService.findUserByCredentials(user.username, user.password);
            promise.success(function (user) {
                    $location.url('/user/' + user._id);
            });
            promise.error(function (user) {
                vm.error = 'Username and/or password incorrect!';
            });
        }
    }

    function ProfileController($routeParams, UserService, $location) {
        var vm = this;
        var userId = $routeParams['uid'];

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function(user) {
                vm.user = user;
            });
        }
        init();

        vm.update = function (newUser) {
                UserService
                    .updateUser(userId, newUser)
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
        };
    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = function register(user) {
            if (user == null          ||
                user.username == null ||
                user.password == null ||
                user.username == ""   ||
                user.password == ""   ||
                user.email == null    ||
                user.email == ""      ||
                user.phone == null    ||
                user.phone == ""){
                    vm.error = "Please enter all your details!";
                    return;
            }
            if (user.password != user.verifypassword) {
                vm.error = "Password mismatch";
                return;
            }

            UserService.findUserByUsername(user.username)
                .success(function (user) {
                    vm.error = "Username " + user.username + " already in use.";
                })
                .error(function(err) {
                    var newUser = {
                        username: user.username,
                        password: user.password,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone
                    };
                    UserService.createUser(newUser)
                        .success(function(user) {
                            $location.url("/user/"+user._id);
                        })
                        .error(function() {
                            vm.error = "Could not register";
                        });

                });

        }
    }
})();