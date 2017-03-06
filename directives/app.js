/**
 * Created by Akshay on 2/21/2017.
 */
(function () {
    angular
        .module("DirectiveApp", [])
        .directive('hello', helloDir)
        .directive('helloWorld', helloWorldDir)
        .directive('colorMeRed', colorMeRed)
        .directive('makeMeDraggable', makeMeDraggable)
        .directive('makeMeSortable', makeMeSortable);

    function helloDir() {
        var config = {
            template: '<h2>Hello From Hello Directive</h2>'
        };
        return config;
    }

    function helloWorldDir() {
        var config = {
            template: '<h2>Camelcased Hello World</h2>'
        };
        return config;
    }

    function colorMeRed() {
        function linkFunc(scope, element) {
            console.log(element);
            element.css('color', 'red')
        }
        return {
          link: linkFunc
        };
    }

    function makeMeDraggable() {
        function linkFunc (scope, element) {
            element.draggable();
        }
        return {
            link: linkFunc
        }
    }

    function makeMeSortable() {
        function linkFunc(scope, element) {
            element.sortable();
        }

        return {
            link: linkFunc
        }
    }
})();