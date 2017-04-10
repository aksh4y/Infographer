/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var PageSchema = mongoose.Schema({
        _website: {type: mongoose.Schema.Types.ObjectId, ref: 'WebsiteModel'},
        name: String,
        title: String,
        description: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref:'WidgetModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "assignment.pages"});
    return PageSchema;
};