/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var InfographicSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: {type: String, required: true},
        background_color: String,
        background_Url: String,
        url: String,
        thumb: String,
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref:'WidgetModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "infographer.infographics"});

    return InfographicSchema;
};
