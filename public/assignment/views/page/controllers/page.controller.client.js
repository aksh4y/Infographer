/**
 * Created by Akshay on 2/15/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("PageNewController", PageNewController)
        .controller("PageEditController", PageEditController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;

        function init() {
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                })
        }
        init();
    }

    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.createPage = createPage;

        function init() {
            PageService
                .findAllPagesForWebsite(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                });
        }
        init();

        function createPage (page) {
            if (page == null             ||
                page.name == null        ||
                page.name == ""          ||
                page.description == null ||
                page.description == ""   ||
                page.title == null        ||
                page.title == "") {
                    vm.error = "Please fill all details";
                    return;
            }

            var newPage = {
                name: page.name,
                title: page.title,
                description: page.description
            };
            PageService
                .createPage(vm.websiteId, newPage)
                .success(function() {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = "An error has occurred.";
                });
        }
    }

    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.deletePage = deletePage;
        vm.updatePage = updatePage;

        function init() {
            PageService
                .findPageById(vm.pageId)
                .success(function (response) {
                    vm.page = response[0];
                });
            PageService.findAllPagesForWebsite(vm.websiteId)
                .success(function (response) {
                    vm.pages = response;
                });
        }
        init();

        function updatePage (pageId, page) {
            PageService
                .updatePage(pageId, page)
                .success(function () {
                    vm.message = "Page successfully updated";
                    PageService.findAllPagesForWebsite(vm.websiteId)
                        .success(function (response) {
                            vm.pages = response;
                        });
                })
                .error(function () {
                    vm.error = "Unable to update page";
                });
         }
        function deletePage () {
            PageService
                .deletePage(vm.pageId)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
                })
                .error(function () {
                    vm.error = "An error has occurred";
                });
        }
    }
})();