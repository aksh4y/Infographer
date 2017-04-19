/**
 * Created by Akshay on 4/18/2017.
 */

(function(){
    angular
        .module("Infographer")
        .controller("ComponentListController", ComponentListController)
        .controller("ComponentNewController", ComponentNewController)
        .controller("ComponentEditController", ComponentEditController)
        .controller("ImageTabsController", ImageTabsController);



    function ImageTabsController ($scope, $window) {
        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
        ];
    }


    function ComponentListController($routeParams, ComponentService, $sce) {
        var vm = this;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getComponentTemplateUrl = getComponentTemplateUrl;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        function init(){
            ComponentService
                .findAllComponentsForPage(vm.pageId)
                .success(function (response) {
                    vm.components = response;
                });
        }
        init();

        function getComponentTemplateUrl(componentType) {
            var url = 'views/component/templates/component-' + componentType + '.view.client.html';
            return url;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(componentUrl) {
            var urlParts = componentUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function ComponentEditController($routeParams, FlickrService, ComponentService,$location) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.componentId = $routeParams.wgid;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.updateComponent = updateComponent;
        vm.deleteComponent = deleteComponent;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        //vm.selectPhoto  = selectPhoto;
        function init() {
            ComponentService
                .findComponentById(vm.componentId)
                .success(function(response) {
                    console.log("component controller found component to edit:"+response);
                    vm.component=response;
                })
                .error(function(){
                    vm.error = "An error occured";
                });
        }
        init();
        //console.log(vm.component);

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
            ComponentService
                .findComponentById(vm.componentId)
                .then(function (response) {
                    var updatedComponent = response.data;
                    updatedComponent.url = url;
                    updatedComponent.width = width;
                    ComponentService
                        .updateComponent(vm.componentId, updatedComponent)
                        .then(function (response) {
                            var updatedComponentObject = response;
                            if(updatedComponentObject){
                                $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component");
                            }
                        }, function (err) {
                            vm.error = "Update error!";
                        });
                }, function (err) {
                    vm.error = "Component not found!";
                });
        }
        function getEditorTemplateUrl(type) {
            return 'views/component/templates/editors/component-' + type + '-editor.view.client.html';
        }

        function deleteComponent () {
            ComponentService
                .deleteComponent(vm.componentId)
                .success(function(){
                    $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component");
                })
                .error(function () {
                    vm.error = "Unable to delete infographic";
                });

        }

        function updateComponent(_component) {
            ComponentService
                .updateComponent(vm.componentId, _component)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component");
                })
                .error(function () {
                    vm.error = "Unable to update component";
                });
        }
    }

    function ComponentNewController($routeParams, ComponentService, $location) {
        var vm = this;
        vm.infographicId = $routeParams.inid;
        vm.newComponent = true;
       /* vm.createHeadingComponent = createHeadingComponent;
        vm.createMediaComponent = createMediaComponent;
        vm.createHTMLComponent = createHTMLComponent;*/
        vm.createTextComponent = createTextComponent;
        /*vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function createMediaComponent(type) {
            var newComponent = {
                type: type,
                _page: vm.pageId,
                url: "http://",
                width: "100%",
                height: "100%"
            };
            ComponentService
                .createComponent(vm.infographicId, newComponent)
                .success(function (component) {
                    $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component/"+component._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }

        function createHeadingComponent() {
            var newComponent = {
                type: 'HEADING',
                _page: vm.pageId,
                text: "New Heading",
                size: 1
            };
            ComponentService
                .createComponent(vm.pageId, newComponent)
                .success(function (component) {
                    $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component/"+component._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }

        function createHTMLComponent() {
            var newComponent = {
                type: 'HTML',
                _page: vm.pageId,
                text: "<p>New Paragraph</p>"
            };
            ComponentService
                .createComponent(vm.pageId, newComponent)
                .success(function (component) {
                    $location.url("/user/"+vm.userId+"/infographic/"+vm.websiteId+"/page/"+vm.pageId+"/component/"+component._id+"?new=yes");
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }*/


        function createTextComponent() {

            var txtType = ($( "#textOptions option:selected").text());
            var font = "";
            var type = "";
            var txt = "";
            var heading = "";
            var top = "50%";
            var left = "50%";
            switch (txtType) {
                case 'Heading':
                    type = 'TEXT';
                    font = 'Times New Roman';
                    txt = $('#text1').text();
                    break;
                case 'Text':
                    type = 'TEXT';
                    font = 'Amatic SC';
                    txt = $('#text2').text();
                    break;
                case 'Jumbotron':
                    type = 'JUMBO';
                    heading = $('#jHeader').text();
                    txt = $('#jTxt').text();
                    break;
                case 'Anchor':
                    type = 'ANCHOR';
                    heading = $('#aLegend').text();
                    txt = $('#addTxt').text();
                    break;
            }

            var newComponent = {
                type: type,
                font: font,
                text: txt,
                heading: heading,
                top: top,
                left: left};
            console.log(newComponent);
            console.log($('#aLegend').val());
            ComponentService
                .createComponent(vm.infographicId, newComponent)
                .success(function (component) {
                    $location.url("/editor/"+vm.infographicId);
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }

        function getEditorTemplateUrl(type) {
            return 'views/component/templates/creators/component-' + type + '-editor.view.client.html';
        }
    }
})();