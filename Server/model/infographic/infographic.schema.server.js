/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var InfographicSchema = mongoose.Schema({
        _user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'},
        name: String,
        background_color: String,
        background_url: String,
        url: String,
        components: [{type: mongoose.Schema.Types.ObjectId, ref:'ComponentModel'}],
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "infographer.infographics"});

    return InfographicSchema;
};
