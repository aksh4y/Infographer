(function () {
    angular
        .module("Infographer", ['ngRoute'])
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';


        $routeProvider
            .when("/", {
                templateUrl: 'views/infograph/templates/welcome.html'
            })
            .when("/login", {
                templateUrl: 'views/user/templates/login.view.client.html'
            })
            .when("/login-local", {
                templateUrl: 'views/user/templates/login-local.view.client.html',
                controller: 'LoginController',
                controllerAs: 'model'
            })
            .when("/register", {
                templateUrl: 'views/user/templates/register.view.client.html'
            })
            .when("/register-local", {
                templateUrl: 'views/user/templates/register-local.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when("/recover", {
                templateUrl: 'views/user/templates/forgot-password.view.client.html',
                controller: 'RegisterController',
                controllerAs: 'model'
            })
            .when('/profile', {
                templateUrl: 'views/user/templates/profile.view.client.html',
                controller: 'ProfileController',
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/dashboard", {
                templateUrl: 'views/user/templates/dashboard.view.client.html',
                controller: "DashboardController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/admin", {
                templateUrl: 'views/admin/templates/admin.view.html',
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkAdmin
                }
            })
            .when("/test", {
                templateUrl: 'views/components/templates/editors/test-editor.html'
            })
            .when("/viewer/:inid", {
                templateUrl: 'views/infograph/templates/infograph-viewer.view.client.html',
                controller: "InfographViewController",
                controllerAs: "model"
            })
            .when("/creator", {
                templateUrl: 'views/infograph/templates/infograph-edit.view.client.html',
                controller: "InfographNewController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/editor/:inid", {
                templateUrl: 'views/infograph/templates/infograph-edit.view.client.html',
                controller: "InfographEditController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkLogin
                }
            })
            .when("/editor/:inid/addtxt", {
                templateUrl: 'views/components/templates/editors/text-new.view.client.html',
                controller: "ComponentNewController",
                controllerAs: 'model',
                resolve: {
                    currentUser: checkLogin
                }
            })
            .otherwise({
                redirectTo: "/"
            });
    }

        function checkAdmin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .isAdmin()
                .then(function (user) {
                    console.log(user);
                    if(user != '0' && user.role.indexOf('ADMIN') > -1) {
                        deferred.resolve(user);
                    } else {
                        $location.url('/profile');
                        deferred.reject();
                    }
                });
            return deferred.promise;
        }

        function checkLogin($q, UserService, $location) {
            var deferred = $q.defer();
            UserService
                .loggedIn()
                .then(function (user) {
                    if(user != '0') {
                        deferred.resolve(user);
                    } else {
                        $location.url('/login');
                        deferred.reject();
                    }
                });
            return deferred.promise;
        }
})();