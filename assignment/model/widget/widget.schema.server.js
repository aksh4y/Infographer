/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function() {
    var mongoose = require("mongoose");
    var WidgetSchema = mongoose.Schema({
        _page: {type: mongoose.Schema.Types.ObjectId, ref: 'PageModel'},
        type: {type:String, enum:['HEADING','IMAGE','YOUTUBE','HTML','TEXT'], required: true},
        name: String,
        text: String,
        placeholder: String,
        description: String,
        url: String,
        width: String,
        height: String,
        rows: String,
        size: String,
        class: String,
        icon: String,
        deletable: Boolean,
        formatted: Boolean,
        dateCreated: {type: Date, default: Date.now()}
    }, {collection: "assignment.widgets"});
    return WidgetSchema;
};