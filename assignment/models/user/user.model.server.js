/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {

    var api = {
        createUser: createUser
    };

    return api;
    var mongoose = require('mongoose');

    var UserSchema = require('./user.schema.server.js')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    function createUser(user) {
        UserModel.create(user);
    }

};