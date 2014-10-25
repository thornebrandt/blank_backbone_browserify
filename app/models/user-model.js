require('../../app/namespace.js');
var App = window.App;
var _ = require('underscore');
var Backbone = require('backbone');
var UserModel;
var self;
module.exports = Backbone.Model.extend({
    initialize: function(){
        self = this;
    }
});