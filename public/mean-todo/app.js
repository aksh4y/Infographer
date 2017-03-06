/**
 * Created by 4kshay on 1/13/2017.
 */
angular
    .module("TodoApp", [])
    .controller("TodoController", TodoController)

function TodoController($scope, $http) {
    $scope.todos = [];

    $http.get('/todo')
        .success(function(response){
            console.log(response);
            $scope.todos = response;
        });

    $scope.createTodo = createTodo;
    $scope.deleteTodo = deleteTodo;
    $scope.selectTodo = selectTodo;
    $scope.updateTodo = updateTodo;
    $scope.selectedIndex = -1;
    $scope.todo = {};

    function createTodo(todo) {
        console.log(todo);
        var newTodo = {
            title: todo.title,
            note: todo.note
        };
        $scope.todos.push(newTodo);
    }

    function deleteTodo(todo) {
        console.log(todo);
        var index = $scope.todos.indexOf(todo);
        console.log(index);
        $scope.todos.splice(index, 1);
    }

    function updateTodo(todo) {
        $scope.todos[$scope.selectedIndex].title = todo.title;
        $scope.todos[$scope.selectedIndex].note = todo.note;
        $scope.todo = {};
    }

    function selectTodo(todo) {

        $scope.selectedIndex = $scope.todos.indexOf(todo);
        $scope.todo.title = todo.title;
        $scope.todo.note = todo.note;
    }
}