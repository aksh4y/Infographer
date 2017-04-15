(function () {
    angular
        .module("WebAppMaker", ['ngRoute'])
        .config(configuration);

    function configuration($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';


        $routeProvider
            .when("/", {
                templateUrl: 'views/creator/templates/welcome.html'
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
            .when("/user/:uid/creator", {
                templateUrl: 'views/creator/templates/creator.new.client.html',
                controller: "InfographicNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/creator/:inid", {
                templateUrl: 'views/creator/templates/creator.edit.view.client.html',
                controller: "InfographicEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/creator/:inid/view", {
                templateUrl: 'views/creator/templates/creator.view.client.html',
                controller: "InfographicViewController",    // Like list controller
                controllerAs: "model"
            })
            /*.when("/user/:uid/creator/:inid/widget",{
             templateUrl: 'views/widget/templates/widget-list.view.client.html',
             controller: "WidgetListController",
             controllerAs: "model"
             })*/
            .when("/user/:uid/creator/:inid/widget/new", {
                templateUrl: 'views/widget/templates/widget-chooser.view.client.html',
                controller: "WidgetNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/creator/:inid/widget/:wgid", {
                templateUrl: 'views/widget/templates/widget-edit.view.client.html'
                , controller: "WidgetEditController",
                controllerAs: "model"
            })
            // Remove later
            .when("/creator", {
                templateUrl: 'views/creator/templates/creator.edit.view.client.html'
            })
            .otherwise({
                redirectTo: "/"
            });
    }

        function checkAdmin($q, userService, $location) {
            var deferred = $q.defer();
            userService
                .isAdmin()
                .then(function (user) {
                    console.log(user);
                    if(user != '0' && user.roles.indexOf('ADMIN') > -1) {
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
                    console.log(user);
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