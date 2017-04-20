/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var ComponentSchema = mongoose.Schema({
        _infographic: {type: mongoose.Schema.Types.ObjectId, ref: 'InfographicModel'},
        type: {type:String, enum:['IMAGE', 'TEXT', 'ANCHOR', 'JUMBO', 'SHAPE'], required: true},
        name: String,
        text: String,
        heading: String,
        font: String,
        font_size: String,
        url: String,
        width: String,
        height: String,
        left: String,
        top: String,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "infographer.components"});
    return ComponentSchema;
};