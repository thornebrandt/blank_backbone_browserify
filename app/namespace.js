var _ = require('underscore');
var Backbone = require('backbone');

window.App = window.App || {};
var App = window.App;
App.Config || (App.Config = {});
App.Models || (App.Models = {});
App.Collections || (App.Collections = {});
App.Routers || (App.Routers = {});
App.Views || (App.Views = {});
App.Templates || (App.Templates = {});
App.Session || (App.Session = {});
App.Data || (App.Data = {});
// App.Events = _.extend(Backbone.Events);
App.Session.authenticated = false;
if(localStorage.user_id){
    App.Session.authenticated = true;
    App.Session.user_id = localStorage.user_id;
}
// App.BASE_URL = 'http://v1-api.bullpenstaff.net/bullpen/api/';
App.BASE_URL = BASE_URL;
App.LIB_PATH = "../public/lib";


