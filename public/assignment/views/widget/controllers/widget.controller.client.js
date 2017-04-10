(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("WidgetNewController", WidgetNewController)
        .controller("WidgetEditController", WidgetEditController)
        .controller("ImageTabsController", ImageTabsController);



    function ImageTabsController ($scope, $window) {
        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
        ];
    }


    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        function init(){
            WidgetService
                .findAllWidgetsForPage(vm.pageId)
                .success(function (response) {
                    vm.widgets = response;
                });
        }
        init();

        function getWidgetTemplateUrl(widgetType) {
            var url = 'views/widget/templates/widget-' + widgetType + '.view.client.html';
            return url;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function WidgetEditController($routeParams, FlickrService, WidgetService,$location) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        //vm.selectPhoto  = selectPhoto;
        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function(response) {
                    console.log("widget controller found widget to edit:"+response);
                    vm.widget=response;
                })
                .error(function(){
                    vm.error = "An error occured";
                });
        }
        init();
        //console.log(vm.widget);

        function searchPhotos(searchTerm) {
            FlickrService
             .searchPhotos(searchTerm)
             .then(function(response) {
             data = response.data.replace("jsonFlickrApi(","");
             data = data.substring(0,data.length - 1);
             data = JSON.parse(data);
             vm.photos = data.photos;
             });
        }

        function selectPhoto(photo, width) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            WidgetService
                .findWidgetById(vm.widgetId)
                .then(function (response) {
                    var updatedWidget = response.data;
                    updatedWidget.url = url;
                    updatedWidget.width = width;
                    WidgetService
                        .updateWidget(vm.widgetId, updatedWidget)
                        .then(function (response) {
                            var updatedWidgetObject = response;
                            if(updatedWidgetObject){
                                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                            }
                        }, function (err) {
                            vm.error = "Update error!";
                        });
                }, function (err) {
                    vm.error = "Widget not found!";
                });
        }
        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/editors/widget-' + type + '-editor.view.client.html';
        }

        function deleteWidget () {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function(){
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Unable to delete website";
                });

        }

        function updateWidget(_widget) {
            WidgetService
                .updateWidget(vm.widgetId, _widget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Unable to update widget";
                });
        }
    }

    function WidgetNewController($routeParams, WidgetService, $location) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.newWidget = true;
        vm.createHeadingWidget = createHeadingWidget;
        vm.createMediaWidget = createMediaWidget;
        vm.createHTMLWidget = createHTMLWidget;
        vm.createTextWidget = createTextWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function createMediaWidget(type) {
            var newWidget = {
                type: type,
                _page: vm.pageId,
                url: "http://",
                width: "100%",
                height: "100%"
            };
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create widget";
                });
        }

        function createHeadingWidget() {
            var newWidget = {
                type: 'HEADING',
                _page: vm.pageId,
                text: "New Heading",
                size: 1
            };
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id+"?new=yes");
                })
                .error(function () {
                   vm.error = "Could not create widget";
                });
        }

        function createHTMLWidget() {
            var newWidget = {
                type: 'HTML',
                _page: vm.pageId,
                text: "<p>New Paragraph</p>"
            };
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create widget";
                });
        }

        function createTextWidget() {
            var newWidget = {
                type: 'TEXT',
                _page: vm.pageId,
                text: "Text",
                rows: 2,
                placeholder: "Enter text",
                formatted: false};
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create widget";
                });
        }

        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/creators/widget-' + type + '-editor.view.client.html';
        }
    }
})();