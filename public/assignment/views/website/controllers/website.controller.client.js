/**
 * Created by Akshay on 2/15/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("WebsiteNewController", WebsiteNewController)
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                });

        }
        init();
    }

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.createWebsite = createWebsite;

        function init() {
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function(response) {
                    vm.websites = response;
                });
        }
        init();

        function createWebsite (website) {
            if (website == null            ||
                website.name == ""        ||
                website.name == null      ||
                website.description == "" ||
                website.description == null) {
                    vm.error = "Please fill all details";
                    return;
            }

            var newWebsite = {
                name: website.name,
                description: website.description,
                developerId: vm.userId,
                created: new Date()
            };
            WebsiteService
                .createWebsite(vm.userId, newWebsite)
                .success(function () {
                    $location.url("/user/" + vm.userId + "/website");
                })
                .error(function () {
                    vm.error = "An error has occurred.";
                });
        }
    }

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        function init() {
            WebsiteService
                .findWebsiteById(vm.websiteId)
                .success(function (response) {
                    vm.website = response;
                })
                .error(function () {
                    vm.error("An error has occurred!");
                });
            WebsiteService
                .findAllWebsitesForUser(vm.userId)
                .success(function (response) {
                    vm.websites = response;
                });

        }
        init();

        function updateWebsite (websiteId, website) {
            WebsiteService
                .updateWebsite(websiteId, website)
                .success(function () {
                    vm.message = "Website successfully updated";
                    WebsiteService
                        .findAllWebsitesForUser(vm.userId)
                        .success(function (response) {
                            vm.websites = response;
                        });
                })
                .error(function () {
                    vm.error = "Unable to update website";
                });
        }

        function deleteWebsite () {
            WebsiteService
                .deleteWebsite(vm.websiteId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website");
                })
                .error(function () {
                    vm.error = "Unable to delete website";
                });
        }
    }
})();