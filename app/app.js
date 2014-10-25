require('../app/namespace.js');
var App = window.App;
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
var analytics = require('backbone.analytics');
App.Routers.Router = require('../app/routers/router.js');
$(function(){
	var router = new App.Routers.Router();
    App.Router = router;
	Backbone.history.start();
});

App.prepareForInternetExplorer = function(){
    $.support.cors = true;
    if (App.debug){
        window.console = window.console || {
            log: function(msg){
                if($("#logIE").length){
                    $("#logIE").append(msg + "<br><hr/>");
                } else {
                    $("body").append("<div id='logIE'><h3>console.log</h3>"+msg+"<br><hr/></div>");
                }
            },
            error: function(msg, source){
                if($("#logIE").length){
                    $("#logIE").append("<span class='consoleError'>" + msg + "<br>" + source + "</span><hr/>");
                } else {
                    $("body").append("<div id='logIE'><h3>console.log</h3>" +
                        "<span class='consoleError'>" +msg+ "<br>" + source + "</span><hr/></div>");
                }
            }
        };
    } else {
        window.console = window.console || {};
    }
};
App.prepareForInternetExplorer();

