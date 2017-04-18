/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function () {

    var userModel    = require("./user/user.model.server")();
    var infographicModel = require("./infographic/infographic.model.server")();
    var pageModel    = require("./page/page.model.server")();
    var widgetModel  = require("./widget/widget.model.server")();
    var componentModel = require("./component/component.model.server")();

    var model = {
        userModel    : userModel,
        infographicModel : infographicModel,
        pageModel    :pageModel,
        widgetModel  :widgetModel,
        componentModel: componentModel
    };
    userModel.setModel(model);
    infographicModel.setModel(model);
    pageModel.setModel(model);
    widgetModel.setModel(model);
    componentModel.setModel(model);
    return model;
};