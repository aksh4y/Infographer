/**
 * Created by Akshay on 4/15/2017.
 */

(function() {
    angular
        .module("Infographer")
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

    function InfographEditController
    (currentUser, $routeParams, ComponentService, UserService, InfographicService, $location) {
        var vm = this;
        vm.user = currentUser;
        vm.infographId = $routeParams.inid;
        vm.updateInfograph = updateInfograph;
        vm.deleteInfograph = deleteInfograph;
        vm.createTextComponent = createTextComponent;
        vm.createShapeComponent = createShapeComponent;
        vm.logout = logout;
        vm.deleteComponent = deleteComponent;
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
                    updateComponents();
                    updateComponentsPositions();


                    vm.message = "Successfully saved!";
                })
                .error(function () {
                    vm.error = "An error has occurred.";
                });
        }

        /* Components */

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

        /*function updateTextComponent() {
            var newComponent = {
                type: type,
                font: font,
                text: txt,
                heading: heading,
                top: top,
                left: left
            };
            ComponentService
                .updateComponent(vm.infographId, newComponent)
                .success(function (component) {
                    location.reload();
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }*/

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
            ComponentService
                .createComponent(vm.infographId, newComponent)
                .success(function (component) {
                    location.reload();
                })
                .error(function () {
                    vm.error = "Could not create component";
                });
        }
    }

})();