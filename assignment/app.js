/**
 * Created by Akshay on 2/17/2017.
 */
module.exports = function (app) {

    <!-- Models -->
    var models = require('./model/models.server')();

    <!-- Services -->
    require('./services/user.service.server.js')(app, models.userModel);
    require('./services/website.service.server.js')(app, models.websiteModel);
    require('./services/page.service.server.js')(app, models.pageModel);
    require('./services/widget.service.server.js')(app, models.widgetModel);
   // require('./services/flickr.service.server.js')(app);
};