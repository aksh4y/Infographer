/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app) {

    <!-- Models -->
    var models = require('./model/models.server')();

    <!-- Services -->
    require('./services/user.service.server.js')(app, models.userModel);
    require('./services/infographic.service.server.js')(app, models.infographicModel);
    require('./services/component.service.server')(app, models.componentModel);
   // require('./services/flickr.service.Server.js')(app);
};