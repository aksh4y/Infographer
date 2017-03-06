/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String
    }, {collection: 'assignment.user'});

    return UserSchema;
};