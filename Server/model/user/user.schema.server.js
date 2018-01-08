/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: {type: String, required: true},
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        google: {
            id: String,
            token: String
        },
        facebook: {
            id: String,
            token: String
        },
        infographics: [{type: mongoose.Schema.Types.ObjectId, ref:'InfographicModel'}],
        role: {type:String, enum:['USER','ADMIN'], required: true, default: 'USER'},
        dateCreated: {type:Date, default: Date.now()}
    }, {collection: 'infographer.users'});

    return UserSchema;
};