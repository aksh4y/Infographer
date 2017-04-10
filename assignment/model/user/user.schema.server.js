/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: {type: String, required: true},
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        websites: [{type: mongoose.Schema.Types.ObjectId, ref:'WebsiteModel'}],
        dateCreated: {type:Date, default: Date.now()}
    }, {collection: 'assignment.users'});

    return UserSchema;
};