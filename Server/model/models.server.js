/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function () {

    var userModel    = require("./user/user.model.server")();
    var infographicModel = require("./infographic/infographic.model.server")();
    var componentModel = require("./component/component.model.server")();

    var model = {
        userModel    : userModel,
        infographicModel : infographicModel,
        componentModel: componentModel
    };
    userModel.setModel(model);
    infographicModel.setModel(model);
    componentModel.setModel(model);
    return model;
};