/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var WidgetSchema = mongoose.Schema({
        _infographic: {type: mongoose.Schema.Types.ObjectId, ref: 'InfographicModel'},
        type: {type:String, enum:['IMAGE', 'TEXT', 'HEADING', 'JUMBO', 'SHAPE'], required: true},
        name: String,
        text: String,
        header: String,
        font: String,
        font_size: String,
        url: String,
        width: String,
        height: String,
        x_pos: String,
        y_pos: String,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "assignment.widgets"});
    return WidgetSchema;
};