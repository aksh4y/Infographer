/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var WebsiteSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: {type: String, required: true},
        description: {type: String, required: true},
        pages: [{type: mongoose.Schema.Types.ObjectId, ref:'PageModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "assignment.websites"});

    return WebsiteSchema;
};
