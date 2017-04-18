/**
 * Created by Akshay on 4/18/2017.
 */
(function () {
    angular
        .module('Infographer')
        .controller('AdminController', AdminController);

    function AdminController(UserService) {
        var model = this;

        model.deleteUser = deleteUser;
        model.updateUser = updateUser;

        function init() {
            findAllUsers();
        }
        init();

        function updateUser(user) {
            UserService
                .updateUser(user)
                .then(findAllUsers);
        }

        function findAllUsers() {
            UserService.
            findAllUsers()
                .then(renderUsers);
        }

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(findAllUsers);
        }

        function renderUsers(users) {
            model.users = users;
        }
    }
})();