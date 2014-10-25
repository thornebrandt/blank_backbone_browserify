require('../namespace.js');
var App = window.App;
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
App.Views.AppView = require('../views/app-view.js');
App.Models.UserModel = require('../models/user-model.js');
module.exports = Backbone.Router.extend({
    routes: {
        "": "index",
    },

    index: function () {
        App.Views.appView = new App.Views.AppView();
    }
});