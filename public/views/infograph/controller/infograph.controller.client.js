/**
 * Created by Akshay on 4/15/2017.
 */

(function() {
    angular
        .module("Infographer")
        .controller("InfographNewController", InfographNewController)
        .controller("InfographEditController", InfographEditController)
        .controller("InfographViewController", InfographViewController);

    function InfographViewController(ComponentService, UserService, $routeParams, InfographicService, $location) {
        var vm = this;
        vm.infographId = $routeParams.inid;
        vm.user = "no";
        vm.logout = logout;
        function init() {
            InfographicService
                .findInfographicById(vm.infographId)
                .success(function (response) {
                    vm.infographic = response[0];
                    UserService
                        .loggedIn()
                        .then(function (user) {
                            if(user != '0') {
                                vm.user = "yes";
                            } else {
                               vm.user = "no";
                            }
                        });
                    $('#page-content-wrapper').css('background-image', 'url(' + vm.infographic.background_url + ')');
                    $('#page-content-wrapper').css('background-color', vm.infographic.background_color);
                    ComponentService
                        .findAllComponentsForInfographic(vm.infographId)
                        .success(function (response) {
                            vm.components = response;
                        });
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

    function InfographEditController
    (currentUser, $routeParams, ComponentService, FlickrService, UserService, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.infographId = $routeParams.inid;
        vm.updateInfograph = updateInfograph;
        vm.deleteInfograph = deleteInfograph;
        vm.createTextComponent = createTextComponent;
        vm.createShapeComponent = createShapeComponent;
        vm.createImageComponent = createImageComponent;
        vm.deleteComponent = deleteComponent;
        vm.logout = logout;
        vm.searchPhotos = searchPhotos;
        vm.selectPhoto = selectPhoto;
        vm.infographic = {};
        function init() {
            InfographicService
                .findInfographicById(vm.infographId)
                .success(function (response) {
                    vm.infographic = response[0];
                    $('#page-content-wrapper').css('background-image', 'url(' + vm.infographic.background_url + ')');
                    $('#page-content-wrapper').css('background-color', vm.infographic.background_color);

                    ComponentService
                        .findAllComponentsForInfographic(vm.infographId)
                        .success(function (response) {
                            vm.components = response;
                        });
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
                    $location.url('/dashboard');
                })
                .error(function () {
                    console.log("error");
                    vm.error = "An error has occurred";
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function (reponse) {
                    $location.url('/login');
                });
        }

        function updateInfograph () {
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
                    updateComponents();
                    updateComponentsPositions();
                    vm.message = "Successfully saved!";
                })
                .error(function () {
                    vm.error = "An error has occurred.";
                });
        }

        /* Components */

        // Delete component
        function deleteComponent(id) {
                ComponentService
                    .deleteComponent(id)
                    .success(function(){
                        location.reload();
                    })
                    .error(function () {
                        vm.error = "Unable to delete component";
                    });
        }

        // Save the current positions of the components
        function updateComponentsPositions() {

            for (var c in vm.components) {
                var d = $(document.getElementById(vm.components[c]._id));
                var newPos = {
                    left: d.css('left'),
                    top: d.css('top')
                };
                ComponentService
                    .updateComponent(vm.components[c]._id, newPos)
                    .success(function() {
                    })
                    .error(function(err) {
                        vm.error = "Something went wrong!";
                    });
            }
        }

        // Update all components
        function  updateComponents() {
            var txt = "";
            var heading = "";
            for(var c in vm.components) {
                switch (vm.components[c].type) {
                    case 'TEXT':
                        txt = $(document.getElementById(vm.components[c]._id +'div')).text();
                        break;
                    case 'JUMBO':
                        heading = $(document.getElementById(vm.components[c]._id +'jHeader')).text();
                        txt = $(document.getElementById(vm.components[c]._id +'jTxt')).text();
                        break;
                    case 'ANCHOR':
                        heading = $(document.getElementById(vm.components[c]._id +'aLegend')).text();
                        txt = $(document.getElementById(vm.components[c]._id +'aTxt')).text();
                        break;
                }
                var updatedComponent = {
                    text: txt,
                    heading: heading
                };
                ComponentService
                    .updateComponent(vm.components[c]._id, updatedComponent)
                    .success(function(){
                        return;
                    })
                    .error(function () {
                        vm.error = "Unable to update component";
                    });
            }
        }

        function createImageComponent(_component) {
            _component.type = "IMAGE";
            ComponentService
                .createComponent(vm.infographId, _component)
                .success(function () {
                    location.reload();
                })
                .error(function () {
                    vm.error = "Unable to create component";
                });
        }

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
                    txt = $('#aTxt').text();
                    break;
            }

            var newComponent = {
                type: type,
                font: font,
                text: txt,
                heading: heading,
                top: top,
                left: left};
            updateInfograph();
            ComponentService
                .createComponent(vm.infographId, newComponent)
                .success(function (component) {
                    location.reload();
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }

        function createShapeComponent(ele) {

            var newComponent = {
                type: "SHAPE",
                font: ele
            };
            updateInfograph();
            ComponentService
                .createComponent(vm.infographId, newComponent)
                .success(function (component) {
                    location.reload();
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }

        /* Flickr Services */
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

        function selectPhoto(photo, width, height) {
            var url = "https://farm" + photo.farm + ".staticflickr.com/" + photo.server;
            url += "/" + photo.id + "_" + photo.secret + "_b.jpg";
            var component = {
                type: "IMAGE",
                url: url,
                width: width,
                height: height
            };
            ComponentService
                .createComponent(vm.infographId, component)
                .then(function (response) {
                        location.reload();
                }, function (err) {
                    vm.error = "Creation error";
                });
        }
    }

})();