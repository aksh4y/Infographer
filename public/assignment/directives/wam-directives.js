/**
 * Created by Akshay on 2/22/2017.
 */

(function () {
    angular
        .module('wamDirectives', [])
        .directive('wamDraggable', wamDraggableDir)
        .directive('wamSortable', wamSortableDir);

    function wamSortableDir() {
        function linkFunc (scope, element, attributes, sort) {
            element.sortable(
                {
                    start: function(event, ui){
                        ui.item.startPos = ui.item.index();
                    },
                    update: function(event, ui){
                        var initialIndex = ui.item.startPos;
                        var finalIndex = ui.item.index();
                        sort.sortWidgets(initialIndex, finalIndex);
                    },
                    axis: "y",
                    handle: ".glyphicon.glyphicon-align-justify",
                    scroll: false
                });
        }
        return {
            link: linkFunc,
            controller: sortController
        }
    }

    function sortController(WidgetService, $routeParams) {
        var vm = this;
        vm.sortWidgets = sortWidgets;

        function sortWidgets(initialIndex, finalIndex) {
            var pageId = $routeParams.pid;
            WidgetService
                .updateOrderForWidget(pageId, initialIndex, finalIndex);
        }
    }

    function wamDraggableDir() {
        function linkFunction(scope, element) {
            element.draggable();
        }
        return {
            link: linkFunction
        }
    }

})();
